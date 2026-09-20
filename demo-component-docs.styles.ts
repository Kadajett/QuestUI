import * as stylex from "@stylexjs/stylex";

export const componentDocsStyles = stylex.create({
  shell: {
    backgroundColor: "var(--q-background)",
    color: "var(--q-foreground)",
    fontFamily: "var(--q-font-body)",
  },
  content: { marginInline: "auto" },
  sidebar: { height: "100%" },
  card: { height: "100%" },
});
