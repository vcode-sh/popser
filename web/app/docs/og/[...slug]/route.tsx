import { generateOGImage } from "fumadocs-ui/og";
import { siteConfig } from "@/lib/site";
import { source } from "@/lib/source";

export function generateStaticParams() {
  return source
    .generateParams()
    .filter((params) => params.slug && params.slug.length > 0);
}

export async function GET(
  _request: Request,
  props: { params: Promise<{ slug: string[] }> }
) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  const title = page?.data.title ?? siteConfig.name;
  const description = page?.data.description ?? siteConfig.description;

  return generateOGImage({
    title,
    description,
    site: siteConfig.name,
    primaryColor: "#f97316",
    primaryTextColor: "#ffffff",
  });
}
