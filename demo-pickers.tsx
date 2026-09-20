import {useState} from 'react'
import {Button} from './components/quest/button'
import {Calendar, type DateRange, type ISODateString} from './components/quest/calendar'
import {Card, CardContent} from './components/quest/card'
import {Grid} from '@astryxdesign/core/Grid'
import {Heading} from '@astryxdesign/core/Heading'
import {Popover} from './components/quest/popover'
import {Combobox, type SelectorOptionType} from './components/quest/combobox'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'

const initialMonth: ISODateString = '2026-09-01'
const destinations: SelectorOptionType[] = [{
  type: 'section',
  title: 'Destinations',
  options: [
    {value: 'Overworld'},
    {value: 'Castle'},
    {value: 'Moonlit forest'},
    {value: 'Crystal caverns'},
    {value: 'Sunken temple'},
  ],
}]

function formatDate(date: ISODateString) {
  return new Date(`${date}T00:00:00`).toLocaleDateString()
}

function DestinationPicker() {
  const [destination, setDestination] = useState('')
  return <Stack gap={4}>
    <Combobox
      label="Destination"
      options={destinations}
      value={destination}
      onChange={setDestination}
      placeholder="Choose destination"
      hasSearch
      searchPlaceholder="Search destinations…"
      emptySearchText="No destination found."
      width="100%"
    />
    <Text as="p" role="status">
      {destination ? `Next stop: ${destination}` : 'Type to filter, then use arrow keys and Enter.'}
    </Text>
    <Stack hAlign="start">
      <Popover label="Travel tips" content={
        <Stack gap={2}>
          <Heading level={3}>Pack light.</Heading>
          <Text as="p">Bring a lantern and leave room for treasure.</Text>
        </Stack>
      }>
        <Button variant="secondary">Travel tips</Button>
      </Popover>
    </Stack>
  </Stack>
}

function DepartureCalendar() {
  const [date, setDate] = useState<ISODateString>()
  const [focusDate, setFocusDate] = useState(initialMonth)
  return <Card><CardContent>
    <Stack gap={3}>
      <Heading level={3} id="departure-heading">Departure date</Heading>
      <Text type="supporting">Departures are available from September 1, 2026.</Text>
      <Calendar
        aria-labelledby="departure-heading"
        mode="single"
        {...(date ? {value: date} : {})}
        onChange={setDate}
        focusDate={focusDate}
        onFocusDateChange={setFocusDate}
        min={initialMonth}
      />
      <Text as="p" role="status">
        {date ? `Depart: ${formatDate(date)}` : 'Choose your departure day.'}
      </Text>
    </Stack>
  </CardContent></Card>
}

function ExpeditionCalendar() {
  const [range, setRange] = useState<DateRange>()
  const [focusDate, setFocusDate] = useState(initialMonth)
  return <Card><CardContent>
    <Stack gap={3}>
      <Heading level={3} id="expedition-heading">Expedition range</Heading>
      <Text type="supporting">Choose a start date, then an end date.</Text>
      <Calendar
        aria-labelledby="expedition-heading"
        mode="range"
        {...(range ? {value: range} : {})}
        onChange={setRange}
        focusDate={focusDate}
        onFocusDateChange={setFocusDate}
      />
      <Text as="p" role="status">
        {range ? `${formatDate(range.start)} → ${formatDate(range.end)}` : 'Choose the first and last day.'}
      </Text>
    </Stack>
  </CardContent></Card>
}

export function PickerExamples() {
  return <>
    <Stack as="section" id="calendar" aria-labelledby="calendar-heading" gap={4}>
      <Stack gap={2}>
        <Heading level={2} id="calendar-heading">07 / Calendar</Heading>
        <Text type="supporting">Pick a day or plan a whole expedition.</Text>
      </Stack>
      <Grid columns={{minWidth: 360, max: 2}} gap={4}>
        <DepartureCalendar/>
        <ExpeditionCalendar/>
      </Grid>
    </Stack>
    <Stack as="section" id="combobox" aria-labelledby="combobox-heading" gap={4}>
      <Stack gap={2}>
        <Heading level={2} id="combobox-heading">08 / Combobox &amp; popover</Heading>
        <Text type="supporting">Searchable choices and contextual content.</Text>
      </Stack>
      <Card><CardContent><DestinationPicker/></CardContent></Card>
    </Stack>
  </>
}
