import {useState} from 'react'
import {describe, expect, it} from 'vitest'
import {render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Theme} from '@astryxdesign/core/theme'
import {questTheme} from '../../components/quest/theme'
import {Breadcrumb, BreadcrumbItem} from '../../components/quest/breadcrumb'
import {Pagination} from '../../components/quest/pagination'
import {NavigationExtraExamples} from '../../demo-navigation-extra'

function Pages() {
  const [page, setPage] = useState(1)
  return <Theme theme={questTheme} mode="light"><Pagination page={page} onChange={setPage} totalPages={3} /><output aria-label="Page">{page}</output></Theme>
}

function renderExamples() {
  return render(<Theme theme={questTheme} mode="light"><NavigationExtraExamples /></Theme>)
}

describe('extra navigation surfaces', () => {
  it('keeps only the final breadcrumb current and leaves ancestors navigable', () => {
    const {rerender} = render(<Theme theme={questTheme} mode="light"><Breadcrumb>
      <BreadcrumbItem href="/world">World</BreadcrumbItem><BreadcrumbItem>Cave</BreadcrumbItem>
    </Breadcrumb></Theme>)
    expect(screen.getByRole('link', {name: 'World'})).toHaveAttribute('href', '/world')
    expect(screen.getByText('Cave')).toHaveAttribute('aria-current', 'page')
    rerender(<Theme theme={questTheme} mode="light"><Breadcrumb>
      <BreadcrumbItem href="/world">World</BreadcrumbItem><BreadcrumbItem href="/cave">Cave</BreadcrumbItem><BreadcrumbItem>Crystal</BreadcrumbItem>
    </Breadcrumb></Theme>)
    expect(screen.getByRole('link', {name: 'Cave'})).not.toHaveAttribute('aria-current')
    expect(screen.getByText('Crystal')).toHaveAttribute('aria-current', 'page')
  })

  it('changes pages while preventing navigation beyond either boundary', async () => {
    const user = userEvent.setup()
    render(<Pages />)
    const previous = screen.getByRole('button', {name: 'Go to previous page'})
    const next = screen.getByRole('button', {name: 'Go to next page'})
    expect(previous).toBeDisabled()
    await user.click(previous)
    expect(screen.getByLabelText('Page')).toHaveTextContent('1')
    await user.click(next)
    expect(screen.getByLabelText('Page')).toHaveTextContent('2')
    await user.click(next)
    expect(screen.getByLabelText('Page')).toHaveTextContent('3')
    expect(next).toBeDisabled()
    await user.click(previous)
    expect(screen.getByLabelText('Page')).toHaveTextContent('2')
  })

  it('collapses the sidebar without losing navigation actions', async () => {
    const user = userEvent.setup()
    renderExamples()
    await user.click(screen.getByRole('button', {name: 'Collapse sidebar'}))
    expect(screen.getByRole('status', {name: 'Sidebar display'})).toHaveTextContent('collapsed')
    const sidebar = screen.getByRole('navigation', {name: 'Adventure sidebar'})
    await user.click(within(sidebar).getByRole('button', {name: 'Inventory'}))
    expect(screen.getByRole('status', {name: 'Sidebar destination'})).toHaveTextContent('Inventory')
    await user.click(screen.getByRole('button', {name: 'Expand sidebar'}))
    expect(screen.getByRole('status', {name: 'Sidebar display'})).toHaveTextContent('expanded')
  })

  it('opens a mobile drawer and dismisses after selecting a destination', async () => {
    const user = userEvent.setup()
    renderExamples()
    await user.click(screen.getByRole('button', {name: 'Open mobile navigation'}))
    const drawer = screen.getByRole('dialog', {name: 'Adventure navigation'})
    await user.click(within(drawer).getByRole('button', {name: 'Quest journal'}))
    expect(screen.getByRole('status', {name: 'Sidebar destination'})).toHaveTextContent('Quest journal')
    await waitFor(() => expect(drawer).not.toHaveAttribute('open'))
  })

  it('activates a subnavigation destination with the keyboard', async () => {
    const user = userEvent.setup()
    renderExamples()
    const trigger = screen.getByRole('button', {name: 'Explore regions'})
    trigger.focus()
    // TopNav opens menu on Enter, then arrow keys navigate menuitems
    await user.keyboard('{Enter}')
    // First menuitem is focused by default after open
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    // Second menuitem gets focus
    expect(screen.getAllByRole('menuitem')[1]).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('status', {name: 'Travel destination'})).toHaveTextContent('Forest Shrine')
  })
})
