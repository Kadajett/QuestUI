"use client"
import {useId, useLayoutEffect, useRef, useState, type ComponentProps, type RefObject} from 'react'
import {Stack} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import * as stylex from '@stylexjs/stylex'
import {Input} from './input'
import {Checkbox} from './checkbox'
import {RadioGroup, RadioGroupItem} from './radio-group'
import {Button} from './button'
import {conversationStyles as styles} from './conversation.stylex'

export type QuestQuestionnaireQuestion = {
  id: string
  title: string
  description?: string
  type: 'single' | 'multiple' | 'text'
  choices?: readonly {value: string; label: string; description?: string; disabled?: boolean}[]
  skippable?: boolean
  placeholder?: string
}
export type QuestQuestionnaireAnswers = Record<string, string | string[]>
export type QuestQuestionnaireProps = Omit<ComponentProps<'form'>, 'onSubmit' | 'onChange'> & {
  questions: readonly QuestQuestionnaireQuestion[]
  defaultAnswers?: QuestQuestionnaireAnswers
  onFinish: (answers: QuestQuestionnaireAnswers) => void | Promise<void>
  finishLabel?: string
  xstyle?: stylex.StyleXStyles
}

type Answer = string | string[] | undefined
type Choice = NonNullable<QuestQuestionnaireQuestion['choices']>[number]

function answerIsEmpty(answer: Answer): boolean {
  if (answer == null || answer === '') return true
  return Array.isArray(answer) && answer.length === 0
}

function enabledChoices(question: QuestQuestionnaireQuestion): Set<string> {
  return new Set((question.choices ?? []).filter(choice => !choice.disabled).map(choice => choice.value))
}

function answerIsValid(question: QuestQuestionnaireQuestion, answer: Answer): boolean {
  if (question.skippable && answerIsEmpty(answer)) return true
  if (question.type === 'text') return typeof answer === 'string' && answer.trim().length > 0
  const allowed = enabledChoices(question)
  if (question.type === 'single') return typeof answer === 'string' && allowed.has(answer)
  if (!Array.isArray(answer) || answer.length === 0) return false
  return answer.every(value => allowed.has(value))
}
function nextAnswers(answers: QuestQuestionnaireAnswers, question: QuestQuestionnaireQuestion, skip: boolean) {
  const next = {...answers}
  if (skip) delete next[question.id]
  return next
}

function submission(questions: readonly QuestQuestionnaireQuestion[], answers: QuestQuestionnaireAnswers) {
  const result: QuestQuestionnaireAnswers = {}
  for (const question of questions) {
    const answer = answers[question.id]
    if (typeof answer === 'string') result[question.id] = answer
    else if (Array.isArray(answer)) result[question.id] = [...answer]
  }
  return result
}

function RadioChoice({choice}: {choice: Choice}) {
  return <RadioGroupItem value={choice.value} label={choice.label}
    {...(choice.description === undefined ? {} : {description: choice.description})}
    {...(choice.disabled === undefined ? {} : {isDisabled: choice.disabled})} />
}

function CheckboxChoice({choice, selected, onChange}: {
  choice: Choice
  selected: readonly string[]
  onChange: (answer: string[]) => void
}) {
  const checked = selected.includes(choice.value)
  const toggle = (enabled: boolean) => {
    onChange(enabled ? [...selected, choice.value] : selected.filter(value => value !== choice.value))
  }
  return <Checkbox label={choice.label} value={checked} onChange={toggle}
    {...(choice.disabled === undefined ? {} : {isDisabled: choice.disabled})} />
}

function QuestionControl({question, answer, onChange}: {
  question: QuestQuestionnaireQuestion
  answer: Answer
  onChange: (answer: string | string[]) => void
}) {
  if (question.type === 'text') {
    return <Input label={question.title} value={typeof answer === 'string' ? answer : ''}
      onChange={onChange} {...(question.placeholder === undefined ? {} : {placeholder: question.placeholder})} />
  }
  if (question.type === 'single') {
    return <RadioGroup label={question.title} value={typeof answer === 'string' ? answer : ''} onChange={onChange}>
      {question.choices?.map(choice => <RadioChoice key={choice.value} choice={choice}/>)}
    </RadioGroup>
  }
  const selected = Array.isArray(answer) ? answer : []
  return <Stack gap={2}>
    {question.choices?.map(choice => <CheckboxChoice key={choice.value} choice={choice}
      selected={selected} onChange={onChange}/>)}
  </Stack>
}

type QuestionnaireBodyProps = {
  complete: boolean
  question: QuestQuestionnaireQuestion | undefined
  currentIndex: number
  questionCount: number
  answer: Answer
  pending: boolean
  error: string
  id: string
  last: boolean
  finishLabel: string
  title: RefObject<HTMLLegendElement | null>
  onAnswer: (answer: string | string[]) => void
  onAdvance: (skip?: boolean) => void
  onBack: () => void
}

function QuestionnaireBody({complete, question, currentIndex, questionCount, answer, pending, error,
  id, last, finishLabel, title, onAnswer, onAdvance, onBack}: QuestionnaireBodyProps) {
  if (complete) return <Text role="status">Answers saved.</Text>
  if (!question) return <Text role="status">No questions available.</Text>
  return <>
    <Text role="status">Question {currentIndex + 1} of {questionCount}</Text>
    <progress max={questionCount} value={currentIndex + 1} aria-label="Questionnaire progress" />
    <fieldset disabled={pending} aria-describedby={`${id}-description${error ? ` ${id}-error` : ''}`}
      {...stylex.props(styles.column)}>
      <legend ref={title} tabIndex={-1} {...stylex.props(styles.title)}>{question.title}</legend>
      <Text id={`${id}-description`}>{question.description}{question.skippable ? ' (Optional)' : ''}</Text>
      <QuestionControl question={question} answer={answer} onChange={onAnswer}/>
    </fieldset>
    {error && <Text id={`${id}-error`} role="alert" xstyle={styles.error}>{error}</Text>}
    <Stack direction="horizontal" gap={2}>
      <Button type="button" variant="outline" disabled={currentIndex === 0 || pending} onClick={onBack}>Back</Button>
      {question.skippable && <Button type="button" variant="ghost" disabled={pending}
        onClick={() => onAdvance(true)}>Skip</Button>}
      <Button type="submit" disabled={pending} loading={pending} loadingText="Saving answers">
        {last ? finishLabel : 'Next'}
      </Button>
    </Stack>
  </>
}

export function Questionnaire({questions, defaultAnswers = {}, onFinish, finishLabel = 'Finish', xstyle, className, ...props}: QuestQuestionnaireProps) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<QuestQuestionnaireAnswers>(defaultAnswers)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [complete, setComplete] = useState(false)
  const title = useRef<HTMLLegendElement>(null)
  const submitted = useRef(false)
  const previousIndex = useRef(0)
  const id = useId()
  const currentIndex = Math.min(index, Math.max(0, questions.length - 1))
  const question = questions[currentIndex]
  const answer = question ? answers[question.id] : undefined
  useLayoutEffect(() => {
    if (previousIndex.current !== currentIndex) title.current?.focus()
    previousIndex.current = currentIndex
  }, [currentIndex])

  const changeAnswer = (value: string | string[]) => {
    if (!question) return
    setAnswers(previous => ({...previous, [question.id]: value}))
    setError('')
  }
  const finish = async (next: QuestQuestionnaireAnswers) => {
    const invalidIndex = questions.findIndex(item => !answerIsValid(item, next[item.id]))
    if (invalidIndex >= 0) {
      setIndex(invalidIndex)
      setError('Please answer this question before continuing.')
      return
    }
    submitted.current = true
    setPending(true)
    try {
      await onFinish(submission(questions, next))
      setComplete(true)
    } catch (cause) {
      submitted.current = false
      setError(cause instanceof Error ? cause.message : 'Could not save your answers. Please try again.')
    } finally {
      setPending(false)
    }
  }
  const advance = async (skip = false) => {
    if (!question || pending || submitted.current) return
    if (!skip && !answerIsValid(question, answer)) {
      setError('Please answer this question before continuing.')
      return
    }
    const next = nextAnswers(answers, question, skip)
    setError('')
    setAnswers(next)
    if (currentIndex < questions.length - 1) {
      setIndex(currentIndex + 1)
      return
    }
    await finish(next)
  }
  const styled = stylex.props(styles.frame, styles.column, xstyle)
  return <form {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')}
    aria-busy={pending || undefined} noValidate onSubmit={event => {
      event.preventDefault()
      void advance()
    }}>
    <QuestionnaireBody complete={complete} question={question} currentIndex={currentIndex}
      questionCount={questions.length} answer={answer} pending={pending} error={error} id={id}
      last={currentIndex === questions.length - 1} finishLabel={finishLabel} title={title}
      onAnswer={changeAnswer} onAdvance={skip => void advance(skip)}
      onBack={() => {setIndex(currentIndex - 1); setError('')}}/>
  </form>
}
