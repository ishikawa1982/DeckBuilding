import type { RunState } from './types'
import { makeStarterDeck } from './cards'
import { generateMap } from './map'
import { ELITE_ENCOUNTERS, NORMAL_ENCOUNTERS, BOSS_ENCOUNTER } from './enemies'
import { makeRand } from './rng'

export const PLAYER_MAX_HP = 70

export function newRun(seed: number): RunState {
  const { deck, nextUid } = makeStarterDeck(1)
  const { map, seedState } = generateMap(seed)
  return {
    seed,
    seedState,
    map,
    currentNodeId: null,
    clearedRows: 0,
    deck,
    relics: [],
    hp: PLAYER_MAX_HP,
    maxHp: PLAYER_MAX_HP,
    floor: 0,
    nextUid,
  }
}

// 行番号に応じて通常戦の敵編成を選ぶ(後半ほど強い編成)
export function pickEncounter(run: RunState, type: 'battle' | 'elite' | 'boss'): string[] {
  if (type === 'boss') return BOSS_ENCOUNTER
  const { rand, getState } = makeRand(run.seedState)
  let result: string[]
  if (type === 'elite') {
    result = ELITE_ENCOUNTERS[Math.floor(rand() * ELITE_ENCOUNTERS.length)]
  } else {
    const row = run.floor
    // 前半は編成リストの前半、後半は全体から抽選
    const cap = Math.min(
      NORMAL_ENCOUNTERS.length,
      Math.max(3, Math.ceil(((row + 1) / 10) * NORMAL_ENCOUNTERS.length)),
    )
    const lo = Math.max(0, cap - 5)
    result = NORMAL_ENCOUNTERS[lo + Math.floor(rand() * (cap - lo))]
  }
  run.seedState = getState()
  return result
}

// セーブ/ロード(スマホでの中断に対応)
const SAVE_KEY = 'spire-like-save-v1'

export function saveRun(run: RunState, screen: string, extra?: unknown): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ run, screen, extra }))
  } catch {
    // ストレージが使えない環境では保存しない
  }
}

export function loadRun(): { run: RunState; screen: string; extra?: unknown } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    // ignore
  }
}
