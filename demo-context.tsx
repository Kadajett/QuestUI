import {useState} from 'react'
import {Stack} from '@astryxdesign/core/Stack'
import {Heading} from '@astryxdesign/core/Heading'
import {Text} from '@astryxdesign/core/Text'
import {Button} from './components/quest/button'
import {Card, CardContent} from './components/quest/card'
import {ContextMenu} from './components/quest/context-menu'
import {HoverCard} from './components/quest/hover-card'

export function ContextExamples() {
  const [action, setAction] = useState('The chest is sealed.')
  return <Stack as="section" id="context-surfaces" gap={4}>
    <Heading level={2}>Context menu and hover card</Heading>
    <Card><CardContent><Stack gap={4}>
      <Text as="p">Right-click the chest, or focus it and press Shift+F10.</Text>
      <ContextMenu label="Chest actions" items={[
        {id: 'open', label: 'Open chest', onClick: () => setAction('You found a moonstone.')},
        {id: 'sell', label: 'Sell chest', isDisabled: true, onClick: () => setAction('Chest sold.')},
        {id: 'mark', label: 'Mark on map', onClick: () => setAction('Chest marked on your map.')},
      ]}>
        <Button variant="secondary">Sealed chest</Button>
      </ContextMenu>
      <Text as="p" role="status" aria-label="Chest result">{action}</Text>
      <HoverCard label="Ranger profile" placement="below" alignment="start" content={
        <Stack gap={2}>
          <Heading level={3}>Mira the ranger</Heading>
          <Text as="p">Level 12 · Keeper of the moonstone trail.</Text>
        </Stack>
      }>
        <Button variant="outline">Meet Mira</Button>
      </HoverCard>
      <Text as="p">Hover or focus Mira to preview her profile. Escape dismisses it.</Text>
    </Stack></CardContent></Card>
  </Stack>
}
