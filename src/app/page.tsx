import { GiphyFeed } from "@/components/GiphyFeed";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-gray-200 bg-white/80">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tighter text-black">
            Meme<span className="text-[#3b82f6]">It</span>
          </h1>
          <div className="flex items-center space-x-4">
            <a href="/login" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
              Log In
            </a>
            <a href="/signup" className="text-sm font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors">
              Sign Up
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black mb-4">
            Discover the internet.
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Scroll through the finest curated GIFs directly from Giphy. Search for reactions, emotions, or just raw chaos.
          </p>
        </div>

        {/* Dynamic Giphy Feed */}
        <GiphyFeed />
      </main>
    </div>
  );
}
