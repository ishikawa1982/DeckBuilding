// Web Audio API で波形を直接合成するサウンドエンジン。音源ファイルは使わない。

const MUTE_KEY = 'spire-like-audio-muted'

class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private sfxBus: GainNode | null = null
  private musicBus: GainNode | null = null
  private noiseBuffer: AudioBuffer | null = null
  private muted = false

  constructor() {
    try {
      this.muted = localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      this.muted = false
    }
  }

  private ensure(): AudioContext {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.muted ? 0 : 1
      this.master.connect(this.ctx.destination)
      this.sfxBus = this.ctx.createGain()
      this.sfxBus.gain.value = 0.5
      this.sfxBus.connect(this.master)
      this.musicBus = this.ctx.createGain()
      this.musicBus.gain.value = 0.3
      this.musicBus.connect(this.master)
    }
    return this.ctx
  }

  // ユーザー操作の中で呼び出し、ブラウザの自動再生制限を解除する
  unlock(): void {
    const ctx = this.ensure()
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  }

  isMuted(): boolean {
    return this.muted
  }

  setMuted(m: boolean): void {
    this.muted = m
    try {
      localStorage.setItem(MUTE_KEY, m ? '1' : '0')
    } catch {
      // ignore
    }
    if (this.master) this.master.gain.value = m ? 0 : 1
  }

  toggleMuted(): boolean {
    this.setMuted(!this.muted)
    return this.muted
  }

  get context(): AudioContext {
    return this.ensure()
  }

  get sfxOut(): GainNode {
    this.ensure()
    return this.sfxBus!
  }

  get musicOut(): GainNode {
    this.ensure()
    return this.musicBus!
  }

  private getNoiseBuffer(): AudioBuffer {
    const ctx = this.ensure()
    if (!this.noiseBuffer) {
      const len = ctx.sampleRate
      const buf = ctx.createBuffer(1, len, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
      this.noiseBuffer = buf
    }
    return this.noiseBuffer
  }

  // 単音のブリープ。ピッチスライドにも対応する
  tone(opts: {
    freq: number
    endFreq?: number
    wave?: OscillatorType
    duration: number // 秒
    gain?: number
    attack?: number
    release?: number
    delay?: number // 現在時刻からのオフセット(秒)
  }): void {
    const ctx = this.ensure()
    const t0 = ctx.currentTime + (opts.delay ?? 0)
    const osc = ctx.createOscillator()
    osc.type = opts.wave ?? 'square'
    osc.frequency.setValueAtTime(opts.freq, t0)
    if (opts.endFreq && opts.endFreq !== opts.freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.endFreq), t0 + opts.duration)
    }

    const gain = ctx.createGain()
    const peak = opts.gain ?? 0.3
    const attack = opts.attack ?? 0.005
    const release = opts.release ?? opts.duration * 0.6
    gain.gain.setValueAtTime(0, t0)
    gain.gain.linearRampToValueAtTime(peak, t0 + attack)
    gain.gain.setValueAtTime(peak, Math.max(t0 + attack, t0 + opts.duration - release))
    gain.gain.linearRampToValueAtTime(0.0001, t0 + opts.duration)

    osc.connect(gain)
    gain.connect(this.sfxOut)
    osc.start(t0)
    osc.stop(t0 + opts.duration + 0.02)
  }

  // ノイズバースト(打撃音・シューという音)
  noise(opts: {
    duration: number
    gain?: number
    filter?: BiquadFilterType
    filterFreq?: number
    delay?: number
  }): void {
    const ctx = this.ensure()
    const t0 = ctx.currentTime + (opts.delay ?? 0)
    const src = ctx.createBufferSource()
    src.buffer = this.getNoiseBuffer()
    src.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = opts.filter ?? 'lowpass'
    filter.frequency.value = opts.filterFreq ?? 1200

    const gain = ctx.createGain()
    const peak = opts.gain ?? 0.3
    gain.gain.setValueAtTime(peak, t0)
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + opts.duration)

    src.connect(filter)
    filter.connect(gain)
    gain.connect(this.sfxOut)
    src.start(t0)
    src.stop(t0 + opts.duration + 0.02)
  }
}

export const audio = new AudioEngine()
