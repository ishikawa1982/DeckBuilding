import type { CardInstance } from '../game/types'
import { CardView } from './CardView'

interface Props {
  deck: CardInstance[]
  onClose: () => void
}

export function DeckOverlay({ deck, onClose }: Props) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-box overlay-deck" onClick={(e) => e.stopPropagation()}>
        <h2>デッキ({deck.length}枚)</h2>
        <div className="deck-grid">
          {deck.map((card) => (
            <CardView key={card.uid} card={card} small />
          ))}
        </div>
        <button className="btn" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  )
}
