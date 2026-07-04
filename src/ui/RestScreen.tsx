import { useState } from 'react'
import type { RunState } from '../game/types'
import { CARDS } from '../game/cards'
import { PixelBg } from '../gfx/PixelBg'
import { Sprite } from '../gfx/Sprite'
import { NODE_ICONS } from '../gfx/sprites'
import { CardView } from './CardView'

interface Props {
  run: RunState
  onChoose: (choice: { kind: 'heal' } | { kind: 'upgrade'; uid: number }) => void
}

export function RestScreen({ run, onChoose }: Props) {
  const [upgrading, setUpgrading] = useState(false)
  const healAmount = Math.floor(run.maxHp * 0.3)
  const upgradable = run.deck.filter((c) => !c.upgraded && CARDS[c.defId].upgraded)

  if (upgrading) {
    return (
      <div className="screen rest-screen">
        <PixelBg kind="room" />
        <h2 className="screen-title">鍛錬</h2>
        <p className="screen-sub">強化するカードを選ぼう</p>
        <div className="deck-grid">
          {upgradable.map((card) => (
            <CardView
              key={card.uid}
              card={card}
              small
              onClick={() => onChoose({ kind: 'upgrade', uid: card.uid })}
            />
          ))}
        </div>
        <button className="btn btn-small" onClick={() => setUpgrading(false)}>
          戻る
        </button>
      </div>
    )
  }

  return (
    <div className="screen rest-screen">
      <PixelBg kind="room" />
      <Sprite sprite={NODE_ICONS.rest} scale={9} animMs={0} />
      <h2 className="screen-title">焚き火</h2>
      <p className="screen-sub">
        ♥ {run.hp}/{run.maxHp}
      </p>
      <div className="rest-choices">
        <button className="btn btn-primary" onClick={() => onChoose({ kind: 'heal' })}>
          休憩する(HP {healAmount} 回復)
        </button>
        <button className="btn" disabled={upgradable.length === 0} onClick={() => setUpgrading(true)}>
          鍛錬する(カード1枚を強化)
        </button>
      </div>
    </div>
  )
}
