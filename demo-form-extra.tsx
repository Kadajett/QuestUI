import {useState} from 'react'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {Grid} from '@astryxdesign/core/Grid'
import {Card, CardContent} from './components/quest/card'
import {Button} from './components/quest/button'
import {Checkbox} from './components/quest/checkbox'
import {NativeSelect} from './components/quest/native-select'
import {InputGroup, InputGroupInput, InputGroupText} from './components/quest/input-group'
import {InputOTP} from './components/quest/input-otp'
import {Toggle} from './components/quest/toggle'
import {ToggleGroup, ToggleGroupItem} from './components/quest/toggle-group'
import {DatePicker} from './components/quest/date-picker'
import type {DateRange, ISODateString} from './components/quest/calendar'

function IdentityExtras() {
  const [slug, setSlug] = useState('mira')
  const [region, setRegion] = useState('forest')
  const [code, setCode] = useState('')
  const [approved, setApproved] = useState(false)
  return <Card><CardContent><Stack gap={4}>
    <Text as="h3" type="large">Guild credentials</Text>
    <InputGroup label="Guild address" description="Your public adventurer profile.">
      <InputGroupText>quest://</InputGroupText>
      <InputGroupInput label="Profile slug" isLabelHidden value={slug} onChange={setSlug} />
      <InputGroupText>.guild</InputGroupText>
    </InputGroup>
    <NativeSelect label="Native realm" name="realm" value={region} onChange={event => setRegion(event.target.value)} description="Uses the platform's own select menu.">
      <option value="forest">Forest realm</option><option value="castle">Castle realm</option><option value="sky" disabled>Sky realm (locked)</option>
    </NativeSelect>
    <InputOTP label="Guild verification" value={code} onChange={setCode} name="verification" description="Enter or paste the six-digit invitation." />
    <Text role="status">Verification: {code.length === 6 ? 'ready' : `${code.length} of 6 digits`}</Text>
    <InputOTP label="Locked verification" length={4} defaultValue="1234" disabled />
    <Checkbox label="Approve guild terms" description="Accept before joining." value={approved}
      onChange={setApproved} isRequired status={approved
        ? {type: 'success', message: 'Terms accepted.'}
        : {type: 'error', message: 'Acceptance is required.'}} />
  </Stack></CardContent></Card>
}

function SelectionExtras() {
  const [favorite, setFavorite] = useState(false)
  const [stance, setStance] = useState<string | null>('defend')
  const [perks, setPerks] = useState<string[]>(['map'])
  const [date, setDate] = useState<ISODateString | undefined>('2026-09-17')
  const [range, setRange] = useState<DateRange | null>({start: '2026-09-18', end: '2026-09-21'})
  return <Card><CardContent><Stack gap={4}>
    <Text as="h3" type="large">Expedition planning</Text>
    <Toggle label="Favorite expedition" isPressed={favorite} onPressedChange={setFavorite} />
    <ToggleGroup label="Battle stance" value={stance} onChange={setStance}>
      <ToggleGroupItem label="Attack" value="attack" /><ToggleGroupItem label="Magic (locked)" value="magic" isDisabled /><ToggleGroupItem label="Defend" value="defend" />
    </ToggleGroup>
    <ToggleGroup type="multiple" label="Travel perks" value={perks} onChange={setPerks}>
      <ToggleGroupItem label="Map" value="map" /><ToggleGroupItem label="Compass" value="compass" /><ToggleGroupItem label="Lantern" value="lantern" />
    </ToggleGroup>
    <Text role="status">Stance: {stance ?? 'none'} · Perks: {perks.join(', ') || 'none'}</Text>
    <DatePicker label="Departure date" {...(date === undefined ? {} : {value: date})}
      onChange={setDate} min="2026-09-01" max="2026-10-31" hasClear nativePicker="never" />
    <DatePicker mode="range" label="Expedition dates" value={range} onChange={setRange} min="2026-09-01" max="2026-10-31" numberOfMonths={1} />
    <Text role="status" aria-label="Date selection">{date ?? 'No departure'} · {range ? `${range.start} to ${range.end}` : 'No expedition dates'}</Text>
    <Button variant="outline" onClick={() => {setDate(undefined); setRange(null)}}>Clear itinerary</Button>
  </Stack></CardContent></Card>
}

export function FormExtraExamples() {
  return <Stack as="section" id="form-extra" aria-labelledby="form-extra-heading" gap={5}>
    <Text as="h2" id="form-extra-heading" type="display-2">Extended form controls</Text>
    <Text type="supporting">Grouped fields, verification codes, toggles, and calendar popovers.</Text>
    <Grid columns={{minWidth: 300, max: 2}} gap={5}><IdentityExtras /><SelectionExtras /></Grid>
  </Stack>
}
