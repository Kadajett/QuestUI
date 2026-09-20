import {useState} from 'react'
import {Heading} from '@astryxdesign/core/Heading'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {Accordion, AccordionItem} from './components/quest/accordion'
import {Button} from './components/quest/button'
import {Card, CardContent} from './components/quest/card'
import {Toast, ToastViewport, useToast, type ToastDismissReason} from './components/quest/toast'

function AccordionExample() {
  const [chapter, setChapter] = useState<string | string[]>('supplies')
  return <Stack as="section" id="accordion" aria-labelledby="accordion-heading" gap={4}>
    <Heading level={2} id="accordion-heading">Accordion</Heading>
    <Text type="supporting">Open one chapter at a time. Tab moves between triggers; Enter or Space toggles.</Text>
    <Card><CardContent><Stack gap={4}>
      <Accordion value={chapter} onChange={setChapter} aria-label="Expedition guide">
        <AccordionItem value="supplies" trigger="What should I bring?">
          <Text as="p">Pack a lantern, two healing potions, and a spare map.</Text>
        </AccordionItem>
        <AccordionItem value="rewards" trigger="What is the reward?">
          <Text as="p">Return the moonstone to earn 120 gold and a ranger badge.</Text>
        </AccordionItem>
        <AccordionItem value="sealed" trigger="The sealed chamber" isDisabled>
          <Text as="p">This chapter unlocks at level 10.</Text>
        </AccordionItem>
      </Accordion>
      <Stack hAlign="start"><Button variant="ghost" size="sm" onClick={() => setChapter('')}>Close all chapters</Button></Stack>
      <Text as="p" role="status">{chapter === '' ? 'All chapters closed.' : `Reading ${chapter}.`}</Text>
    </Stack></CardContent></Card>
  </Stack>
}

function ToastControls() {
  const showToast = useToast()
  const [lastEvent, setLastEvent] = useState('No notifications yet.')
  const [warning, setWarning] = useState(false)
  function recordDismissal(reason: ToastDismissReason) {
    setLastEvent(reason === 'auto' ? 'Notification expired.' : 'Notification dismissed.')
  }
  return <Stack gap={4}>
    <Stack direction="horizontal" gap={3} wrap="wrap">
      <Button onClick={() => {
        setLastEvent('Progress saved.')
        showToast({body: 'Quest progress saved. Your camp is ready.', isAutoHide: false, uniqueID: 'quest-save', onHide: recordDismissal})
      }}>Save quest</Button>
      <Button variant="secondary" onClick={() => {
        setLastEvent('Reward collected.')
        showToast({body: 'You collected 120 gold.', autoHideDuration: 4000, uniqueID: 'quest-reward', onHide: recordDismissal})
      }}>Collect reward</Button>
      <Button variant="outline" disabled={warning} onClick={() => setWarning(true)}>Show connection warning</Button>
    </Stack>
    <Text as="p" role="status">{lastEvent}</Text>
    {warning && <Toast type="error" body="Connection lost. Your progress is stored locally." isAutoHide={false} autoHideDuration={5000}
      dismissLabel="Dismiss connection warning" onDismiss={() => setWarning(false)}/>}
  </Stack>
}

function ToastExample() {
  return <Stack as="section" id="toast" aria-labelledby="toast-heading" gap={4}>
    <Heading level={2} id="toast-heading">Toast</Heading>
    <Text type="supporting">Save for a persistent notification, or collect a reward that expires after four seconds. F6 focuses notifications; hover or focus pauses the timer.</Text>
    <Card><CardContent><ToastViewport position="bottomEnd" maxVisible={3}><ToastControls/></ToastViewport></CardContent></Card>
  </Stack>
}

export function DisclosureExamples() {
  return <><AccordionExample/><ToastExample/></>
}
