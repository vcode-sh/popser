import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
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
} from '@/components/demos';

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
