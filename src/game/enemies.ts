import type { EnemyDef, EnemyMove } from './types'

const move = (m: EnemyMove) => m

// ===== 通常敵 =====

const slime: EnemyDef = {
  id: 'slime',
  name: 'スライム',
  emoji: '🟢',
  minHp: 28,
  maxHp: 34,
  ai: (_turn, prev, rand) => {
    if (prev === 'tackle' && rand() < 0.6) {
      return move({ id: 'goo', intent: 'debuff', applyWeak: 1, label: '粘液を吐く' })
    }
    return move({ id: 'tackle', intent: 'attack', damage: 8, label: '体当たり' })
  },
}

const cultist: EnemyDef = {
  id: 'cultist',
  name: 'カルト信者',
  emoji: '🦅',
  minHp: 40,
  maxHp: 46,
  ai: (turn) => {
    if (turn === 1) {
      return move({ id: 'ritual', intent: 'buff', gainStrength: 3, label: '儀式(筋力+3)' })
    }
    return move({ id: 'dark-strike', intent: 'attack', damage: 6, label: '闇の一撃' })
  },
}

const bandit: EnemyDef = {
  id: 'bandit',
  name: '盗賊',
  emoji: '🗡️',
  minHp: 34,
  maxHp: 40,
  ai: (_turn, prev, rand) => {
    if (prev !== 'slash-combo' && rand() < 0.5) {
      return move({ id: 'slash-combo', intent: 'attack', damage: 5, hits: 2, label: '二段斬り' })
    }
    if (rand() < 0.3) {
      return move({ id: 'guard', intent: 'attack-defend', damage: 6, block: 6, label: '斬撃と防御' })
    }
    return move({ id: 'heavy-slash', intent: 'attack', damage: 10, label: '重い斬撃' })
  },
}

const fungus: EnemyDef = {
  id: 'fungus',
  name: '毒キノコ',
  emoji: '🍄',
  minHp: 26,
  maxHp: 32,
  ai: (_turn, prev, rand) => {
    if (prev !== 'spore' && rand() < 0.45) {
      return move({ id: 'spore', intent: 'debuff', applyVulnerable: 2, label: '胞子(脆弱2)' })
    }
    return move({ id: 'bite', intent: 'attack', damage: 7, label: '噛みつく' })
  },
}

const treant: EnemyDef = {
  id: 'treant',
  name: '森の精',
  emoji: '🌳',
  minHp: 50,
  maxHp: 58,
  ai: (turn, _prev, rand) => {
    if (turn % 3 === 0) {
      return move({ id: 'bark', intent: 'defend', block: 10, label: '樹皮硬化' })
    }
    if (rand() < 0.5) {
      return move({ id: 'branch', intent: 'attack', damage: 9, label: '枝の一撃' })
    }
    return move({ id: 'roots', intent: 'attack', damage: 6, applyWeak: 1, label: '絡む根(弱体1)' })
  },
}

// ===== エリート =====

const gremlinLord: EnemyDef = {
  id: 'gremlin-lord',
  name: 'グレムリンの王',
  emoji: '👺',
  minHp: 80,
  maxHp: 90,
  ai: (turn, _prev, rand) => {
    if (turn === 1) {
      return move({ id: 'warcry', intent: 'buff', gainStrength: 2, label: '鬨の声(筋力+2)' })
    }
    if (turn % 4 === 0) {
      return move({ id: 'rally', intent: 'buff', gainStrength: 2, label: '再結集(筋力+2)' })
    }
    if (rand() < 0.5) {
      return move({ id: 'flurry', intent: 'attack', damage: 5, hits: 3, label: '乱れ突き' })
    }
    return move({ id: 'crush', intent: 'attack', damage: 13, label: '粉砕' })
  },
}

const stoneGolem: EnemyDef = {
  id: 'stone-golem',
  name: 'ストーンゴーレム',
  emoji: '🗿',
  minHp: 90,
  maxHp: 100,
  ai: (turn) => {
    const cycle = (turn - 1) % 3
    if (cycle === 0) {
      return move({ id: 'harden', intent: 'defend', block: 15, label: '硬化' })
    }
    if (cycle === 1) {
      return move({ id: 'slam', intent: 'attack', damage: 16, label: '叩きつけ' })
    }
    return move({ id: 'quake', intent: 'attack', damage: 10, applyVulnerable: 1, label: '地震(脆弱1)' })
  },
}

// ===== ボス =====

const abyssKing: EnemyDef = {
  id: 'abyss-king',
  name: '深淵の王',
  emoji: '👹',
  minHp: 150,
  maxHp: 150,
  ai: (turn, prev, rand) => {
    if (turn === 1) {
      return move({ id: 'awaken', intent: 'buff', gainStrength: 3, label: '覚醒(筋力+3)' })
    }
    if (turn % 5 === 0) {
      return move({ id: 'dark-ritual', intent: 'buff', gainStrength: 3, label: '闇の儀式(筋力+3)' })
    }
    if (prev !== 'abyss-wave' && rand() < 0.35) {
      return move({ id: 'abyss-wave', intent: 'debuff', applyWeak: 2, applyVulnerable: 2, label: '深淵の波動' })
    }
    if (rand() < 0.5) {
      return move({ id: 'claw-storm', intent: 'attack', damage: 7, hits: 3, label: '爪の嵐' })
    }
    return move({ id: 'annihilate', intent: 'attack', damage: 18, label: '滅殺' })
  },
}

export const ENEMIES: Record<string, EnemyDef> = {
  slime,
  cultist,
  bandit,
  fungus,
  treant,
  'gremlin-lord': gremlinLord,
  'stone-golem': stoneGolem,
  'abyss-king': abyssKing,
}

// 階層に応じた通常戦闘の敵編成
export const NORMAL_ENCOUNTERS: string[][] = [
  ['slime'],
  ['fungus'],
  ['slime', 'slime'],
  ['cultist'],
  ['bandit'],
  ['fungus', 'slime'],
  ['treant'],
  ['bandit', 'fungus'],
  ['cultist', 'slime'],
  ['treant', 'fungus'],
]

export const ELITE_ENCOUNTERS: string[][] = [['gremlin-lord'], ['stone-golem']]

export const BOSS_ENCOUNTER: string[] = ['abyss-king']
