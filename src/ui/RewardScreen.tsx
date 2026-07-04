import { useEffect } from 'react'
import type { CardDef, RelicId } from '../game/types'
import { RELICS } from '../game/relics'
import { PixelBg } from '../gfx/PixelBg'
import { Sprite } from '../gfx/Sprite'
import { RELIC_SPRITES } from '../gfx/sprites'
import { sfx } from '../audio/sfx'
import { CardFace } from './CardView'
import { SoundToggle } from './SoundToggle'

interface Props {
  cards: CardDef[]
  relic: RelicId | null
  onPick: (card: CardDef | null) => void
}

export function RewardScreen({ cards, relic, onPick }: Props) {
  useEffect(() => {
    if (relic) sfx.relic()
  }, [relic])

  return (
    <div className="screen reward-screen">
      <PixelBg kind="room" />
      <SoundToggle corner />
      <h2 className="screen-title">戦利品</h2>
      {relic && (
        <div className="relic-reward">
          <Sprite sprite={RELIC_SPRITES[relic]} scale={4} animMs={0} />
          <div>
            <div className="relic-name">{RELICS[relic].name}</div>
            <div className="relic-desc">{RELICS[relic].description}</div>
          </div>
        </div>
      )}
      <p className="screen-sub">カードを1枚選んでデッキに加えよう</p>
      <div className="reward-cards">
        {cards.map((card) => (
          <CardFace
            key={card.id}
            def={card}
            onClick={() => {
              sfx.click()
              onPick(card)
            }}
          />
        ))}
      </div>
      <button
        className="btn btn-small"
        onClick={() => {
          sfx.click()
          onPick(null)
        }}
      >
        受け取らない
      </button>
    </div>
  )
}
