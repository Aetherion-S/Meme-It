import { GiphyFeed } from "@/components/GiphyFeed";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header with responsive navigation */}
      <Navbar />

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
