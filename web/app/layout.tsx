import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter } from "next/font/google";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Popser",
    template: "%s | Popser",
  },
  description:
    "Toast notifications for React. Built on Base UI. Sonner-compatible API.",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
