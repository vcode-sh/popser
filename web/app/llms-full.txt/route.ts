import { getLLMText } from "@/lib/get-llm-text";
import { siteConfig } from "@/lib/site";
import { source } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const pages = source.getPages().filter((p) => p.slugs[0] !== "changelog");

  const header = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
  ].join("\n");

  const sections = await Promise.all(pages.map((page) => getLLMText(page)));
  const body = sections.join("\n\n---\n\n");

  return new Response(`${header}\n\n---\n\n${body}`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
