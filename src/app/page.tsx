import { GiphyFeed } from "@/components/GiphyFeed";
import { ThemeToggleLogo } from "@/components/ThemeToggleLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-border bg-background/80">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ThemeToggleLogo />
            <h1 className="text-2xl font-black tracking-tighter text-foreground">
              Meme<span className="text-primary">It</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Log In
            </a>
            <a href="/signup" className="text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity">
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
