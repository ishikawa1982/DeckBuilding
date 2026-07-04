import { PixelBg } from '../gfx/PixelBg'
import { Sprite } from '../gfx/Sprite'
import { HERO_SPRITE, NODE_ICONS } from '../gfx/sprites'

interface Props {
  victory: boolean
  onBackToTitle: () => void
}

export function EndScreen({ victory, onBackToTitle }: Props) {
  return (
    <div className="screen end-screen">
      <PixelBg kind={victory ? 'title' : 'room'} />
      <Sprite sprite={victory ? HERO_SPRITE : NODE_ICONS.elite} scale={victory ? 8 : 9} animMs={600} />
      <h1 className={`end-title${victory ? '' : ' end-title-defeat'}`}>
        {victory ? '塔を制覇した!' : '冒険はここで終わった'}
      </h1>
      <p className="screen-sub">
        {victory
          ? '深淵の王は倒れ、塔に静寂が戻った。'
          : 'だが挑戦は何度でもできる。次はもっと強いデッキを組もう。'}
      </p>
      <button className="btn btn-primary" onClick={onBackToTitle}>
        タイトルへ
      </button>
    </div>
  )
}
