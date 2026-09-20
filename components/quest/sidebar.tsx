'use client'

import {SideNav, SideNavItem, SideNavSection, SideNavHeading, SideNavCollapseButton, type SideNavProps, type SideNavItemProps, type SideNavSectionProps, type SideNavHeadingProps, type SideNavCollapseButtonProps} from '@astryxdesign/core/SideNav'
import {MobileNav, type MobileNavProps} from '@astryxdesign/core/MobileNav'
import {cardStyles} from './card-styles'
import {navigationStyles} from './navigation-extra.styles'

export type QuestSidebarProps = SideNavProps
export type QuestSidebarItemProps = SideNavItemProps
export type QuestSidebarSectionProps = SideNavSectionProps
export type QuestSidebarHeadingProps = SideNavHeadingProps
export type QuestSidebarCollapseButtonProps = SideNavCollapseButtonProps
export type QuestSidebarMobileProps = MobileNavProps

/** Desktop rail. Use collapsible for native controlled or uncontrolled collapse. */
export function Sidebar({xstyle, ...props}: QuestSidebarProps) {
  return <SideNav {...props} xstyle={[cardStyles.frame, navigationStyles.tokens, navigationStyles.sidebar, xstyle]} />
}

export function SidebarItem({xstyle, ...props}: QuestSidebarItemProps) {
  return <SideNavItem {...props} xstyle={[navigationStyles.item, xstyle]} />
}

export function SidebarSection({xstyle, ...props}: QuestSidebarSectionProps) {
  return <SideNavSection {...props} xstyle={[navigationStyles.tokens, xstyle]} />
}

export function SidebarHeading({xstyle, ...props}: QuestSidebarHeadingProps) {
  return <SideNavHeading {...props} xstyle={[navigationStyles.item, xstyle]} />
}

export function SidebarCollapseButton({xstyle, ...props}: QuestSidebarCollapseButtonProps) {
  return <SideNavCollapseButton {...props} xstyle={[navigationStyles.item, xstyle]} />
}

/** Controlled native modal drawer, or automatic mobile navigation in an Astryx AppShell. */
export function SidebarMobile({xstyle, ...props}: QuestSidebarMobileProps) {
  return <MobileNav {...props} xstyle={[navigationStyles.tokens, navigationStyles.drawer, xstyle]} />
}
