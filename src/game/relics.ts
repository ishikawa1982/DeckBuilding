import type { RelicDef, RelicId } from './types'

export const RELICS: Record<RelicId, RelicDef> = {
  'burning-heart': {
    id: 'burning-heart',
    name: '燃える心臓',
    emoji: '❤️‍🔥',
    description: '戦闘開始時、筋力を1得る。',
  },
  'iron-scale': {
    id: 'iron-scale',
    name: '鉄の鱗',
    emoji: '🛡️',
    description: '毎ターン開始時、3ブロックを得る。',
  },
  'swift-boots': {
    id: 'swift-boots',
    name: '疾風のブーツ',
    emoji: '👢',
    description: '戦闘開始時、カードを2枚追加で引く。',
  },
  'poison-fang': {
    id: 'poison-fang',
    name: '毒の牙',
    emoji: '🐍',
    description: '戦闘開始時、敵全体に毒を3付与する。',
  },
  'war-banner': {
    id: 'war-banner',
    name: '戦旗',
    emoji: '🚩',
    description: '最大HPが10増える(取得時に10回復)。',
  },
}

export function rollRelic(rand: () => number, owned: RelicId[]): RelicDef | null {
  const available = Object.values(RELICS).filter((r) => !owned.includes(r.id))
  if (available.length === 0) return null
  return available[Math.floor(rand() * available.length)]
}
