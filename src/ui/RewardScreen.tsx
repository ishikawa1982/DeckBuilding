import type { CardDef, RelicId } from '../game/types'
import { RELICS } from '../game/relics'

interface Props {
  cards: CardDef[]
  relic: RelicId | null
  onPick: (card: CardDef | null) => void
}

export function RewardScreen({ cards, relic, onPick }: Props) {
  return (
    <div className="screen reward-screen">
      <h2 className="screen-title">戦利品</h2>
      {relic && (
        <div className="relic-reward">
          <span className="relic-emoji">{RELICS[relic].emoji}</span>
          <div>
            <div className="relic-name">{RELICS[relic].name}</div>
            <div className="relic-desc">{RELICS[relic].description}</div>
          </div>
        </div>
      )}
      <p className="screen-sub">カードを1枚選んでデッキに加えよう</p>
      <div className="reward-cards">
        {cards.map((card) => (
          <button key={card.id} className={`card card-${card.type}`} onClick={() => onPick(card)}>
            <div className="card-top">
              <span className="card-cost">{card.cost}</span>
              <span className="card-name">{card.name}</span>
            </div>
            <div className="card-type">
              {card.type === 'attack' ? 'アタック' : card.type === 'skill' ? 'スキル' : 'パワー'}
            </div>
            <div className="card-desc">{card.description}</div>
          </button>
        ))}
      </div>
      <button className="btn" onClick={() => onPick(null)}>
        受け取らない
      </button>
    </div>
  )
}
