import { siteConfig } from "@/lib/site";
import { source } from "@/lib/source";

export const revalidate = false;

export function GET() {
  const pages = source.getPages().filter((p) => p.slugs[0] !== "changelog");

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Docs",
    "",
    ...pages.map((page) => {
      const url = `${siteConfig.url}${page.url}`;
      const description = page.data.description ?? page.data.title;
      return `- [${page.data.title}](${url}): ${description}`;
    }),
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
