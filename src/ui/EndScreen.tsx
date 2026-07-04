interface Props {
  victory: boolean
  onBackToTitle: () => void
}

export function EndScreen({ victory, onBackToTitle }: Props) {
  return (
    <div className="screen end-screen">
      <div className="end-art">{victory ? '🏆' : '☠️'}</div>
      <h1 className="screen-title">{victory ? '塔を制覇した!' : '冒険はここで終わった'}</h1>
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
