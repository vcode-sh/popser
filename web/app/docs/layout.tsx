import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsToaster } from "@/components/docs-toaster";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      {children}
      <DocsToaster />
    </DocsLayout>
  );
}
