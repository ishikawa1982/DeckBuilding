// mulberry32 ベースのシード付き乱数。状態を数値1つで持ち回れるようにする。

export function nextRandom(state: number): { value: number; state: number } {
  let t = (state + 0x6d2b79f5) | 0
  let r = Math.imul(t ^ (t >>> 15), 1 | t)
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
  const value = ((r ^ (r >>> 14)) >>> 0) / 4294967296
  return { value, state: t }
}

// 可変状態を内包した rand 関数を作る(戦闘中など連続して使う場面用)
export function makeRand(initialState: number): { rand: () => number; getState: () => number } {
  let state = initialState
  return {
    rand: () => {
      const r = nextRandom(state)
      state = r.state
      return r.value
    },
    getState: () => state,
  }
}

export function randInt(rand: () => number, min: number, max: number): number {
  return min + Math.floor(rand() * (max - min + 1))
}

export function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]
}
