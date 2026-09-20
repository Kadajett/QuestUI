'use client'

import {useMemo, useState, type ReactNode} from 'react'
import {Stack, type StackProps} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {Button} from './button'
import {Checkbox} from './checkbox'
import {Input} from './input'
import {Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption} from './table'

export type QuestDataTableValue = string | number | boolean | null | undefined
export type QuestDataTableColumn<T> = {
  id: string
  header: string
  accessor: (row: T) => QuestDataTableValue
  cell?: (row: T) => ReactNode
  sortable?: boolean
  filterable?: boolean
  compare?: (a: T, b: T) => number
}
export type QuestDataTableSort = {id: string; direction: 'ascending' | 'descending'} | null
export type QuestDataTableProps<T> = Omit<StackProps, 'children'> & {
  data: readonly T[]
  columns: readonly QuestDataTableColumn<T>[]
  getRowId: (row: T) => string
  caption: string
  pageSize?: number
  filterLabel?: string
  selectable?: boolean
  selectedRowIds?: ReadonlySet<string>
  onSelectionChange?: (ids: Set<string>) => void
  onSortChange?: (sort: QuestDataTableSort) => void
  onFilterChange?: (query: string) => void
  onPageChange?: (page: number) => void
  emptyMessage?: string
}

function compareValues(a: QuestDataTableValue, b: QuestDataTableValue) {
  if (a == null) return b == null ? 0 : 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, {numeric: true, sensitivity: 'base'})
}

export function DataTable<T>({data, columns, getRowId, caption, pageSize = 5, filterLabel = 'Filter rows', selectable = true, selectedRowIds, onSelectionChange, onSortChange, onFilterChange, onPageChange, emptyMessage = 'No matching rows.', ...props}: QuestDataTableProps<T>) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<QuestDataTableSort>(null)
  const [page, setPage] = useState(0)
  const [internalSelection, setSelection] = useState<Set<string>>(() => new Set())
  const selection = selectedRowIds ?? internalSelection
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 5
  const rows = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    const filtered = needle ? data.filter(row => columns.some(column => column.filterable !== false && String(column.accessor(row) ?? '').toLocaleLowerCase().includes(needle))) : [...data]
    const column = columns.find(candidate => candidate.id === sort?.id)
    if (column && sort) filtered.sort((a, b) => (column.compare?.(a, b) ?? compareValues(column.accessor(a), column.accessor(b))) * (sort.direction === 'ascending' ? 1 : -1))
    return filtered
  }, [data, columns, query, sort])
  const pages = Math.max(1, Math.ceil(rows.length / size))
  const currentPage = Math.min(page, pages - 1)
  const visible = rows.slice(currentPage * size, (currentPage + 1) * size)
  const selectedCount = data.reduce((count, row) => count + Number(selection.has(getRowId(row))), 0)
  const pageSelection = visible.filter(row => selection.has(getRowId(row))).length
  function changePage(next: number) { setPage(next); onPageChange?.(next) }
  function filter(next: string) { setQuery(next); changePage(0); onFilterChange?.(next) }
  function changeSort(id: string) {
    const next: QuestDataTableSort = sort?.id !== id ? {id, direction: 'ascending'} : sort.direction === 'ascending' ? {id, direction: 'descending'} : null
    setSort(next); changePage(0); onSortChange?.(next)
  }
  function select(ids: string[], checked: boolean) {
    const next = new Set(selection)
    for (const id of ids) { if (checked) next.add(id); else next.delete(id) }
    if (selectedRowIds === undefined) setSelection(next)
    onSelectionChange?.(next)
  }
  return <Stack gap={3} {...props}>
    <Input label={filterLabel} value={query} onChange={filter}/>
    <Table aria-label={caption}>
      <TableCaption>{caption}</TableCaption>
      <TableHeader><TableRow>
        {selectable && <TableHead><Checkbox label="Select this page" isLabelHidden isDisabled={!visible.length} value={pageSelection === 0 ? false : pageSelection === visible.length ? true : 'indeterminate'} onChange={checked => select(visible.map(getRowId), checked)}/></TableHead>}
        {columns.map(column => <TableHead key={column.id} aria-sort={sort?.id === column.id ? sort.direction : undefined}>
          {column.sortable === false ? column.header : <Button variant="ghost" size="sm" onClick={() => changeSort(column.id)}>{column.header}{sort?.id === column.id ? sort.direction === 'ascending' ? ' ↑' : ' ↓' : ''}</Button>}
        </TableHead>)}
      </TableRow></TableHeader>
      <TableBody>{visible.length ? visible.map(row => <TableRow key={getRowId(row)} data-selected={selection.has(getRowId(row))}>
        {selectable && <TableCell><Checkbox label={`Select row ${getRowId(row)}`} isLabelHidden value={selection.has(getRowId(row))} onChange={checked => select([getRowId(row)], checked)}/></TableCell>}
        {columns.map(column => <TableCell key={column.id}>{column.cell ? column.cell(row) : String(column.accessor(row) ?? '')}</TableCell>)}
      </TableRow>) : <TableRow><TableCell colSpan={columns.length + Number(selectable)}>{emptyMessage}</TableCell></TableRow>}</TableBody>
    </Table>
    <Stack direction="horizontal" wrap="wrap" gap={3} vAlign="center" hAlign="between">
      <Text as="p" role="status">{rows.length} results{selectable ? ` · ${selectedCount} selected` : ''} · Page {currentPage + 1} of {pages}</Text>
      <Stack direction="horizontal" gap={2}>
        <Button variant="outline" size="sm" disabled={currentPage === 0} onClick={() => changePage(currentPage - 1)}>Previous page</Button>
        <Button variant="outline" size="sm" disabled={currentPage === pages - 1} onClick={() => changePage(currentPage + 1)}>Next page</Button>
      </Stack>
    </Stack>
  </Stack>
}
