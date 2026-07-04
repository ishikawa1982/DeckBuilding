import { useCallback, useEffect, useRef, useState } from 'react'
import type { CardInstance, CombatState, EnemyState, RelicId, StatusMap } from '../game/types'
import { getCardDef } from '../game/cards'
import { calcDamage } from '../game/combat'
import { RELICS } from '../game/relics'
import { PixelBg } from '../gfx/PixelBg'
import { Sprite } from '../gfx/Sprite'
import {
  ENEMY_SPRITES,
  HERO_SPRITE,
  HERO_ATTACK_SPRITE,
  SLASH_SPRITE,
  MISC_ICONS,
  NODE_ICONS,
  RELIC_SPRITES,
} from '../gfx/sprites'
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

interface Fx {
  id: number
  kind: 'dmg' | 'block' | 'heal'
  value: number
  target: 'player' | number // number = 敵slot
  slash?: boolean
}

function StatusChips({ s }: { s: StatusMap }) {
  const chips: string[] = []
  if (s.strength > 0) chips.push(`力+${s.strength}`)
  if (s.dexterity > 0) chips.push(`敏+${s.dexterity}`)
  if (s.vulnerable > 0) chips.push(`脆${s.vulnerable}`)
  if (s.weak > 0) chips.push(`弱${s.weak}`)
  if (s.poison > 0) chips.push(`毒${s.poison}`)
  if (s.thorns > 0) chips.push(`棘${s.thorns}`)
  return <div className="status-chips">{chips.join(' ')}</div>
}

function Intent({ enemy, playerStatuses }: { enemy: EnemyState; playerStatuses: StatusMap }) {
  const mv = enemy.nextMove
  if (mv.intent === 'attack' || mv.intent === 'attack-defend') {
    const dmg = calcDamage(mv.damage ?? 0, enemy.statuses, playerStatuses)
    return (
      <div className="enemy-intent">
        <Sprite sprite={MISC_ICONS.sword} scale={2} animMs={0} />
        <span>
          {dmg}
          {mv.hits && mv.hits > 1 ? `×${mv.hits}` : ''}
        </span>
        {mv.intent === 'attack-defend' && <Sprite sprite={MISC_ICONS.shield} scale={2} animMs={0} />}
      </div>
    )
  }
  if (mv.intent === 'defend') {
    return (
      <div className="enemy-intent">
        <Sprite sprite={MISC_ICONS.shield} scale={2} animMs={0} />
      </div>
    )
  }
  if (mv.intent === 'buff') {
    return (
      <div className="enemy-intent">
        <Sprite sprite={MISC_ICONS.power} scale={2} animMs={0} />
        <span>強化</span>
      </div>
    )
  }
  return (
    <div className="enemy-intent">
      <Sprite sprite={NODE_ICONS.event} scale={2} animMs={0} />
      <span>妨害</span>
    </div>
  )
}

function enemyScale(defId: string): number {
  const rows = ENEMY_SPRITES[defId]?.frames[0]
  if (!rows) return 6
  const w = Math.max(...rows.map((r) => r.length))
  return w <= 16 ? 6 : 5
}

let fxSeq = 1

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
  const [fx, setFx] = useState<Fx[]>([])
  const [enemyAnims, setEnemyAnims] = useState<Record<number, 'hit' | 'attacking'>>({})
  const [dyingSlots, setDyingSlots] = useState<Set<number>>(new Set())
  const [playerAnim, setPlayerAnim] = useState<'' | 'attacking' | 'hit'>('')
  const [shaking, setShaking] = useState(false)

  const prevRef = useRef<CombatState | null>(null)
  const lastActionRef = useRef<'card' | 'endturn' | null>(null)
  const timersRef = useRef<number[]>([])

  const later = useCallback((ms: number, f: () => void) => {
    timersRef.current.push(window.setTimeout(f, ms))
  }, [])

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach(clearTimeout)
  }, [])

  const addFx = useCallback(
    (items: Omit<Fx, 'id'>[]) => {
      const withIds = items.map((f) => ({ ...f, id: fxSeq++ }))
      setFx((cur) => [...cur, ...withIds])
      for (const f of withIds) {
        later(900, () => setFx((cur) => cur.filter((x) => x.id !== f.id)))
      }
    },
    [later],
  )

  // 状態の差分から演出を組み立てる(ゲームロジックには触れない)
  useEffect(() => {
    const prev = prevRef.current
    prevRef.current = combat
    if (!prev || prev === combat) return
    const action = lastActionRef.current
    const newFx: Omit<Fx, 'id'>[] = []
    const hits: number[] = []
    const dying: number[] = []

    for (const enemy of combat.enemies) {
      const before = prev.enemies.find((p) => p.slot === enemy.slot)
      if (!before) continue
      if (enemy.hp < before.hp) {
        newFx.push({ kind: 'dmg', value: before.hp - enemy.hp, target: enemy.slot, slash: action === 'card' })
        hits.push(enemy.slot)
      }
      if (enemy.hp <= 0 && before.hp > 0) dying.push(enemy.slot)
    }

    if (combat.player.hp < prev.player.hp) {
      newFx.push({ kind: 'dmg', value: prev.player.hp - combat.player.hp, target: 'player' })
      setPlayerAnim('hit')
      setShaking(true)
      later(360, () => setPlayerAnim(''))
      later(400, () => setShaking(false))
    } else if (combat.player.hp > prev.player.hp) {
      newFx.push({ kind: 'heal', value: combat.player.hp - prev.player.hp, target: 'player' })
    }
    if (action === 'card' && combat.player.block > prev.player.block) {
      newFx.push({ kind: 'block', value: combat.player.block - prev.player.block, target: 'player' })
    }

    if (newFx.length > 0) addFx(newFx)
    if (hits.length > 0) {
      setEnemyAnims((cur) => {
        const next = { ...cur }
        for (const slot of hits) next[slot] = 'hit'
        return next
      })
      later(340, () =>
        setEnemyAnims((cur) => {
          const next = { ...cur }
          for (const slot of hits) if (next[slot] === 'hit') delete next[slot]
          return next
        }),
      )
    }
    if (dying.length > 0) {
      setDyingSlots((cur) => new Set([...cur, ...dying]))
    }
    lastActionRef.current = null
  }, [combat, addFx, later])

  const p = combat.player
  const aliveEnemies = combat.enemies.filter((e) => e.hp > 0)
  const selectedCard = combat.hand.find((c) => c.uid === selectedUid) ?? null
  const selectedDef = selectedCard ? getCardDef(selectedCard) : null
  const needsTarget = selectedDef?.target === 'enemy' && aliveEnemies.length > 1

  const playWithFx = (uid: number, targetSlot?: number) => {
    const card = combat.hand.find((c) => c.uid === uid)
    if (card && getCardDef(card).type === 'attack') {
      setPlayerAnim('attacking')
      later(380, () => setPlayerAnim(''))
    }
    lastActionRef.current = 'card'
    onPlayCard(uid, targetSlot)
  }

  const handleCardTap = (card: CardInstance) => {
    if (!canPlay(card)) return
    const def = getCardDef(card)
    if (card.uid === selectedUid) {
      if (def.target === 'enemy') {
        if (aliveEnemies.length === 1) {
          setSelectedUid(null)
          playWithFx(card.uid, aliveEnemies[0].slot)
        }
      } else {
        setSelectedUid(null)
        playWithFx(card.uid)
      }
    } else {
      setSelectedUid(card.uid)
    }
  }

  const handleEnemyTap = (enemy: EnemyState) => {
    if (!selectedCard || !selectedDef) return
    if (selectedDef.target !== 'enemy') return
    setSelectedUid(null)
    playWithFx(selectedCard.uid, enemy.slot)
  }

  const handleEndTurn = () => {
    lastActionRef.current = 'endturn'
    // 攻撃意図の敵に突進モーション
    const attackers = aliveEnemies
      .filter((e) => e.nextMove.intent === 'attack' || e.nextMove.intent === 'attack-defend')
      .map((e) => e.slot)
    if (attackers.length > 0) {
      setEnemyAnims((cur) => {
        const next = { ...cur }
        for (const slot of attackers) next[slot] = 'attacking'
        return next
      })
      later(420, () =>
        setEnemyAnims((cur) => {
          const next = { ...cur }
          for (const slot of attackers) if (next[slot] === 'attacking') delete next[slot]
          return next
        }),
      )
    }
    onEndTurn()
  }

  const finished = combat.outcome !== 'ongoing'

  return (
    <div className="screen combat-screen">
      <PixelBg kind="combat" height={422} />
      <header className="hud">
        <span className="hud-floor">{floor + 1}F</span>
        <span className="hud-turn">ターン {combat.turn}</span>
        <span className="hud-relics">
          {relics.map((r) => (
            <span key={r} title={RELICS[r].name}>
              <Sprite sprite={RELIC_SPRITES[r]} scale={2} animMs={0} />
            </span>
          ))}
        </span>
      </header>

      <div className={`combat-main${shaking ? ' shake' : ''}`}>
        <div className="enemy-area">
          {combat.enemies.map((enemy) => {
            const anim = enemyAnims[enemy.slot]
            const dying = dyingSlots.has(enemy.slot)
            return (
              <button
                key={enemy.slot}
                className={[
                  'enemy',
                  enemy.hp <= 0 ? 'enemy-dead' : '',
                  dying ? 'enemy-dying' : '',
                  anim === 'hit' ? 'enemy-hit' : '',
                  anim === 'attacking' ? 'enemy-attacking' : '',
                  needsTarget && enemy.hp > 0 ? 'enemy-targetable' : '',
                  selectedDef?.target === 'enemy' && enemy.hp > 0 ? 'enemy-can-target' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleEnemyTap(enemy)}
                disabled={enemy.hp <= 0}
              >
                {enemy.hp > 0 ? (
                  <Intent enemy={enemy} playerStatuses={p.statuses} />
                ) : (
                  <div className="enemy-intent" style={{ visibility: 'hidden' }} />
                )}
                <div className="enemy-sprite">
                  <Sprite
                    sprite={ENEMY_SPRITES[enemy.defId]}
                    scale={enemyScale(enemy.defId)}
                    animMs={enemy.hp > 0 ? 550 : 0}
                  />
                </div>
                <div className="enemy-name">{enemy.name}</div>
                <div className="hp-bar">
                  <div
                    className="hp-bar-fill"
                    style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
                  />
                  <span className="hp-bar-text">
                    {enemy.hp}/{enemy.maxHp}
                    {enemy.block > 0 ? ` 盾${enemy.block}` : ''}
                  </span>
                </div>
                <StatusChips s={enemy.statuses} />
                {fx
                  .filter((f) => f.target === enemy.slot)
                  .map((f) => (
                    <span key={f.id}>
                      <span className={`dmg-pop${f.kind !== 'dmg' ? ` dmg-pop-${f.kind}` : ''}`}>
                        {f.kind === 'dmg' ? f.value : `+${f.value}`}
                      </span>
                      {f.slash && (
                        <span className="slash-fx">
                          <Sprite sprite={SLASH_SPRITE} scale={5} animMs={0} />
                        </span>
                      )}
                    </span>
                  ))}
              </button>
            )
          })}
        </div>

        {needsTarget && selectedCard && <div className="target-banner">▼ 対象の敵をタップ ▼</div>}

        <div className="player-area">
          <div
            className={`player-unit${playerAnim === 'attacking' ? ' player-attacking' : ''}${playerAnim === 'hit' ? ' player-hit' : ''}`}
          >
            <Sprite
              sprite={playerAnim === 'attacking' ? HERO_ATTACK_SPRITE : HERO_SPRITE}
              scale={6}
              animMs={playerAnim === 'attacking' ? 0 : 600}
            />
            <div className="hp-bar hp-bar-player">
              <div
                className="hp-bar-fill"
                style={{ width: `${Math.max(0, (p.hp / p.maxHp) * 100)}%` }}
              />
              <span className="hp-bar-text">
                ♥ {p.hp}/{p.maxHp}
                {p.block > 0 ? ` 盾${p.block}` : ''}
              </span>
            </div>
            <StatusChips s={p.statuses} />
            {fx
              .filter((f) => f.target === 'player')
              .map((f) => (
                <span
                  key={f.id}
                  className={`dmg-pop${f.kind !== 'dmg' ? ` dmg-pop-${f.kind}` : ''}`}
                >
                  {f.kind === 'dmg' ? f.value : `+${f.value}`}
                </span>
              ))}
          </div>
          <div className={`energy-orb${p.energy === 0 ? ' energy-empty' : ''}`}>
            {p.energy}/{p.maxEnergy}
          </div>
        </div>
      </div>

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
        <button className="btn btn-primary btn-small" onClick={handleEndTurn} disabled={finished}>
          ターン終了 ▶
        </button>
      </footer>

      {finished && (
        <div className="overlay">
          <div className="overlay-box">
            <h2 className="screen-title">
              {combat.outcome === 'victory' ? '勝利!' : '倒れてしまった…'}
            </h2>
            <button className="btn btn-primary" onClick={onFinished}>
              {combat.outcome === 'victory' ? '報酬を見る' : '結果へ'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
