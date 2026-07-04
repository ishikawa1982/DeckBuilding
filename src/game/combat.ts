import type {
  CardInstance,
  CombatState,
  EnemyState,
  PlayerState,
  RelicId,
  StatusMap,
} from './types'
import { getCardDef } from './cards'
import { ENEMIES } from './enemies'
import { makeRand, randInt, shuffle } from './rng'

export const HAND_SIZE = 5
export const MAX_ENERGY = 3

export function emptyStatuses(): StatusMap {
  return { strength: 0, dexterity: 0, vulnerable: 0, weak: 0, poison: 0, thorns: 0 }
}

// 攻撃側の筋力・弱体、防御側の脆弱を加味した最終ダメージ
export function calcDamage(base: number, attacker: StatusMap, defender: StatusMap): number {
  let dmg = base + attacker.strength
  if (attacker.weak > 0) dmg = Math.floor(dmg * 0.75)
  if (defender.vulnerable > 0) dmg = Math.floor(dmg * 1.5)
  return Math.max(0, dmg)
}

// ブロックを考慮してダメージを適用。実際に減ったHPを返す
function dealDamage(target: { hp: number; block: number }, amount: number): number {
  const blocked = Math.min(target.block, amount)
  target.block -= blocked
  const hpLoss = Math.min(target.hp, amount - blocked)
  target.hp -= hpLoss
  return hpLoss
}

export function startCombat(
  deck: CardInstance[],
  hp: number,
  maxHp: number,
  enemyIds: string[],
  relics: RelicId[],
  seedState: number,
): CombatState {
  const { rand, getState } = makeRand(seedState)

  const enemies: EnemyState[] = enemyIds.map((id, i) => {
    const def = ENEMIES[id]
    const ehp = randInt(rand, def.minHp, def.maxHp)
    return {
      defId: id,
      name: def.name,
      emoji: def.emoji,
      hp: ehp,
      maxHp: ehp,
      block: 0,
      statuses: emptyStatuses(),
      nextMove: def.ai(1, null, rand),
      prevMoveId: null,
      slot: i,
    }
  })

  const player: PlayerState = {
    hp,
    maxHp,
    block: 0,
    energy: MAX_ENERGY,
    maxEnergy: MAX_ENERGY,
    statuses: emptyStatuses(),
  }

  const state: CombatState = {
    player,
    enemies,
    hand: [],
    drawPile: shuffle(deck, rand),
    discardPile: [],
    exhaustPile: [],
    turn: 1,
    log: [],
    outcome: 'ongoing',
    seedState: getState(),
  }

  // レリック効果(戦闘開始時)
  let extraDraw = 0
  for (const relic of relics) {
    if (relic === 'burning-heart') {
      player.statuses.strength += 1
      state.log.push('❤️‍🔥 燃える心臓: 筋力+1')
    }
    if (relic === 'swift-boots') extraDraw += 2
    if (relic === 'poison-fang') {
      for (const e of enemies) e.statuses.poison += 3
      state.log.push('🐍 毒の牙: 敵全体に毒3')
    }
    if (relic === 'iron-scale') {
      player.block += 3
    }
  }

  drawCards(state, HAND_SIZE + extraDraw)
  return state
}

export function drawCards(state: CombatState, count: number): void {
  const { rand, getState } = makeRand(state.seedState)
  for (let i = 0; i < count; i++) {
    if (state.drawPile.length === 0) {
      if (state.discardPile.length === 0) break
      state.drawPile = shuffle(state.discardPile, rand)
      state.discardPile = []
    }
    const card = state.drawPile.pop()
    if (card) state.hand.push(card)
  }
  state.seedState = getState()
}

// カードをプレイできるか
export function canPlayCard(state: CombatState, card: CardInstance): boolean {
  if (state.outcome !== 'ongoing') return false
  const def = getCardDef(card)
  return state.player.energy >= def.cost
}

// カードをプレイ。targetSlot は単体対象カードのみ使用
export function playCard(state: CombatState, cardUid: number, targetSlot?: number): void {
  const idx = state.hand.findIndex((c) => c.uid === cardUid)
  if (idx === -1) return
  const card = state.hand[idx]
  const def = getCardDef(card)
  if (state.player.energy < def.cost) return

  const p = state.player
  const e = def.effect

  // 対象の解決
  let targets: EnemyState[] = []
  if (def.target === 'enemy') {
    const t = state.enemies.find((en) => en.slot === targetSlot && en.hp > 0)
    if (!t) return
    targets = [t]
  } else if (def.target === 'all-enemies') {
    targets = state.enemies.filter((en) => en.hp > 0)
  }

  p.energy -= def.cost
  state.hand.splice(idx, 1)

  // 手札枚数参照はカードを手札から除いた後に行う
  if (e.blockPerCardInHand) {
    p.block += (e.blockPerCardInHand + p.statuses.dexterity) * state.hand.length
  }

  if (e.selfDamage) {
    p.hp = Math.max(1, p.hp - e.selfDamage)
  }
  if (e.block) p.block += e.block + p.statuses.dexterity
  if (e.gainEnergy) p.energy += e.gainEnergy
  if (e.gainStrength) p.statuses.strength += e.gainStrength
  if (e.gainDexterity) p.statuses.dexterity += e.gainDexterity
  if (e.gainThorns) p.statuses.thorns += e.gainThorns
  if (e.heal) p.hp = Math.min(p.maxHp, p.hp + e.heal)

  const hits = e.hits ?? 1
  for (const target of targets) {
    if (e.damage) {
      for (let h = 0; h < hits; h++) {
        if (target.hp <= 0) break
        const dmg = calcDamage(e.damage, p.statuses, target.statuses)
        dealDamage(target, dmg)
        state.log.push(`${def.name}: ${target.name}に${dmg}ダメージ`)
      }
    }
    if (e.applyVulnerable) target.statuses.vulnerable += e.applyVulnerable
    if (e.applyWeak) target.statuses.weak += e.applyWeak
    if (e.applyPoison) target.statuses.poison += e.applyPoison
  }

  if (e.draw) drawCards(state, e.draw)

  if (e.exhaust) {
    state.exhaustPile.push(card)
  } else {
    state.discardPile.push(card)
  }

  checkOutcome(state)
}

// ターン終了: 敵の行動 → 状態異常処理 → 次ターン開始
export function endTurn(state: CombatState, relics: RelicId[]): void {
  if (state.outcome !== 'ongoing') return
  const { rand, getState } = makeRand(state.seedState)
  const p = state.player

  // 手札を捨てる
  state.discardPile.push(...state.hand)
  state.hand = []

  // 敵の毒ダメージ(敵ターン開始前に処理)
  for (const enemy of state.enemies) {
    if (enemy.hp > 0 && enemy.statuses.poison > 0) {
      enemy.hp = Math.max(0, enemy.hp - enemy.statuses.poison)
      state.log.push(`☠️ ${enemy.name}は毒で${enemy.statuses.poison}ダメージ`)
      enemy.statuses.poison -= 1
    }
  }

  // 敵の行動
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue
    const mv = enemy.nextMove
    if (mv.damage) {
      const hits = mv.hits ?? 1
      for (let h = 0; h < hits; h++) {
        const dmg = calcDamage(mv.damage, enemy.statuses, p.statuses)
        const hpLoss = dealDamage(p, dmg)
        state.log.push(`${enemy.name}の${mv.label}: ${dmg}ダメージ${hpLoss < dmg ? '(一部ブロック)' : ''}`)
        // 棘ダメージ
        if (p.statuses.thorns > 0 && enemy.hp > 0) {
          enemy.hp = Math.max(0, enemy.hp - p.statuses.thorns)
          state.log.push(`🌵 反撃: ${enemy.name}に${p.statuses.thorns}ダメージ`)
        }
        if (p.hp <= 0) break
      }
    }
    if (mv.block) enemy.block += mv.block
    if (mv.gainStrength) enemy.statuses.strength += mv.gainStrength
    if (mv.applyWeak) p.statuses.weak += mv.applyWeak
    if (mv.applyVulnerable) p.statuses.vulnerable += mv.applyVulnerable
    if (mv.applyPoison) p.statuses.poison += mv.applyPoison
    if (p.hp <= 0) break
  }

  checkOutcome(state)
  if (state.outcome !== 'ongoing') {
    state.seedState = getState()
    return
  }

  // ステータス減衰(ターン数系)
  const decay = (s: StatusMap) => {
    if (s.vulnerable > 0) s.vulnerable -= 1
    if (s.weak > 0) s.weak -= 1
  }
  decay(p.statuses)
  for (const enemy of state.enemies) decay(enemy.statuses)
  p.statuses.thorns = 0

  // プレイヤーの毒
  if (p.statuses.poison > 0) {
    p.hp = Math.max(0, p.hp - p.statuses.poison)
    state.log.push(`☠️ 毒で${p.statuses.poison}ダメージ`)
    p.statuses.poison -= 1
  }

  // 次ターン開始
  state.turn += 1
  p.block = 0
  p.energy = p.maxEnergy
  for (const relic of relics) {
    if (relic === 'iron-scale') p.block += 3
  }
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue
    enemy.block = 0
    enemy.prevMoveId = enemy.nextMove.id
    enemy.nextMove = ENEMIES[enemy.defId].ai(state.turn, enemy.prevMoveId, rand)
  }

  state.seedState = getState()
  drawCards(state, HAND_SIZE)
  checkOutcome(state)
}

function checkOutcome(state: CombatState): void {
  if (state.player.hp <= 0) {
    state.outcome = 'defeat'
  } else if (state.enemies.every((e) => e.hp <= 0)) {
    state.outcome = 'victory'
  }
}
