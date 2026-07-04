import { describe, it, expect } from 'vitest'
import { startCombat, playCard, endTurn, calcDamage, emptyStatuses, canPlayCard } from '../combat'
import { makeStarterDeck, getCardDef, rollRewardCards } from '../cards'
import { generateMap, selectableNodes, getNode } from '../map'
import { newRun } from '../run'
import { makeRand } from '../rng'

function setup(enemyIds: string[] = ['slime'], seed = 42) {
  const { deck } = makeStarterDeck(1)
  return startCombat(deck, 70, 70, enemyIds, [], seed)
}

describe('戦闘エンジン', () => {
  it('戦闘開始時に手札5枚・エネルギー3で始まる', () => {
    const c = setup()
    expect(c.hand).toHaveLength(5)
    expect(c.player.energy).toBe(3)
    expect(c.drawPile).toHaveLength(5)
    expect(c.enemies[0].hp).toBeGreaterThanOrEqual(28)
    expect(c.enemies[0].hp).toBeLessThanOrEqual(34)
  })

  it('ストライクで敵にダメージを与えエネルギーを消費する', () => {
    const c = setup()
    const strike = c.hand.find((h) => h.defId === 'strike')!
    const before = c.enemies[0].hp
    playCard(c, strike.uid, 0)
    expect(c.enemies[0].hp).toBe(before - 6)
    expect(c.player.energy).toBe(2)
    expect(c.discardPile).toHaveLength(1)
    expect(c.hand).toHaveLength(4)
  })

  it('エネルギー不足のカードはプレイできない', () => {
    const c = setup()
    c.player.energy = 0
    const strike = c.hand.find((h) => h.defId === 'strike')!
    expect(canPlayCard(c, strike)).toBe(false)
    playCard(c, strike.uid, 0)
    expect(c.enemies[0].hp).toBe(c.enemies[0].maxHp)
  })

  it('防御でブロックを得て、敵の攻撃を軽減する', () => {
    const c = setup()
    const defend = c.hand.find((h) => h.defId === 'defend')
    if (defend) {
      playCard(c, defend.uid)
      expect(c.player.block).toBe(5)
    }
  })

  it('脆弱を付与するとダメージが1.5倍になる', () => {
    const attacker = emptyStatuses()
    const defender = emptyStatuses()
    expect(calcDamage(10, attacker, defender)).toBe(10)
    defender.vulnerable = 2
    expect(calcDamage(10, attacker, defender)).toBe(15)
  })

  it('弱体はダメージを25%減らす', () => {
    const attacker = emptyStatuses()
    attacker.weak = 1
    expect(calcDamage(10, attacker, emptyStatuses())).toBe(7)
  })

  it('筋力はダメージに加算される', () => {
    const attacker = emptyStatuses()
    attacker.strength = 3
    expect(calcDamage(6, attacker, emptyStatuses())).toBe(9)
  })

  it('敵のHPが0になると勝利する', () => {
    const c = setup()
    c.enemies[0].hp = 5
    const strike = c.hand.find((h) => h.defId === 'strike')!
    playCard(c, strike.uid, 0)
    expect(c.outcome).toBe('victory')
  })

  it('ターン終了で敵が行動し、次ターンの手札が配られる', () => {
    const c = setup()
    const hpBefore = c.player.hp
    endTurn(c, [])
    expect(c.turn).toBe(2)
    expect(c.hand).toHaveLength(5)
    expect(c.player.energy).toBe(3)
    // スライムの初手は体当たり(8ダメージ)
    expect(c.player.hp).toBeLessThanOrEqual(hpBefore)
  })

  it('毒はターン終了時にダメージを与えて1減る', () => {
    const c = setup()
    c.enemies[0].statuses.poison = 3
    const hpBefore = c.enemies[0].hp
    endTurn(c, [])
    expect(c.enemies[0].hp).toBe(hpBefore - 3)
    expect(c.enemies[0].statuses.poison).toBe(2)
  })

  it('プレイヤーHPが0になると敗北する', () => {
    const c = setup(['abyss-king'])
    c.player.hp = 1
    // ボスが攻撃するまでターンを進める
    for (let i = 0; i < 10 && c.outcome === 'ongoing'; i++) {
      endTurn(c, [])
    }
    expect(c.outcome).toBe('defeat')
  })

  it('山札が尽きたら捨札がシャッフルされて山札になる', () => {
    const c = setup()
    endTurn(c, []) // 手札5枚捨て → 山札5枚から5枚引く
    endTurn(c, []) // 山札0 → 捨札をシャッフルして引く
    expect(c.hand).toHaveLength(5)
  })

  it('廃棄カードは捨札ではなく廃棄置き場に行く', () => {
    const { deck } = makeStarterDeck(1)
    deck.push({ uid: 99, defId: 'impervious', upgraded: false })
    const c = startCombat(deck, 70, 70, ['slime'], [], 7)
    // 廃棄カードを手札に強制的に置く
    c.hand = [{ uid: 99, defId: 'impervious', upgraded: false }]
    c.player.energy = 3
    playCard(c, 99)
    expect(c.exhaustPile).toHaveLength(1)
    expect(c.discardPile).toHaveLength(0)
    expect(c.player.block).toBe(30)
  })

  it('強化カードは効果が強くなる', () => {
    const base = getCardDef({ uid: 1, defId: 'strike', upgraded: false })
    const up = getCardDef({ uid: 1, defId: 'strike', upgraded: true })
    expect(base.effect.damage).toBe(6)
    expect(up.effect.damage).toBe(9)
    expect(up.name).toBe('ストライク+')
  })

  it('レリック: 燃える心臓で筋力+1、疾風のブーツで7枚ドロー', () => {
    const { deck } = makeStarterDeck(1)
    const c = startCombat(deck, 70, 70, ['slime'], ['burning-heart', 'swift-boots'], 3)
    expect(c.player.statuses.strength).toBe(1)
    expect(c.hand).toHaveLength(7)
  })
})

describe('マップ生成', () => {
  it('15行のマップが生成され、最終行はボスのみ', () => {
    const { map } = generateMap(123)
    expect(map.rows).toBe(15)
    const bossRow = map.nodes.filter((n) => n.row === 14)
    expect(bossRow).toHaveLength(1)
    expect(bossRow[0].type).toBe('boss')
  })

  it('ボス前の行はすべて休憩所', () => {
    const { map } = generateMap(123)
    const preBoss = map.nodes.filter((n) => n.row === 13)
    expect(preBoss.every((n) => n.type === 'rest')).toBe(true)
  })

  it('どのノードからでもボスまで到達できる', () => {
    for (const seed of [1, 42, 999, 31337]) {
      const { map } = generateMap(seed)
      // 各ノードの next が実在するか + 最終行以外は next を持つ
      for (const node of map.nodes) {
        if (node.row < map.rows - 1) {
          expect(node.next.length).toBeGreaterThan(0)
          for (const id of node.next) {
            expect(() => getNode(map, id)).not.toThrow()
          }
        }
      }
      // 全行のノードに入る辺があるか(0行目を除く)
      for (let row = 1; row < map.rows; row++) {
        for (const node of map.nodes.filter((n) => n.row === row)) {
          const hasIncoming = map.nodes.some((n) => n.next.includes(node.id))
          expect(hasIncoming).toBe(true)
        }
      }
    }
  })

  it('最初は0行目のノードだけ選択できる', () => {
    const run = newRun(55)
    const sel = selectableNodes(run.map, null)
    expect(sel.length).toBeGreaterThanOrEqual(2)
    expect(sel.every((n) => n.row === 0)).toBe(true)
  })
})

describe('報酬', () => {
  it('カード報酬は重複しない3枚', () => {
    const { rand } = makeRand(9)
    const cards = rollRewardCards(rand, 3, false)
    expect(cards).toHaveLength(3)
    expect(new Set(cards.map((c) => c.id)).size).toBe(3)
    expect(cards.every((c) => c.rarity !== 'starter')).toBe(true)
  })
})
