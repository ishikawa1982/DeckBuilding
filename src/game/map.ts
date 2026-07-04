import type { GameMap, MapNode, NodeType } from './types'
import { makeRand } from './rng'

export const MAP_ROWS = 15

// Slay the Spire 風の分岐マップ(簡易版)。
// 3レーン×15行。各ノードは次の行の同レーンまたは隣接レーンに接続する。
export function generateMap(seedState: number): { map: GameMap; seedState: number } {
  const { rand, getState } = makeRand(seedState)
  const nodes: MapNode[] = []

  // 各行に存在する列を決める(最終行はボス1つ)
  const rowCols: number[][] = []
  for (let row = 0; row < MAP_ROWS; row++) {
    if (row === MAP_ROWS - 1) {
      rowCols.push([1])
      continue
    }
    const count = row === 0 ? 2 + Math.floor(rand() * 2) : 2 + Math.floor(rand() * 2)
    const cols: number[] = []
    const available = [0, 1, 2]
    for (let i = 0; i < count && available.length > 0; i++) {
      const idx = Math.floor(rand() * available.length)
      cols.push(available.splice(idx, 1)[0])
    }
    cols.sort((a, b) => a - b)
    rowCols.push(cols)
  }

  const typeForRow = (row: number, rand: () => number): NodeType => {
    if (row === MAP_ROWS - 1) return 'boss'
    if (row === MAP_ROWS - 2) return 'rest'
    if (row === 0) return 'battle'
    const r = rand()
    // 中盤以降にエリートと休憩を出す
    if (row >= 4 && r < 0.16) return 'elite'
    if (row >= 3 && r < 0.32) return 'rest'
    if (r < 0.5) return 'event'
    return 'battle'
  }

  for (let row = 0; row < MAP_ROWS; row++) {
    for (const col of rowCols[row]) {
      nodes.push({
        id: `${row}-${col}`,
        row,
        col,
        type: typeForRow(row, rand),
        next: [],
      })
    }
  }

  // 接続: 各ノードから次の行の「近い」ノードへ 1〜2 本
  for (let row = 0; row < MAP_ROWS - 1; row++) {
    const current = nodes.filter((n) => n.row === row)
    const nextRow = nodes.filter((n) => n.row === row + 1)
    for (const node of current) {
      const sorted = [...nextRow].sort(
        (a, b) => Math.abs(a.col - node.col) - Math.abs(b.col - node.col),
      )
      const linkCount = sorted.length > 1 && rand() < 0.4 ? 2 : 1
      for (let i = 0; i < linkCount; i++) {
        if (!node.next.includes(sorted[i].id)) node.next.push(sorted[i].id)
      }
    }
    // 次の行に入ってくる辺がないノードを救済
    for (const nn of nextRow) {
      if (!current.some((c) => c.next.includes(nn.id))) {
        const nearest = [...current].sort(
          (a, b) => Math.abs(a.col - nn.col) - Math.abs(b.col - nn.col),
        )[0]
        nearest.next.push(nn.id)
      }
    }
  }

  return { map: { nodes, rows: MAP_ROWS }, seedState: getState() }
}

export function getNode(map: GameMap, id: string): MapNode {
  const node = map.nodes.find((n) => n.id === id)
  if (!node) throw new Error(`node not found: ${id}`)
  return node
}

// 現在位置から次に選択できるノード
export function selectableNodes(map: GameMap, currentNodeId: string | null): MapNode[] {
  if (currentNodeId === null) {
    return map.nodes.filter((n) => n.row === 0)
  }
  const current = getNode(map, currentNodeId)
  return current.next.map((id) => getNode(map, id))
}
