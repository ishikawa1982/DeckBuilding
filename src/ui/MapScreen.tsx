import { useEffect, useMemo, useRef, useState } from 'react'
import type { RunState, MapNode } from '../game/types'
import { selectableNodes } from '../game/map'
import { RELICS } from '../game/relics'
import { PixelBg } from '../gfx/PixelBg'
import { Sprite } from '../gfx/Sprite'
import { NODE_ICONS, RELIC_SPRITES } from '../gfx/sprites'
import { DeckOverlay } from './DeckOverlay'

interface Props {
  run: RunState
  onSelectNode: (id: string) => void
  onAbandon: () => void
}

// レイアウト定数(SVG接続線の座標計算に使う)
const ROW_H = 76
const ROW_GAP = 18
const PAD_TOP = 24
const PAD_BOTTOM = 28
// 3列の中心X(%)。map-row の space-around 配置と一致させる
const COL_X = ['16.67%', '50%', '83.33%']

export function MapScreen({ run, onSelectNode, onAbandon }: Props) {
  const [showDeck, setShowDeck] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const selectable = useMemo(
    () => new Set(selectableNodes(run.map, run.currentNodeId).map((n) => n.id)),
    [run.map, run.currentNodeId],
  )

  // 現在地が見えるよう、進行度に合わせてスクロール位置を調整する
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const progress = run.currentNodeId === null ? 0 : (run.floor + 1) / run.map.rows
    el.scrollTop = (el.scrollHeight - el.clientHeight) * (1 - progress)
  }, [run.currentNodeId, run.floor, run.map.rows])

  const rows: MapNode[][] = useMemo(() => {
    const byRow: MapNode[][] = []
    for (let r = run.map.rows - 1; r >= 0; r--) {
      byRow.push(run.map.nodes.filter((n) => n.row === r))
    }
    return byRow
  }, [run.map])

  const gridHeight = PAD_TOP + run.map.rows * ROW_H + (run.map.rows - 1) * ROW_GAP + PAD_BOTTOM
  const rowCenterY = (row: number) => {
    const displayIdx = run.map.rows - 1 - row
    return PAD_TOP + displayIdx * (ROW_H + ROW_GAP) + ROW_H / 2
  }

  const currentRow = run.currentNodeId === null ? -1 : parseInt(run.currentNodeId.split('-')[0], 10)

  return (
    <div className="screen map-screen">
      <PixelBg kind="map" height={720} />
      <header className="hud">
        <span className="hud-hp">
          ♥ {run.hp}/{run.maxHp}
        </span>
        <span className="hud-floor">{run.floor + 1}F</span>
        <span className="hud-relics">
          {run.relics.map((r) => (
            <span key={r} title={RELICS[r].name}>
              <Sprite sprite={RELIC_SPRITES[r]} scale={2} animMs={0} />
            </span>
          ))}
        </span>
        <button className="btn btn-small" onClick={() => setShowDeck(true)}>
          デッキ {run.deck.length}
        </button>
      </header>

      <div className="map-scroll" ref={scrollRef}>
        <div className="map-grid" style={{ minHeight: gridHeight }}>
          {/* ノード間の接続線 */}
          <svg className="map-lines" width="100%" height={gridHeight}>
            {run.map.nodes.map((node) =>
              node.next.map((nextId) => {
                const next = run.map.nodes.find((n) => n.id === nextId)
                if (!next) return null
                const active = node.id === run.currentNodeId && selectable.has(nextId)
                const passed = node.row < currentRow
                return (
                  <line
                    key={`${node.id}-${nextId}`}
                    x1={COL_X[node.col]}
                    y1={rowCenterY(node.row)}
                    x2={COL_X[next.col]}
                    y2={rowCenterY(next.row)}
                    stroke={active ? '#ffd166' : passed ? '#241c3a' : '#3d3260'}
                    strokeWidth={4}
                    strokeDasharray="6 6"
                  />
                )
              }),
            )}
          </svg>

          {rows.map((rowNodes, i) => {
            const rowIndex = run.map.rows - 1 - i
            return (
              <div className="map-row" key={rowIndex} style={{ height: ROW_H }}>
                {[0, 1, 2].map((col) => {
                  const node = rowNodes.find((n) => n.col === col)
                  if (!node) return <div className="map-cell" key={col} />
                  const isCurrent = run.currentNodeId === node.id
                  const canSelect = selectable.has(node.id)
                  const passed = node.row <= currentRow
                  return (
                    <div className="map-cell" key={col}>
                      <button
                        className={[
                          'map-node',
                          node.type === 'boss' ? 'map-node-boss' : '',
                          isCurrent ? 'map-node-current' : '',
                          canSelect ? 'map-node-selectable' : '',
                          passed && !isCurrent ? 'map-node-passed' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        disabled={!canSelect}
                        onClick={() => onSelectNode(node.id)}
                        aria-label={`${node.row + 1}階 ${node.type}`}
                      >
                        <Sprite
                          sprite={NODE_ICONS[node.type]}
                          scale={node.type === 'boss' ? 5 : 3}
                          animMs={0}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <footer className="map-footer">
        <span className="map-help">光るマスをタップして進もう</span>
        <button className="btn btn-small btn-danger" onClick={onAbandon}>
          冒険を諦める
        </button>
      </footer>

      {showDeck && <DeckOverlay deck={run.deck} onClose={() => setShowDeck(false)} />}
    </div>
  )
}
