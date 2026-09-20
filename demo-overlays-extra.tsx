import {useRef, useState} from 'react'
import {Heading} from '@astryxdesign/core/Heading'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {AlertDialog} from './components/quest/alert-dialog'
import {Button} from './components/quest/button'
import {Card, CardContent} from './components/quest/card'
import {Collapsible} from './components/quest/collapsible'
import {Command, CommandInput, createStaticSource} from './components/quest/command'
import {Drawer} from './components/quest/drawer'
import {Menubar, MenubarCheckboxItem, MenubarItem, MenubarMenu, MenubarSeparator} from './components/quest/menubar'
import {Sheet} from './components/quest/sheet'

const commandSource = createStaticSource([
  {id: 'map', label: 'Open world map', auxiliaryData: {group: 'Travel'}},
  {id: 'camp', label: 'Return to camp', auxiliaryData: {group: 'Travel'}},
  {id: 'save', label: 'Save expedition', auxiliaryData: {group: 'Quest'}},
])

function ModalExamples() {
  const [alertOpen, setAlertOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [result, setResult] = useState('Expedition is active.')
  const drawerTrigger = useRef<HTMLButtonElement>(null)
  return <Stack gap={4}>
    <Stack direction="horizontal" gap={3} wrap="wrap">
      <Button variant="danger" onClick={() => setAlertOpen(true)}>Abandon expedition</Button>
      <Button variant="outline" onClick={() => setSheetOpen(true)}>Open quest sheet</Button>
      <Button variant="secondary" ref={drawerTrigger} onClick={() => setDrawerOpen(true)}>Open supply drawer</Button>
    </Stack>
    <Text as="p" role="status">{result}</Text>
    <AlertDialog isOpen={alertOpen} onOpenChange={setAlertOpen} title="Abandon this expedition?"
      description="Unclaimed expedition rewards will be lost. Your character remains safe."
      cancelLabel="Keep exploring" actionLabel="Confirm abandonment"
      onAction={() => {setResult('Expedition abandoned.'); setAlertOpen(false)}} />
    <Sheet isOpen={sheetOpen} onOpenChange={setSheetOpen} aria-label="Quest details" purpose="form">
      <Stack gap={4}>
        <Heading level={3}>Quest details</Heading>
        <Text as="p">Retrieve the moonstone from the eastern ruins.</Text>
        <Button onClick={() => setSheetOpen(false)}>Close quest sheet</Button>
      </Stack>
    </Sheet>
    <Drawer isOpen={drawerOpen} onOpenChange={setDrawerOpen} finalFocusRef={drawerTrigger}
      label="Expedition supplies" height="hug">
      <Stack gap={4} padding={4}>
        <Heading level={3}>Expedition supplies</Heading>
        <Text as="p">Two healing potions and a lantern are packed.</Text>
        <Button onClick={() => {setResult('Supplies collected.'); setDrawerOpen(false)}}>Take supplies</Button>
      </Stack>
    </Drawer>
  </Stack>
}

function CommandExample() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('No command selected.')
  return <Stack gap={3}>
    <Stack hAlign="start"><Button onClick={() => setOpen(true)}>Find expedition command</Button></Stack>
    <Text as="p" role="status">{selected}</Text>
    <Command isOpen={open} onOpenChange={setOpen} searchSource={commandSource} label="Expedition commands"
      input={<CommandInput label="Search expedition commands" placeholder="Search map, camp, or save…" />}
      emptySearchText="No expedition commands found."
      onValueChange={id => setSelected(`Command selected: ${id}.`)} />
  </Stack>
}

function MenubarExample() {
  const [grid, setGrid] = useState(false)
  const [action, setAction] = useState('No menu action yet.')
  return <Stack gap={3}>
    <Menubar label="Expedition menu">
      <MenubarMenu button={{label: 'Expedition'}} menuWidth={220}>
        <MenubarItem label="Save checkpoint" onClick={() => setAction('Checkpoint saved.')} />
        <MenubarSeparator />
        <MenubarItem label="Locked checkpoint" isDisabled />
      </MenubarMenu>
      <MenubarMenu button={{label: 'Map view'}} menuWidth={220}>
        <MenubarCheckboxItem label="Show grid" value={grid} onChange={setGrid} />
        <MenubarItem label="Center on camp" onClick={() => setAction('Map centered on camp.')} />
      </MenubarMenu>
    </Menubar>
    <Text as="p" role="status">{action} Grid {grid ? 'visible' : 'hidden'}.</Text>
  </Stack>
}

export function OverlaysExtraExamples() {
  return <Stack as="section" id="overlays-extra" aria-labelledby="overlays-extra-heading" gap={4}>
    <Heading level={2} id="overlays-extra-heading">Dialogs, drawers and commands</Heading>
    <Text type="supporting">Confirm a decision, inspect quest details, search commands, or navigate the menu with arrow keys.</Text>
    <Card><CardContent><Stack gap={6}>
      <ModalExamples />
      <Collapsible trigger="Expedition notes" defaultIsOpen={false}>
        <Text as="p">The eastern gate opens at sunrise.</Text>
      </Collapsible>
      <Collapsible trigger="Companion notes" defaultIsOpen={false}>
        <Text as="p">The ranger is waiting at camp.</Text>
      </Collapsible>
      <CommandExample />
      <MenubarExample />
    </Stack></CardContent></Card>
  </Stack>
}
