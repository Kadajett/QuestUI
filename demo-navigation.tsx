import {useState} from 'react'
import {Heading} from '@astryxdesign/core/Heading'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {Button} from './components/quest/button'
import {Card, CardContent} from './components/quest/card'
import {Dialog} from './components/quest/dialog'
import {Tabs, Tab} from './components/quest/tabs'
import {DropdownMenu} from './components/quest/dropdown-menu'

function QuestJournal() {
  const [tab, setTab] = useState('active')
  return <Card><CardContent><Stack gap={4}>
    <Tabs value={tab} onChange={setTab} aria-label="Quest journal">
      <Tab id="journal-active-tab" value="active" label="Active" panelId="journal-active-panel" />
      <Tab id="journal-locked-tab" value="locked" label="Locked" panelId="journal-locked-panel" disabled />
      <Tab id="journal-completed-tab" value="completed" label="Completed" panelId="journal-completed-panel" />
    </Tabs>
    <div id="journal-active-panel" role="tabpanel" aria-labelledby="journal-active-tab" hidden={tab !== 'active'} tabIndex={0}>
      <Stack gap={2}>
        <Heading level={3}>The missing star</Heading>
        <Text as="p">Travel to the Crystal Cave and recover the fallen star.</Text>
      </Stack>
    </div>
    <div id="journal-locked-panel" role="tabpanel" aria-labelledby="journal-locked-tab" hidden={tab !== 'locked'} tabIndex={0}>
      Reach level ten to unlock more quests.
    </div>
    <div id="journal-completed-panel" role="tabpanel" aria-labelledby="journal-completed-tab" hidden={tab !== 'completed'} tabIndex={0}>
      <Stack gap={2}>
        <Heading level={3}>A hero's first steps</Heading>
        <Text as="p">You delivered the village supplies. Reward: 120 gold.</Text>
      </Stack>
    </div>
    <Text type="supporting">Left and right arrows move focus. Enter or Space selects a tab.</Text>
  </Stack></CardContent></Card>
}

function CampDialog() {
  const [isOpen, setOpen] = useState(false)
  const [rested, setRested] = useState(false)
  return <Card><CardContent><Stack gap={4} hAlign="start">
    <Text as="p">Take a break before the next encounter.</Text>
    <Button onClick={() => setOpen(true)}>Set up camp</Button>
    {rested && <Text role="status">Party restored. Ready for another adventure!</Text>}
    <Dialog isOpen={isOpen} onOpenChange={setOpen} purpose="form" width={480} padding={6}
      aria-labelledby="camp-dialog-title" aria-describedby="camp-dialog-description">
      <Stack gap={6}>
        <Stack gap={2}>
          <Heading level={2} id="camp-dialog-title">Rest at camp?</Heading>
          <Text as="p" id="camp-dialog-description">Restore the party's health and save your progress. The world will wait.</Text>
        </Stack>
        <Stack gap={3}>
          <Button variant="secondary" data-autofocus onClick={() => setOpen(false)}>Keep exploring</Button>
          <Button onClick={() => {setRested(true); setOpen(false)}}>Rest and save</Button>
        </Stack>
      </Stack>
    </Dialog>
  </Stack></CardContent></Card>
}

function QuestActions() {
  const [chosen, setChosen] = useState('Nothing selected yet.')
  return <Card><CardContent><Stack gap={4} hAlign="start">
    <Text as="p" role="status">{chosen}</Text>
    <DropdownMenu
      button={{label: 'Quest actions'}}
      aria-label="Quest actions"
      items={[
        {id: 'inspect', label: 'Inspect seal', onClick: () => setChosen('Inspecting the seal.')},
        {type: 'divider'},
        {id: 'retreat', label: 'Retreat to camp', isDisabled: true, description: 'Unavailable during combat'},
        {id: 'abandon', label: 'Abandon quest', variant: 'destructive', onClick: () => setChosen('Quest abandoned.')},
      ]}
    />
  </Stack></CardContent></Card>
}



export function NavigationExamples() {
  return <>
    <Stack as="section" id="tabs" aria-labelledby="tabs-heading" gap={4}>
      <Stack gap={2}>
        <Heading level={2} id="tabs-heading">09 / Tabs</Heading>
        <Text type="supporting">A keyboard-friendly quest journal with a locked destination.</Text>
      </Stack>
      <QuestJournal />
    </Stack>
    <Stack as="section" id="dropdown" aria-labelledby="dropdown-heading" gap={4}>
      <Stack gap={2}>
        <Heading level={2} id="dropdown-heading">Dropdown menu</Heading>
        <Text type="supporting">Pixel-framed action menus for quest decisions.</Text>
      </Stack>
      <QuestActions/>
    </Stack>
    <Stack as="section" id="dialog" aria-labelledby="dialog-heading" gap={4}>
      <Stack gap={2}>
        <Heading level={2} id="dialog-heading">10 / Dialog</Heading>
        <Text type="supporting">A native modal that keeps focus inside and returns you to the trail.</Text>
      </Stack>
      <CampDialog />
    </Stack>
  </>
}
