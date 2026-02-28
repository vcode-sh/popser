import { ImageResponse } from "next/og";
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

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 80px",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.1,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#a1a1aa",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #f97316, #ef4444)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            fontWeight: 700,
            color: "white",
          }}
        >
          P
        </div>
        <div
          style={{
            fontSize: "24px",
            fontWeight: 600,
            background: "linear-gradient(135deg, #f97316, #ef4444)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {siteConfig.name}
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
