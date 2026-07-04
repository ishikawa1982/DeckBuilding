// 効果音の定義。すべて audio.tone / audio.noise の組み合わせで合成する。
import { audio } from './engine'

export const sfx = {
  click: () => {
    audio.tone({ freq: 520, duration: 0.06, wave: 'square', gain: 0.22 })
  },
  cardSelect: () => {
    audio.tone({ freq: 700, duration: 0.05, wave: 'square', gain: 0.18 })
  },
  attack: () => {
    audio.noise({ duration: 0.08, filter: 'bandpass', filterFreq: 1800, gain: 0.35 })
    audio.tone({ freq: 180, endFreq: 90, duration: 0.12, wave: 'square', gain: 0.2, delay: 0.02 })
  },
  skill: () => {
    audio.tone({ freq: 700, duration: 0.08, wave: 'triangle', gain: 0.2 })
    audio.tone({ freq: 1000, duration: 0.1, wave: 'triangle', gain: 0.16, delay: 0.05 })
  },
  power: () => {
    ;[440, 554, 659, 880].forEach((f, i) =>
      audio.tone({ freq: f, duration: 0.12, wave: 'triangle', gain: 0.2, delay: i * 0.05 }),
    )
  },
  block: () => {
    audio.tone({ freq: 900, endFreq: 1200, duration: 0.1, wave: 'triangle', gain: 0.22 })
  },
  heal: () => {
    ;[660, 880, 1100].forEach((f, i) =>
      audio.tone({ freq: f, duration: 0.14, wave: 'sine', gain: 0.2, delay: i * 0.07 }),
    )
  },
  hit: () => {
    audio.noise({ duration: 0.15, filter: 'lowpass', filterFreq: 900, gain: 0.4 })
    audio.tone({ freq: 140, endFreq: 50, duration: 0.18, wave: 'square', gain: 0.28 })
  },
  playerHit: () => {
    audio.noise({ duration: 0.2, filter: 'lowpass', filterFreq: 600, gain: 0.4 })
    audio.tone({ freq: 110, endFreq: 40, duration: 0.22, wave: 'sawtooth', gain: 0.25 })
  },
  death: () => {
    ;[520, 440, 360, 280, 200].forEach((f, i) =>
      audio.tone({ freq: f, duration: 0.1, wave: 'square', gain: 0.2, delay: i * 0.06 }),
    )
  },
  turnEnd: () => {
    audio.tone({ freq: 300, endFreq: 700, duration: 0.2, wave: 'sawtooth', gain: 0.18 })
  },
  nodeSelect: () => {
    audio.tone({ freq: 440, duration: 0.08, wave: 'square', gain: 0.2 })
    audio.tone({ freq: 660, duration: 0.1, wave: 'square', gain: 0.16, delay: 0.05 })
  },
  upgrade: () => {
    ;[523, 659, 784, 1046].forEach((f, i) =>
      audio.tone({ freq: f, duration: 0.12, wave: 'triangle', gain: 0.2, delay: i * 0.06 }),
    )
  },
  relic: () => {
    ;[784, 988, 1175].forEach((f, i) =>
      audio.tone({ freq: f, duration: 0.18, wave: 'sine', gain: 0.22, delay: i * 0.09 }),
    )
  },
  remove: () => {
    audio.tone({ freq: 500, endFreq: 200, duration: 0.2, wave: 'sawtooth', gain: 0.18 })
  },
}
