import { useEffect, useRef } from 'react'
import { drawBg, type BgKind } from './backgrounds'

// 低解像度で描いた背景をCSSで引き伸ばすピクセル背景。
// 論理解像度は幅195px(390の1/2)を基準にする。
export function PixelBg({ kind, height = 422 }: { kind: BgKind; height?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current) drawBg(ref.current, kind)
  }, [kind, height])
  return (
    <canvas
      ref={ref}
      width={195}
      height={height}
      className="pixel-bg"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
