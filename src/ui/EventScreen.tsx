import { useState } from 'react'
import type { RunState } from '../game/types'
import type { GameEvent, EventChoice } from '../game/events'
import { CardView } from './CardView'

interface Props {
  event: GameEvent
  run: RunState
  onChoose: (choice: EventChoice, cardUid?: number) => void
}

export function EventScreen({ event, run, onChoose }: Props) {
  const [removing, setRemoving] = useState<EventChoice | null>(null)

  if (removing) {
    return (
      <div className="screen event-screen">
        <h2 className="screen-title">🗿 除去するカードを選ぼう</h2>
        <div className="deck-grid">
          {run.deck.map((card) => (
            <CardView key={card.uid} card={card} small onClick={() => onChoose(removing, card.uid)} />
          ))}
        </div>
        <button className="btn" onClick={() => setRemoving(null)}>
          戻る
        </button>
      </div>
    )
  }

  return (
    <div className="screen event-screen">
      <div className="event-art">{event.emoji}</div>
      <h2 className="screen-title">{event.title}</h2>
      <p className="event-text">{event.text}</p>
      <div className="event-choices">
        {event.choices.map((choice) => (
          <button
            key={choice.label}
            className="btn event-choice"
            onClick={() => {
              if (choice.action.kind === 'remove-card') {
                setRemoving(choice)
              } else {
                onChoose(choice)
              }
            }}
          >
            <span className="event-choice-label">{choice.label}</span>
            <span className="event-choice-detail">{choice.detail}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
