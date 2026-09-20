'use client'

import type {ComponentProps} from 'react'
import * as stylex from '@stylexjs/stylex'
import {Table as NativeTable, TableHeader as NativeHeader, TableBody as NativeBody, TableFooter as NativeFooter, TableRow as NativeRow, TableCell as NativeCell, TableHeaderCell as NativeHead, type TableProps} from '@astryxdesign/core/Table'
import {dataStyles} from './data-extra.styles'

export type QuestTableProps = TableProps<Record<string, unknown>>
export type QuestTableHeaderProps = ComponentProps<typeof NativeHeader>
export type QuestTableBodyProps = ComponentProps<typeof NativeBody>
export type QuestTableFooterProps = ComponentProps<typeof NativeFooter>
export type QuestTableRowProps = ComponentProps<typeof NativeRow>
export type QuestTableCellProps = ComponentProps<typeof NativeCell>
export type QuestTableHeadProps = ComponentProps<typeof NativeHead>
export type QuestTableCaptionProps = ComponentProps<'caption'> & {xstyle?: stylex.StyleXStyles}

export function Table({xstyle, ...props}: QuestTableProps) {
  return <NativeTable {...props} xstyle={[dataStyles.frame, dataStyles.table, xstyle]}/>
}
export function TableHeader({xstyle, ...props}: QuestTableHeaderProps) {
  return <NativeHeader {...props} xstyle={[dataStyles.head, xstyle]}/>
}
export function TableBody(props: QuestTableBodyProps) { return <NativeBody {...props}/> }
export function TableFooter({xstyle, ...props}: QuestTableFooterProps) {
  return <NativeFooter {...props} xstyle={[dataStyles.head, xstyle]}/>
}
export function TableRow({xstyle, ...props}: QuestTableRowProps) {
  return <NativeRow {...props} xstyle={[dataStyles.row, xstyle]}/>
}
export function TableCell({xstyle, ...props}: QuestTableCellProps) {
  return <NativeCell {...props} xstyle={[dataStyles.cell, xstyle]}/>
}
export function TableHead({xstyle, ...props}: QuestTableHeadProps) {
  return <NativeHead scope="col" {...props} xstyle={[dataStyles.cell, dataStyles.head, xstyle]}/>
}
export function TableCaption({xstyle, className, ...props}: QuestTableCaptionProps) {
  const styled = stylex.props(dataStyles.caption, xstyle)
  return <caption {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')}/>
}
