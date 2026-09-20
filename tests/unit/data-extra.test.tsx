import {useState, type ReactNode} from 'react'
import {fireEvent, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {Theme} from '@astryxdesign/core/theme'
import {questTheme} from '../../components/quest/theme'
import {DataTable, type QuestDataTableColumn} from '../../components/quest/data-table'
import {Chart} from '../../components/quest/chart'
import {Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption} from '../../components/quest/table'

function Quest({children}: {children: ReactNode}) { return <Theme theme={questTheme} mode="light">{children}</Theme> }
type Row = {id: string; name: string; gold: number}
const data: Row[] = [{id: 'a', name: 'Moonstone', gold: 80}, {id: 'b', name: 'Potion', gold: 12}, {id: 'c', name: 'Map', gold: 120}]
const columns: QuestDataTableColumn<Row>[] = [{id: 'name', header: 'Item', accessor: row => row.name}, {id: 'gold', header: 'Gold', accessor: row => row.gold}]
const getRowId = (row: Row) => row.id
function ControlledInventory() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  return <><DataTable data={data} columns={columns} getRowId={getRowId} caption="Inventory" pageSize={2} selectedRowIds={selected} onSelectionChange={setSelected}/><output aria-label="Packed ids">{[...selected].join(',')}</output></>
}

describe('data table', () => {
  it('sorts numbers rather than text and resets pagination when filtering to an empty result', async () => {
    const user = userEvent.setup()
    render(<DataTable data={data} columns={columns} getRowId={getRowId} caption="Inventory" pageSize={2}/>, {wrapper: Quest})
    await user.click(screen.getByRole('button', {name: 'Gold'}))
    const rows = within(screen.getByRole('table')).getAllByRole('row')
    expect(rows[1]).toHaveTextContent('Potion')
    expect(rows[2]).toHaveTextContent('Moonstone')
    await user.click(screen.getByRole('button', {name: 'Next page'}))
    expect(screen.getByRole('cell', {name: 'Map'})).toBeVisible()
    expect(screen.getByRole('button', {name: 'Next page'})).toBeDisabled()
    await user.type(screen.getByRole('textbox', {name: 'Filter rows'}), 'not found')
    expect(screen.getByRole('cell', {name: 'No matching rows.'})).toBeVisible()
    expect(screen.getByRole('button', {name: 'Previous page'})).toBeDisabled()
    expect(screen.getByRole('checkbox', {name: 'Select this page'})).toBeDisabled()
    await user.clear(screen.getByRole('textbox', {name: 'Filter rows'}))
    expect(screen.getByRole('cell', {name: 'Potion'})).toBeVisible()
  })

  it('keeps controlled selection across pages and only toggles the current page', async () => {
    const user = userEvent.setup()
    render(<ControlledInventory/>, {wrapper: Quest})
    await user.click(screen.getByRole('checkbox', {name: 'Select row a'}))
    expect(screen.getByRole('checkbox', {name: 'Select this page'})).toBePartiallyChecked()
    await user.click(screen.getByRole('button', {name: 'Next page'}))
    await user.click(screen.getByRole('checkbox', {name: 'Select this page'}))
    expect(screen.getByLabelText('Packed ids')).toHaveTextContent('a,c')
    await user.click(screen.getByRole('button', {name: 'Previous page'}))
    expect(screen.getByRole('checkbox', {name: 'Select row a'})).toBeChecked()
    expect(screen.getByRole('checkbox', {name: 'Select row b'})).not.toBeChecked()
    await user.click(screen.getByRole('checkbox', {name: 'Select this page'}))
    await user.click(screen.getByRole('checkbox', {name: 'Select this page'}))
    expect(screen.getByLabelText('Packed ids')).toHaveTextContent('c')
  })

  it('clamps the visible page after data shrink without rendering an empty stale page', async () => {
    const user = userEvent.setup()
    const {rerender} = render(<DataTable data={data} columns={columns} getRowId={getRowId} caption="Inventory" pageSize={2}/>, {wrapper: Quest})
    await user.click(screen.getByRole('button', {name: 'Next page'}))
    rerender(<DataTable data={data.slice(0, 1)} columns={columns} getRowId={getRowId} caption="Inventory" pageSize={2}/>)
    expect(screen.getByRole('cell', {name: 'Moonstone'})).toBeVisible()
    expect(screen.getByRole('button', {name: 'Previous page'})).toBeDisabled()
  })
})

describe('chart', () => {
  it('describes negative and zero values, skips missing samples, and dismisses focus tooltips', async () => {
    const user = userEvent.setup()
    render(<Chart label="Balance" data={[{label: 'Mon', gold: -12}, {label: 'Tue', gold: null}, {label: 'Wed', gold: 0}]} series={[{key: 'gold', label: 'Gold'}]} variant="area"/>, {wrapper: Quest})
    const point = screen.getByRole('img', {name: 'Mon, Gold: -12'})
    fireEvent.focus(point)
    expect(screen.getByRole('tooltip')).toHaveTextContent('Mon · Gold: -12')
    fireEvent.keyDown(point, {key: 'Escape'})
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(screen.queryByRole('img', {name: /Tue/})).not.toBeInTheDocument()
    await user.hover(screen.getByRole('img', {name: 'Wed, Gold: 0'}))
    expect(screen.getByRole('tooltip')).toHaveTextContent('Wed · Gold: 0')
  })

  it('removes stale tooltip content when the active datum disappears', () => {
    const series = [{key: 'gold', label: 'Gold'}]
    const {rerender} = render(<Chart label="Balance" data={[{label: 'Mon', gold: 4}]} series={series}/>, {wrapper: Quest})
    fireEvent.focus(screen.getByRole('img', {name: 'Mon, Gold: 4'}))
    rerender(<Chart label="Balance" data={[]} series={series}/>)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(screen.getByText('No chart data.')).toBeVisible()
  })
})

it('preserves semantic table slots and caption associations', () => {
  render(<Table><TableCaption>Trading post</TableCaption><TableHeader><TableRow><TableHead>Item</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Lantern</TableCell></TableRow></TableBody></Table>, {wrapper: Quest})
  const table = screen.getByRole('table', {name: 'Trading post'})
  expect(within(table).getByRole('columnheader', {name: 'Item'})).toHaveAttribute('scope', 'col')
  expect(within(table).getByRole('cell', {name: 'Lantern'})).toBeVisible()
})
