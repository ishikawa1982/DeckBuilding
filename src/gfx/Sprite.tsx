import { useEffect, useRef } from 'react'
import type { SpriteDef } from './sprites'

interface Props {
  sprite: SpriteDef
  scale?: number
  // アイドルアニメのフレーム切替間隔(ms)。0で静止
  animMs?: number
  className?: string
}

function drawFrame(canvas: HTMLCanvasElement, sprite: SpriteDef, frameIdx: number, scale: number) {
  const rows = sprite.frames[frameIdx % sprite.frames.length]
  const h = rows.length
  const w = Math.max(...rows.map((r) => r.length))
  canvas.width = w * scale
  canvas.height = h * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  for (let y = 0; y < h; y++) {
    const row = rows[y]
    for (let x = 0; x < row.length; x++) {
      const c = sprite.pal[row[x]]
      if (!c) continue
      ctx.fillStyle = c
      ctx.fillRect(x * scale, y * scale, scale, scale)
    }
  }
}

export function Sprite({ sprite, scale = 5, animMs = 600, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawFrame(canvas, sprite, 0, scale)
    if (animMs <= 0 || sprite.frames.length < 2) return
    let frame = 0
    const timer = setInterval(() => {
      frame = (frame + 1) % sprite.frames.length
      if (ref.current) drawFrame(ref.current, sprite, frame, scale)
    }, animMs)
    return () => clearInterval(timer)
  }, [sprite, scale, animMs])

  return <canvas ref={ref} className={className} style={{ imageRendering: 'pixelated' }} />
}
