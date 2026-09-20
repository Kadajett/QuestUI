import { AppShell } from "@astryxdesign/core/AppShell";
import { Link } from "@astryxdesign/core/Link";
import { Stack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import type { QuestTheme } from "./components/quest/theme";
import { landingStyles as styles } from "./demo-landing.styles";
import { Catalog, Install, Restyle } from "./demo-landing-details";
import { Architecture, Hero, Metrics } from "./demo-landing-intro";
import { githubUrl, SiteNav } from "./demo-site-nav";

const supportUrl = "https://buymeacoffee.com/kadajett";

function LandingFooter() {
  return (
    <Stack
      as="footer"
      direction="horizontal"
      hAlign="between"
      gap={4}
      wrap="wrap"
      paddingBlock={6}
      xstyle={styles.footer}
    >
      <Text color="secondary">
        QuestUI · editable pixel components for React
      </Text>
      <Stack direction="horizontal" gap={4} wrap="wrap">
        <Link href="/components" isStandalone>
          Component docs
        </Link>
        <Link href="/llms.txt" isStandalone>
          AI docs
        </Link>
        <Link href={githubUrl} isStandalone>
          GitHub
        </Link>
        <Link href={supportUrl} isStandalone>
          Buy me a coffee
        </Link>
      </Stack>
    </Stack>
  );
}

export function LandingPage({
  themeName,
  onThemeChange,
}: {
  themeName: QuestTheme;
  onThemeChange: (themeName: QuestTheme) => void;
}) {
  return (
    <AppShell
      height="auto"
      contentPadding={0}
      variant="section"
      xstyle={styles.shell}
      topNav={<SiteNav themeName={themeName} onThemeChange={onThemeChange} />}
    >
      <Stack
        width="100%"
        maxWidth={1280}
        padding={8}
        gap={10}
        xstyle={styles.content}
      >
        <Hero />
        <Metrics />
        <Architecture />
        <Restyle />
        <Install />
        <Catalog />
        <LandingFooter />
      </Stack>
    </AppShell>
  );
}
