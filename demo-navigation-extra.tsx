import {useState} from 'react'
import {Heading} from '@astryxdesign/core/Heading'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {Breadcrumb, BreadcrumbItem} from './components/quest/breadcrumb'
import {Pagination} from './components/quest/pagination'
import {ScrollArea} from './components/quest/scroll-area'
import {Sidebar, SidebarItem, SidebarSection, SidebarHeading, SidebarMobile} from './components/quest/sidebar'
import {NavigationMenu, NavigationMenuLink, NavigationMenuItem} from './components/quest/navigation-menu'
import {Card, CardContent} from './components/quest/card'
import {Button} from './components/quest/button'
import {PixelIcon} from './components/quest/pixel-icon'

const destinations = ['World map', 'Quest journal', 'Inventory'] as const

function TrailAndPages() {
  const [page, setPage] = useState(1)
  const [location, setLocation] = useState('Crystal Cave')
  return <Card><CardContent><Stack gap={4}>
    <Heading level={3}>Breadcrumb & pagination</Heading>
    <Breadcrumb label="Exploration trail">
      <BreadcrumbItem onClick={() => setLocation('Overworld')} isCurrent={false}>Overworld</BreadcrumbItem>
      <BreadcrumbItem onClick={() => setLocation('Mountain pass')} isCurrent={false}>Mountain pass</BreadcrumbItem>
      <BreadcrumbItem isCurrent>{location}</BreadcrumbItem>
    </Breadcrumb>
    <Text role="status" aria-label="Journal page">Journal page {page}: {['Find the crystal', 'Meet the ranger', 'Return to camp'][page - 1]}</Text>
    <Pagination label="Journal pages" page={page} onChange={setPage} totalPages={3} />
  </Stack></CardContent></Card>
}

function NavigationRail() {
  const [selected, setSelected] = useState<string>('World map')
  const [isCollapsed, setCollapsed] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const items = <SidebarSection title="Adventure">
    {destinations.map((label, index) => <SidebarItem key={label} label={label}
      icon={<PixelIcon name={index === 0 ? 'grid' : index === 1 ? 'spark' : 'diamond'} />}
      isSelected={selected === label} onClick={() => {setSelected(label); setOpen(false)}} />)}
  </SidebarSection>
  return <Card><CardContent><Stack gap={4} hAlign="start">
    <Heading level={3}>Sidebar</Heading>
    <Button onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={isOpen}>Open mobile navigation</Button>
    <Sidebar aria-label="Adventure sidebar" header={<SidebarHeading heading="Quest log" icon={<PixelIcon name="spark" />} />}
      collapsible={{isCollapsed, onCollapsedChange: setCollapsed}}>{items}</Sidebar>
    <SidebarMobile isOpen={isOpen} onOpenChange={setOpen} header="Adventure navigation" label="Adventure navigation">{items}</SidebarMobile>
    <Text role="status" aria-label="Sidebar destination">Destination: {selected}</Text>
    <Text role="status" aria-label="Sidebar display">Sidebar {isCollapsed ? 'collapsed' : 'expanded'}</Text>
  </Stack></CardContent></Card>
}

function RouteMenu() {
  const [route, setRoute] = useState('Camp')
  return <Card><CardContent><Stack gap={4}>
    <Heading level={3}>Navigation menu</Heading>
    <NavigationMenu label="Travel navigation">
      <NavigationMenuLink label="Camp" href="#navigation-extra" isSelected={route === 'Camp'} onClick={() => setRoute('Camp')} />
      <NavigationMenuItem label="Explore regions" items={[
        {title: 'Crystal Cave', description: 'A glittering underground path', onClick: () => setRoute('Crystal Cave')},
        {title: 'Forest Shrine', description: 'A quiet place among the trees', onClick: () => setRoute('Forest Shrine')},
      ]} />
    </NavigationMenu>
    <Text role="status" aria-label="Travel destination">Travel destination: {route}</Text>
  </Stack></CardContent></Card>
}

export function NavigationExtraExamples() {
  return <Stack as="section" id="navigation-extra" aria-labelledby="navigation-extra-heading" gap={4}>
    <Heading level={2} id="navigation-extra-heading">Explore the world</Heading>
    <Text>Trails, page controls, native scrolling, a collapsible rail and keyboard-ready subnavigation.</Text>
    <TrailAndPages />
    <Card><CardContent><Stack gap={4}>
      <Heading level={3}>Scroll area</Heading>
      <ScrollArea label="Expedition history" role="region" height={180} padding={4} overscroll="contain">
        <Stack gap={3}>{Array.from({length: 18}, (_, index) => <Text key={index}>Day {index + 1}: {index === 17 ? 'The final crystal is recovered.' : 'The party charts another trail.'}</Text>)}</Stack>
      </ScrollArea>
    </Stack></CardContent></Card>
    <NavigationRail />
    <RouteMenu />
  </Stack>
}
