import type { CardDef, CardInstance } from '../game/types'
import { getCardDef } from '../game/cards'
import { Sprite } from '../gfx/Sprite'
import { cardIcon } from '../gfx/sprites'

// カード定義をそのまま描く(報酬画面などデッキ外のカード用)
export function CardFace({
  def,
  upgraded,
  selected,
  disabled,
  small,
  onClick,
}: {
  def: CardDef
  upgraded?: boolean
  selected?: boolean
  disabled?: boolean
  small?: boolean
  onClick?: () => void
}) {
  const classes = [
    'card',
    `card-${def.type}`,
    selected ? 'card-selected' : '',
    disabled ? 'card-disabled' : '',
    small ? 'card-small' : '',
    upgraded ? 'card-upgraded' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} onClick={onClick} disabled={!onClick}>
      <div className="card-cost">{def.cost}</div>
      <div className="card-name">{def.name}</div>
      <div className="card-art">
        <Sprite sprite={cardIcon(def.id, def.type)} scale={small ? 3 : 4} animMs={0} />
      </div>
      <div className="card-desc">{def.description}</div>
    </button>
  )
}

interface Props {
  card: CardInstance
  selected?: boolean
  disabled?: boolean
  small?: boolean
  onClick?: () => void
}

export function CardView({ card, selected, disabled, small, onClick }: Props) {
  const def = getCardDef(card)
  return (
    <CardFace
      def={def}
      upgraded={card.upgraded}
      selected={selected}
      disabled={disabled}
      small={small}
      onClick={onClick}
    />
  )
}
