import { useState } from 'react'
import type { CardInstance, CombatState, EnemyState, RelicId } from '../game/types'
import { getCardDef } from '../game/cards'
import { calcDamage } from '../game/combat'
import { RELICS } from '../game/relics'
import { CardView } from './CardView'

interface Props {
  combat: CombatState
  relics: RelicId[]
  floor: number
  canPlay: (card: CardInstance) => boolean
  onPlayCard: (uid: number, targetSlot?: number) => void
  onEndTurn: () => void
  onFinished: () => void
}

function StatusChips({ s }: { s: EnemyState['statuses'] }) {
  const chips: string[] = []
  if (s.strength > 0) chips.push(`💪${s.strength}`)
  if (s.dexterity > 0) chips.push(`🦶${s.dexterity}`)
  if (s.vulnerable > 0) chips.push(`💔${s.vulnerable}`)
  if (s.weak > 0) chips.push(`😵${s.weak}`)
  if (s.poison > 0) chips.push(`☠️${s.poison}`)
  if (s.thorns > 0) chips.push(`🌵${s.thorns}`)
  if (chips.length === 0) return null
  return <div className="status-chips">{chips.join(' ')}</div>
}

function intentText(enemy: EnemyState, playerStatuses: CombatState['player']['statuses']): string {
  const mv = enemy.nextMove
  switch (mv.intent) {
    case 'attack': {
      const dmg = calcDamage(mv.damage ?? 0, enemy.statuses, playerStatuses)
      return mv.hits && mv.hits > 1 ? `⚔️ ${dmg}×${mv.hits}` : `⚔️ ${dmg}`
    }
    case 'attack-defend': {
      const dmg = calcDamage(mv.damage ?? 0, enemy.statuses, playerStatuses)
      return `⚔️ ${dmg} + 🛡️`
    }
    case 'defend':
      return '🛡️ 防御'
    case 'buff':
      return '💪 強化'
    case 'debuff':
      return '🌀 妨害'
  }
}

export function CombatScreen({
  combat,
  relics,
  floor,
  canPlay,
  onPlayCard,
  onEndTurn,
  onFinished,
}: Props) {
  const [selectedUid, setSelectedUid] = useState<number | null>(null)
  const p = combat.player
  const aliveEnemies = combat.enemies.filter((e) => e.hp > 0)
  const selectedCard = combat.hand.find((c) => c.uid === selectedUid) ?? null
  const selectedDef = selectedCard ? getCardDef(selectedCard) : null
  const needsTarget = selectedDef?.target === 'enemy' && aliveEnemies.length > 1

  const handleCardTap = (card: CardInstance) => {
    if (!canPlay(card)) return
    const def = getCardDef(card)
    if (card.uid === selectedUid) {
      // 2回目のタップで確定(単体対象で敵が複数いる場合はタップ対象待ち)
      if (def.target === 'enemy') {
        if (aliveEnemies.length === 1) {
          setSelectedUid(null)
          onPlayCard(card.uid, aliveEnemies[0].slot)
        }
        // 複数敵: 敵タップ待ち
      } else {
        setSelectedUid(null)
        onPlayCard(card.uid)
      }
    } else {
      setSelectedUid(card.uid)
    }
  }

  const handleEnemyTap = (enemy: EnemyState) => {
    if (!selectedCard || !selectedDef) return
    if (selectedDef.target !== 'enemy') return
    setSelectedUid(null)
    onPlayCard(selectedCard.uid, enemy.slot)
  }

  const finished = combat.outcome !== 'ongoing'

  return (
    <div className="screen combat-screen">
      <header className="hud">
        <span className="hud-floor">{floor + 1}F</span>
        <span className="hud-turn">ターン {combat.turn}</span>
        <span className="hud-relics">
          {relics.map((r) => (
            <span key={r} title={RELICS[r].name}>
              {RELICS[r].emoji}
            </span>
          ))}
        </span>
      </header>

      <div className="enemy-area">
        {combat.enemies.map((enemy) => (
          <button
            key={enemy.slot}
            className={[
              'enemy',
              enemy.hp <= 0 ? 'enemy-dead' : '',
              needsTarget && enemy.hp > 0 ? 'enemy-targetable' : '',
              selectedDef?.target === 'enemy' && enemy.hp > 0 ? 'enemy-can-target' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleEnemyTap(enemy)}
            disabled={enemy.hp <= 0}
          >
            <div className="enemy-intent">{enemy.hp > 0 ? intentText(enemy, p.statuses) : ''}</div>
            <div className="enemy-emoji">{enemy.hp > 0 ? enemy.emoji : '💨'}</div>
            <div className="enemy-name">{enemy.name}</div>
            <div className="hp-bar">
              <div
                className="hp-bar-fill"
                style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
              />
              <span className="hp-bar-text">
                {enemy.hp}/{enemy.maxHp}
                {enemy.block > 0 ? ` 🛡️${enemy.block}` : ''}
              </span>
            </div>
            <StatusChips s={enemy.statuses} />
          </button>
        ))}
      </div>

      <div className="player-area">
        <div className="player-stats">
          <div className="hp-bar hp-bar-player">
            <div
              className="hp-bar-fill"
              style={{ width: `${Math.max(0, (p.hp / p.maxHp) * 100)}%` }}
            />
            <span className="hp-bar-text">
              ❤️ {p.hp}/{p.maxHp}
              {p.block > 0 ? ` 🛡️${p.block}` : ''}
            </span>
          </div>
          <StatusChips s={p.statuses} />
        </div>
        <div className="energy-orb">
          {p.energy}/{p.maxEnergy}
        </div>
      </div>

      {needsTarget && selectedCard && (
        <div className="target-banner">対象の敵をタップ</div>
      )}

      <div className="hand-area">
        {combat.hand.map((card) => (
          <CardView
            key={card.uid}
            card={card}
            selected={card.uid === selectedUid}
            disabled={!canPlay(card)}
            onClick={() => handleCardTap(card)}
          />
        ))}
        {combat.hand.length === 0 && <div className="hand-empty">手札なし</div>}
      </div>

      <footer className="combat-footer">
        <span className="pile-info">
          山札 {combat.drawPile.length} / 捨札 {combat.discardPile.length}
        </span>
        <button className="btn btn-primary" onClick={onEndTurn} disabled={finished}>
          ターン終了
        </button>
      </footer>

      {finished && (
        <div className="overlay">
          <div className="overlay-box">
            <h2>{combat.outcome === 'victory' ? '勝利!' : '倒れてしまった…'}</h2>
            <button className="btn btn-primary" onClick={onFinished}>
              {combat.outcome === 'victory' ? '報酬を見る' : '結果へ'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
