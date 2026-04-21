"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuthStore, useCartStore } from "@/lib/store";
import {
  mockAddresses,
  mockOrders,
  mockPoints,
  mockWishlistIds,
  type AddressRecord,
  type OrderStatus,
} from "@/lib/mock/account";
import { getProductById, resolveProductImage } from "@/lib/data/products";
import ProductImage from "@/components/product/ProductImage";
import { nmIdentify, nmLogin, nmRegister, nmAddToCart, nmRemoveFromWishlist } from "@/lib/netmera-events";
import type { Product, User } from "@/types";

type AuthTab = "signin" | "register";
type AccountSection = "orders" | "details" | "addresses" | "wishlist" | "rewards";

const inputClass =
  "w-full rounded-lg border border-[#DDD8CE] bg-white px-3 py-2.5 text-sm text-ink focus:border-sage focus:outline-none";

const statusBadgeClass: Record<OrderStatus, string> = {
  Processing: "bg-[#FFF7ED] text-[#C2410C]",
  Shipped: "bg-[#EFF6FF] text-[#1D4ED8]",
  Delivered: "bg-[#F0FDF4] text-[#15803D]",
  Cancelled: "bg-[#FEF2F2] text-[#B91C1C]",
};

const sectionLabel: Record<AccountSection, string> = {
  orders: "My Orders",
  details: "My Details",
  addresses: "Addresses",
  wishlist: "Wishlist",
  rewards: "Loyalty & Rewards",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const wishlistProducts = mockWishlistIds
  .map((id) => getProductById(id))
  .filter((p): p is Product => p !== undefined);

export default function AccountPage() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const { addItem } = useCartStore();

  const [tab, setTab] = useState<AuthTab>("signin");
  const [section, setSection] = useState<AccountSection>("orders");

  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [detailsData, setDetailsData] = useState({
    firstName: user?.name?.split(" ")[0] ?? "",
    lastName: user?.name?.split(" ").slice(1).join(" ") ?? "",
    email: user?.email ?? "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [wishlist, setWishlist] = useState<Product[]>(wishlistProducts);
  const [addresses, setAddresses] = useState<AddressRecord[]>(mockAddresses);
  const [showPasswordPanel, setShowPasswordPanel] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    street: "",
    city: "",
    postcode: "",
    country: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const currentUserName = useMemo(() => {
    if (!user?.name) return "N·Walks Member";
    return user.name;
  }, [user?.name]);

  const validateSignIn = () => {
    const nextErrors: Record<string, string> = {};
    if (!emailRegex.test(signInData.email)) nextErrors.signinEmail = "Please enter a valid email.";
    if (signInData.password.length < 6) nextErrors.signinPassword = "Password must be at least 6 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateRegister = () => {
    const nextErrors: Record<string, string> = {};
    if (!registerData.firstName.trim()) nextErrors.registerFirstName = "First name is required.";
    if (!registerData.lastName.trim()) nextErrors.registerLastName = "Last name is required.";
    if (!emailRegex.test(registerData.email)) nextErrors.registerEmail = "Please enter a valid email.";
    if (registerData.password.length < 6) nextErrors.registerPassword = "Password must be at least 6 characters.";
    if (registerData.password !== registerData.confirmPassword) {
      nextErrors.registerConfirmPassword = "Passwords do not match.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!validateSignIn()) return;

    const mockUser: User = {
      id: `usr_${Date.now()}`,
      name: "Emre Sumer",
      email: signInData.email,
      gender: "other",
      favoriteCategory: "new-arrivals",
      createdAt: new Date().toISOString(),
    };

    login(mockUser);
    nmIdentify(mockUser.id, {
      email: mockUser.email,
      name: mockUser.name,
      gender: mockUser.gender,
      favoriteCategory: mockUser.favoriteCategory,
    });
    nmLogin(mockUser.id);
    setDetailsData({
      firstName: mockUser.name.split(" ")[0] ?? "",
      lastName: mockUser.name.split(" ").slice(1).join(" "),
      email: mockUser.email,
      phone: "",
    });
    setSection("orders");
    setMessage("Signed in successfully.");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!validateRegister()) return;

    const fullName = `${registerData.firstName} ${registerData.lastName}`.trim();
    const mockUser: User = {
      id: `usr_${Date.now()}`,
      name: fullName,
      email: registerData.email,
      gender: "other",
      favoriteCategory: "new-arrivals",
      createdAt: new Date().toISOString(),
    };

    login(mockUser);
    nmIdentify(mockUser.id, {
      email: mockUser.email,
      name: mockUser.name,
      gender: mockUser.gender,
      favoriteCategory: mockUser.favoriteCategory,
    });
    nmRegister(
      mockUser.id,
      mockUser.email,
      mockUser.gender,
      mockUser.favoriteCategory ?? "new-arrivals"
    );
    setDetailsData({
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      phone: "",
    });
    setSection("orders");
    setMessage("Account created successfully.");
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!detailsData.firstName.trim()) nextErrors.detailsFirstName = "First name is required.";
    if (!detailsData.lastName.trim()) nextErrors.detailsLastName = "Last name is required.";
    if (!emailRegex.test(detailsData.email)) nextErrors.detailsEmail = "Please enter a valid email.";
    if (showPasswordPanel) {
      if (passwordData.newPassword.length > 0 && passwordData.currentPassword.length === 0) {
        nextErrors.passwordCurrent = "Current password is required.";
      }
      if (passwordData.newPassword.length > 0 && passwordData.newPassword.length < 6) {
        nextErrors.passwordNew = "New password must be at least 6 characters.";
      }
      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        nextErrors.passwordConfirm = "New passwords do not match.";
      }
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setMessage("Details saved.");
  };

  const handleAddWishlistToCart = (product: Product) => {
    const defaultSize = product.sizes[Math.floor(product.sizes.length / 2)];
    const defaultColor = product.colors[0];
    addItem(product, defaultSize, defaultColor);
    nmAddToCart(product, defaultSize, defaultColor.name, 1, "quick_add");
    setMessage(`${product.name} added to cart.`);
  };

  const handleRemoveWishlistItem = (product: Product) => {
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
    nmRemoveFromWishlist(product.id);
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!addressForm.fullName.trim()) nextErrors.addressFullName = "Name is required.";
    if (!addressForm.street.trim()) nextErrors.addressStreet = "Street is required.";
    if (!addressForm.city.trim()) nextErrors.addressCity = "City is required.";
    if (!addressForm.postcode.trim()) nextErrors.addressPostcode = "Postcode is required.";
    if (!addressForm.country.trim()) nextErrors.addressCountry = "Country is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setAddresses((prev) => [
      ...prev.map((a) => ({ ...a, isDefault: false })),
      {
        id: `addr_${Date.now()}`,
        ...addressForm,
        isDefault: true,
      },
    ]);
    setShowAddressForm(false);
    setAddressForm({ fullName: "", street: "", city: "", postcode: "", country: "" });
    setMessage("Address added.");
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-8">My Account</h1>

        <div className="bg-white border border-[#E7E2D8] rounded-2xl p-5 sm:p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setTab("signin");
                setErrors({});
                setMessage("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                tab === "signin" ? "bg-sage text-white" : "bg-[#F3EFE7] text-ink"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab("register");
                setErrors({});
                setMessage("");
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                tab === "register" ? "bg-sage text-white" : "bg-[#F3EFE7] text-ink"
              }`}
            >
              Create Account
            </button>
          </div>

          {tab === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className={inputClass}
                  value={signInData.email}
                  onChange={(e) => setSignInData((s) => ({ ...s, email: e.target.value }))}
                />
                {errors.signinEmail && <p className="text-xs text-red-600 mt-1">{errors.signinEmail}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  className={inputClass}
                  value={signInData.password}
                  onChange={(e) => setSignInData((s) => ({ ...s, password: e.target.value }))}
                />
                {errors.signinPassword && (
                  <p className="text-xs text-red-600 mt-1">{errors.signinPassword}</p>
                )}
                <Link href="#" className="mt-2 inline-block text-xs text-sage hover:text-sage-dark">
                  Forgot password?
                </Link>
              </div>
              <button className="w-full rounded-lg bg-sage text-white py-2.5 font-semibold text-sm hover:bg-sage-dark transition-colors">
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                    First Name
                  </label>
                  <input
                    className={inputClass}
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData((s) => ({ ...s, firstName: e.target.value }))}
                  />
                  {errors.registerFirstName && (
                    <p className="text-xs text-red-600 mt-1">{errors.registerFirstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                    Last Name
                  </label>
                  <input
                    className={inputClass}
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData((s) => ({ ...s, lastName: e.target.value }))}
                  />
                  {errors.registerLastName && (
                    <p className="text-xs text-red-600 mt-1">{errors.registerLastName}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className={inputClass}
                  value={registerData.email}
                  onChange={(e) => setRegisterData((s) => ({ ...s, email: e.target.value }))}
                />
                {errors.registerEmail && <p className="text-xs text-red-600 mt-1">{errors.registerEmail}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    className={inputClass}
                    value={registerData.password}
                    onChange={(e) => setRegisterData((s) => ({ ...s, password: e.target.value }))}
                  />
                  {errors.registerPassword && (
                    <p className="text-xs text-red-600 mt-1">{errors.registerPassword}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className={inputClass}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData((s) => ({ ...s, confirmPassword: e.target.value }))}
                  />
                  {errors.registerConfirmPassword && (
                    <p className="text-xs text-red-600 mt-1">{errors.registerConfirmPassword}</p>
                  )}
                </div>
              </div>
              <button className="w-full rounded-lg bg-sage text-white py-2.5 font-semibold text-sm hover:bg-sage-dark transition-colors">
                Create Account
              </button>
            </form>
          )}

          <p className="text-xs text-muted mt-5">
            By creating an account you agree to our{" "}
            <Link href="#" className="underline">
              Terms
            </Link>{" "}
            &{" "}
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
          {message && <p className="text-sm text-sage mt-3">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink">My Account</h1>
        <p className="text-muted mt-2">Welcome back, {currentUserName}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside>
          <div className="lg:block hidden border border-[#E7E2D8] rounded-2xl bg-white overflow-hidden">
            {(Object.keys(sectionLabel) as AccountSection[]).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSection(item);
                  setErrors({});
                  setMessage("");
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors border-l-2 ${
                  section === item
                    ? "border-l-sage text-ink font-semibold bg-[#F7F4EF]"
                    : "border-l-transparent text-muted hover:bg-[#FAF8F2]"
                }`}
              >
                {sectionLabel[item]}
                {item === "rewards" ? (
                  <span className="ml-2 inline-flex items-center rounded-full bg-sage text-white text-[10px] px-2 py-0.5">
                    {mockPoints.balance} pts
                  </span>
                ) : null}
              </button>
            ))}
            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 text-sm text-red-700 hover:bg-red-50 border-t border-[#EEE7DA]"
            >
              Sign Out
            </button>
          </div>

          <div className="lg:hidden flex overflow-x-auto gap-2 pb-2">
            {(Object.keys(sectionLabel) as AccountSection[]).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setSection(item);
                  setErrors({});
                  setMessage("");
                }}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm ${
                  section === item ? "bg-sage text-white" : "bg-white border border-[#E7E2D8] text-ink"
                }`}
              >
                {sectionLabel[item]}
              </button>
            ))}
            <button
              onClick={logout}
              className="whitespace-nowrap px-3 py-2 rounded-lg text-sm border border-red-200 text-red-700 bg-white"
            >
              Sign Out
            </button>
          </div>
        </aside>

        <section className="bg-white border border-[#E7E2D8] rounded-2xl p-5 sm:p-7">
          {section === "orders" && (
            <div>
              <h2 className="text-2xl font-bold text-ink mb-5">My Orders</h2>
              {mockOrders.length === 0 ? (
                <p className="text-muted">
                  No orders yet.{" "}
                  <Link href="/shop" className="text-sage underline">
                    Start shopping →
                  </Link>
                </p>
              ) : (
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="rounded-xl border border-[#EEE7DA] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <p className="font-semibold text-ink">Order #{order.id}</p>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadgeClass[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted mb-3">
                        Date: {order.date} · Total: ${order.total.toFixed(2)}
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item) => {
                          const product = getProductById(item.productId);
                          if (!product) return null;
                          return (
                            <div key={`${order.id}-${item.productId}`} className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F7F4EF]">
                                <ProductImage
                                  name={product.name}
                                  colorHex={product.colors[0].hex}
                                  colorName={product.colors[0].name}
                                  imageUrl={resolveProductImage(product, 0)}
                                  variant={0}
                                />
                              </div>
                              <p className="text-sm text-ink">
                                {product.name} <span className="text-muted">× {item.quantity}</span>
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      <Link href={`/account/orders/${order.id}`} className="inline-block mt-3 text-sm text-sage hover:text-sage-dark underline">
                        View Order
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "details" && (
            <div>
              <h2 className="text-2xl font-bold text-ink mb-5">My Details</h2>
              <form onSubmit={handleSaveDetails} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                      First Name
                    </label>
                    <input
                      className={inputClass}
                      value={detailsData.firstName}
                      onChange={(e) => setDetailsData((s) => ({ ...s, firstName: e.target.value }))}
                    />
                    {errors.detailsFirstName && <p className="text-xs text-red-600 mt-1">{errors.detailsFirstName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                      Last Name
                    </label>
                    <input
                      className={inputClass}
                      value={detailsData.lastName}
                      onChange={(e) => setDetailsData((s) => ({ ...s, lastName: e.target.value }))}
                    />
                    {errors.detailsLastName && <p className="text-xs text-red-600 mt-1">{errors.detailsLastName}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      className={inputClass}
                      value={detailsData.email}
                      onChange={(e) => setDetailsData((s) => ({ ...s, email: e.target.value }))}
                    />
                    {errors.detailsEmail && <p className="text-xs text-red-600 mt-1">{errors.detailsEmail}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                      Phone
                    </label>
                    <input
                      className={inputClass}
                      value={detailsData.phone}
                      onChange={(e) => setDetailsData((s) => ({ ...s, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EEE7DA]">
                  <button
                    type="button"
                    onClick={() => setShowPasswordPanel((v) => !v)}
                    className="text-sm text-ink font-semibold"
                  >
                    Change Password {showPasswordPanel ? "−" : "+"}
                  </button>
                  {showPasswordPanel && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                      <div>
                        <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className={inputClass}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData((s) => ({ ...s, currentPassword: e.target.value }))}
                        />
                        {errors.passwordCurrent && (
                          <p className="text-xs text-red-600 mt-1">{errors.passwordCurrent}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                          New Password
                        </label>
                        <input
                          type="password"
                          className={inputClass}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData((s) => ({ ...s, newPassword: e.target.value }))}
                        />
                        {errors.passwordNew && <p className="text-xs text-red-600 mt-1">{errors.passwordNew}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold tracking-widest uppercase text-muted mb-1.5">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className={inputClass}
                          value={passwordData.confirmNewPassword}
                          onChange={(e) => setPasswordData((s) => ({ ...s, confirmNewPassword: e.target.value }))}
                        />
                        {errors.passwordConfirm && <p className="text-xs text-red-600 mt-1">{errors.passwordConfirm}</p>}
                      </div>
                    </div>
                  )}
                </div>

                <button className="rounded-lg bg-sage text-white px-5 py-2.5 text-sm font-semibold hover:bg-sage-dark transition-colors">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {section === "addresses" && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-5">
                <h2 className="text-2xl font-bold text-ink">Addresses</h2>
                <button
                  type="button"
                  onClick={() => setShowAddressForm((v) => !v)}
                  className="rounded-lg bg-sage text-white px-4 py-2 text-sm font-semibold hover:bg-sage-dark"
                >
                  + Add New Address
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mb-6 rounded-xl border border-[#EEE7DA] p-4 space-y-3 bg-[#FCFBF8]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        className={inputClass}
                        placeholder="Full Name"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm((s) => ({ ...s, fullName: e.target.value }))}
                      />
                      {errors.addressFullName && <p className="text-xs text-red-600 mt-1">{errors.addressFullName}</p>}
                    </div>
                    <div>
                      <input
                        className={inputClass}
                        placeholder="Street"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm((s) => ({ ...s, street: e.target.value }))}
                      />
                      {errors.addressStreet && <p className="text-xs text-red-600 mt-1">{errors.addressStreet}</p>}
                    </div>
                    <div>
                      <input
                        className={inputClass}
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm((s) => ({ ...s, city: e.target.value }))}
                      />
                      {errors.addressCity && <p className="text-xs text-red-600 mt-1">{errors.addressCity}</p>}
                    </div>
                    <div>
                      <input
                        className={inputClass}
                        placeholder="Postcode"
                        value={addressForm.postcode}
                        onChange={(e) => setAddressForm((s) => ({ ...s, postcode: e.target.value }))}
                      />
                      {errors.addressPostcode && <p className="text-xs text-red-600 mt-1">{errors.addressPostcode}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        className={inputClass}
                        placeholder="Country"
                        value={addressForm.country}
                        onChange={(e) => setAddressForm((s) => ({ ...s, country: e.target.value }))}
                      />
                      {errors.addressCountry && <p className="text-xs text-red-600 mt-1">{errors.addressCountry}</p>}
                    </div>
                  </div>
                  <button className="rounded-lg bg-sage text-white px-4 py-2 text-sm font-semibold">Save Address</button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div key={address.id} className="rounded-xl border border-[#EEE7DA] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-ink">{address.fullName}</p>
                      {address.isDefault && (
                        <span className="rounded-full bg-sage/15 text-sage text-[11px] px-2 py-0.5 font-semibold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted leading-6">
                      {address.street}
                      <br />
                      {address.city}, {address.postcode}
                      <br />
                      {address.country}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3 text-sm">
                        <button type="button" className="text-sage hover:text-sage-dark">
                          Edit
                        </button>
                      <button
                          type="button"
                        onClick={() => setAddresses((prev) => prev.filter((a) => a.id !== address.id))}
                        className="text-red-700 hover:text-red-800"
                      >
                        Delete
                      </button>
                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="text-ink hover:text-sage"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === "wishlist" && (
            <div>
              <h2 className="text-2xl font-bold text-ink mb-5">Wishlist</h2>
              {wishlist.length === 0 ? (
                <p className="text-muted">
                  Your wishlist is empty.{" "}
                  <Link href="/products/new-arrivals" className="text-sage underline">
                    Explore new arrivals →
                  </Link>
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlist.map((product) => (
                    <div key={product.id} className="rounded-xl border border-[#EEE7DA] p-3 bg-white">
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-[#F7F4EF]">
                        <ProductImage
                          name={product.name}
                          colorHex={product.colors[0].hex}
                          colorName={product.colors[0].name}
                          imageUrl={resolveProductImage(product, 0)}
                        />
                        <button
                          onClick={() => handleRemoveWishlistItem(product)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 text-ink text-sm leading-none"
                        >
                          ×
                        </button>
                      </div>
                      <p className="font-semibold text-sm text-ink">{product.name}</p>
                      <p className="text-sm text-muted mb-3">${product.price}</p>
                      <button
                        onClick={() => handleAddWishlistToCart(product)}
                        className="w-full rounded-lg bg-sage text-white py-2 text-xs font-semibold hover:bg-sage-dark"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === "rewards" && (
            <div>
              <h2 className="text-2xl font-bold text-ink mb-5">Loyalty & Rewards</h2>
              <div className="rounded-xl border border-[#EEE7DA] p-4 mb-5">
                <p className="text-xs tracking-widest uppercase text-muted">Points Balance</p>
                <p className="text-4xl font-bold text-sage mt-1">{mockPoints.balance} pts</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-muted mb-1">
                    <span>{mockPoints.tier}</span>
                    <span>{mockPoints.nextTier}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#ECE7DC] overflow-hidden">
                    <div
                      className="h-full bg-sage"
                      style={{
                        width: `${Math.min(100, (mockPoints.balance / mockPoints.nextTierAt) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {mockPoints.history.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between rounded-lg border border-[#EEE7DA] px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-ink">{entry.label}</p>
                      <p className="text-xs text-muted">{entry.date}</p>
                    </div>
                    <p className={`text-sm font-semibold ${entry.delta >= 0 ? "text-[#15803D]" : "text-[#B91C1C]"}`}>
                      {entry.delta >= 0 ? "+" : ""}
                      {entry.delta} pts
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {message && <p className="text-sm text-sage mt-5">{message}</p>}
        </section>
      </div>
    </div>
  );
}
