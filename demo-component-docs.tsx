import { AppShell } from "@astryxdesign/core/AppShell";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { componentCatalog } from "./cli/catalog";
import { Item } from "./components/quest/item";
import { PixelIcon } from "./components/quest/pixel-icon";
import {
  Sidebar,
  SidebarHeading,
  SidebarItem,
  SidebarSection,
} from "./components/quest/sidebar";
import type { QuestTheme } from "./components/quest/theme";
import { componentDocsStyles as styles } from "./demo-component-docs.styles";
import type { CatalogEntry } from "./demo-component-docs-model";
import { displayName } from "./demo-component-docs-model";
import { ComponentDetail, MissingComponent } from "./demo-component-detail";
import { SiteNav } from "./demo-site-nav";

function ComponentSidebar({ activeName }: { activeName?: string }) {
  return (
    <Sidebar
      aria-label="Component documentation"
      xstyle={styles.sidebar}
      header={
        <SidebarHeading heading="Components" icon={<PixelIcon name="grid" />} />
      }
    >
      <SidebarSection title="QuestUI catalog">
        {componentCatalog.map((component) => (
          <SidebarItem
            key={component.name}
            label={displayName(component.name)}
            href={`/components/${component.name}`}
            isSelected={component.name === activeName}
          />
        ))}
      </SidebarSection>
    </Sidebar>
  );
}

function ComponentsIndex() {
  return (
    <Stack width="100%" maxWidth={1040} gap={6} xstyle={styles.content}>
      <Stack gap={2}>
        <Text type="label" color="accent">
          64 SOURCE-COPY COMPOSITIONS
        </Text>
        <Heading level={1} type="display-1">
          Components
        </Heading>
        <Text as="p" type="large" color="secondary">
          One page per component: install command, import path, Astryx
          foundation, registry artifact, and the editable source.
        </Text>
      </Stack>
      <Grid columns={{ minWidth: 240, max: 3 }} gap={3}>
        {componentCatalog.map((component) => (
          <Item
            key={component.name}
            href={`/components/${component.name}`}
            label={displayName(component.name)}
            description={`Built on ${component.native}`}
            xstyle={styles.card}
          />
        ))}
      </Grid>
    </Stack>
  );
}

function componentDocsTitle(
  entry: CatalogEntry | undefined,
  componentName: string | undefined,
): string {
  if (entry) return `${displayName(entry.name)} · QuestUI`;
  if (componentName) return "Component not found · QuestUI";
  return "Components · QuestUI";
}

function componentDocsContent(
  entry: CatalogEntry | undefined,
  componentName: string | undefined,
) {
  if (!componentName) return <ComponentsIndex />;
  if (entry) return <ComponentDetail entry={entry} />;
  return <MissingComponent name={componentName} />;
}

export interface ComponentDocsPageProps {
  componentName?: string;
  themeName: QuestTheme;
  onThemeChange: (themeName: QuestTheme) => void;
}

export default function ComponentDocsPage({
  componentName,
  themeName,
  onThemeChange,
}: ComponentDocsPageProps) {
  const entry = componentName
    ? componentCatalog.find((component) => component.name === componentName)
    : undefined;
  document.title = componentDocsTitle(entry, componentName);
  return (
    <AppShell
      height="fill"
      contentPadding={8}
      variant="section"
      xstyle={styles.shell}
      topNav={<SiteNav themeName={themeName} onThemeChange={onThemeChange} />}
      sideNav={
        <ComponentSidebar {...(entry ? { activeName: entry.name } : {})} />
      }
    >
      {componentDocsContent(entry, componentName)}
    </AppShell>
  );
}
