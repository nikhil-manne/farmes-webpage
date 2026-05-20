export type LocalGalleryItem = {
  id: string;
  title: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  createdAt: string;
};

const localGalleryModules = import.meta.glob("../gallery/*.{png,jpg,jpeg,webp,gif,mp4,webm,mov,m4v,ogg}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const VIDEO_EXTENSIONS = new Set(["mp4", "webm", "mov", "m4v", "ogg"]);

const getTypeFromPath = (path: string): "IMAGE" | "VIDEO" => {
  const ext = path.split(".").pop()?.toLowerCase() || "";
  return VIDEO_EXTENSIONS.has(ext) ? "VIDEO" : "IMAGE";
};

const getTitleFromPath = (path: string): string => {
  const file = path.split("/").pop() || "media";
  const name = file.replace(/\.[^/.]+$/, "");
  return name.replace(/[-_]+/g, " ").trim() || "Gallery Media";
};

export const localGalleryItems: LocalGalleryItem[] = Object.entries(localGalleryModules)
  .map(([path, url], index) => ({
    id: `local-${index}`,
    title: getTitleFromPath(path),
    url,
    type: getTypeFromPath(path),
    createdAt: new Date().toISOString(),
  }))
  .sort((a, b) => a.title.localeCompare(b.title));

export const localGalleryImages = localGalleryItems.filter((item) => item.type === "IMAGE");
export const localGalleryVideos = localGalleryItems.filter((item) => item.type === "VIDEO");
