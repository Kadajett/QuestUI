import * as stylex from "@stylexjs/stylex";

export const landingStyles = stylex.create({
  shell: {
    backgroundColor: "var(--q-background)",
    color: "var(--q-foreground)",
    fontFamily: "var(--q-font-body)",
  },
  content: { marginInline: "auto" },
  hero: { overflow: "hidden" },
  heroCopy: { maxWidth: "48rem" },
  heroIcon: {
    color: "var(--q-primary)",
    width: "var(--spacing-10)",
    height: "var(--spacing-10)",
    filter: "drop-shadow(var(--spacing-1) var(--spacing-1) 0 var(--q-shadow))",
  },
  accent: { color: "var(--q-primary)" },
  supporting: { maxWidth: "42rem" },
  anchor: { scrollMarginTop: "calc(var(--spacing-12) + var(--spacing-8))" },
  metric: { minHeight: "var(--spacing-10)" },
  architecture: { minHeight: "100%" },
  catalogItem: { height: "100%" },
  footer: {
    borderTopWidth: "var(--spacing-0-5)",
    borderTopStyle: "solid",
    borderTopColor: "var(--q-border)",
  },
});
