import type { TokenValue } from "@astryxdesign/core/theme";

/** Semantic colors consumed by createQuestTheme. Values may differ by light and dark mode. */
export interface QuestPalette {
  readonly background: TokenValue;
  readonly foreground: TokenValue;
  readonly card: TokenValue;
  readonly cardForeground: TokenValue;
  readonly popover: TokenValue;
  readonly popoverForeground: TokenValue;
  readonly primary: TokenValue;
  readonly primaryForeground: TokenValue;
  readonly secondary: TokenValue;
  readonly secondaryForeground: TokenValue;
  readonly muted: TokenValue;
  readonly mutedForeground: TokenValue;
  readonly accent: TokenValue;
  readonly accentForeground: TokenValue;
  readonly destructive: TokenValue;
  readonly destructiveForeground: TokenValue;
  readonly border: TokenValue;
  readonly input: TokenValue;
  readonly ring: TokenValue;
  readonly edge: TokenValue;
  readonly shadow: TokenValue;
  readonly highlight: TokenValue;
}

export const overworldCastlePalette: QuestPalette = {
  background: ["#e7f1fc", "#111820"],
  foreground: ["#1c2b45", "#edf0e9"],
  card: ["#fffefa", "#1b2735"],
  cardForeground: ["#1c2b45", "#edf0e9"],
  popover: ["#ffffff", "#263343"],
  popoverForeground: ["#1c2b45", "#edf0e9"],
  primary: ["#c92e35", "#ee665e"],
  primaryForeground: ["#ffffff", "#281013"],
  secondary: ["#255cbd", "#a8bed3"],
  secondaryForeground: ["#ffffff", "#151c29"],
  muted: ["#d4e2f2", "#2c3949"],
  mutedForeground: ["#485d76", "#aebbcd"],
  accent: ["#f6dcd9", "#3d272a"],
  accentForeground: ["#8e1e30", "#f4dddd"],
  destructive: ["#8e1e30", "#f28d84"],
  destructiveForeground: ["#ffffff", "#301719"],
  border: ["#97abc1", "#4b5a6d"],
  input: ["#667f9b", "#7e90a7"],
  ring: ["#255cbd", "#edf0e9"],
  edge: ["#17243b", "#070c12"],
  shadow: ["#a6bbd5", "#070c12"],
  highlight: ["#4b6280", "#7b8899"],
};

export const nymphGbColors = [
  "#2c2137",
  "#446176",
  "#3fac95",
  "#a1ef8c",
] as const;

export const nymphGbPalette: QuestPalette = {
  background: "#2c2137",
  foreground: "#a1ef8c",
  card: "#446176",
  cardForeground: "#a1ef8c",
  popover: "#446176",
  popoverForeground: "#a1ef8c",
  primary: "#a1ef8c",
  primaryForeground: "#2c2137",
  secondary: "#3fac95",
  secondaryForeground: "#2c2137",
  muted: "#446176",
  mutedForeground: "#a1ef8c",
  accent: "#3fac95",
  accentForeground: "#2c2137",
  destructive: "#a1ef8c",
  destructiveForeground: "#2c2137",
  border: "#3fac95",
  input: "#a1ef8c",
  ring: "#a1ef8c",
  edge: "#2c2137",
  shadow: "#2c2137",
  highlight: "#a1ef8c",
};

export const pico8Colors = [
  "#000000",
  "#1D2B53",
  "#7E2553",
  "#008751",
  "#AB5236",
  "#5F574F",
  "#C2C3C7",
  "#FFF1E8",
  "#FF004D",
  "#FFA300",
  "#FFEC27",
  "#00E436",
  "#29ADFF",
  "#83769C",
  "#FF77A8",
  "#FFCCAA",
] as const;

export const pico8Palette: QuestPalette = {
  background: "#1D2B53",
  foreground: "#FFF1E8",
  card: "#000000",
  cardForeground: "#FFF1E8",
  popover: "#7E2553",
  popoverForeground: "#FFF1E8",
  primary: "#FF004D",
  primaryForeground: "#000000",
  secondary: "#29ADFF",
  secondaryForeground: "#000000",
  muted: "#5F574F",
  mutedForeground: "#FFF1E8",
  accent: "#FFEC27",
  accentForeground: "#000000",
  destructive: "#AB5236",
  destructiveForeground: "#FFF1E8",
  border: "#C2C3C7",
  input: "#FFCCAA",
  ring: "#00E436",
  edge: "#000000",
  shadow: "#000000",
  highlight: "#83769C",
};
