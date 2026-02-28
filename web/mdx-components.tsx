import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
  ActionsDemo,
  AnchorArrowDemo,
  AnchorClickDemo,
  AnchorSidesDemo,
  AnchoredDemo,
  CloseDemo,
  CustomAnchoredDemo,
  CustomDemo,
  CustomNotificationDemo,
  DedupDemo,
  DescriptionDemo,
  PromiseDemo,
  RichColorsDemo,
  StyleDemo,
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
    CustomNotificationDemo,
    CustomAnchoredDemo,
    RichColorsDemo,
    AnchoredDemo,
    AnchorSidesDemo,
    AnchorClickDemo,
    AnchorArrowDemo,
    StyleDemo,
    ...components,
  };
}
