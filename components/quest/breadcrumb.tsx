'use client'

import {Breadcrumbs, BreadcrumbItem as AstryxBreadcrumbItem, type BreadcrumbsProps, type BreadcrumbItemProps} from '@astryxdesign/core/Breadcrumbs'
import {navigationStyles} from './navigation-extra.styles'

export type QuestBreadcrumbProps = BreadcrumbsProps
export type QuestBreadcrumbItemProps = BreadcrumbItemProps

/** A semantic trail. The final item is current unless isCurrent is explicitly supplied. */
export function Breadcrumb({xstyle, ...props}: QuestBreadcrumbProps) {
  return <Breadcrumbs {...props} xstyle={[navigationStyles.tokens, navigationStyles.trail, xstyle]} />
}

export function BreadcrumbItem({xstyle, ...props}: QuestBreadcrumbItemProps) {
  return <AstryxBreadcrumbItem {...props} xstyle={[navigationStyles.item, xstyle]} />
}
