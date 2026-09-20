export const consumerControls = `import {useState} from 'react'
import {VStack} from '@astryxdesign/core/VStack'
import {Button} from '@/components/quest/button'
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/quest/card'
import {Badge} from '@/components/quest/badge'
import {Avatar} from '@/components/quest/avatar'
import {Separator} from '@/components/quest/separator'
import {Input} from '@/components/quest/input'
import {Textarea} from '@/components/quest/textarea'
import {Label} from '@/components/quest/label'
import {Checkbox} from '@/components/quest/checkbox'
import {RadioGroup, RadioGroupItem} from '@/components/quest/radio-group'
import {Switch} from '@/components/quest/switch'
import {Slider} from '@/components/quest/slider'
import {Select} from '@/components/quest/select'
import {Combobox} from '@/components/quest/combobox'
import {Calendar, type ISODateString} from '@/components/quest/calendar'
import {Popover} from '@/components/quest/popover'

export function SurfaceExamples() {
  const [count, setCount] = useState(0)
  const [saving, setSaving] = useState(true)
  return <>
    <VStack as="section" data-quest="button" gap={3}>
      <h2>Installed buttons</h2>
      <Button onClick={() => setCount(value => value + 1)}>Count installed clicks</Button>
      <Button disabled onClick={() => setCount(value => value + 1)}>Locked installed button</Button>
      <Button loading={saving} loadingText="Saving installed quest" onClick={() => setCount(value => value + 1)}>Save installed quest</Button>
      <Button onClick={() => setSaving(value => !value)}>{saving ? 'Finish button loading' : 'Restart button loading'}</Button>
      <p id="button-result" role="status">Installed clicks: {count}</p>
    </VStack>
    <section data-quest="card"><Card>
      <CardHeader><CardTitle>Installed quest card</CardTitle><CardDescription>A copied card with a live reward count.</CardDescription></CardHeader>
      <CardContent>
        <section data-quest="avatar"><Avatar name="Installed Ranger" tooltip={false} /><p>Installed Ranger</p></section>
        <section data-quest="separator"><Separator decorative={false} aria-label="Installed reward divider" /></section>
        <section data-quest="badge"><Badge>{count} rewards</Badge></section>
      </CardContent>
      <CardFooter><Button onClick={() => setCount(value => value + 1)}>Collect installed reward</Button></CardFooter>
    </Card></section>
  </>
}

export function InputExamples() {
  const [name, setName] = useState('Mira')
  const [story, setStory] = useState('')
  return <VStack as="section" gap={3}>
    <h2>Installed text fields</h2>
    <section data-quest="label">
      <Label label="Installed name shortcut" inputID="installed-name" />
      <input id="installed-name" name="shortcut" value={name} onChange={event => setName(event.target.value)} />
    </section>
    <VStack as="section" data-quest="input" gap={3}>
      <Input label="Installed hero name" value={name} onChange={setName} htmlName="name" />
      <Input label="Locked installed input" value="Locked" isDisabled />
      <Input label="Installed read only code" value="QUEST-0042" isReadOnly />
    </VStack>
    <section data-quest="textarea"><Textarea label="Installed story" value={story} onChange={setStory} htmlName="story" /></section>
    <p id="input-result" role="status">Name: {name}</p>
    <p id="textarea-result" role="status">Story: {story}</p>
  </VStack>
}

export function ChoiceExamples() {
  const [updates, setUpdates] = useState(false)
  const [sound, setSound] = useState(true)
  const [volume, setVolume] = useState(40)
  const [role, setRole] = useState('ranger')
  return <VStack as="section" gap={3}>
    <h2>Installed choices</h2>
    <section data-quest="checkbox"><Checkbox label="Installed updates" value={updates} onChange={setUpdates} htmlName="updates" /></section>
    <section data-quest="switch"><Switch label="Installed sound" value={sound} onChange={setSound} htmlName="sound" /></section>
    <section data-quest="slider"><Slider label="Installed volume" value={volume} onChange={setVolume} max={100} step={10} valueDisplay="text" /></section>
    <section data-quest="radio-group"><RadioGroup label="Installed class" value={role} onChange={setRole} htmlName="class">
      <RadioGroupItem label="Installed ranger class" value="ranger" />
      <RadioGroupItem label="Installed mage class" value="mage" />
      <RadioGroupItem label="Installed locked class" value="knight" isDisabled />
    </RadioGroup></section>
    <p id="checkbox-result" role="status">Updates: {updates ? 'on' : 'off'}</p>
    <p id="switch-result" role="status">Sound: {sound ? 'on' : 'off'}</p>
    <p id="slider-result" role="status">Volume: {volume}</p>
    <p id="radio-result" role="status">Class: {role}</p>
  </VStack>
}

const regions = [{value: 'overworld', label: 'Installed Overworld'}, {value: 'castle', label: 'Installed Castle'}, {value: 'locked', label: 'Installed locked region', disabled: true}]
const destinations = [{value: 'Moonlit forest'}, {value: 'Crystal caverns'}, {value: 'Sunken temple'}]

export function PickerExamples() {
  const [region, setRegion] = useState('overworld')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState<ISODateString>()
  const [focusDate, setFocusDate] = useState<ISODateString>('2026-09-01')
  const [packed, setPacked] = useState(false)
  return <VStack as="section" gap={3}>
    <h2>Installed pickers</h2>
    <section data-quest="select"><Select label="Installed region" value={region} onChange={setRegion} options={regions} /></section>
    <section data-quest="combobox"><Combobox label="Installed destination" value={destination} onChange={setDestination} options={destinations}
      hasSearch searchPlaceholder="Search installed destinations" emptySearchText="No installed destination found." /></section>
    <p id="select-result" role="status">Region: {region}</p>
    <p id="combobox-result" role="status">Destination: {destination}</p>
    <section data-quest="calendar"><Calendar aria-label="Installed departure calendar" mode="single"
      {...(date ? {value: date} : {})} onChange={setDate} focusDate={focusDate} onFocusDateChange={setFocusDate} min="2026-09-01" max="2026-09-30" /></section>
    <p id="calendar-result" role="status">Departure: {date ?? 'not selected'}</p>
    <section data-quest="popover"><Popover label="Installed travel tips" content={<VStack gap={3}>
      <p>Pack an installed lantern.</p><Button onClick={() => setPacked(true)}>Pack installed lantern</Button>
    </VStack>}><Button>Open installed travel tips</Button></Popover></section>
    <p id="popover-result" role="status">Lantern: {packed ? 'packed' : 'not packed'}</p>
  </VStack>
}
`
