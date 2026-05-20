import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, X, Calendar, Film } from "lucide-react";
import { api, BackendGalleryVideo } from "@/lib/api";
import { Loader } from "@/components/ui/loader";

const Gallery = () => {
  const [videos, setVideos] = useState<BackendGalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<BackendGalleryVideo | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .listGallery()
      .then((data) => {
        setVideos(data);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message || "Failed to load gallery videos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-20 px-5 lg:px-0">
      {/* Header Back Button & Title */}
      <div className="max-w-6xl mx-auto w-full pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center md:text-left mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary mb-4">
            <Film className="h-3.5 w-3.5" />
            Our Journey In Motion
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Our <span className="text-primary">Gallery</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Go behind the scenes of local farming. Watch how our partner farmers harvest fresh crops and see the journey from farm gate to your front door.
          </p>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="py-20 flex justify-center">
            <Loader text="Loading gallery media..." />
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-xl mx-auto my-12">
            <p className="text-destructive font-bold mb-2">Error Sourcing Media</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="rounded-3xl border border-border bg-card p-12 text-center max-w-xl mx-auto my-12 shadow-soft">
            <Film className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-foreground">No Videos Yet</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Our gallery is currently getting set up. Check back soon for beautiful farming videos!
            </p>
          </div>
        )}

        {/* Video Grid */}
        {!loading && !error && videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <article
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
              >
                {/* Video Preview Container */}
                <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                  {/* Silent preview auto-playing on hover (for premium experience) */}
                  <video
                    src={video.url}
                    preload="metadata"
                    muted
                    loop
                    className="w-full h-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 group-hover:bg-black/20">
                    <div className="w-14 h-14 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Info Metadata */}
                <div className="p-6">
                  <h3 className="font-display text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(video.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedVideo(null)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-4xl aspect-video rounded-3xl bg-black overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Premium Video Player */}
            <video
              src={selectedVideo.url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
