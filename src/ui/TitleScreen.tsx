interface Props {
  hasSave: boolean
  onNewRun: () => void
  onContinue: () => void
}

export function TitleScreen({ hasSave, onNewRun, onContinue }: Props) {
  return (
    <div className="screen title-screen">
      <div className="title-art">🗼</div>
      <h1 className="title-name">スパイアの残響</h1>
      <p className="title-sub">デッキ構築型ローグライク</p>
      <div className="title-buttons">
        <button className="btn btn-primary" onClick={onNewRun}>
          新しい冒険
        </button>
        {hasSave && (
          <button className="btn" onClick={onContinue}>
            続きから
          </button>
        )}
      </div>
      <p className="title-hint">カードを集め、塔の頂の「深淵の王」を倒せ</p>
    </div>
  )
}
