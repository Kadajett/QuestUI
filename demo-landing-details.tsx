import { CodeBlock } from "@astryxdesign/core/CodeBlock";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { Section } from "@astryxdesign/core/Section";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { componentCatalog } from "./cli/catalog";
import { Card, CardContent } from "./components/quest/card";
import { Item } from "./components/quest/item";
import { landingStyles as styles } from "./demo-landing.styles";
import { githubUrl } from "./demo-site-nav";

const installCommand = `npx quest-ui init --framework vite --registry https://questui.yougotserved.dev/r
npx quest-ui add button card dialog --registry https://questui.yougotserved.dev/r`;
const themeExample = `const mossTheme = createQuestTheme('moss', {
  ...nymphGbPalette,
  primary: '#3fac95',
  primaryForeground: '#2c2137',
})`;

function RestyleIntro() {
  return (
    <Stack gap={2}>
      <Text type="label" color="accent">
        YOUR GAME, YOUR ART DIRECTION
      </Text>
      <Heading level={2} type="display-2">
        Four themes are examples—not the boundary.
      </Heading>
      <Text as="p" type="large" color="secondary" xstyle={styles.supporting}>
        QuestUI exports a palette-to-theme factory and editable source. Switch
        among Overworld, Castle, Nymph GB, and PICO-8 in the Theme control
        above, then bring a handheld palette, fantasy-console set, or brand
        system of your own without rebuilding component behavior.
      </Text>
    </Stack>
  );
}

function RestyleLayers() {
  const layers = [
    [
      "Palette",
      "Map any Lospec palette once to semantic surface, text, action, border, and state tokens.",
    ],
    [
      "Silhouette",
      "Change stepped geometry, radius, type, spacing, borders, and hard-shadow tokens.",
    ],
    [
      "Components",
      "Retarget Astryx slots or edit copied StyleX while accessible behavior stays intact.",
    ],
  ] as const;
  return (
    <Grid columns={{ minWidth: 260, max: 3 }} gap={4}>
      {layers.map(([title, description]) => (
        <Card key={title} xstyle={styles.architecture}>
          <CardContent>
            <Stack gap={3}>
              <Heading level={3}>{title}</Heading>
              <Text as="p" color="secondary">
                {description}
              </Text>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}

function RestyleResources() {
  return (
    <Stack direction="horizontal" gap={4} wrap="wrap">
      <Link
        href={`${githubUrl}/blob/main/docs/getting-started.md#build-your-own-theme`}
        isStandalone
        weight="bold"
      >
        Build your own theme
      </Link>
      <Link href="https://lospec.com/palette-list/nymph-gb" isStandalone>
        Nymph GB by Kerrie Lake
      </Link>
      <Link href="https://lospec.com/palette-list/pico-8" isStandalone>
        PICO-8 palette
      </Link>
      <Link href="https://lospec.com/palette-list" isStandalone>
        Browse all Lospec palettes
      </Link>
    </Stack>
  );
}

export function Restyle() {
  return (
    <Section
      id="themes"
      variant="transparent"
      padding={0}
      xstyle={styles.anchor}
    >
      <Stack gap={5}>
        <RestyleIntro />
        <RestyleLayers />
        <CodeBlock
          code={themeExample}
          language="typescript"
          title="components/quest/theme.ts"
          width="100%"
          hasLineNumbers={false}
        />
        <RestyleResources />
      </Stack>
    </Section>
  );
}

export function Install() {
  return (
    <Section id="install" variant="muted" padding={6} xstyle={styles.anchor}>
      <Grid columns={{ minWidth: 300, max: 2 }} gap={6} align="center">
        <Stack gap={3}>
          <Text type="label" color="accent">
            TWO COMMANDS TO ADVENTURE
          </Text>
          <Heading level={2} type="display-2">
            Initialize once. Copy only what you need.
          </Heading>
          <Text as="p" color="secondary">
            The guarded Vite initializer wires StyleX, Astryx styles, the Quest
            theme, fonts, aliases, and source delivery without replacing your
            application.
          </Text>
          <Link href="/components" isStandalone weight="bold">
            Open the component docs
          </Link>
        </Stack>
        <CodeBlock
          code={installCommand}
          language="shell"
          title="terminal"
          width="100%"
          hasLineNumbers={false}
        />
      </Grid>
    </Section>
  );
}

function componentLabel(name: string): string {
  return name
    .split("-")
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");
}

export function Catalog() {
  return (
    <Section
      id="components"
      variant="transparent"
      padding={0}
      xstyle={styles.anchor}
    >
      <Stack gap={5}>
        <Stack gap={2}>
          <Text type="label" color="accent">
            COMPLETE CATALOG
          </Text>
          <Heading level={2} type="display-2">
            All 64 components. No missing screen.
          </Heading>
          <Text as="p" color="secondary">
            Each row is an installable registry slug backed by a Quest
            composition and an Astryx or native semantic foundation.
          </Text>
        </Stack>
        <Grid columns={{ minWidth: 220, max: 4 }} gap={3}>
          {componentCatalog.map((component) => (
            <Item
              key={component.name}
              href={`/components/${component.name}`}
              label={componentLabel(component.name)}
              description={component.native}
              xstyle={styles.catalogItem}
            />
          ))}
        </Grid>
      </Stack>
    </Section>
  );
}
