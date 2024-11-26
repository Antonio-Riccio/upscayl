export const VALID_IMAGE_FORMATS = [
  "png",
  "jpg",
  "jpeg",
  "jfif",
  "webp",
] as const;

export const VALID_VIDEO_FORMATS = ["mp4", "mov"] as const;

export type VideoFormat = (typeof VALID_VIDEO_FORMATS)[number];

export type ImageFormat = (typeof VALID_IMAGE_FORMATS)[number];
