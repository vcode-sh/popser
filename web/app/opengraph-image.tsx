import { generateOGImage } from "fumadocs-ui/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return generateOGImage({
    title: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.name,
    primaryColor: "#f97316",
    primaryTextColor: "#ffffff",
  });
}
