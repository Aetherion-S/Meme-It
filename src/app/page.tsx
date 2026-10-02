import Image from "next/image";
import { LikeButton } from "@/components/LikeButton";

const memes = [
  { src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjR6cHFyNzRzb3JvdHNtNXdweWNyeDNnbGg1MzAwNGVybndxeGQwZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LqT2G1c1I1p6y55t5d/giphy.gif", width: 480, height: 360, alt: "A funny cat typing rapidly on a computer keyboard" },
  { src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTVudHlqZTZyeWtueDVyMjYwbm0waDBpeGdja3RtcHBwaDBiZmxyYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aLdiZJbpEbVks/giphy.gif", width: 480, height: 480, alt: "A person blinking in disbelief with a confused expression" },
  { src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXpmbHk5OXM5NXRsZDk0ZDUyb2E5NzR0bWxqcWlkbHRsMzUyc2oxYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif", width: 480, height: 270, alt: "Two people giving each other an enthusiastic high five" },
  { src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnlyMTBndThxZGhjMGE3OXB6d3NsdzNyOGVtcDFkdmI1bGR3M3E4NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VbnUQpnihPSIgIXuZv/giphy.gif", width: 480, height: 360, alt: "A cute dog nodding in agreement" },
  { src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamhzcmU5cHR1eDJxbjFqZGk4cWc2cXFhMmpxNjUzazQ1OGVudjE3eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l41lFw057lAJQMwg0/giphy.gif", width: 480, height: 480, alt: "A dramatic zoom in on a surprised face" },
  { src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG1tNjBicDJtdGNlcm4wNDhzdDVydXlueDQyMm16aDhnZDd3dzUweCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/11sBLVxNs7v6WA/giphy.gif", width: 480, height: 320, alt: "A monkey eating a banana with a funny facial expression" },
  { src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGJxbGJxbThscDVhZDhsbTNtZG0wYXNsb3lkZ2I3dnY1aWFqZGVtayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7abKhOpu0NwenH3O/giphy.gif", width: 480, height: 360, alt: "Someone excitedly eating popcorn while watching drama" },
  { src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTRnMnNtbWFjNnE5dmhkYXFxcWFxcWFxcWFxcWFxcWFxcWFxcWFxcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MDJ9IbxxvDUQM/giphy.gif", width: 480, height: 480, alt: "A cat sleeping peacefully in a strange position" },
  { src: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDVqNDJnYzBseTJtd3h1OG0ycmE4Y3JqMjRtcXQ5N3MxeWZwdzIyaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ICOgUNjpvO0PC/giphy.gif", width: 480, height: 270, alt: "A thumbs up gesture of approval" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/70">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Meme<span className="text-blue-500">It</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
            Discover the best memes.
          </h2>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            A minimalistic space for maximum laughs. Scroll through the finest curated GIFs on the internet.
          </p>
        </div>

        {/* Meme Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {memes.map((meme, idx) => (
            <div 
              key={idx} 
              className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800"
            >
              <img
                src={meme.src}
                alt={meme.alt}
                width={meme.width}
                height={meme.height}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="p-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Meme {idx + 1}
                </span>
                <LikeButton />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
