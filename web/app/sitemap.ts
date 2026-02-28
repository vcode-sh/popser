import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: new Date() },
    { url: `${siteConfig.url}/why`, lastModified: new Date() },
    { url: `${siteConfig.url}/why-base-ui`, lastModified: new Date() },
    { url: `${siteConfig.url}/collaborate`, lastModified: new Date() },
  ];

  const docsPages: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: `${siteConfig.url}${page.url}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...docsPages];
}
