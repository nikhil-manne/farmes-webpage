import React, { useState } from 'react';
import { Play, Film, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import { BackendGalleryVideo } from '@/lib/api';

interface HeroGalleryProps {
  videos: BackendGalleryVideo[];
  onPlayVideo: (video: BackendGalleryVideo) => void;
}

export const HeroGallery: React.FC<HeroGalleryProps> = ({ videos, onPlayVideo }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeVideo = videos[activeIndex];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  // Fallback if there are no videos yet
  if (!videos || videos.length === 0) {
    return (
      <div className="relative w-full aspect-[4/3] md:aspect-video lg:aspect-[16/9] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[2.5rem] overflow-hidden border border-border shadow-2xl flex flex-col items-center justify-center p-8 text-center">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
        
        <Film className="w-12 h-12 text-primary/40 mb-4 animate-pulse" />
        <h3 className="font-display text-lg font-bold text-foreground">Welcome to Farmes</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-2">
          Fresh video diaries uploaded directly by our partner farmers are loading.
        </p>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-[80px]" />
      </div>
    );
  }

  return (
    <div 
      onClick={() => onPlayVideo(activeVideo)}
      className="group relative w-full aspect-[4/3] md:aspect-video lg:aspect-[16/9] bg-black rounded-[2.5rem] overflow-hidden border border-border shadow-2xl cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-elevated"
    >
      {/* Video Preview Auto-playing */}
      <video
        key={activeVideo.id}
        src={activeVideo.url}
        preload="metadata"
        muted
        loop
        autoPlay
        playsInline
        className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/45" />

      {/* Top Tag */}
      <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md px-3.5 py-1 text-[11px] font-black text-white uppercase tracking-wider">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        Farmer Log Live
      </div>

      {/* Middle Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/95 text-primary flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
          <Play className="w-7 h-7 fill-current translate-x-0.5" />
        </div>
      </div>

      {/* Bottom Glassmorphic Info Banner */}
      <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h4 className="font-display font-bold text-base leading-tight md:text-lg">
            {activeVideo.title}
          </h4>
          <p className="text-[10px] text-white/60 font-semibold tracking-wider uppercase mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(activeVideo.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        
        {/* Navigation Indicators if multiple videos exist */}
        {videos.length > 1 && (
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button 
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors border border-white/5"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold font-mono tracking-widest px-1">
              {activeIndex + 1}/{videos.length}
            </span>
            <button 
              onClick={handleNext}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-colors border border-white/5"
              aria-label="Next video"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Hover prompt */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors pointer-events-none" />
    </div>
  );
};
