import * as stylex from '@stylexjs/stylex'
import {AppShell} from '@astryxdesign/core/AppShell'
import {CodeBlock} from '@astryxdesign/core/CodeBlock'
import {Grid} from '@astryxdesign/core/Grid'
import {Heading} from '@astryxdesign/core/Heading'
import {Link} from '@astryxdesign/core/Link'
import {Section} from '@astryxdesign/core/Section'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {TopNav, TopNavHeading, TopNavItem} from '@astryxdesign/core/TopNav'
import {componentCatalog} from './cli/catalog'
import {Button} from './components/quest/button'
import {Card, CardContent} from './components/quest/card'
import {Item} from './components/quest/item'
import {PixelIcon} from './components/quest/pixel-icon'

const installCommand = `npx quest-ui init --framework vite --registry https://your-host.example/r
npx quest-ui add button card dialog --registry https://your-host.example/r`

const styles = stylex.create({
  shell: {backgroundColor: 'var(--q-background)', color: 'var(--q-foreground)', fontFamily: 'var(--q-font-body)'},
  content: {marginInline: 'auto'},
  hero: {overflow: 'hidden'},
  heroCopy: {maxWidth: '48rem'},
  heroIcon: {
    color: 'var(--q-primary)',
    width: 'var(--spacing-10)',
    height: 'var(--spacing-10)',
    filter: 'drop-shadow(var(--spacing-1) var(--spacing-1) 0 var(--q-shadow))',
  },
  accent: {color: 'var(--q-primary)'},
  supporting: {maxWidth: '42rem'},
  metric: {minHeight: 'var(--spacing-10)'},
  architecture: {minHeight: '100%'},
  catalogItem: {height: '100%'},
  footer: {borderTopWidth: 'var(--spacing-0-5)', borderTopStyle: 'solid', borderTopColor: 'var(--q-border)'},
})


function ProductNav({dark, onThemeToggle}: {dark: boolean; onThemeToggle: () => void}) {
  return <TopNav
    heading={<TopNavHeading heading="QuestUI" headingHref="/" logo={<PixelIcon name="spark" />} />}
    startContent={<>
      <TopNavItem label="Components" href="#components" />
      <TopNavItem label="Install" href="#install" />
      <TopNavItem label="Workbench" href="/demo" />
    </>}
    endContent={<Button size="sm" variant="outline" onClick={onThemeToggle}>
      {dark ? 'Switch to Overworld' : 'Switch to Castle'}
    </Button>}
    label="QuestUI navigation"
  />
}

function Hero() {
  return <Section variant="transparent" padding={0}>
    <Card xstyle={styles.hero}>
      <CardContent>
        <Grid columns={{minWidth: 280, max: 2}} gap={8} align="center">
          <Stack gap={5} xstyle={styles.heroCopy}>
            <Text type="label" color="accent">ASTRYX SEMANTICS · STYLEX PIXELS · YOUR SOURCE</Text>
            <Heading level={1} type="display-1" textWrap="balance">
              Every shadcn component, reimagined for a <Text type="inherit" color="accent" xstyle={styles.accent}>pixel-art world.</Text>
            </Heading>
            <Text as="p" type="large" color="secondary" xstyle={styles.supporting}>
              Copy 64 editable React compositions into your app. Keep accessible Astryx behavior, compile the look with StyleX, and own every line.
            </Text>
            <Stack direction="horizontal" gap={4} wrap="wrap">
              <Link href="/demo" isStandalone size="lg" weight="bold">Explore the workbench</Link>
              <Link href="#install" isStandalone size="lg" weight="bold" color="primary">Install from the registry</Link>
            </Stack>
          </Stack>
          <Stack hAlign="center" vAlign="center" minHeight="var(--spacing-10)">
            <PixelIcon {...stylex.props(styles.heroIcon)} name="spark" aria-hidden="true" />
            <Text type="display-2" color="accent">QUEST READY</Text>
            <Text as="p" color="secondary">Overworld by day. Castle by night.</Text>
          </Stack>
        </Grid>
      </CardContent>
    </Card>
  </Section>
}

function Metrics() {
  const metrics = [
    ['64', 'shadcn-compatible compositions'],
    ['2', 'pixel themes: overworld and castle'],
    ['1', 'source-copy CLI contract'],
  ] as const
  return <Grid columns={{minWidth: 220, max: 3}} gap={4}>
    {metrics.map(([value, label]) => <Card key={label} xstyle={styles.metric}>
      <CardContent><Stack gap={2}><Heading level={2} type="display-2" color="accent">{value}</Heading><Text as="p">{label}</Text></Stack></CardContent>
    </Card>)}
  </Grid>
}

function Architecture() {
  const steps = [
    ['01 · Copy', 'The shadcn-compatible registry installs real TypeScript into your application.'],
    ['02 · Compose', 'Astryx owns focus, keyboard behavior, announcements, and interaction state.'],
    ['03 · Restyle', 'StyleX and Quest theme tokens paint hard shadows, stepped corners, and two worlds.'],
  ] as const
  return <Section variant="transparent" padding={0}>
    <Stack gap={5}>
      <Stack gap={2}>
        <Text type="label" color="accent">THE STACK</Text>
        <Heading level={2} type="display-2">Accessible underneath. Pixel-perfect on top.</Heading>
      </Stack>
      <Grid columns={{minWidth: 260, max: 3}} gap={4}>
        {steps.map(([title, description]) => <Card key={title} xstyle={styles.architecture}>
          <CardContent><Stack gap={3}><Heading level={3}>{title}</Heading><Text as="p" color="secondary">{description}</Text></Stack></CardContent>
        </Card>)}
      </Grid>
    </Stack>
  </Section>
}

function Install() {
  return <Section id="install" variant="muted" padding={6}>
    <Grid columns={{minWidth: 300, max: 2}} gap={6} align="center">
      <Stack gap={3}>
        <Text type="label" color="accent">TWO COMMANDS TO ADVENTURE</Text>
        <Heading level={2} type="display-2">Initialize once. Copy only what you need.</Heading>
        <Text as="p" color="secondary">The guarded Vite initializer wires StyleX, Astryx styles, the Quest theme, fonts, aliases, and source delivery without replacing your application.</Text>
        <Link href="/demo" isStandalone weight="bold">See every component in action</Link>
      </Stack>
      <CodeBlock code={installCommand} language="shell" title="terminal" width="100%" hasLineNumbers={false} />
    </Grid>
  </Section>
}

function Catalog() {
  return <Section id="components" variant="transparent" padding={0}>
    <Stack gap={5}>
      <Stack gap={2}>
        <Text type="label" color="accent">COMPLETE CATALOG</Text>
        <Heading level={2} type="display-2">All 64 components. No missing screen.</Heading>
        <Text as="p" color="secondary">Each row is an installable registry slug backed by a Quest composition and an Astryx or native semantic foundation.</Text>
      </Stack>
      <Grid columns={{minWidth: 220, max: 4}} gap={3}>
        {componentCatalog.map(component => {
          const label = component.name.split('-').map(part => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`).join(' ')
          return <Item key={component.name} label={label} description={component.native} xstyle={styles.catalogItem} />
        })}
      </Grid>
    </Stack>
  </Section>
}

export function LandingPage({dark, onThemeToggle}: {dark: boolean; onThemeToggle: () => void}) {
  return <AppShell height="auto" contentPadding={0} variant="section" xstyle={styles.shell}
    topNav={<ProductNav dark={dark} onThemeToggle={onThemeToggle} />}>
    <Stack width="100%" maxWidth={1280} padding={8} gap={10} xstyle={styles.content}>
      <Hero />
      <Metrics />
      <Architecture />
      <Install />
      <Catalog />
      <Stack as="footer" direction="horizontal" hAlign="between" gap={4} wrap="wrap" paddingBlock={6} xstyle={styles.footer}>
        <Text color="secondary">QuestUI · editable pixel components for React</Text>
        <Stack direction="horizontal" gap={4} wrap="wrap">
          <Link href="/demo" isStandalone>Workbench</Link>
          <Link href="/llms.txt" isStandalone>AI docs</Link>
        </Stack>
      </Stack>
    </Stack>
  </AppShell>
}
