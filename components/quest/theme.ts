import {
  defineTheme,
  type ResolvedDefinedTheme,
} from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral";
import { createElement } from "react";
import { PixelIcon } from "./pixel-icon";
import { pickerThemeComponents, pickerThemeIcons } from "./picker-theme";
import { questControlTargets } from "./control-theme";
import { questIndicators } from "./control-indicators";
import {
  nymphGbColors,
  nymphGbPalette,
  overworldCastlePalette,
  pico8Colors,
  pico8Palette,
  type QuestPalette,
} from "./palettes";

export type { QuestPalette } from "./palettes";

const sharedLocalTokens = {
  "--q-font-display": '"Pixelify Sans", ui-monospace, monospace',
  "--q-font-body": '"VT323", ui-monospace, monospace',
  "--q-step":
    "polygon(0 8px,4px 8px,4px 4px,8px 4px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 4px,calc(100% - 4px) 4px,calc(100% - 4px) 8px,100% 8px,100% calc(100% - 8px),calc(100% - 4px) calc(100% - 8px),calc(100% - 4px) calc(100% - 4px),calc(100% - 8px) calc(100% - 4px),calc(100% - 8px) 100%,8px 100%,8px calc(100% - 4px),4px calc(100% - 4px),4px calc(100% - 8px),0 calc(100% - 8px))",
} as const;

function questLocalTokens(palette: QuestPalette) {
  return {
    ...sharedLocalTokens,
    "--q-background": palette.background,
    "--q-foreground": palette.foreground,
    "--q-card": palette.card,
    "--q-card-foreground": palette.cardForeground,
    "--q-popover": palette.popover,
    "--q-popover-foreground": palette.popoverForeground,
    "--q-primary": palette.primary,
    "--q-primary-foreground": palette.primaryForeground,
    "--q-secondary": palette.secondary,
    "--q-secondary-foreground": palette.secondaryForeground,
    "--q-muted": palette.muted,
    "--q-muted-foreground": palette.mutedForeground,
    "--q-accent": palette.accent,
    "--q-accent-foreground": palette.accentForeground,
    "--q-destructive": palette.destructive,
    "--q-destructive-foreground": palette.destructiveForeground,
    "--q-border": palette.border,
    "--q-input": palette.input,
    "--q-ring": palette.ring,
    "--q-edge": palette.edge,
    "--q-shadow": palette.shadow,
    "--q-highlight": palette.highlight,
  };
}

const sharedComponents = {
  button: {
    base: {
      borderRadius: "0px",
      boxShadow: "none",
      fontFamily: 'var(--q-font-display, "Pixelify Sans")',
    },
  },
  card: {
    base: {
      borderRadius: "0px",
      backgroundColor: "transparent",
      color: "var(--q-card-foreground)",
    },
  },
  popover: {
    base: {
      borderRadius: "0px",
      borderWidth: "2px",
      borderStyle: "solid",
      boxShadow: "4px 4px 0 var(--q-shadow)",
      backgroundColor: "var(--q-popover)",
      color: "var(--q-popover-foreground)",
    },
  },
  avatar: {
    base: {
      borderRadius: "0px",
      backgroundColor: "var(--q-muted)",
      color: "var(--q-foreground)",
      fontFamily: "var(--q-font-display)",
      fontWeight: "700",
      lineHeight: "1",
    },
  },
  banner: {
    base: {
      backgroundColor: "transparent",
      color: "inherit",
      borderRadius: "0px",
    },
  },
  "banner-description": { base: { color: "inherit" } },
  "banner-icon": { base: { color: "inherit" } },
  "banner-content": {
    base: {
      backgroundColor: "transparent",
      color: "inherit",
      borderRadius: "0px",
    },
  },
  ...pickerThemeComponents,
  ...questControlTargets,
};

/** Build the complete QuestUI theme around a semantic color palette. */
export function createQuestTheme(
  name: string,
  palette: QuestPalette,
): ResolvedDefinedTheme {
  return defineTheme({
    name,
    extends: neutralTheme,
    color: { accent: palette.primary, neutralStyle: "cool" },
    typography: {
      scale: { base: 20, ratio: 1.15 },
      body: { family: "VT323", fallbacks: "ui-monospace, monospace" },
      heading: {
        family: "Pixelify Sans",
        fallbacks: "ui-monospace, monospace",
      },
    },
    radius: { base: 0, multiplier: 0 },
    localTokens: questLocalTokens(palette),
    tokens: {
      "--color-background-body": palette.background,
      "--color-background-surface": palette.card,
      "--color-background-card": palette.card,
      "--color-text-primary": palette.foreground,
      "--color-text-secondary": palette.mutedForeground,
      "--color-border": palette.border,
      "--size-element-sm": "44px",
      "--size-element-md": "48px",
      "--size-element-lg": "60px",
      "--shadow-low": "4px 4px 0 var(--color-border)",
    },
    components: sharedComponents,
    icons: {
      ...pickerThemeIcons,
      check: createElement(PixelIcon, { name: "check" }),
    },
    indicators: questIndicators,
  });
}

/** Backwards-compatible default with the original Overworld and Castle modes. */
export const questTheme = createQuestTheme("questui", overworldCastlePalette);
export default questTheme;
const nymphGbTheme = createQuestTheme("questui-nymph-gb", nymphGbPalette);
const pico8Theme = createQuestTheme("questui-pico-8", pico8Palette);

export const themeNames = [
  "overworld",
  "castle",
  "nymph-gb",
  "pico-8",
] as const;
export type QuestTheme = (typeof themeNames)[number];
export interface QuestThemeMetadata {
  readonly name: string;
  readonly mode: "light" | "dark";
  readonly theme: ResolvedDefinedTheme;
  readonly colors: readonly string[];
  readonly sourceUrl?: string;
  readonly sourceLabel?: string;
}

const overworldColors = [
  "#e7f1fc",
  "#1c2b45",
  "#fffefa",
  "#c92e35",
  "#255cbd",
  "#d4e2f2",
  "#f6dcd9",
  "#8e1e30",
  "#97abc1",
] as const;
const castleColors = [
  "#111820",
  "#edf0e9",
  "#1b2735",
  "#263343",
  "#ee665e",
  "#a8bed3",
  "#2c3949",
  "#3d272a",
  "#f28d84",
  "#4b5a6d",
] as const;

export const themes: Record<QuestTheme, QuestThemeMetadata> = {
  overworld: {
    name: "Overworld",
    mode: "light",
    theme: questTheme,
    colors: overworldColors,
  },
  castle: {
    name: "Castle",
    mode: "dark",
    theme: questTheme,
    colors: castleColors,
  },
  "nymph-gb": {
    name: "Nymph GB",
    mode: "dark",
    theme: nymphGbTheme,
    colors: nymphGbColors,
    sourceUrl: "https://lospec.com/palette-list/nymph-gb",
    sourceLabel: "Nymph GB by Kerrie Lake",
  },
  "pico-8": {
    name: "PICO-8",
    mode: "dark",
    theme: pico8Theme,
    colors: pico8Colors,
    sourceUrl: "https://lospec.com/palette-list/pico-8",
    sourceLabel: "PICO-8",
  },
};
