import {useState} from 'react'
import * as stylex from '@stylexjs/stylex'
import {Stack} from '@astryxdesign/core/Stack'
import {Heading} from '@astryxdesign/core/Heading'
import {Text} from '@astryxdesign/core/Text'
import {Card, CardContent} from './components/quest/card'
import {Button} from './components/quest/button'
import {PixelAvatar, avatarCatalogs, createAvatar, type AvatarCategoryId, type AvatarSelection} from './packages/pixel-avatars/src/index'

const categories = ['hair', 'eyes', 'face', 'skinColor', 'clothing', 'background'] as const satisfies readonly AvatarCategoryId[]
const gallery = Array.from({length: 48}, (_, seed) => createAvatar(`gallery-${seed}`))
const labels: Record<AvatarCategoryId, string> = {hair: 'Hair', eyes: 'Eyes', face: 'Face', skinColor: 'Skin color', clothing: 'Clothing', background: 'Background'}
const styles = stylex.create({
  layout: {display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'start'},
  preview: {display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center'},
  fields: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 16, flex: '1 1 400px', minWidth: 0},
  label: {display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'var(--q-font-body)'},
  gallery: {display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16},
  sample: {display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: 0},
  select: {width: '100%', minHeight: 44, borderWidth: 2, borderStyle: 'solid', borderColor: 'var(--q-border)', backgroundColor: 'var(--q-card)', color: 'var(--q-foreground)', fontFamily: 'var(--q-font-body)', fontSize: 20, padding: 8},
})

function AvatarOptions({selection, onChange}: {selection: AvatarSelection; onChange: (category: AvatarCategoryId, id: string) => void}) {
  return <div {...stylex.props(styles.fields)}>{categories.map(category => <label key={category} {...stylex.props(styles.label)}>
    {labels[category]} · {avatarCatalogs[category].length} options
    <select aria-label={`Avatar ${labels[category].toLowerCase()}`} value={selection[category]} onChange={event => onChange(category, event.target.value)} {...stylex.props(styles.select)}>
      {avatarCatalogs[category].map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
    </select>
  </label>)}</div>
}

export function AvatarGeneratorExample() {
  const [seed, setSeed] = useState(0)
  const [selection, setSelection] = useState(() => createAvatar(0))
  function nextAvatar() {
    const next = seed + 1
    setSeed(next)
    setSelection(createAvatar(next))
  }
  return <Stack as="section" id="pixel-avatars" aria-labelledby="pixel-avatars-heading" gap={4}>
    <Heading level={2} id="pixel-avatars-heading">Pixel avatar companion</Heading>
    <Text type="supporting">Six independently selectable catalogs. Original pixel artwork, deterministic seeds.</Text>
    <Card><CardContent><div {...stylex.props(styles.layout)}>
      <div {...stylex.props(styles.preview)}>
        <PixelAvatar selection={selection} size={192} label="Your generated adventurer"/>
        <Button onClick={nextAvatar}>Next avatar</Button>
        <Text as="p" role="status">Avatar seed {seed}</Text>
      </div>
      <AvatarOptions selection={selection} onChange={(category, id) => setSelection(current => ({...current, [category]: id}))}/>
    </div></CardContent></Card>
    <div id="avatar-gallery" {...stylex.props(styles.gallery)}>{gallery.map((avatar, index) => <figure key={index} {...stylex.props(styles.sample)}>
      <PixelAvatar selection={avatar} size={144} label={`Adventurer ${index + 1}`}/>
      <figcaption>Adventurer {index + 1}</figcaption>
    </figure>)}</div>
  </Stack>
}
