import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const gitConfig = {
  user: "vcode-sh",
  repo: "popser",
  branch: "main",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Popser",
    },
    links: [
      {
        text: "Why Popser",
        url: "/why",
      },
      {
        text: "Why Base UI",
        url: "/why-base-ui",
      },
      {
        text: "Documentation",
        url: "/docs",
        active: "nested-url",
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
