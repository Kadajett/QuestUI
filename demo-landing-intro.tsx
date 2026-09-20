import * as stylex from "@stylexjs/stylex";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { Section } from "@astryxdesign/core/Section";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Card, CardContent } from "./components/quest/card";
import { PixelIcon } from "./components/quest/pixel-icon";
import { landingStyles as styles } from "./demo-landing.styles";
import { githubUrl } from "./demo-site-nav";

function HeroCopy() {
  return (
    <Stack gap={5} xstyle={styles.heroCopy}>
      <Text type="label" color="accent">
        ASTRYX SEMANTICS · STYLEX PIXELS · YOUR SOURCE
      </Text>
      <Heading level={1} type="display-1" textWrap="balance">
        Every shadcn component, reimagined for a{" "}
        <Text type="inherit" color="accent" xstyle={styles.accent}>
          pixel-art world.
        </Text>
      </Heading>
      <Text as="p" type="large" color="secondary" xstyle={styles.supporting}>
        Copy 64 editable React compositions into your app. Keep accessible
        Astryx behavior, compile the look with StyleX, and own every line.
      </Text>
      <Stack direction="horizontal" gap={4} wrap="wrap">
        <Link href="/components" isStandalone size="lg" weight="bold">
          Browse component docs
        </Link>
        <Link
          href="#install"
          isStandalone
          size="lg"
          weight="bold"
          color="primary"
        >
          Install from the registry
        </Link>
        <Link href={githubUrl} isStandalone size="lg" weight="bold">
          View source on GitHub
        </Link>
      </Stack>
    </Stack>
  );
}

function HeroArt() {
  return (
    <Stack hAlign="center" vAlign="center" minHeight="var(--spacing-10)">
      <PixelIcon
        {...stylex.props(styles.heroIcon)}
        name="spark"
        aria-hidden="true"
      />
      <Text type="display-2" color="accent">
        QUEST READY
      </Text>
      <Text as="p" color="secondary">
        Four sample worlds. Infinite palettes.
      </Text>
    </Stack>
  );
}

export function Hero() {
  return (
    <Section variant="transparent" padding={0}>
      <Card xstyle={styles.hero}>
        <CardContent>
          <Grid columns={{ minWidth: 280, max: 2 }} gap={8} align="center">
            <HeroCopy />
            <HeroArt />
          </Grid>
        </CardContent>
      </Card>
    </Section>
  );
}

export function Metrics() {
  const metrics = [
    ["64", "shadcn-compatible compositions"],
    ["4", "included themes, plus your own"],
    ["1", "source-copy CLI contract"],
  ] as const;
  return (
    <Grid columns={{ minWidth: 220, max: 3 }} gap={4}>
      {metrics.map(([value, label]) => (
        <Card key={label} xstyle={styles.metric}>
          <CardContent>
            <Stack gap={2}>
              <Heading level={2} type="display-2" color="accent">
                {value}
              </Heading>
              <Text as="p">{label}</Text>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}

export function Architecture() {
  const steps = [
    [
      "01 · Copy",
      "The shadcn-compatible registry installs real TypeScript into your application.",
    ],
    [
      "02 · Compose",
      "Astryx supplies accessible behavior while QuestUI owns the pixel-art presentation.",
    ],
    [
      "03 · Reforge",
      "Edit the component source or map a new palette through the exported theme factory.",
    ],
  ] as const;
  return (
    <Section variant="transparent" padding={0}>
      <Stack gap={5}>
        <Stack gap={2}>
          <Text type="label" color="accent">
            THE SOURCE-COPY LOOP
          </Text>
          <Heading level={2} type="display-2">
            Accessible foundations. Pixel-world freedom.
          </Heading>
        </Stack>
        <Grid columns={{ minWidth: 260, max: 3 }} gap={4}>
          {steps.map(([title, description]) => (
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
      </Stack>
    </Section>
  );
}
