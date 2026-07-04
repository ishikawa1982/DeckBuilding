// ピクセル背景をcanvasに描く関数群。低解像度で描いてCSSで拡大する。

function seededRand(seed: number): () => number {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

// タイトル: 星空・月・遠景の山・塔
export function drawTitleBg(cv: HTMLCanvasElement): void {
  const ctx = cv.getContext('2d')
  if (!ctx) return
  const W = cv.width
  const H = cv.height
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#05040c')
  grad.addColorStop(0.45, '#131028')
  grad.addColorStop(0.8, '#2a1c3d')
  grad.addColorStop(1, '#3d2447')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  const rnd = seededRand(7)
  ctx.fillStyle = '#ffffff'
  for (let i = 0; i < 90; i++) {
    const x = Math.floor(rnd() * W)
    const y = Math.floor(rnd() * H * 0.55)
    ctx.globalAlpha = 0.3 + rnd() * 0.7
    ctx.fillRect(x, y, 1, 1)
  }
  ctx.globalAlpha = 1

  // 月(ピクセル円)
  const mx = 34
  const my = 44
  const mr = 12
  for (let y = -mr; y <= mr; y++) {
    for (let x = -mr; x <= mr; x++) {
      const d = x * x + y * y
      if (d > mr * mr) continue
      ctx.fillStyle = d > (mr - 2) * (mr - 2) ? '#e8cf90' : '#fff5d8'
      ctx.fillRect(mx + x, my + y, 1, 1)
    }
  }
  ctx.fillStyle = '#e8cf90'
  ctx.fillRect(30, 42, 4, 4)
  ctx.fillRect(38, 48, 3, 3)
  ctx.fillRect(32, 51, 2, 2)

  // 遠景の山
  ctx.fillStyle = '#1a1430'
  for (let x = 0; x < W; x++) {
    const h = 40 + Math.floor(18 * Math.abs(Math.sin(x * 0.05)) + 10 * Math.abs(Math.sin(x * 0.02 + 2)))
    ctx.fillRect(x, H * 0.62 - h + 40, 1, h + 200)
  }

  // 塔
  const tx = Math.floor(W / 2) - 26
  const tw = 52
  ctx.fillStyle = '#241c40'
  ctx.fillRect(tx, 96, tw, H - 96)
  ctx.fillStyle = '#2c2450'
  ctx.fillRect(tx + 4, 96, 10, H - 96)
  ctx.fillStyle = '#1c1636'
  for (let y = 100; y < H; y += 10) {
    ctx.fillRect(tx, y, tw, 1)
    for (let x = tx + ((y / 10) % 2) * 6; x < tx + tw; x += 12) ctx.fillRect(x, y - 10, 1, 10)
  }
  ctx.fillStyle = '#2c2450'
  ctx.fillRect(tx - 6, 88, tw + 12, 10)
  ctx.fillStyle = '#362b58'
  for (let x = tx - 6; x < tx + tw + 6; x += 8) ctx.fillRect(x, 80, 5, 8)

  const win = (x: number, y: number, lit: boolean) => {
    ctx.fillStyle = lit ? '#ffd166' : '#0d0a18'
    ctx.fillRect(x, y, 6, 9)
    ctx.fillStyle = lit ? '#ff9a4a' : '#161226'
    ctx.fillRect(x + 1, y + 5, 4, 4)
    ctx.fillStyle = '#0d0a18'
    ctx.fillRect(x + 2, y, 1, 9)
  }
  win(tx + 10, 112, true)
  win(tx + 34, 112, false)
  win(tx + 22, 150, true)
  win(tx + 10, 190, false)
  win(tx + 34, 190, true)
  win(tx + 22, 235, true)
  win(tx + 10, 280, true)
  win(tx + 34, 280, false)

  ctx.fillStyle = '#ff4a6a'
  ctx.fillRect(tx + 24, 72, 4, 8)

  ctx.fillStyle = '#131028'
  ctx.fillRect(0, H - 60, W, 60)
  ctx.fillStyle = '#1c1636'
  for (let x = 0; x < W; x += 7) ctx.fillRect(x, H - 60 + (x % 3), 4, 2)
}

function drawTorch(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = '#5c4a38'
  ctx.fillRect(x, y + 6, 3, 8)
  ctx.fillStyle = '#e84a2a'
  ctx.fillRect(x - 1, y, 5, 6)
  ctx.fillStyle = '#ff9a4a'
  ctx.fillRect(x - 1, y + 1, 5, 5)
  ctx.fillStyle = '#ffd166'
  ctx.fillRect(x, y + 2, 3, 3)
  ctx.fillStyle = '#fff5d8'
  ctx.fillRect(x + 1, y + 3, 1, 1)
  ctx.globalAlpha = 0.12
  ctx.fillStyle = '#ffd166'
  ctx.fillRect(x - 7, y - 5, 17, 17)
  ctx.globalAlpha = 1
}

// マップ: 塔内部のレンガ壁と松明
export function drawMapBg(cv: HTMLCanvasElement): void {
  const ctx = cv.getContext('2d')
  if (!ctx) return
  const W = cv.width
  const H = cv.height
  ctx.fillStyle = '#151024'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#1a1430'
  for (let y = 0; y < H; y += 12) {
    for (let x = ((y / 12) % 2) * 10 - 10; x < W; x += 20) {
      ctx.fillRect(x + 1, y + 1, 18, 10)
    }
  }
  ctx.fillStyle = '#0f0b1c'
  for (let y = 0; y < H; y += 12) ctx.fillRect(0, y, W, 1)
  ctx.fillStyle = '#241c40'
  ctx.fillRect(0, 0, 10, H)
  ctx.fillRect(W - 10, 0, 10, H)
  ctx.fillStyle = '#2c2450'
  ctx.fillRect(10, 0, 2, H)
  ctx.fillRect(W - 12, 0, 2, H)
  for (let y = 40; y < H - 20; y += 110) {
    drawTorch(ctx, 17, y)
    drawTorch(ctx, W - 20, y)
  }
}

// 戦闘: ダンジョンの壁・アーチ窓・松明・石畳
export function drawCombatBg(cv: HTMLCanvasElement): void {
  const ctx = cv.getContext('2d')
  if (!ctx) return
  const W = cv.width
  const H = cv.height
  const bands = ['#0d0a1c', '#110d24', '#151030', '#1a1438']
  bands.forEach((c, i) => {
    ctx.fillStyle = c
    ctx.fillRect(0, i * H * 0.18, W, H)
  })
  ctx.fillStyle = '#1e1838'
  for (let y = 20; y < H * 0.55; y += 10) {
    for (let x = ((y / 10) % 2) * 8 - 8; x < W; x += 16) ctx.fillRect(x + 1, y + 1, 14, 8)
  }
  const arch = (x: number) => {
    ctx.fillStyle = '#0a0616'
    ctx.fillRect(x, 30, 18, 40)
    ctx.fillRect(x + 3, 24, 12, 6)
    ctx.fillStyle = '#2a1c50'
    ctx.fillRect(x + 2, 34, 2, 34)
    ctx.fillStyle = '#4a3d78'
    ctx.fillRect(x + 7, 28, 4, 42)
  }
  arch(Math.floor(W * 0.15))
  arch(Math.floor(W * 0.75))
  drawTorch(ctx, Math.floor(W * 0.06), 60)
  drawTorch(ctx, Math.floor(W * 0.91), 60)
  // 床
  ctx.fillStyle = '#241c38'
  ctx.fillRect(0, H * 0.56, W, H)
  ctx.fillStyle = '#2c2244'
  for (let y = Math.floor(H * 0.56); y < H; y += 14) {
    for (let x = ((Math.floor(y / 14) % 2) as number) * 12 - 12; x < W; x += 24) {
      ctx.fillRect(x + 1, y + 1, 22, 12)
    }
  }
  ctx.fillStyle = '#161028'
  for (let y = Math.floor(H * 0.56); y < H; y += 14) ctx.fillRect(0, y, W, 1)
  ctx.globalAlpha = 0.35
  ctx.fillStyle = '#000'
  ctx.fillRect(0, H * 0.56, W, 4)
  ctx.globalAlpha = 1
}

// 汎用: 暗いレンガ部屋(報酬・休憩・イベント画面用)
export function drawRoomBg(cv: HTMLCanvasElement): void {
  const ctx = cv.getContext('2d')
  if (!ctx) return
  const W = cv.width
  const H = cv.height
  ctx.fillStyle = '#120e20'
  ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = '#171230'
  for (let y = 0; y < H; y += 12) {
    for (let x = ((y / 12) % 2) * 10 - 10; x < W; x += 20) {
      ctx.fillRect(x + 1, y + 1, 18, 10)
    }
  }
  ctx.fillStyle = '#0d0a18'
  for (let y = 0; y < H; y += 12) ctx.fillRect(0, y, W, 1)
  // 中央を少し明るく(ビネット逆)
  ctx.globalAlpha = 0.08
  ctx.fillStyle = '#ffd166'
  ctx.fillRect(W * 0.2, H * 0.25, W * 0.6, H * 0.5)
  ctx.globalAlpha = 1
}

// Reactから使うためのフック的ヘルパー
export type BgKind = 'title' | 'map' | 'combat' | 'room'
export function drawBg(cv: HTMLCanvasElement, kind: BgKind): void {
  if (kind === 'title') drawTitleBg(cv)
  else if (kind === 'map') drawMapBg(cv)
  else if (kind === 'combat') drawCombatBg(cv)
  else drawRoomBg(cv)
}
