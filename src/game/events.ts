// マップ上の「?」ノードで発生するイベント

export interface EventChoice {
  label: string
  detail: string
  // 効果は App 側で解釈する簡易コマンド
  action:
    | { kind: 'heal'; amount: number }
    | { kind: 'maxhp'; amount: number; hpCost?: number }
    | { kind: 'damage'; amount: number }
    | { kind: 'upgrade-random' }
    | { kind: 'remove-card' }
    | { kind: 'nothing' }
}

export interface GameEvent {
  id: string
  title: string
  emoji: string
  text: string
  choices: EventChoice[]
}

export const EVENTS: GameEvent[] = [
  {
    id: 'spring',
    title: '癒しの泉',
    emoji: '⛲',
    text: '透き通った水をたたえた泉を見つけた。飲めば体力が回復しそうだが、何かが沈んでいるのも見える。',
    choices: [
      { label: '水を飲む', detail: 'HPを15回復する', action: { kind: 'heal', amount: 15 } },
      {
        label: '底をさらう',
        detail: 'HPを6失うが、最大HPが5増える',
        action: { kind: 'maxhp', amount: 5, hpCost: 6 },
      },
      { label: '立ち去る', detail: '何も起こらない', action: { kind: 'nothing' } },
    ],
  },
  {
    id: 'blacksmith',
    title: '流浪の鍛冶屋',
    emoji: '⚒️',
    text: '焚き火のそばで鍛冶屋が店を広げている。「一振り鍛えてやろうか?」',
    choices: [
      {
        label: '鍛えてもらう',
        detail: 'ランダムなカード1枚を強化する',
        action: { kind: 'upgrade-random' },
      },
      { label: '断る', detail: '何も起こらない', action: { kind: 'nothing' } },
    ],
  },
  {
    id: 'shrine',
    title: '忘却の祠',
    emoji: '🗿',
    text: '古びた祠に手をかざすと、記憶の一部が薄れていく感覚がする。不要な技を忘れられるかもしれない。',
    choices: [
      {
        label: '祈る',
        detail: 'デッキからカードを1枚除去する',
        action: { kind: 'remove-card' },
      },
      { label: '立ち去る', detail: '何も起こらない', action: { kind: 'nothing' } },
    ],
  },
  {
    id: 'cursed-chest',
    title: '呪われた宝箱',
    emoji: '🎁',
    text: '豪華な宝箱が置かれている。開けた者は代償を払うという言い伝えがあるが……。',
    choices: [
      {
        label: '開ける',
        detail: 'HPを10失うが、最大HPが8増える',
        action: { kind: 'maxhp', amount: 8, hpCost: 10 },
      },
      { label: '無視する', detail: '何も起こらない', action: { kind: 'nothing' } },
    ],
  },
]

export function pickEvent(rand: () => number): GameEvent {
  return EVENTS[Math.floor(rand() * EVENTS.length)]
}
