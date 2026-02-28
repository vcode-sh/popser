import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
  ActionsDemo,
  AnchoredDemo,
  CloseDemo,
  CustomDemo,
  DedupDemo,
  DescriptionDemo,
  PromiseDemo,
  RichColorsDemo,
  TypesDemo,
  UpdateDemo,
} from "@/components/demos";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    TypesDemo,
    DescriptionDemo,
    ActionsDemo,
    UpdateDemo,
    CloseDemo,
    DedupDemo,
    PromiseDemo,
    CustomDemo,
    RichColorsDemo,
    AnchoredDemo,
    ...components,
  };
}
