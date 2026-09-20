import {useState} from 'react'
import {Heading} from '@astryxdesign/core/Heading'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {Card, CardContent} from './components/quest/card'
import {Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter} from './components/quest/table'
import {DataTable, type QuestDataTableColumn} from './components/quest/data-table'
import {Carousel} from './components/quest/carousel'
import {Chart, type QuestChartProps} from './components/quest/chart'
import {Resizable} from './components/quest/resizable'
import {Button} from './components/quest/button'

type Loot = {id: string; name: string; value: number; region: string}
const loot: Loot[] = [
  {id: 'moonstone', name: 'Moonstone', value: 80, region: 'Cavern'},
  {id: 'potion', name: 'Health potion', value: 12, region: 'Forest'},
  {id: 'blade', name: 'Iron blade', value: 40, region: 'Castle'},
  {id: 'map', name: 'Ancient map', value: 120, region: 'Cavern'},
  {id: 'shield', name: 'Oak shield', value: 24, region: 'Forest'},
  {id: 'ring', name: 'Ruby ring', value: 200, region: 'Castle'},
]
const columns: QuestDataTableColumn<Loot>[] = [
  {id: 'name', header: 'Item', accessor: row => row.name},
  {id: 'value', header: 'Gold', accessor: row => row.value},
  {id: 'region', header: 'Region', accessor: row => row.region},
]
const chartData = [{label: 'Mon', gold: 20, costs: -12}, {label: 'Tue', gold: 40, costs: -8}, {label: 'Wed', gold: 28, costs: -18}, {label: 'Thu', gold: 72, costs: -24}, {label: 'Fri', gold: 96, costs: -16}]
const series = [{key: 'gold', label: 'Gold earned'}, {key: 'costs', label: 'Supplies'}]

export function DataExtraExamples() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [variant, setVariant] = useState<NonNullable<QuestChartProps['variant']>>('bar')
  const [size, setSize] = useState<number | null>(null)
  const [destination, setDestination] = useState<string | null>(null)
  return <Stack as="section" id="data-extra" aria-labelledby="data-extra-heading" gap={6}>
    <Heading level={2} id="data-extra-heading">Tables, charts and panels</Heading>
    <Stack as="section" id="table" gap={3}>
      <Heading level={3}>Table</Heading>
      <Table aria-label="Supply prices"><TableCaption>Village trading post</TableCaption><TableHeader><TableRow><TableHead>Supply</TableHead><TableHead>Gold</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Lantern</TableCell><TableCell>15</TableCell></TableRow><TableRow><TableCell>Rope</TableCell><TableCell>5</TableCell></TableRow></TableBody><TableFooter><TableRow><TableCell>Total</TableCell><TableCell>20</TableCell></TableRow></TableFooter></Table>
    </Stack>
    <Stack as="section" id="data-table" gap={3}>
      <Heading level={3}>Data table</Heading>
      <Text type="supporting">Sort any column, filter inventory, and select loot across pages.</Text>
      <Card><CardContent><DataTable data={loot} columns={columns} getRowId={row => row.id} caption="Quest inventory" pageSize={3} selectedRowIds={selected} onSelectionChange={setSelected}/></CardContent></Card>
      <Text as="p" role="status" aria-label="Loot selection">{selected.size ? `Packed: ${[...selected].join(', ')}` : 'No loot packed.'}</Text>
    </Stack>
    <Stack as="section" id="carousel" gap={3}>
      <Heading level={3}>Carousel</Heading>
      <Text type="supporting">Scroll the destinations, use the navigation buttons, or focus the scroller and press arrows, Home or End.</Text>
      <Carousel aria-label="Quest destinations">
        {['Forest path', 'Crystal cavern', 'Moonlit castle', 'Dragon peak', 'Harbor town'].map((name, index) => <Stack key={name} padding={5} width={280} minHeight={160} gap={3}><Heading level={4}>{name}</Heading><Text>Chapter {index + 1}</Text><Button variant="outline" aria-pressed={destination === name} onClick={() => setDestination(name)}>{destination === name ? 'Destination marked' : 'Mark destination'}</Button></Stack>)}
      </Carousel>
    </Stack>
    <Stack as="section" id="chart" gap={3}>
      <Heading level={3}>Chart</Heading>
      <Stack direction="horizontal" gap={2} wrap="wrap">{(['bar', 'line', 'area'] as const).map(type => <Button key={type} variant={variant === type ? 'primary' : 'outline'} aria-pressed={variant === type} onClick={() => setVariant(type)}>{type.charAt(0).toUpperCase() + type.slice(1)} chart</Button>)}</Stack>
      <Chart label="Expedition balance" description="Daily gold earned and supplies spent. Focus or hover each point for its value." data={chartData} series={series} variant={variant} style={{padding: 20, margin: 0}}/>
    </Stack>
    <Stack as="section" id="resizable" gap={3}>
      <Heading level={3}>Resizable</Heading>
      <Text type="supporting">Drag the divider or use arrow keys. Both panels keep at least 20% of the available space.</Text>
      <Resizable style={{height: 220}} handleLabel="Resize map and journal" primaryLabel="Map panel" secondaryLabel="Journal panel" onSizeChange={setSize} primary={<Stack padding={4} gap={3}><Heading level={4}>World map</Heading><Text>Forest → Cavern → Castle</Text></Stack>} secondary={<Stack padding={4} gap={3}><Heading level={4}>Quest journal</Heading><Text>Find the moonstone and return before nightfall.</Text></Stack>}/>
      <Text as="p" role="status" aria-label="Panel size">{size === null ? 'Drag or use arrow keys to resize.' : `Map width: ${Math.round(size)} pixels`}</Text>
    </Stack>
  </Stack>
}
