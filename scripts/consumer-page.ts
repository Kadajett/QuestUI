export const consumerPage = `import {useState} from 'react'
import {createRoot} from 'react-dom/client'
import {VStack} from '@astryxdesign/core/VStack'
import {Button} from '@/components/quest/button'
import {Alert} from '@/components/quest/alert'
import {Tooltip} from '@/components/quest/tooltip'
import {Tabs, Tab} from '@/components/quest/tabs'
import {Dialog} from '@/components/quest/dialog'
import {Progress} from '@/components/quest/progress'
import {Skeleton} from '@/components/quest/skeleton'
import {Accordion, AccordionItem} from '@/components/quest/accordion'
import {Toast} from '@/components/quest/toast'
import {DropdownMenu} from '@/components/quest/dropdown-menu'
import {ContextMenu} from '@/components/quest/context-menu'
import {HoverCard} from '@/components/quest/hover-card'
import {SurfaceExamples, InputExamples, ChoiceExamples, PickerExamples} from './consumer-controls'
import {LayoutExtraExamples} from './demo-layout-extra'
import {NavigationExtraExamples} from './demo-navigation-extra'
import {OverlaysExtraExamples} from './demo-overlays-extra'
import {FormExtraExamples} from './demo-form-extra'
import {DataExtraExamples} from './demo-data-extra'
import {ConversationExtraExamples} from './demo-conversation-extra'
import './index.css'

function FeedbackExamples() {
  const [progress, setProgress] = useState(40)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [notification, setNotification] = useState(false)
  return <VStack as="section" gap={3} width="100%">
    <h2>Installed feedback</h2>
    <section data-quest="alert"><Alert status="success" title="CLI installation complete" description="Every catalog entry was copied from the local registry."
      isDismissable dismissLabel="Dismiss installation alert" onDismiss={() => setDismissed(true)} /></section>
    {dismissed && <p id="alert-result" role="status">Installation alert dismissed.</p>}
    <section data-quest="tooltip"><Tooltip content="This tooltip came from the installed source." delay={0}><Button>Inspect tooltip</Button></Tooltip></section>
    <VStack as="section" data-quest="progress" gap={3} width="100%">
      <Progress label="Quest completion" value={progress} max={100} hasValueLabel />
      <Button onClick={() => setProgress(value => Math.min(100, value + 20))}>Advance progress</Button>
      <Progress label="Searching for quests" isIndeterminate />
    </VStack>
    <VStack as="section" data-quest="skeleton" gap={3} width="100%">
      <Button onClick={() => setLoading(value => !value)}>{loading ? 'Finish loading' : 'Reload inventory'}</Button>
      <VStack as="section" aria-label="Inventory preview" aria-busy={loading} gap={3} width="100%">
        {loading ? <><Skeleton height="var(--spacing-8)" width="75%" /><Skeleton height="var(--spacing-6)" width="50%" index={1} /></>
          : <p role="status">Inventory loaded: pixel sword and shield.</p>}
      </VStack>
    </VStack>
    <section data-quest="toast">
      <Button onClick={() => setNotification(true)}>Show installed notification</Button>
      {notification && <Toast type="info" autoHideDuration={5000} body="Installed notification ready." isAutoHide={false} dismissLabel="Dismiss installed notification" onDismiss={() => setNotification(false)} />}
    </section>
  </VStack>
}

function DisclosureExamples() {
  const [tab, setTab] = useState('mission')
  const [open, setOpen] = useState(false)
  const [accepted, setAccepted] = useState(false)
  return <VStack as="section" gap={3} width="100%">
    <h2>Installed disclosure</h2>
    <VStack as="section" data-quest="tabs" gap={3} width="100%">
      <Tabs value={tab} onChange={setTab} aria-label="Consumer sections">
        <Tab id="mission-tab" value="mission" label="Mission" panelId="mission-panel" />
        <Tab id="inventory-tab" value="inventory" label="Inventory" panelId="inventory-panel" />
      </Tabs>
      <section id="mission-panel" role="tabpanel" aria-labelledby="mission-tab" hidden={tab !== 'mission'} tabIndex={0}><p>The mission panel is ready.</p></section>
      <section id="inventory-panel" role="tabpanel" aria-labelledby="inventory-tab" hidden={tab !== 'inventory'} tabIndex={0}><p>The inventory panel is ready.</p></section>
    </VStack>
    <section data-quest="dialog">
      <Button onClick={() => setOpen(true)}>Open quest dialog</Button>
      <Dialog isOpen={open} onOpenChange={setOpen} aria-labelledby="quest-dialog-title" purpose="info">
        <VStack gap={4}>
          <h2 id="quest-dialog-title">Accept this quest?</h2>
          <p>The native modal supports focus trapping, Escape, and focus restoration.</p>
          <Button onClick={() => {setAccepted(true); setOpen(false)}}>Accept quest</Button>
          <Button onClick={() => setOpen(false)}>Close quest dialog</Button>
        </VStack>
      </Dialog>
      <p id="dialog-result" role="status">Quest: {accepted ? 'accepted' : 'not accepted'}</p>
    </section>
    <section data-quest="accordion"><Accordion defaultValue="supplies" aria-label="Installed expedition guide">
      <AccordionItem value="supplies" trigger="Installed supplies">Pack a lantern.</AccordionItem>
      <AccordionItem value="rewards" trigger="Installed rewards">Collect the moonstone.</AccordionItem>
    </Accordion></section>
  </VStack>
}

function MenuExamples() {
  const [action, setAction] = useState('No installed action selected.')
  return <VStack as="section" gap={3}>
    <h2>Installed menus and preview</h2>
    <section data-quest="dropdown-menu"><DropdownMenu button={{label: 'Installed actions'}} aria-label="Installed actions" items={[
      {id: 'inspect', label: 'Inspect installed seal', onClick: () => setAction('Installed seal inspected.')},
      {id: 'locked', label: 'Locked action', isDisabled: true},
    ]} /></section>
    <section data-quest="context-menu"><ContextMenu label="Installed chest actions" items={[
      {id: 'open', label: 'Open installed chest', onClick: () => setAction('Installed chest opened.')},
    ]}><Button>Installed chest</Button></ContextMenu></section>
    <section data-quest="hover-card"><HoverCard label="Installed profile" content={<p>Installed ranger preview.</p>}>
      <Button>Installed ranger</Button>
    </HoverCard></section>
    <p id="menu-result" role="status">{action}</p>
  </VStack>
}

function Consumer() {
  return <VStack as="main" gap={6} padding={8} width="100%"
      style={{minHeight: '100dvh', backgroundColor: 'var(--q-background)', color: 'var(--q-foreground)'}}>
      <h1>QuestUI packaged consumer</h1>
      <p>Every catalog entry installed separately by the packaged quest-ui CLI.</p>
      <SurfaceExamples /><InputExamples /><ChoiceExamples /><PickerExamples />
      <FeedbackExamples /><DisclosureExamples /><MenuExamples />
      <LayoutExtraExamples /><NavigationExtraExamples /><OverlaysExtraExamples />
      <FormExtraExamples /><DataExtraExamples /><ConversationExtraExamples />
    </VStack>
}

const root = document.getElementById('root')
if (!root) throw new Error('Missing consumer root')
createRoot(root).render(<Consumer />)
`
