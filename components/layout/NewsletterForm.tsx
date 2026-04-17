"use client";

// Isolated client component — only the submit handler needs interactivity.
// The rest of Footer is a server component.
export default function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex gap-2 w-full sm:w-auto"
    >
      <input
        type="email"
        placeholder="your@email.com"
        className="bg-gray-800 text-sm text-white placeholder-gray-500 px-4 py-2.5 rounded-full flex-1 sm:w-64 focus:outline-none focus:ring-2 focus:ring-sage"
      />
      <button
        type="submit"
        className="bg-sage hover:bg-sage-light text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
