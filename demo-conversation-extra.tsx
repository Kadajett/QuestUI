import {useState} from 'react'
import {Stack} from '@astryxdesign/core/Stack'
import {Heading} from '@astryxdesign/core/Heading'
import {Text} from '@astryxdesign/core/Text'
import {Card, CardContent} from './components/quest/card'
import {Button} from './components/quest/button'
import {Attachment, AttachmentInput, AttachmentGroup} from './components/quest/attachment'
import {Bubble} from './components/quest/bubble'
import {Marker} from './components/quest/marker'
import {Message, MessageAvatar, MessageHeader, MessageFooter} from './components/quest/message'
import {MessageScroller} from './components/quest/message-scroller'
import {Questionnaire, type QuestQuestionnaireAnswers} from './components/quest/questionnaire'

export function ConversationExtraExamples() {
  const [file, setFile] = useState<File | null>(null)
  const [removed, setRemoved] = useState(false)
  const [reaction, setReaction] = useState(false)
  const [messages, setMessages] = useState(() => Array.from({length: 18}, (_, index) => ({id: `message-${index}`, text: `Trail report ${index + 1}: the path to Moonkeep is clear.`})))
  const [history, setHistory] = useState(0)
  const [answers, setAnswers] = useState<QuestQuestionnaireAnswers | null>(null)
  return <Stack as="section" id="conversation-extra" gap={4}>
    <Heading level={2}>Conversation extras</Heading>
    <Card><CardContent><Stack gap={4}>
      <AttachmentGroup aria-label="Quest attachments">
        {!removed && <Attachment name="moonkeep-map.txt" size={128} mediaType="text/plain" state="done" href="data:text/plain,Moonkeep%20lies%20north." onRemove={() => setRemoved(true)} />}
        <Attachment name="moonkeep-flag.svg" mediaType="image/svg+xml" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cpath fill='%23255cbd' d='M0 0h72v72H0z'/%3E%3Cpath fill='%23fff' d='M20 12h4v48h-4zm4 0h28v24H24z'/%3E%3C/svg%3E" alt="White Moonkeep banner on blue" />
        <Attachment name="upload-preview.png" mediaType="image/png" size={64000} state="uploading" progress={64} />
        <Attachment name="failed-preview.txt" state="error" error="Example: connection interrupted" />
        {file && <Attachment name={file.name} size={file.size} mediaType={file.type} onRemove={() => setFile(null)} />}
      </AttachmentGroup>
      <AttachmentInput label="Attach a local file" value={file} onChange={value => setFile(Array.isArray(value) ? value[0] ?? null : value)} />
      <Text>Local files are selected only, not sent to a server. The upload rows illustrate owner-supplied lifecycle states.</Text>
      <Marker variant="separator">Today</Marker>
      <Message header={<MessageHeader>Mira the ranger</MessageHeader>} avatar={<MessageAvatar name="Mira" tooltip={false} />} footer={<MessageFooter>Delivered · 09:42</MessageFooter>}>
        <Bubble variant="muted" collapsedContent="The ranger has a longer route briefing." reactions={[{id: 'helpful', label: 'Helpful', count: reaction ? 3 : 2, selected: reaction}]} onReactionChange={(_, selected) => setReaction(selected)}>
          The northern bridge is repaired. Cross before sunset, then follow the silver banners to the keep. Bring a lantern for the return journey.
        </Bubble>
      </Message>
      <Message align="end" header="You" avatar={<MessageAvatar name="You" tooltip={false} />}><Bubble align="end">I will bring a lantern.</Bubble></Message>
      <Marker role="status" variant="border">Party connected</Marker>
      <Heading level={3}>Trail transcript</Heading>
      <div><Button variant="outline" onClick={() => {
        const next = history + 1
        setHistory(next)
        setMessages(previous => [{id: `history-${next}`, text: `Older trail note ${next}: supplies collected.`}, ...previous])
      }}>Load older history</Button>{' '}<Button onClick={() => setMessages(previous => [...previous, {id: `message-${previous.filter(item => item.id.startsWith('message-')).length}`, text: 'New trail report: a messenger arrived.'}])}>Add message</Button></div>
      <MessageScroller label="Trail transcript" height={300} items={messages.map(item => ({id: item.id, content: <Message header="Scout"><Bubble variant="outline">{item.text}</Bubble></Message>}))} />
      <Heading level={3}>Plan your quest</Heading>
      <Questionnaire aria-label="Quest plan" questions={[
        {id: 'route', type: 'single', title: 'Which route?', choices: [{value: 'forest', label: 'Forest'}, {value: 'river', label: 'River'}]},
        {id: 'gear', type: 'multiple', title: 'Which supplies?', choices: [{value: 'lantern', label: 'Lantern'}, {value: 'rope', label: 'Rope'}]},
        {id: 'note', type: 'text', title: 'Any notes?', skippable: true},
      ]} onFinish={setAnswers} />
      {answers && <Text role="status" aria-label="Saved quest plan">{JSON.stringify(answers)}</Text>}
    </Stack></CardContent></Card>
  </Stack>
}
