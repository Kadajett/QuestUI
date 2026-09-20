import {useState} from 'react'
import * as stylex from '@stylexjs/stylex'
import {Button} from './components/quest/button'
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from './components/quest/card'
import {Badge} from './components/quest/badge'
import {Avatar} from './components/quest/avatar'
import {Separator} from './components/quest/separator'
import {Alert} from './components/quest/alert'
import {PixelIcon} from './components/quest/pixel-icon'

const styles = stylex.create({
  section: {marginBlock: 48, scrollMarginTop: 24},
  heading: {display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px 24px', marginBottom: 24},
  title: {margin: 0, fontFamily: 'var(--q-font-display)', fontSize: 28, fontWeight: 700, lineHeight: 1.15},
  metadata: {fontSize: 18, color: 'var(--q-muted-foreground)'},
  row: {display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBlock: 24},
  firstRow: {marginTop: 0},
  compact: {display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12},
  muted: {marginTop: 24, marginBottom: 0, color: 'var(--q-muted-foreground)'},
  grid: {display: 'grid', gridTemplateColumns: {default: 'repeat(2, minmax(0, 1fr))', '@media (max-width: 760px)': '1fr'}, gap: 28},
  card: {display: 'flex', flexDirection: 'column'},
  content: {flex: 1},
  paragraph: {marginTop: 0},
  rewards: {display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBlock: '24px 0'},
  reward: {display: 'inline-flex', alignItems: 'center', gap: 8},
  rewardIcon: {color: 'var(--q-secondary)'},
  member: {display: 'flex', alignItems: 'center', gap: {default: 16, '@media (max-width: 420px)': 8}, paddingBlock: 12},
  memberText: {flex: 1, minWidth: 0},
  noMargin: {margin: 0},
  memberDivider: {marginBlock: 12},
  divider: {display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24, maxWidth: 480},
  vertical: {flexDirection: 'row', alignItems: 'center', minHeight: 64},
  avatars: {display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: {default: 32, '@media (max-width: 420px)': 20}, marginBottom: 24},
  sample: {display: 'flex', alignItems: 'center', gap: 12},
})

const portrait = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="#255cbd" d="M0 0h16v16H0z"/><path fill="#17243b" d="M4 2h8v2h2v8H2V4h2z"/><path fill="#f6dcd9" d="M4 5h8v6h-2v2H6v-2H4z"/><path fill="#17243b" d="M5 6h2v2H5zm4 0h2v2H9z"/><path fill="#c92e35" d="M4 12h2v2h4v-2h2v4H4z"/></svg>')}`

function SectionHeading({id, title, description}: {id: string; title: string; description: string}) {
  return <header {...stylex.props(styles.heading)}>
    <h2 id={id} {...stylex.props(styles.title)}>{title}</h2>
    <span {...stylex.props(styles.metadata)}>{description}</span>
  </header>
}
function AlertExamples() {
  return <section id="alerts" aria-labelledby="alerts-heading" {...stylex.props(styles.section)}>
    <SectionHeading id="alerts-heading" title="Alerts" description="Banners with pixel frames." />
    <div {...stylex.props(styles.grid)}>
      <Alert status="info" title="Quest available" description="A new bounty was posted at the guild hall.">
        <Button size="sm" variant="secondary">View</Button>
      </Alert>
      <Alert status="success" title="Victory" description="The dragon has been defeated." />
      <Alert status="warning" title="Low supplies" description="Your rations will not reach the mountain." />
      <Alert status="error" title="Defeat" description="Your party was wiped out. Retrying from the last camp." isDismissable />
    </div>
  </section>
}

function CardExamples({onInvite}: {onInvite: () => void}) {
  const [accepted, setAccepted] = useState(false)
  return <section id="cards" aria-labelledby="cards-heading" {...stylex.props(styles.section)}>
      <SectionHeading id="cards-heading" title="Cards" description="Stepped frames for your next adventure." />
      <div {...stylex.props(styles.grid)}>
        <Card xstyle={styles.card}>
          <CardHeader><div {...stylex.props(styles.compact)}><Badge>NEW QUEST</Badge><Badge variant="outline">LEVEL 12</Badge></div><CardTitle>The lost crystal</CardTitle><CardDescription>A new adventure awaits beyond the overworld.</CardDescription></CardHeader>
          <CardContent xstyle={styles.content}><p {...stylex.props(styles.paragraph)}>Find the ancient crystal and return it to the castle. Bring a friend: the path is full of surprises.</p><p {...stylex.props(styles.rewards)}><span {...stylex.props(styles.reward)}><PixelIcon name="diamond" {...stylex.props(styles.rewardIcon)} />250 gold</span><span {...stylex.props(styles.reward)}><PixelIcon name="spark" {...stylex.props(styles.rewardIcon)} />500 XP</span></p></CardContent>
          <CardFooter><Button onClick={() => setAccepted(value => !value)}><PixelIcon name={accepted ? 'check' : 'arrow'} />{accepted ? 'Quest accepted' : 'Accept quest'}</Button><span role="status" {...stylex.props(styles.metadata)}>{accepted ? 'Added to your quest log.' : 'Ready when you are.'}</span></CardFooter>
        </Card>
        <Card xstyle={styles.card}>
          <CardHeader><CardTitle>Your party</CardTitle><CardDescription>Every adventure is better together.</CardDescription></CardHeader>
          <CardContent xstyle={styles.content}>
            <div {...stylex.props(styles.member)}><Avatar src={portrait} name="Pixel Knight" tooltip={false} /><div {...stylex.props(styles.memberText)}><p {...stylex.props(styles.noMargin)}>Pixel Knight</p><p {...stylex.props(styles.metadata, styles.noMargin)}>Level 12 · Warrior</p></div><Badge variant="secondary">READY</Badge></div>
            <Separator xstyle={styles.memberDivider} />
            <div {...stylex.props(styles.member)}><Avatar name="Moon Mage" tooltip={false} /><div {...stylex.props(styles.memberText)}><p {...stylex.props(styles.noMargin)}>Moon Mage</p><p {...stylex.props(styles.metadata, styles.noMargin)}>Level 10 · Mage</p></div><Badge variant="outline">AWAY</Badge></div>
          </CardContent>
          <CardFooter><Button variant="outline" onClick={onInvite}><PixelIcon name="plus" />Invite a friend</Button></CardFooter>
        </Card>
      </div>
    </section>
}
export function SurfaceExamples() {
  const [count, setCount] = useState(0)
  const [favorite, setFavorite] = useState(false)
  return <>
    <section id="buttons" aria-labelledby="buttons-heading" {...stylex.props(styles.section)}>
      <SectionHeading id="buttons-heading" title="Buttons" description="Five variants. Four sizes. Real interactions." />
      <div {...stylex.props(styles.row, styles.firstRow)}>
        <Button onClick={() => setCount(value => value + 1)}>Primary</Button>
        <Button variant="secondary" onClick={() => setCount(value => value + 1)}>Secondary</Button>
        <Button variant="outline" onClick={() => setCount(value => value + 1)}>Outline</Button>
        <Button variant="ghost" onClick={() => setCount(value => value + 1)}>Ghost</Button>
        <Button variant="danger" onClick={() => setCount(0)}>Reset counter</Button>
      </div>
      <div {...stylex.props(styles.row)}>
        <Button size="sm" onClick={() => setCount(value => value + 1)}>Small</Button>
        <Button onClick={() => setCount(value => value + 1)}><PixelIcon name="plus" />Default</Button>
        <Button size="lg" onClick={() => setCount(value => value + 1)}>Large<PixelIcon name="arrow" /></Button>
        <Button size="icon" aria-label={favorite ? 'Remove favorite' : 'Add favorite'} aria-pressed={favorite} onClick={() => setFavorite(value => !value)}><PixelIcon name="heart" /></Button>
      </div>
      <div {...stylex.props(styles.row)}>
        <Button disabled>Unavailable</Button>
        <Button variant="secondary" disabled>Locked</Button>
        <Button loading loadingText="Saving…">Save quest</Button>
        <Button variant="outline" loading loadingText="Loading…">Load quest</Button>
      </div>
      <p role="status" {...stylex.props(styles.muted)}>Button presses: {count}. {favorite ? 'Favorite saved.' : 'Choose a favorite.'}</p>
      <p {...stylex.props(styles.muted)}>Hover, press, or Tab to a button to inspect its pixel states.</p>
    </section>

    <CardExamples onInvite={() => setCount(value => value + 1)}/>

    <StaticSurfaceExamples/>
    <AlertExamples />
  </>
}

function StaticSurfaceExamples() {
  return <>
    <section id="badges" aria-labelledby="badges-heading" {...stylex.props(styles.section)}>
      <SectionHeading id="badges-heading" title="Badges" description="Compact labels with pixel edges." />
      <div {...stylex.props(styles.compact)}><Badge>Primary</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="outline">Outline</Badge><Badge variant="danger">Danger</Badge><Badge icon={<PixelIcon name="heart" />}>3 lives</Badge><Badge variant="secondary" icon={<PixelIcon name="check" />}>Complete</Badge></div>
    </section>

    <section id="separators" aria-labelledby="separators-heading" {...stylex.props(styles.section)}>
      <SectionHeading id="separators-heading" title="Separators" description="Horizontal and vertical separation." />
      <div {...stylex.props(styles.divider)}><span>Inventory</span><Separator decorative={false} aria-label="Inventory and equipment" /><span>Equipment</span></div>
      <div {...stylex.props(styles.divider, styles.vertical)}><span>Health</span><Separator orientation="vertical" decorative={false} aria-label="Health and mana" /><span>Mana</span><Separator orientation="vertical" /><span>Stamina</span></div>
    </section>

    <section id="avatars" aria-labelledby="avatars-heading" {...stylex.props(styles.section)}>
      <SectionHeading id="avatars-heading" title="Avatars" description="Pixel portraits and dependable fallbacks." />
      <div {...stylex.props(styles.avatars)}>{(['sm', 'md', 'lg'] as const).map(size => <div key={size} {...stylex.props(styles.sample)}><Avatar size={size} src={portrait} name="Pixel Knight" tooltip={false} /><span>{size}</span></div>)}</div>
      <div {...stylex.props(styles.avatars)}><div {...stylex.props(styles.sample)}><Avatar src={portrait} name="Pixel Knight" tooltip={false} /><span>Loaded image</span></div><div {...stylex.props(styles.sample)}><Avatar src="data:image/png;base64,broken" name="Broken Image" tooltip={false} /><span>Broken image</span></div><div {...stylex.props(styles.sample)}><Avatar name="Missing Image" tooltip={false} /><span>Missing image</span></div><div {...stylex.props(styles.sample)}><Avatar alt="Unknown adventurer" tooltip={false} /><span>No name</span></div></div>
      <p {...stylex.props(styles.muted)}>Images stay crisp. Missing or failed images use accessible initials or Astryx’s default avatar icon.</p>
    </section>
  </>
}
