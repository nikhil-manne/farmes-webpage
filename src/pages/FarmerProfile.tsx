import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Award, ChevronLeft, Leaf, MapPin, Play, X } from "lucide-react";
import farmCover from "@/assets/farm-1.jpg";
import farmerPortrait from "@/assets/farmer-1.jpg";
import { api, BackendFarmer } from "@/lib/api";
import { Loader } from "@/components/ui/loader";
import { getProductImage } from "@/lib/mappers";

type MediaItem = { id: string; type: "IMAGE" | "VIDEO"; url: string };
type FarmerProductCard = { id: string; name: string; image: string; pricePerKg: number };

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test((value || "").trim());
const inferMediaTypeFromUrl = (url: string): "IMAGE" | "VIDEO" => {
  const clean = (url || "").split("?")[0].toLowerCase();
  if ([".mp4", ".mov", ".m4v", ".webm", ".3gp", ".mkv"].some((ext) => clean.endsWith(ext))) return "VIDEO";
  return "IMAGE";
};

const FarmerProfile = () => {
  const { id = "" } = useParams();
  const [farmer, setFarmer] = useState<BackendFarmer | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [signedUrlByMediaId, setSignedUrlByMediaId] = useState<Record<string, string>>({});
  const [mediaAccessError, setMediaAccessError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{ type: "IMAGE" | "VIDEO"; url: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setSignedUrlByMediaId({});
    api
      .getFarmer(id)
      .then((data) => {
        setFarmer(data);
        const combined = [...data.media]
          .map((item) => ({
            id: item.id,
            url: typeof item.url === "string" ? item.url.trim() : "",
            type: item.type || inferMediaTypeFromUrl(item.url || ""),
          }))
          .filter((item) => item.id && item.url);
        const deduped = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        setMedia(deduped);
      })
      .catch((err: Error) => {
        setFarmer(null);
        setMedia([]);
        setError(err.message || "Unable to load farmer.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !media.length) return;
    let active = true;
    void (async () => {
      const nextSigned: Record<string, string> = {};
      setMediaAccessError(null);
      try {
        const signed = await api.getFarmerMediaSigned(id);
        signed.items.forEach((item) => {
          if (item.url?.trim()) nextSigned[item.mediaId] = item.url.trim();
        });
      } catch {
        if (active) setMediaAccessError("Could not load /media/farmer/:id for this profile. Login may be required.");
      }
      if (active) setSignedUrlByMediaId(nextSigned);
    })();
    return () => {
      active = false;
    };
  }, [id, media]);

  const products = useMemo<FarmerProductCard[]>(
    () =>
      (farmer?.products || []).map((product) => ({
        id: product.id,
        name: product.name,
        image: getProductImage(product.name),
        pricePerKg: Number(product.pricePerKg),
      })),
    [farmer],
  );
  const resolvedUrl = (item: MediaItem) => signedUrlByMediaId[item.id] || (isAbsoluteUrl(item.url) ? item.url : "");
  const name = farmer?.user.name || farmer?.farmName || "Farm Partner";

  if (loading) return <Loader text="Loading farmer profile..." />;
  if (!farmer) return <div className="p-6 text-sm text-muted-foreground">{error || "Farmer not found."}</div>;

  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden bg-primary-soft lg:mt-8 lg:rounded-lg">
        <img src={farmCover} alt="" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent" />
        <button onClick={() => navigate(-1)} className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/85 shadow-soft backdrop-blur-md" aria-label="Back">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 px-5 lg:px-0">
        <img src={farmerPortrait} alt={name} className="h-24 w-24 rounded-full border-4 border-background object-cover shadow-card" />
        <h1 className="mt-3 font-display text-2xl font-bold">{name}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> {farmer.villageOrAddress}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-border bg-card p-3 shadow-soft">
          {[
            { icon: Award, label: "Farm", value: farmer.farmName || "Local" },
            { icon: Leaf, label: "Practice", value: "Fresh" },
            { icon: MapPin, label: "Acres", value: farmer.landSize },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 px-1 text-center">
              <item.icon className="h-4 w-4 text-secondary" strokeWidth={2.2} />
              <p className="max-w-full truncate font-display text-sm font-bold">{item.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Serving fresh produce from {farmer.villageOrAddress}. Land size: {farmer.landSize} acres.
        </p>

        <div className="mt-6 flex items-end justify-between">
          <h2 className="font-display text-lg font-bold">Farm Photos & Videos</h2>
          <span className="text-xs text-muted-foreground">{media.length} uploads</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-4">
          {media.length ? media.map((item) => {
            const url = resolvedUrl(item);
            const isVideo = item.type === "VIDEO";
            return (
              <button key={item.id} disabled={!url} onClick={() => setViewer({ type: item.type, url })} className="relative aspect-square overflow-hidden rounded-lg bg-muted text-left disabled:cursor-not-allowed">
                {url && isVideo ? <video src={url} className="h-full w-full object-cover" muted preload="metadata" /> : null}
                {url && !isVideo ? <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" /> : null}
                {!url ? <div className="flex h-full w-full items-center justify-center p-2 text-center text-[11px] text-muted-foreground">Login to view</div> : null}
                {isVideo && url ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background/90">
                      <Play className="ml-0.5 h-4 w-4 fill-foreground text-foreground" />
                    </div>
                  </div>
                ) : null}
              </button>
            );
          }) : <div className="col-span-full rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">No farm media uploaded yet.</div>}
        </div>
        {mediaAccessError ? (
          <p className="mt-3 text-xs font-semibold text-muted-foreground">{mediaAccessError}</p>
        ) : null}

        <div className="mt-8">
          <h2 className="font-display text-lg font-bold">Products from this farm</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
                <div className="aspect-square bg-muted">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="truncate font-display text-sm font-bold">{product.name}</p>
                  <p className="mt-1 text-sm font-bold text-primary">Rs {product.pricePerKg}/kg</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {viewer ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button onClick={() => setViewer(null)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
          {viewer.type === "IMAGE" ? <img src={viewer.url} alt="" className="max-h-[85vh] max-w-full object-contain" /> : null}
          {viewer.type === "VIDEO" ? <video src={viewer.url} className="max-h-[85vh] max-w-full" controls autoPlay /> : null}
        </div>
      ) : null}
    </div>
  );
};

export default FarmerProfile;
