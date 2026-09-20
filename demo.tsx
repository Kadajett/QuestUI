import { lazy, Suspense, useState } from "react";
import { createRoot } from "react-dom/client";
import { Text } from "@astryxdesign/core/Text";
import { Theme } from "@astryxdesign/core/theme";
import { themes, type QuestTheme } from "./components/quest/theme";
import { LandingPage } from "./demo-landing";

import "@astryxdesign/core/reset.css";
import "@astryxdesign/core/astryx.css";
import "./components/quest/fonts.css";

const Workbench = lazy(() => import("./demo-workbench"));
const ComponentDocsPage = lazy(() => import("./demo-component-docs"));

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
  const [themeName, setThemeName] = useState<QuestTheme>("overworld");
  const activeTheme = themes[themeName];
  return (
    <Theme theme={activeTheme.theme} mode={activeTheme.mode}>
      <CurrentPage themeName={themeName} onThemeChange={setThemeName} />
    </Theme>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");
createRoot(root).render(<App />);
