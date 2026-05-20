import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, X, Calendar, Film } from "lucide-react";
// import { api } from "@/lib/api";
import { Loader } from "@/components/ui/loader";
import { LocalGalleryItem, localGalleryImages, localGalleryItems, localGalleryVideos } from "@/lib/localGallery";

const Gallery = () => {
  const [items, setItems] = useState<LocalGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<LocalGalleryItem | null>(null);
  const [activeSection, setActiveSection] = useState<"IMAGES" | "VIDEOS">("IMAGES");

  useEffect(() => {
    setLoading(true);

    // TEMPORARY LOCAL GALLERY SOURCE:
    // Drop images/videos into: webpage/src/gallery
    // and they will show here without backend/S3.
    setItems(localGalleryItems);
    setError(null);
    setLoading(false);

    // ORIGINAL PRODUCTION FLOW (S3 + backend gallery API):
    // api
    //   .listGallery()
    //   .then((data) => {
    //     const mapped = data.map((video) => ({
    //       id: video.id,
    //       title: video.title,
    //       url: video.url,
    //       type: "VIDEO" as const,
    //       createdAt: video.createdAt,
    //     }));
    //     setItems(mapped);
    //     setError(null);
    //   })
    //   .catch((err: Error) => {
    //     setError(err.message || "Failed to load gallery videos.");
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  }, []);

  const visibleItems = useMemo(
    () => (activeSection === "IMAGES" ? localGalleryImages : localGalleryVideos),
    [activeSection],
  );

  const renderCard = (item: LocalGalleryItem) => (
    <article
      key={item.id}
      onClick={() => setSelectedItem(item)}
      className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-border bg-card shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
    >
      <div className="aspect-square bg-black relative flex items-center justify-center overflow-hidden">
        {item.type === "VIDEO" ? (
          <video
            src={item.url}
            preload="metadata"
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
          />
        ) : (
          <img
            src={item.url}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        )}

        {item.type === "VIDEO" && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 group-hover:bg-black/20">
            <div className="w-14 h-14 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>
            {new Date(item.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </article>
  );

  return (
    <div className="flex flex-col min-h-screen pb-20 px-5 lg:px-0">
      <div className="max-w-6xl mx-auto w-full pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight tracking-[0.08em] uppercase">
            Our Gallery
          </h1>
        </div>

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

        {!loading && !error && items.length === 0 && (
          <div className="rounded-3xl border border-border bg-card p-12 text-center max-w-xl mx-auto my-12 shadow-soft">
            <Film className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold text-foreground">No Media Yet</h3>
            <p className="text-sm text-muted-foreground mt-2">Paste files in <code>webpage/src/gallery</code> to show media here.</p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 rounded-lg bg-transparent">
              <button
                onClick={() => setActiveSection("IMAGES")}
                className={`rounded-md px-5 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                  activeSection === "IMAGES" ? "bg-black text-white" : "bg-card text-foreground border border-border hover:bg-muted"
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setActiveSection("VIDEOS")}
                className={`rounded-md px-5 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                  activeSection === "VIDEOS" ? "bg-black text-white" : "bg-card text-foreground border border-border hover:bg-muted"
                }`}
              >
                Videos
              </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleItems.map(renderCard)}
            </div>

            {visibleItems.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No {activeSection === "IMAGES" ? "images" : "videos"} available.
              </div>
            )}
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedItem(null)}
          />

          <div className="relative w-full max-w-4xl aspect-video rounded-3xl bg-black overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedItem.type === "VIDEO" ? (
              <video
                src={selectedItem.url}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                className="w-full h-full object-contain"
              />
            ) : (
              <img src={selectedItem.url} alt={selectedItem.title} className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
