import {useState} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Theme} from '@astryxdesign/core/theme'
import {questTheme} from '../../components/quest/theme'
import {Attachment} from '../../components/quest/attachment'
import {Bubble} from '../../components/quest/bubble'
import {Marker} from '../../components/quest/marker'
import {Questionnaire, type QuestQuestionnaireQuestion} from '../../components/quest/questionnaire'

const wrap = (children: React.ReactNode) => <Theme theme={questTheme} mode="light">{children}</Theme>
const questions: QuestQuestionnaireQuestion[] = [
  {id: 'route', title: 'Route', type: 'single', choices: [{value: 'forest', label: 'Forest'}, {value: 'river', label: 'River'}]},
  {id: 'gear', title: 'Gear', type: 'multiple', choices: [{value: 'rope', label: 'Rope'}, {value: 'lamp', label: 'Lamp'}]},
  {id: 'note', title: 'Note', type: 'text', skippable: true},
]

it('keeps downloads unavailable during uploads and errors, and offers cancel then retry', async () => {
  const user = userEvent.setup()
  const cancel = vi.fn()
  const retry = vi.fn()
  const {rerender} = render(wrap(<Attachment name="map.txt" href="/map.txt" state="uploading" progress={150} onRemove={cancel} />))
  expect(screen.getByRole('progressbar')).toHaveAttribute('value', '100')
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', {name: 'Cancel upload of map.txt'}))
  expect(cancel).toHaveBeenCalledOnce()
  rerender(wrap(<Attachment name="map.txt" href="/map.txt" state="error" onRetry={retry} />))
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', {name: 'Retry map.txt'}))
  expect(retry).toHaveBeenCalledOnce()
  rerender(wrap(<Attachment name="map.txt" href="/map.txt" state="done" />))
  expect(screen.getByRole('link', {name: 'Download map.txt'})).toHaveAttribute('download', 'map.txt')
})

function InteractiveBubble() {
  const [selected, setSelected] = useState(false)
  return <Bubble collapsedContent="Preview" reactions={[{id: 'helpful', label: 'Helpful', count: selected ? 2 : 1, selected}]} onReactionChange={(_, value) => setSelected(value)}>Full briefing</Bubble>
}
it('toggles accessible collapse and controlled reaction state without losing the body', async () => {
  const user = userEvent.setup()
  render(wrap(<InteractiveBubble />))
  expect(screen.queryByText('Full briefing')).not.toBeInTheDocument()
  await user.click(screen.getByRole('button', {name: 'Show more'}))
  expect(screen.getByText('Full briefing')).toBeVisible()
  expect(screen.getByRole('button', {name: 'Show less'})).toHaveAttribute('aria-expanded', 'true')
  await user.click(screen.getByRole('button', {name: 'Helpful'}))
  expect(screen.getByRole('button', {name: 'Helpful'})).toHaveAttribute('aria-pressed', 'true')
  await user.click(screen.getByRole('button', {name: 'Show less'}))
  expect(screen.getByText('Preview')).toBeVisible()
})
it('gives labeled separators a name while status markers retain live semantics', () => {
  render(wrap(<><Marker variant="separator">Yesterday</Marker><Marker role="status">Ranger typing</Marker></>))
  expect(screen.getByRole('separator', {name: 'Yesterday'})).toHaveAttribute('aria-orientation', 'horizontal')
  expect(screen.getByRole('status')).toHaveTextContent('Ranger typing')
})

describe('questionnaire transitions', () => {
  it('requires answers, preserves prior choices, deselects multiple choices and clears skipped text', async () => {
    const user = userEvent.setup()
    const finish = vi.fn()
    render(wrap(<Questionnaire questions={questions} onFinish={finish} defaultAnswers={{stale: 'excluded'}} />))
    await user.click(screen.getByRole('button', {name: 'Next'}))
    expect(screen.getByRole('alert')).toBeVisible()
    await user.click(screen.getByRole('radio', {name: 'Forest'}))
    await user.click(screen.getByRole('button', {name: 'Next'}))
    await user.click(screen.getByRole('checkbox', {name: 'Rope'}))
    await user.click(screen.getByRole('checkbox', {name: 'Lamp'}))
    await user.click(screen.getByRole('checkbox', {name: 'Rope'}))
    await user.click(screen.getByRole('button', {name: 'Back'}))
    expect(screen.getByRole('radio', {name: 'Forest'})).toBeChecked()
    await user.click(screen.getByRole('button', {name: 'Next'}))
    expect(screen.getByRole('checkbox', {name: 'Lamp'})).toBeChecked()
    expect(screen.getByRole('checkbox', {name: 'Rope'})).not.toBeChecked()
    await user.click(screen.getByRole('button', {name: 'Next'}))
    await user.type(screen.getByRole('textbox', {name: 'Note'}), 'Do not submit this')
    await user.click(screen.getByRole('button', {name: 'Skip'}))
    expect(finish).toHaveBeenCalledWith({route: 'forest', gear: ['lamp']})
    expect(await screen.findByText('Answers saved.')).toBeVisible()
  })
  it('rejects blank required text and allows retrying a failed asynchronous save', async () => {
    const user = userEvent.setup()
    const finish = vi.fn().mockRejectedValueOnce(new Error('Save failed')).mockResolvedValueOnce(undefined)
    render(wrap(<Questionnaire questions={[{id: 'name', title: 'Name', type: 'text'}]} onFinish={finish} />))
    await user.type(screen.getByRole('textbox', {name: 'Name'}), '   ')
    await user.click(screen.getByRole('button', {name: 'Finish'}))
    expect(finish).not.toHaveBeenCalled()
    await user.type(screen.getByRole('textbox', {name: 'Name'}), 'Mira')
    await user.click(screen.getByRole('button', {name: 'Finish'}))
    expect(await screen.findByRole('alert')).toHaveTextContent('Save failed')
    await user.click(screen.getByRole('button', {name: 'Finish'}))
    expect(await screen.findByText('Answers saved.')).toBeVisible()
    expect(finish).toHaveBeenCalledTimes(2)
  })
})
