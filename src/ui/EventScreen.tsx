import { useState } from 'react'
import type { RunState } from '../game/types'
import type { GameEvent, EventChoice } from '../game/events'
import { PixelBg } from '../gfx/PixelBg'
import { Sprite } from '../gfx/Sprite'
import { EVENT_ICONS, NODE_ICONS } from '../gfx/sprites'
import { sfx } from '../audio/sfx'
import { CardView } from './CardView'
import { SoundToggle } from './SoundToggle'

interface Props {
  event: GameEvent
  run: RunState
  onChoose: (choice: EventChoice, cardUid?: number) => void
}

// 選択肢の効果に応じて最もふさわしい効果音を鳴らす
function playChoiceSfx(choice: EventChoice): void {
  switch (choice.action.kind) {
    case 'heal':
      sfx.heal()
      break
    case 'maxhp':
      sfx.upgrade()
      break
    case 'damage':
      sfx.playerHit()
      break
    case 'upgrade-random':
      sfx.upgrade()
      break
    default:
      sfx.click()
  }
}

export function EventScreen({ event, run, onChoose }: Props) {
  const [removing, setRemoving] = useState<EventChoice | null>(null)

  if (removing) {
    return (
      <div className="screen event-screen">
        <PixelBg kind="room" />
        <SoundToggle corner />
        <h2 className="screen-title">除去するカードを選ぼう</h2>
        <div className="deck-grid">
          {run.deck.map((card) => (
            <CardView
              key={card.uid}
              card={card}
              small
              onClick={() => {
                sfx.remove()
                onChoose(removing, card.uid)
              }}
            />
          ))}
        </div>
        <button
          className="btn btn-small"
          onClick={() => {
            sfx.click()
            setRemoving(null)
          }}
        >
          戻る
        </button>
      </div>
    )
  }

  return (
    <div className="screen event-screen">
      <PixelBg kind="room" />
      <SoundToggle corner />
      <Sprite sprite={EVENT_ICONS[event.id] ?? NODE_ICONS.event} scale={8} animMs={0} />
      <h2 className="screen-title">{event.title}</h2>
      <p className="event-text">{event.text}</p>
      <div className="event-choices">
        {event.choices.map((choice) => (
          <button
            key={choice.label}
            className="btn event-choice"
            onClick={() => {
              if (choice.action.kind === 'remove-card') {
                sfx.click()
                setRemoving(choice)
              } else {
                playChoiceSfx(choice)
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
