import type { CardDef, CardInstance } from './types'

export const CARDS: Record<string, CardDef> = {
  // ===== 初期カード =====
  strike: {
    id: 'strike',
    name: 'ストライク',
    type: 'attack',
    rarity: 'starter',
    cost: 1,
    target: 'enemy',
    description: '6ダメージを与える。',
    effect: { damage: 6 },
    upgraded: { description: '9ダメージを与える。', effect: { damage: 9 } },
  },
  defend: {
    id: 'defend',
    name: '防御',
    type: 'skill',
    rarity: 'starter',
    cost: 1,
    target: 'self',
    description: '5ブロックを得る。',
    effect: { block: 5 },
    upgraded: { description: '8ブロックを得る。', effect: { block: 8 } },
  },
  bash: {
    id: 'bash',
    name: '強打',
    type: 'attack',
    rarity: 'starter',
    cost: 2,
    target: 'enemy',
    description: '8ダメージを与え、脆弱を2付与する。',
    effect: { damage: 8, applyVulnerable: 2 },
    upgraded: {
      description: '10ダメージを与え、脆弱を3付与する。',
      effect: { damage: 10, applyVulnerable: 3 },
    },
  },

  // ===== コモン =====
  'twin-strike': {
    id: 'twin-strike',
    name: '連撃',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '4ダメージを2回与える。',
    effect: { damage: 4, hits: 2 },
    upgraded: { description: '6ダメージを2回与える。', effect: { damage: 6, hits: 2 } },
  },
  cleave: {
    id: 'cleave',
    name: 'なぎ払い',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'all-enemies',
    description: '敵全体に8ダメージを与える。',
    effect: { damage: 8 },
    upgraded: { description: '敵全体に11ダメージを与える。', effect: { damage: 11 } },
  },
  'shrug-it-off': {
    id: 'shrug-it-off',
    name: '受け流し',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    target: 'self',
    description: '8ブロックを得て、カードを1枚引く。',
    effect: { block: 8, draw: 1 },
    upgraded: { description: '11ブロックを得て、カードを1枚引く。', effect: { block: 11, draw: 1 } },
  },
  'poison-stab': {
    id: 'poison-stab',
    name: '毒刃',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '5ダメージを与え、毒を3付与する。',
    effect: { damage: 5, applyPoison: 3 },
    upgraded: { description: '7ダメージを与え、毒を4付与する。', effect: { damage: 7, applyPoison: 4 } },
  },
  'quick-draw': {
    id: 'quick-draw',
    name: '早撃ち',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    target: 'self',
    description: 'カードを2枚引く。',
    effect: { draw: 2 },
    upgraded: { description: 'カードを3枚引く。', effect: { draw: 3 } },
  },
  'iron-wave': {
    id: 'iron-wave',
    name: 'アイアンウェーブ',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    target: 'enemy',
    description: '5ダメージを与え、5ブロックを得る。',
    effect: { damage: 5, block: 5 },
    upgraded: { description: '7ダメージを与え、7ブロックを得る。', effect: { damage: 7, block: 7 } },
  },
  clothesline: {
    id: 'clothesline',
    name: 'ラリアット',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    target: 'enemy',
    description: '12ダメージを与え、弱体を2付与する。',
    effect: { damage: 12, applyWeak: 2 },
    upgraded: { description: '14ダメージを与え、弱体を3付与する。', effect: { damage: 14, applyWeak: 3 } },
  },

  // ===== アンコモン =====
  uppercut: {
    id: 'uppercut',
    name: 'アッパーカット',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    target: 'enemy',
    description: '13ダメージを与え、弱体1・脆弱1を付与する。',
    effect: { damage: 13, applyWeak: 1, applyVulnerable: 1 },
    upgraded: {
      description: '13ダメージを与え、弱体2・脆弱2を付与する。',
      effect: { damage: 13, applyWeak: 2, applyVulnerable: 2 },
    },
  },
  'flame-barrier': {
    id: 'flame-barrier',
    name: '炎の障壁',
    type: 'skill',
    rarity: 'uncommon',
    cost: 2,
    target: 'self',
    description: '12ブロックを得る。このターン、攻撃してきた敵に4ダメージを返す。',
    effect: { block: 12, gainThorns: 4 },
    upgraded: {
      description: '16ブロックを得る。このターン、攻撃してきた敵に6ダメージを返す。',
      effect: { block: 16, gainThorns: 6 },
    },
  },
  'venom-cloud': {
    id: 'venom-cloud',
    name: '毒霧',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    target: 'all-enemies',
    description: '敵全体に毒を4付与する。廃棄。',
    effect: { applyPoison: 4, exhaust: true },
    upgraded: { description: '敵全体に毒を6付与する。廃棄。', effect: { applyPoison: 6, exhaust: true } },
  },
  'battle-cry': {
    id: 'battle-cry',
    name: '雄叫び',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '筋力を2得る。',
    effect: { gainStrength: 2 },
    upgraded: { description: '筋力を3得る。', effect: { gainStrength: 3 } },
  },
  'shield-stance': {
    id: 'shield-stance',
    name: '盾の構え',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '敏捷を2得る(ブロック獲得量+2)。',
    effect: { gainDexterity: 2 },
    upgraded: { description: '敏捷を3得る(ブロック獲得量+3)。', effect: { gainDexterity: 3 } },
  },
  'second-wind': {
    id: 'second-wind',
    name: 'セカンドウィンド',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    target: 'self',
    description: '手札1枚につき3ブロックを得る(このカードを除く)。',
    effect: { blockPerCardInHand: 3 },
    upgraded: {
      description: '手札1枚につき4ブロックを得る(このカードを除く)。',
      effect: { blockPerCardInHand: 4 },
    },
  },
  adrenaline: {
    id: 'adrenaline',
    name: 'アドレナリン',
    type: 'skill',
    rarity: 'uncommon',
    cost: 0,
    target: 'self',
    description: 'エネルギーを1得て、カードを1枚引く。廃棄。',
    effect: { gainEnergy: 1, draw: 1, exhaust: true },
    upgraded: {
      description: 'エネルギーを2得て、カードを1枚引く。廃棄。',
      effect: { gainEnergy: 2, draw: 1, exhaust: true },
    },
  },

  // ===== レア =====
  bludgeon: {
    id: 'bludgeon',
    name: '大殴打',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    target: 'enemy',
    description: '32ダメージを与える。',
    effect: { damage: 32 },
    upgraded: { description: '42ダメージを与える。', effect: { damage: 42 } },
  },
  offering: {
    id: 'offering',
    name: '供物',
    type: 'skill',
    rarity: 'rare',
    cost: 0,
    target: 'self',
    description: 'HPを6失う。エネルギーを2得て、カードを3枚引く。廃棄。',
    effect: { selfDamage: 6, gainEnergy: 2, draw: 3, exhaust: true },
    upgraded: {
      description: 'HPを6失う。エネルギーを2得て、カードを5枚引く。廃棄。',
      effect: { selfDamage: 6, gainEnergy: 2, draw: 5, exhaust: true },
    },
  },
  'demon-form': {
    id: 'demon-form',
    name: '悪魔化',
    type: 'power',
    rarity: 'rare',
    cost: 3,
    target: 'self',
    description: '筋力を4得る。',
    effect: { gainStrength: 4 },
    upgraded: { description: '筋力を5得る。', effect: { gainStrength: 5 } },
  },
  whirlwind: {
    id: 'whirlwind',
    name: '旋風刃',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    target: 'all-enemies',
    description: '敵全体に7ダメージを2回与える。',
    effect: { damage: 7, hits: 2 },
    upgraded: { description: '敵全体に9ダメージを2回与える。', effect: { damage: 9, hits: 2 } },
  },
  impervious: {
    id: 'impervious',
    name: '鉄壁',
    type: 'skill',
    rarity: 'rare',
    cost: 2,
    target: 'self',
    description: '30ブロックを得る。廃棄。',
    effect: { block: 30, exhaust: true },
    upgraded: { description: '40ブロックを得る。廃棄。', effect: { block: 40, exhaust: true } },
  },
}

export function getCardDef(inst: CardInstance): CardDef {
  const base = CARDS[inst.defId]
  if (!inst.upgraded || !base.upgraded) return base
  return { ...base, ...base.upgraded, name: base.name + '+' }
}

export function cardPool(rarity: 'common' | 'uncommon' | 'rare'): CardDef[] {
  return Object.values(CARDS).filter((c) => c.rarity === rarity)
}

// レアリティ抽選: コモン60% / アンコモン32% / レア8%(エリート後はレア率アップ)
export function rollRewardCards(
  rand: () => number,
  count: number,
  elite: boolean,
): CardDef[] {
  const result: CardDef[] = []
  const used = new Set<string>()
  let guard = 0
  while (result.length < count && guard < 100) {
    guard++
    const r = rand()
    const rareChance = elite ? 0.2 : 0.08
    const uncommonChance = elite ? 0.45 : 0.32
    const rarity = r < rareChance ? 'rare' : r < rareChance + uncommonChance ? 'uncommon' : 'common'
    const pool = cardPool(rarity)
    const card = pool[Math.floor(rand() * pool.length)]
    if (!used.has(card.id)) {
      used.add(card.id)
      result.push(card)
    }
  }
  return result
}

export function makeStarterDeck(startUid: number): { deck: CardInstance[]; nextUid: number } {
  const deck: CardInstance[] = []
  let uid = startUid
  for (let i = 0; i < 5; i++) deck.push({ uid: uid++, defId: 'strike', upgraded: false })
  for (let i = 0; i < 4; i++) deck.push({ uid: uid++, defId: 'defend', upgraded: false })
  deck.push({ uid: uid++, defId: 'bash', upgraded: false })
  return { deck, nextUid: uid }
}
