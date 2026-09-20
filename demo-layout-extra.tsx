import {useState} from 'react'
import * as stylex from '@stylexjs/stylex'
import {Heading} from '@astryxdesign/core/Heading'
import {Grid} from '@astryxdesign/core/Grid'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {Card, CardContent} from './components/quest/card'
import {Button} from './components/quest/button'
import {PixelIcon} from './components/quest/pixel-icon'
import {AspectRatio} from './components/quest/aspect-ratio'
import {ButtonGroup} from './components/quest/button-group'
import {Empty} from './components/quest/empty'
import {Item} from './components/quest/item'
import {Kbd} from './components/quest/kbd'
import {Typography, TypographyHeading, TypographyList, TypographyCode} from './components/quest/typography'
import {Direction} from './components/quest/direction'
import {Spinner} from './components/quest/spinner'

const styles = stylex.create({
  media: {maxWidth: 480},
  direction: {padding: 16, borderWidth: 2, borderStyle: 'solid', borderColor: 'var(--q-border)'},
})
const landscape = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90" shape-rendering="crispEdges"><path fill="#a8bed3" d="M0 0h160v90H0z"/><path fill="#fffefa" d="M112 12h16v16h-16z"/><path fill="#255cbd" d="M0 58h20V42h20V26h20v16h20v16h20V42h20v16h40v32H0z"/><path fill="#17243b" d="M0 76h160v14H0z"/><path fill="#c92e35" d="M68 62h24v14H68z"/></svg>')}`

function GeometryCard({destination, onDestination}: {
  destination: string
  onDestination: (destination: string) => void
}) {
  return <Card><CardContent><Stack gap={4}>
    <Heading level={3}>Aspect ratio</Heading>
    <AspectRatio ratio={16 / 9} fit="cover" xstyle={styles.media} data-testid="quest-landscape">
      <img src={landscape} alt="Pixel mountains beside a red camp" />
    </AspectRatio>
    <Typography>A widescreen view of the next destination, held at 16:9.</Typography>
    <Heading level={3}>Button group</Heading>
    <ButtonGroup label="Travel destination">
      <Button size="sm" variant={destination === 'Forest' ? 'primary' : 'outline'}
        onClick={() => onDestination('Forest')}>Forest</Button>
      <Button size="sm" variant="outline" disabled>Sea</Button>
      <Button size="sm" variant={destination === 'Castle' ? 'primary' : 'outline'}
        onClick={() => onDestination('Castle')}>Castle</Button>
    </ButtonGroup>
    <Text role="status">Destination: {destination}</Text>
    <Text>Use <Kbd>←</Kbd> and <Kbd>→</Kbd> to move between available destinations.</Text>
  </Stack></CardContent></Card>
}

type QuestStateCardProps = {
  hasQuest: boolean
  selected: boolean
  searching: boolean
  onSelect: () => void
  onArchive: () => void
  onFind: () => void
  onSearchToggle: () => void
}

function QuestStateCard({hasQuest, selected, searching, onSelect, onArchive, onFind, onSearchToggle}: QuestStateCardProps) {
  return <Card><CardContent><Stack gap={4}>
    <Heading level={3}>Empty & item</Heading>
    {hasQuest ? <>
      <Item label="The mountain trail" description="Bring a lantern and two rations."
        startContent={<PixelIcon name="diamond" />} isSelected={selected} onClick={onSelect}
        endContent={<Button size="sm" variant="outline" onClick={onArchive}>Archive</Button>} />
      <Text role="status">{selected ? 'Mountain trail selected' : 'Select a quest to inspect it.'}</Text>
    </> : <Empty title="Your quest log is empty" description="Choose an adventure to begin your journey."
      headingLevel={4} icon={<PixelIcon name="spark" />}
      actions={<Button onClick={onFind}>Find a quest</Button>} />}
    <Heading level={3}>Spinner</Heading>
    {searching ? <Spinner label="Scouting the trail" /> : <Text role="status">Trail ready</Text>}
    <Button variant="outline" onClick={onSearchToggle}>{searching ? 'Finish scouting' : 'Scout again'}</Button>
  </Stack></CardContent></Card>
}

function FieldGuideCard() {
  return <Card><CardContent>
    <TypographyHeading level={3}>Field guide</TypographyHeading>
    <Typography>Every adventurer starts with a small pack. Enter <TypographyCode>/inventory</TypographyCode> to inspect yours.</Typography>
    <TypographyList aria-label="Packing list"><li>A lantern for dark caves</li><li>Two rations for the trail</li><li>A map of the overworld</li></TypographyList>
    <TypographyList as="ol" aria-label="Travel steps"><li>Choose a destination</li><li>Gather your party</li><li>Begin the quest</li></TypographyList>
    <Typography>Open your map with <Kbd aria-label="Control">Ctrl</Kbd> + <Kbd>M</Kbd>.</Typography>
  </CardContent></Card>
}

function DirectionCard({direction, onToggle}: {direction: 'ltr' | 'rtl'; onToggle: () => void}) {
  return <Card><CardContent><Stack gap={4}>
    <Heading level={3}>Direction</Heading>
    <Button variant="outline" onClick={onToggle}>Use {direction === 'ltr' ? 'RTL' : 'LTR'} layout</Button>
    <Direction dir={direction} xstyle={styles.direction} data-testid="direction-preview">
      <Typography>Party inventory</Typography>
      <Stack direction="horizontal" gap={3}>
        <Kbd>1</Kbd><Text data-testid="direction-text">Lantern</Text><Kbd>2</Kbd><Text>Map</Text>
      </Stack>
      <Direction dir="ltr"><Typography>Fixed LTR code: <TypographyCode>Q-102</TypographyCode></Typography></Direction>
    </Direction>
    <Text type="supporting">The HTML dir attribute affects descendants. Nested boundaries keep mixed-direction content readable.</Text>
  </Stack></CardContent></Card>
}

export function LayoutExtraExamples() {
  const [hasQuest, setHasQuest] = useState(false)
  const [selected, setSelected] = useState(false)
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr')
  const [searching, setSearching] = useState(true)
  const [destination, setDestination] = useState('Forest')
  return <Stack as="section" id="layout-extra" aria-labelledby="layout-extra-heading" gap={4}>
    <Heading level={2} id="layout-extra-heading">Layout & typography</Heading>
    <Text type="supporting">Pixel geometry, semantic content, keyboard groups, and real direction boundaries.</Text>
    <Grid columns={{minWidth: 300, max: 2}} gap={5}>
      <GeometryCard destination={destination} onDestination={setDestination}/>
      <QuestStateCard hasQuest={hasQuest} selected={selected} searching={searching}
        onSelect={() => setSelected(value => !value)} onArchive={() => setHasQuest(false)}
        onFind={() => setHasQuest(true)} onSearchToggle={() => setSearching(value => !value)}/>
      <FieldGuideCard/>
      <DirectionCard direction={direction}
        onToggle={() => setDirection(value => value === 'ltr' ? 'rtl' : 'ltr')}/>
    </Grid>
  </Stack>
}
