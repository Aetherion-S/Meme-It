import { GiphyFeed } from "@/components/GiphyFeed";
import { ThemeToggleLogo } from "@/components/ThemeToggleLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-border bg-background/80">
        <div className="container mx-auto px-6 h-16 sm:h-20 flex items-center justify-between relative">
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggleLogo />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Meme<span className="text-primary">It</span>
            </h1>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-8 font-medium text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Category</a>
            <a href="https://giphy.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Giphy</a>
            <a href="#" className="hover:text-foreground transition-colors">Favorites</a>
          </nav>

          {/* Right: Search Bar & Auth Buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search memes..." 
                className="h-9 w-9 pl-9 pr-3 text-sm rounded-full bg-muted border border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-ring hover:w-44 focus:w-44 sm:hover:w-48 sm:focus:w-48 [&:not(:placeholder-shown)]:w-44 sm:[&:not(:placeholder-shown)]:w-48 transition-all duration-300 ease-out text-foreground placeholder:text-transparent hover:placeholder:text-muted-foreground focus:placeholder:text-muted-foreground [&:not(:placeholder-shown)]:placeholder:text-muted-foreground cursor-pointer focus:cursor-text"
              />
              <svg 
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <a href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log In
            </a>
            <a href="/signup" className="text-sm font-medium bg-foreground text-background px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:opacity-90 transition-opacity">
              Sign Up
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Discover the internet.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Scroll through the finest curated GIFs directly from Giphy. Search for reactions, emotions, or just raw chaos.
          </p>
        </div>

        {/* Dynamic Giphy Feed */}
        <GiphyFeed />
      </main>
    </div>
  );
}
