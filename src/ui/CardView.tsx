import type { CardInstance } from '../game/types'
import { getCardDef } from '../game/cards'

const TYPE_LABEL: Record<string, string> = {
  attack: 'アタック',
  skill: 'スキル',
  power: 'パワー',
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
  const classes = [
    'card',
    `card-${def.type}`,
    selected ? 'card-selected' : '',
    disabled ? 'card-disabled' : '',
    small ? 'card-small' : '',
    card.upgraded ? 'card-upgraded' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} onClick={onClick} disabled={!onClick}>
      <div className="card-top">
        <span className="card-cost">{def.cost}</span>
        <span className="card-name">{def.name}</span>
      </div>
      <div className="card-type">{TYPE_LABEL[def.type]}</div>
      <div className="card-desc">{def.description}</div>
    </button>
  )
}
