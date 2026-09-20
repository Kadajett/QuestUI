import {useState, type ReactNode} from 'react'
import {act, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {Theme} from '@astryxdesign/core/theme'
import {questTheme} from '../../components/quest/theme'
import {Accordion, AccordionItem} from '../../components/quest/accordion'
import {Toast, ToastViewport, useToast, type ToastDismissReason} from '../../components/quest/toast'

function Quest({children}: {children: ReactNode}) {
  return <Theme theme={questTheme} mode="light">{children}</Theme>
}

function Chapters() {
  return <>
    <AccordionItem value="map" trigger="Map">Follow the river.</AccordionItem>
    <AccordionItem value="loot" trigger="Loot">Collect the moonstone.</AccordionItem>
    <AccordionItem value="locked" trigger="Locked" isDisabled>Sealed chamber.</AccordionItem>
  </>
}

describe('Accordion', () => {
  it('coordinates single selection through keyboard activation and blocks disabled items', async () => {
    const user = userEvent.setup()
    render(<Accordion defaultValue="map"><Chapters/></Accordion>, {wrapper: Quest})
    const map = screen.getByRole('button', {name: 'Map'})
    const loot = screen.getByRole('button', {name: 'Loot'})
    expect(map).toHaveAttribute('aria-expanded', 'true')
    expect(loot).toHaveAttribute('aria-expanded', 'false')
    const panelId = map.getAttribute('aria-controls')
    expect(panelId).toBeTruthy()
    expect(document.getElementById(panelId ?? '')).toHaveTextContent('Follow the river.')
    await user.tab()
    expect(map).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(map).toHaveAttribute('aria-expanded', 'false')
    await user.keyboard(' ')
    expect(map).toHaveAttribute('aria-expanded', 'true')
    await user.tab()
    expect(loot).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(loot).toHaveAttribute('aria-expanded', 'true')
    expect(map).toHaveAttribute('aria-expanded', 'false')
    const locked = screen.getByRole('button', {name: 'Locked'})
    expect(locked).toHaveAttribute('aria-disabled', 'true')
    await user.click(locked)
    expect(locked).toHaveAttribute('aria-expanded', 'false')
    expect(loot).toHaveAttribute('aria-expanded', 'true')
  })

  it('keeps multiple chapters open and closes only the activated one', async () => {
    const user = userEvent.setup()
    render(<Accordion type="multiple" defaultValue={['map']}><Chapters/></Accordion>, {wrapper: Quest})
    const map = screen.getByRole('button', {name: 'Map'})
    const loot = screen.getByRole('button', {name: 'Loot'})
    await user.click(loot)
    expect(map).toHaveAttribute('aria-expanded', 'true')
    expect(loot).toHaveAttribute('aria-expanded', 'true')
    await user.click(map)
    expect(map).toHaveAttribute('aria-expanded', 'false')
    expect(loot).toHaveAttribute('aria-expanded', 'true')
  })

  it('does not change controlled state until the owner accepts the request', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const {rerender} = render(<Accordion value="map" onChange={onChange}><Chapters/></Accordion>, {wrapper: Quest})
    await user.click(screen.getByRole('button', {name: 'Loot'}))
    expect(onChange).toHaveBeenCalledWith('loot')
    expect(screen.getByRole('button', {name: 'Map'})).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', {name: 'Loot'})).toHaveAttribute('aria-expanded', 'false')
    rerender(<Accordion value="loot" onChange={onChange}><Chapters/></Accordion>)
    expect(screen.getByRole('button', {name: 'Map'})).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', {name: 'Loot'})).toHaveAttribute('aria-expanded', 'true')
  })
})

function OwnedToast({autoHide = false}: {autoHide?: boolean}) {
  const [open, setOpen] = useState(true)
  const [reason, setReason] = useState<ToastDismissReason>()
  return <>
    {open && <Toast type="error" body="Connection lost" isAutoHide={autoHide} autoHideDuration={2000} dismissLabel="Close warning"
      onDismiss={value => {setReason(value); setOpen(false)}}/>}
    <output aria-label="Dismissal reason">{reason}</output>
  </>
}

function NotificationAction() {
  const showToast = useToast()
  const [reason, setReason] = useState<ToastDismissReason>()
  return <>
    <button onClick={() => showToast({body: 'Saved at camp', isAutoHide: false, dismissLabel: 'Close saved message', onHide: setReason})}>Save</button>
    <output aria-label="Dismissal reason">{reason}</output>
  </>
}

describe('Toast', () => {
  it('announces an error and allows a localized keyboard dismissal owned by the consumer', async () => {
    const user = userEvent.setup()
    render(<OwnedToast/>, {wrapper: Quest})
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Connection lost')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
    await user.tab()
    expect(within(alert).getByRole('button', {name: 'Close warning'})).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Dismissal reason')).toHaveTextContent('manual')
  })

  it('pauses auto-hide while a notification control has focus and resumes on leaving', () => {
    vi.useFakeTimers()
    const {unmount} = render(<OwnedToast autoHide/>, {wrapper: Quest})
    try {
      act(() => vi.advanceTimersByTime(500))
      const dismiss = screen.getByRole('button', {name: 'Close warning'})
      act(() => dismiss.focus())
      act(() => vi.advanceTimersByTime(5000))
      expect(screen.getByRole('alert')).toHaveTextContent('Connection lost')
      act(() => dismiss.blur())
      act(() => vi.advanceTimersByTime(1499))
      expect(screen.getByRole('alert')).toBeInTheDocument()
      act(() => vi.advanceTimersByTime(1))
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(screen.getByLabelText('Dismissal reason')).toHaveTextContent('auto')
    } finally {
      unmount()
      vi.useRealTimers()
    }
  })

  it('renders hook notifications in the real viewport and reports manual dismissal', async () => {
    const user = userEvent.setup()
    render(<ToastViewport isTopLayer={false}><NotificationAction/></ToastViewport>, {wrapper: Quest})
    await user.click(screen.getByRole('button', {name: 'Save'}))
    // The viewport also maintains a singleton announcer; choose the interactive toast.
    const dismiss = await screen.findByRole('button', {name: 'Close saved message'})
    expect(dismiss.closest('[role="status"]')).toHaveTextContent('Saved at camp')
    await user.keyboard('{F6}')
    expect(dismiss).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByLabelText('Dismissal reason')).toHaveTextContent('manual')
  })
})
