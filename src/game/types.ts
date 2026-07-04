// ゲーム全体で使う型定義

export type CardType = 'attack' | 'skill' | 'power'
export type CardRarity = 'starter' | 'common' | 'uncommon' | 'rare'
export type TargetKind = 'enemy' | 'self' | 'all-enemies'

export interface CardEffect {
  damage?: number
  hits?: number
  block?: number
  draw?: number
  gainEnergy?: number
  heal?: number
  // 敵に付与するステータス
  applyVulnerable?: number
  applyWeak?: number
  applyPoison?: number
  // 自分に付与するステータス
  gainStrength?: number
  gainDexterity?: number
  gainThorns?: number
  selfDamage?: number
  // 山札からのドロー以外の特殊処理
  exhaust?: boolean
  blockPerCardInHand?: number
  damagePerExhausted?: number
}

export interface CardDef {
  id: string
  name: string
  type: CardType
  rarity: CardRarity
  cost: number
  target: TargetKind
  description: string
  effect: CardEffect
  upgraded?: Partial<Pick<CardDef, 'cost' | 'description' | 'effect'>>
}

// デッキ内の1枚(同名カードを区別するためのインスタンス)
export interface CardInstance {
  uid: number
  defId: string
  upgraded: boolean
}

export interface StatusMap {
  strength: number
  dexterity: number
  vulnerable: number
  weak: number
  poison: number
  thorns: number
}

export interface Combatant {
  hp: number
  maxHp: number
  block: number
  statuses: StatusMap
}

export type IntentKind = 'attack' | 'defend' | 'buff' | 'debuff' | 'attack-defend'

export interface EnemyMove {
  id: string
  intent: IntentKind
  damage?: number
  hits?: number
  block?: number
  gainStrength?: number
  applyWeak?: number
  applyVulnerable?: number
  applyPoison?: number
  label: string
}

export interface EnemyDef {
  id: string
  name: string
  emoji: string
  minHp: number
  maxHp: number
  // 現在ターンと直前の行動IDから次の行動を決める
  ai: (turn: number, prevMoveId: string | null, rand: () => number) => EnemyMove
}

export interface EnemyState extends Combatant {
  defId: string
  name: string
  emoji: string
  nextMove: EnemyMove
  prevMoveId: string | null
  slot: number
}

export interface PlayerState extends Combatant {
  energy: number
  maxEnergy: number
}

export interface CombatState {
  player: PlayerState
  enemies: EnemyState[]
  hand: CardInstance[]
  drawPile: CardInstance[]
  discardPile: CardInstance[]
  exhaustPile: CardInstance[]
  turn: number
  log: string[]
  outcome: 'ongoing' | 'victory' | 'defeat'
  seedState: number
}

export type RelicId =
  | 'burning-heart'
  | 'iron-scale'
  | 'swift-boots'
  | 'poison-fang'
  | 'war-banner'

export interface RelicDef {
  id: RelicId
  name: string
  emoji: string
  description: string
}

export type NodeType = 'battle' | 'elite' | 'rest' | 'event' | 'boss'

export interface MapNode {
  id: string
  row: number
  col: number
  type: NodeType
  next: string[] // 次の行の接続先ノードID
}

export interface GameMap {
  nodes: MapNode[]
  rows: number
}

export type ScreenId =
  | 'title'
  | 'map'
  | 'combat'
  | 'reward'
  | 'rest'
  | 'event'
  | 'victory'
  | 'defeat'

export interface RunState {
  seed: number
  seedState: number
  map: GameMap
  currentNodeId: string | null // null = まだ最初のノードを選んでいない
  clearedRows: number // 次に選べる行
  deck: CardInstance[]
  relics: RelicId[]
  hp: number
  maxHp: number
  floor: number
  nextUid: number
}
