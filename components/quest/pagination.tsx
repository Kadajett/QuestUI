'use client'

import {Pagination as AstryxPagination, type PaginationProps} from '@astryxdesign/core/Pagination'
import {cardStyles} from './card-styles'
import {navigationStyles} from './navigation-extra.styles'

export type QuestPaginationProps = PaginationProps

/** Controlled, one-based pagination with native bounded navigation and page-size controls. */
export function Pagination({xstyle, ...props}: QuestPaginationProps) {
  return <AstryxPagination {...props} xstyle={[cardStyles.frame, navigationStyles.tokens, navigationStyles.bar, xstyle]} />
}
