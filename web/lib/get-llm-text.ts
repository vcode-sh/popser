import { siteConfig } from "@/lib/site";
import type { source } from "@/lib/source";

type Page = ReturnType<typeof source.getPages>[number];

export async function getLLMText(page: Page): Promise<string> {
  const url = `${siteConfig.url}${page.url}`;
  const title = page.data.title;
  const description = page.data.description;

  const rawMarkdown = await (
    page.data as unknown as { getText(type: string): Promise<string> }
  ).getText("processed");

  const content = rawMarkdown
    .replace(/<\w+[^>]*\/>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const lines = [`# ${title}`, url];
  if (description) {
    lines.push("", `> ${description}`);
  }
  lines.push("", content);

  return lines.join("\n");
}
