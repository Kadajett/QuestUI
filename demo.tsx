import { lazy, Suspense, useState } from "react";
import { createRoot } from "react-dom/client";
import { Text } from "@astryxdesign/core/Text";
import { Theme } from "@astryxdesign/core/theme";
import {
  themeNames,
  themes,
  type QuestTheme,
} from "./components/quest/theme";
import { LandingPage } from "./demo-landing";

import "@astryxdesign/core/reset.css";
import "@astryxdesign/core/astryx.css";
import "./components/quest/fonts.css";

const Workbench = lazy(() => import("./demo-workbench"));
const ComponentDocsPage = lazy(() => import("./demo-component-docs"));

const themeStorageKey = "questui.theme.v1";

function storedThemeName(): QuestTheme | undefined {
  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);
    return themeNames.find((themeName) => themeName === storedTheme);
  } catch {
    return undefined;
  }
}

function initialThemeName(): QuestTheme {
  const storedTheme = storedThemeName();
  if (storedTheme) return storedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "castle"
    : "overworld";
}

function persistThemeName(themeName: QuestTheme): void {
  try {
    window.localStorage.setItem(themeStorageKey, themeName);
  } catch {
    // Storage may be disabled; the in-memory selection still applies.
  }
}

interface CurrentPageProps {
  themeName: QuestTheme;
  onThemeChange: (themeName: QuestTheme) => void;
}

function CurrentPage({ themeName, onThemeChange }: CurrentPageProps) {
  const pathname = window.location.pathname;
  if (pathname.startsWith("/demo")) {
    document.title = "QuestUI component playground";
    return (
      <Suspense fallback={<Text>Loading component playground…</Text>}>
        <Workbench themeName={themeName} onThemeChange={onThemeChange} />
      </Suspense>
    );
  }
  const docsMatch = pathname.match(/^\/components(?:\/([^/]+))?\/?$/);
  if (docsMatch) {
    document.title = "QuestUI component docs";
    const componentName = docsMatch[1];
    return (
      <Suspense fallback={<Text>Loading component docs…</Text>}>
        <ComponentDocsPage
          {...(componentName ? { componentName } : {})}
          themeName={themeName}
          onThemeChange={onThemeChange}
        />
      </Suspense>
    );
  }
  document.title = "QuestUI · Pixel components for React";
  return <LandingPage themeName={themeName} onThemeChange={onThemeChange} />;
}

function App() {
  const [themeName, setThemeName] = useState<QuestTheme>(initialThemeName);
  const activeTheme = themes[themeName];
  const changeTheme = (nextTheme: QuestTheme) => {
    setThemeName(nextTheme);
    persistThemeName(nextTheme);
  };
  return (
    <Theme theme={activeTheme.theme} mode={activeTheme.mode}>
      <CurrentPage themeName={themeName} onThemeChange={changeTheme} />
    </Theme>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");
createRoot(root).render(<App />);
