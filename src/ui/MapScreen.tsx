import { useEffect, useMemo, useRef, useState } from 'react'
import type { RunState, MapNode, NodeType } from '../game/types'
import { selectableNodes } from '../game/map'
import { RELICS } from '../game/relics'
import { DeckOverlay } from './DeckOverlay'

const NODE_ICON: Record<NodeType, string> = {
  battle: '⚔️',
  elite: '💀',
  rest: '🔥',
  event: '❓',
  boss: '👹',
}

const NODE_LABEL: Record<NodeType, string> = {
  battle: '戦闘',
  elite: 'エリート',
  rest: '休憩',
  event: 'イベント',
  boss: 'ボス',
}

interface Props {
  run: RunState
  onSelectNode: (id: string) => void
  onAbandon: () => void
}

export function MapScreen({ run, onSelectNode, onAbandon }: Props) {
  const [showDeck, setShowDeck] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 現在地(下の方)が見えるよう、進行度に合わせてスクロール位置を調整する
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const progress = run.currentNodeId === null ? 0 : (run.floor + 1) / run.map.rows
    el.scrollTop = (el.scrollHeight - el.clientHeight) * (1 - progress)
  }, [run.currentNodeId, run.floor, run.map.rows])
  const selectable = useMemo(
    () => new Set(selectableNodes(run.map, run.currentNodeId).map((n) => n.id)),
    [run.map, run.currentNodeId],
  )

  // 行ごとにまとめる(下から上へ登る)
  const rows: MapNode[][] = useMemo(() => {
    const byRow: MapNode[][] = []
    for (let r = run.map.rows - 1; r >= 0; r--) {
      byRow.push(run.map.nodes.filter((n) => n.row === r))
    }
    return byRow
  }, [run.map])

  return (
    <div className="screen map-screen">
      <header className="hud">
        <span className="hud-hp">
          ❤️ {run.hp}/{run.maxHp}
        </span>
        <span className="hud-floor">{run.floor + 1}F</span>
        <span className="hud-relics">
          {run.relics.map((r) => (
            <span key={r} title={RELICS[r].name}>
              {RELICS[r].emoji}
            </span>
          ))}
        </span>
        <button className="btn btn-small" onClick={() => setShowDeck(true)}>
          🎴 {run.deck.length}
        </button>
      </header>

      <div className="map-scroll" ref={scrollRef}>
        <div className="map-grid">
          {rows.map((rowNodes, i) => {
            const rowIndex = run.map.rows - 1 - i
            return (
              <div className="map-row" key={rowIndex}>
                {[0, 1, 2].map((col) => {
                  const node = rowNodes.find((n) => n.col === col)
                  if (!node) return <div className="map-cell" key={col} />
                  const isCurrent = run.currentNodeId === node.id
                  const canSelect = selectable.has(node.id)
                  const currentRow =
                    run.currentNodeId === null ? -1 : parseInt(run.currentNodeId.split('-')[0], 10)
                  const passed = node.row <= currentRow
                  return (
                    <div className="map-cell" key={col}>
                      <button
                        className={[
                          'map-node',
                          `map-node-${node.type}`,
                          isCurrent ? 'map-node-current' : '',
                          canSelect ? 'map-node-selectable' : '',
                          passed && !isCurrent ? 'map-node-passed' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        disabled={!canSelect}
                        onClick={() => onSelectNode(node.id)}
                        aria-label={`${node.row + 1}階 ${NODE_LABEL[node.type]}`}
                      >
                        <span className="map-node-icon">{NODE_ICON[node.type]}</span>
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
        <span className="map-help">光っているマスをタップして進もう</span>
        <button className="btn btn-small btn-danger" onClick={onAbandon}>
          冒険を諦める
        </button>
      </footer>

      {showDeck && <DeckOverlay deck={run.deck} onClose={() => setShowDeck(false)} />}
    </div>
  )
}
