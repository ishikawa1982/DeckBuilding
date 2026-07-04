// ループ再生するチップチューンBGM。音源ファイルは使わず、音階を都度合成する。
import { audio } from './engine'

const NOTE_RE = /^([A-G])(#?)(-?\d+)$/

function noteToFreq(note: string): number {
  const m = NOTE_RE.exec(note)
  if (!m) return 440
  const [, letter, sharp, octaveStr] = m
  const semitoneMap: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
  const octave = parseInt(octaveStr, 10)
  const semitone = semitoneMap[letter] + (sharp ? 1 : 0)
  const midi = (octave + 1) * 12 + semitone
  return 440 * Math.pow(2, (midi - 69) / 12)
}

interface TrackNote {
  note: string // 'R' は休符
  steps: number
}

interface TrackLane {
  wave: OscillatorType
  gain: number
  notes: TrackNote[] // steps の合計が totalSteps と一致すること
}

interface Track {
  bpm: number
  stepsPerBeat: number
  totalSteps: number
  loop: boolean
  lanes: TrackLane[]
}

export type TrackId = 'title' | 'map' | 'combat' | 'victory' | 'defeat'

// すべて A minor(= C major)の調で統一し、ファンファーレへの転調でも違和感が出ないようにしている
const TRACKS: Record<TrackId, Track> = {
  title: {
    bpm: 84,
    stepsPerBeat: 2,
    totalSteps: 16,
    loop: true,
    lanes: [
      {
        wave: 'triangle',
        gain: 0.22,
        notes: [
          { note: 'A4', steps: 4 },
          { note: 'C5', steps: 2 },
          { note: 'B4', steps: 2 },
          { note: 'A4', steps: 4 },
          { note: 'G4', steps: 2 },
          { note: 'A4', steps: 2 },
        ],
      },
      {
        wave: 'square',
        gain: 0.13,
        notes: [
          { note: 'A2', steps: 8 },
          { note: 'E2', steps: 4 },
          { note: 'F2', steps: 4 },
        ],
      },
    ],
  },
  map: {
    bpm: 90,
    stepsPerBeat: 2,
    totalSteps: 16,
    loop: true,
    lanes: [
      {
        wave: 'triangle',
        gain: 0.2,
        notes: [
          { note: 'E4', steps: 4 },
          { note: 'R', steps: 2 },
          { note: 'D4', steps: 2 },
          { note: 'C4', steps: 4 },
          { note: 'R', steps: 2 },
          { note: 'A3', steps: 2 },
        ],
      },
      {
        wave: 'square',
        gain: 0.12,
        notes: [
          { note: 'A2', steps: 8 },
          { note: 'G2', steps: 8 },
        ],
      },
    ],
  },
  combat: {
    bpm: 140,
    stepsPerBeat: 2,
    totalSteps: 16,
    loop: true,
    lanes: [
      {
        wave: 'square',
        gain: 0.18,
        notes: [
          { note: 'A4', steps: 2 },
          { note: 'A4', steps: 2 },
          { note: 'C5', steps: 2 },
          { note: 'B4', steps: 2 },
          { note: 'A4', steps: 2 },
          { note: 'G4', steps: 2 },
          { note: 'A4', steps: 2 },
          { note: 'E4', steps: 2 },
        ],
      },
      {
        wave: 'square',
        gain: 0.2,
        notes: [
          { note: 'A2', steps: 1 },
          { note: 'A2', steps: 1 },
          { note: 'A2', steps: 1 },
          { note: 'A2', steps: 1 },
          { note: 'F2', steps: 1 },
          { note: 'F2', steps: 1 },
          { note: 'F2', steps: 1 },
          { note: 'F2', steps: 1 },
          { note: 'G2', steps: 1 },
          { note: 'G2', steps: 1 },
          { note: 'G2', steps: 1 },
          { note: 'G2', steps: 1 },
          { note: 'A2', steps: 1 },
          { note: 'A2', steps: 1 },
          { note: 'A2', steps: 1 },
          { note: 'A2', steps: 1 },
        ],
      },
    ],
  },
  victory: {
    bpm: 120,
    stepsPerBeat: 2,
    totalSteps: 10,
    loop: false,
    lanes: [
      {
        wave: 'square',
        gain: 0.26,
        notes: [
          { note: 'C5', steps: 2 },
          { note: 'E5', steps: 2 },
          { note: 'G5', steps: 2 },
          { note: 'C6', steps: 4 },
        ],
      },
      {
        wave: 'triangle',
        gain: 0.16,
        notes: [{ note: 'C4', steps: 10 }],
      },
    ],
  },
  defeat: {
    bpm: 70,
    stepsPerBeat: 2,
    totalSteps: 14,
    loop: false,
    lanes: [
      {
        wave: 'sawtooth',
        gain: 0.18,
        notes: [
          { note: 'A4', steps: 3 },
          { note: 'G4', steps: 3 },
          { note: 'F4', steps: 3 },
          { note: 'E4', steps: 5 },
        ],
      },
      {
        wave: 'square',
        gain: 0.13,
        notes: [
          { note: 'A2', steps: 7 },
          { note: 'E2', steps: 7 },
        ],
      },
    ],
  },
}

class MusicPlayer {
  private current: TrackId | null = null
  private fadeGain: GainNode | null = null
  private timer: number | null = null

  private getFade(): GainNode {
    if (!this.fadeGain) {
      this.fadeGain = audio.context.createGain()
      this.fadeGain.gain.value = 1
      this.fadeGain.connect(audio.musicOut)
    }
    return this.fadeGain
  }

  private scheduleNote(freq: number, wave: OscillatorType, gain: number, t0: number, dur: number): void {
    const ctx = audio.context
    const osc = ctx.createOscillator()
    osc.type = wave
    osc.frequency.value = freq
    const g = ctx.createGain()
    const attack = Math.min(0.02, dur * 0.2)
    const release = Math.min(0.08, dur * 0.4)
    g.gain.setValueAtTime(0, t0)
    g.gain.linearRampToValueAtTime(gain, t0 + attack)
    g.gain.setValueAtTime(gain, Math.max(t0 + attack, t0 + dur - release))
    g.gain.linearRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(g)
    g.connect(this.getFade())
    osc.start(t0)
    osc.stop(t0 + dur + 0.05)
  }

  private scheduleLoop(id: TrackId, track: Track, startAt: number): void {
    const secPerStep = 60 / track.bpm / track.stepsPerBeat
    const loopDuration = secPerStep * track.totalSteps

    for (const lane of track.lanes) {
      let pos = 0
      for (const n of lane.notes) {
        if (n.note !== 'R') {
          this.scheduleNote(noteToFreq(n.note), lane.wave, lane.gain, startAt + pos * secPerStep, n.steps * secPerStep)
        }
        pos += n.steps
      }
    }

    if (!track.loop) return
    const nextStart = startAt + loopDuration
    const ctx = audio.context
    const msUntilNext = Math.max(30, (nextStart - ctx.currentTime - 0.2) * 1000)
    this.timer = window.setTimeout(() => {
      if (this.current === id) this.scheduleLoop(id, track, nextStart)
    }, msUntilNext)
  }

  private start(id: TrackId): void {
    const ctx = audio.context
    const fade = this.getFade()
    const now = ctx.currentTime
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    // 直前の曲(あれば)を素早くフェードアウトしてから、新しい曲をフェードインする
    fade.gain.cancelScheduledValues(now)
    fade.gain.setValueAtTime(fade.gain.value, now)
    fade.gain.linearRampToValueAtTime(0, now + 0.2)
    this.current = id
    const track = TRACKS[id]
    const startAt = now + 0.25
    fade.gain.setValueAtTime(0, startAt)
    fade.gain.linearRampToValueAtTime(1, startAt + 0.3)
    this.scheduleLoop(id, track, startAt)
  }

  // ループBGMの切り替え。同じ曲がすでに流れていれば何もしない
  play(id: TrackId): void {
    if (this.current === id) return
    this.start(id)
  }

  // ワンショット曲(勝利/敗北)。同じ曲でも常に鳴らし直す
  playOnce(id: TrackId): void {
    this.current = null
    this.start(id)
  }
}

export const music = new MusicPlayer()
