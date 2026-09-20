import { TopNav, TopNavHeading, TopNavItem } from "@astryxdesign/core/TopNav";
import { PixelIcon } from "./components/quest/pixel-icon";
import type { QuestTheme } from "./components/quest/theme";
import { ThemePicker } from "./demo-theme-picker";

export const githubUrl = "https://github.com/Kadajett/QuestUI";

export interface SiteNavProps {
  themeName: QuestTheme;
  onThemeChange: (themeName: QuestTheme) => void;
}

export function SiteNav({ themeName, onThemeChange }: SiteNavProps) {
  return (
    <TopNav
      heading={
        <TopNavHeading
          heading="QuestUI"
          headingHref="/"
          logo={<PixelIcon name="spark" />}
        />
      }
      startContent={
        <>
          <TopNavItem label="Components" href="/components" />
          <TopNavItem label="Themes" href="/#themes" />
          <TopNavItem label="Install" href="/#install" />
          <TopNavItem label="GitHub" href={githubUrl} />
        </>
      }
      endContent={
        <ThemePicker themeName={themeName} onThemeChange={onThemeChange} />
      }
      label="QuestUI navigation"
    />
  );
}
