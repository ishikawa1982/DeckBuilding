import { PixelBg } from '../gfx/PixelBg'
import { sfx } from '../audio/sfx'
import { SoundToggle } from './SoundToggle'

interface Props {
  hasSave: boolean
  onNewRun: () => void
  onContinue: () => void
}

export function TitleScreen({ hasSave, onNewRun, onContinue }: Props) {
  return (
    <div className="screen title-screen">
      <PixelBg kind="title" />
      <SoundToggle corner />
      <div className="title-content">
        <h1 className="title-name">スパイアの残響</h1>
        <p className="title-sub">- PIXEL ROGUELIKE -</p>
        <div className="title-buttons">
          <button
            className="btn btn-primary blink"
            onClick={() => {
              sfx.click()
              onNewRun()
            }}
          >
            ▶ 新しい冒険
          </button>
          {hasSave && (
            <button
              className="btn"
              onClick={() => {
                sfx.click()
                onContinue()
              }}
            >
              続きから
            </button>
          )}
        </div>
        <p className="title-hint">カードを集め、塔の頂の「深淵の王」を倒せ</p>
      </div>
    </div>
  )
}
