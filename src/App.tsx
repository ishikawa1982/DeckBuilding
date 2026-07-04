import { useCallback, useEffect, useState } from 'react'
import type { CardInstance, CombatState, RunState, ScreenId, RelicId } from './game/types'
import type { CardDef } from './game/types'
import { newRun, pickEncounter, saveRun, loadRun, clearSave } from './game/run'
import { getNode } from './game/map'
import { startCombat, playCard, endTurn, canPlayCard } from './game/combat'
import { rollRewardCards, CARDS } from './game/cards'
import { rollRelic } from './game/relics'
import { makeRand } from './game/rng'
import { pickEvent, type GameEvent, type EventChoice } from './game/events'
import { audio } from './audio/engine'
import { music } from './audio/music'
import { TitleScreen } from './ui/TitleScreen'
import { MapScreen } from './ui/MapScreen'
import { CombatScreen } from './ui/CombatScreen'
import { RewardScreen } from './ui/RewardScreen'
import { RestScreen } from './ui/RestScreen'
import { EventScreen } from './ui/EventScreen'
import { EndScreen } from './ui/EndScreen'

interface RewardInfo {
  cards: CardDef[]
  relic: RelicId | null
  afterBoss: boolean
}

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('title')
  const [run, setRun] = useState<RunState | null>(null)
  const [combat, setCombat] = useState<CombatState | null>(null)
  const [reward, setReward] = useState<RewardInfo | null>(null)
  const [event, setEvent] = useState<GameEvent | null>(null)
  const [hasSave, setHasSave] = useState(false)

  useEffect(() => {
    setHasSave(loadRun() !== null)
  }, [])

  // 最初のタップ/クリックでAudioContextの自動再生制限を解除する
  useEffect(() => {
    const unlock = () => audio.unlock()
    window.addEventListener('pointerdown', unlock, { capture: true })
    return () => window.removeEventListener('pointerdown', unlock, { capture: true })
  }, [])

  // 画面に応じてBGMを切り替える(reward/victory/defeatは直前の曲の余韻に任せる)
  useEffect(() => {
    if (screen === 'title') music.play('title')
    else if (screen === 'map' || screen === 'rest' || screen === 'event') music.play('map')
    else if (screen === 'combat') music.play('combat')
  }, [screen])

  // マップ画面に戻るたびにセーブ
  useEffect(() => {
    if (run && screen === 'map') {
      saveRun(run, 'map')
      setHasSave(true)
    }
  }, [run, screen])

  const startNewRun = useCallback(() => {
    clearSave()
    const seed = Math.floor(Math.random() * 2 ** 31)
    setRun(newRun(seed))
    setScreen('map')
  }, [])

  const continueRun = useCallback(() => {
    const saved = loadRun()
    if (!saved) return
    setRun(saved.run)
    setScreen('map')
  }, [])

  // マップでノードを選択
  const selectNode = useCallback(
    (nodeId: string) => {
      if (!run) return
      const node = getNode(run.map, nodeId)
      const next: RunState = structuredClone(run)
      next.currentNodeId = nodeId
      next.floor = node.row

      if (node.type === 'battle' || node.type === 'elite' || node.type === 'boss') {
        const enemyIds = pickEncounter(next, node.type)
        const c = startCombat(next.deck, next.hp, next.maxHp, enemyIds, next.relics, next.seedState)
        next.seedState = c.seedState
        setCombat(c)
        setRun(next)
        setScreen('combat')
      } else if (node.type === 'rest') {
        setRun(next)
        setScreen('rest')
      } else {
        const { rand, getState } = makeRand(next.seedState)
        const ev = pickEvent(rand)
        next.seedState = getState()
        setEvent(ev)
        setRun(next)
        setScreen('event')
      }
    },
    [run],
  )

  // 戦闘中の操作
  const onPlayCard = useCallback(
    (uid: number, targetSlot?: number) => {
      if (!combat) return
      const next = structuredClone(combat)
      playCard(next, uid, targetSlot)
      setCombat(next)
    },
    [combat],
  )

  const onEndTurn = useCallback(() => {
    if (!combat || !run) return
    const next = structuredClone(combat)
    endTurn(next, run.relics)
    setCombat(next)
  }, [combat, run])

  // 戦闘終了処理
  const onCombatFinished = useCallback(() => {
    if (!combat || !run) return
    const node = run.currentNodeId ? getNode(run.map, run.currentNodeId) : null

    if (combat.outcome === 'defeat') {
      clearSave()
      setHasSave(false)
      setScreen('defeat')
      return
    }

    // 勝利: HPと乱数状態を反映して報酬へ
    const next: RunState = structuredClone(run)
    next.hp = combat.player.hp
    next.seedState = combat.seedState

    const isElite = node?.type === 'elite'
    const isBoss = node?.type === 'boss'
    const { rand, getState } = makeRand(next.seedState)
    const cards = rollRewardCards(rand, 3, isElite || isBoss)
    let relic: RelicId | null = null
    if (isElite) {
      const r = rollRelic(rand, next.relics)
      if (r) relic = r.id
    }
    next.seedState = getState()

    setRun(next)
    setCombat(null)
    setReward({ cards, relic, afterBoss: isBoss })
    setScreen('reward')
  }, [combat, run])

  // 報酬選択(card=null はスキップ)
  const onPickReward = useCallback(
    (card: CardDef | null) => {
      if (!run || !reward) return
      const next: RunState = structuredClone(run)
      if (card) {
        next.deck.push({ uid: next.nextUid++, defId: card.id, upgraded: false })
      }
      if (reward.relic) {
        next.relics.push(reward.relic)
        if (reward.relic === 'war-banner') {
          next.maxHp += 10
          next.hp = Math.min(next.maxHp, next.hp + 10)
        }
      }
      setReward(null)
      if (reward.afterBoss) {
        clearSave()
        setHasSave(false)
        setRun(next)
        setScreen('victory')
      } else {
        setRun(next)
        setScreen('map')
      }
    },
    [run, reward],
  )

  // 休憩所
  const onRest = useCallback(
    (choice: { kind: 'heal' } | { kind: 'upgrade'; uid: number }) => {
      if (!run) return
      const next: RunState = structuredClone(run)
      if (choice.kind === 'heal') {
        next.hp = Math.min(next.maxHp, next.hp + Math.floor(next.maxHp * 0.3))
      } else {
        const card = next.deck.find((c) => c.uid === choice.uid)
        if (card) card.upgraded = true
      }
      setRun(next)
      setScreen('map')
    },
    [run],
  )

  // イベント選択
  const onEventChoice = useCallback(
    (choice: EventChoice, cardUid?: number) => {
      if (!run) return
      const next: RunState = structuredClone(run)
      const a = choice.action
      if (a.kind === 'heal') {
        next.hp = Math.min(next.maxHp, next.hp + a.amount)
      } else if (a.kind === 'maxhp') {
        next.maxHp += a.amount
        next.hp = Math.max(1, next.hp - (a.hpCost ?? 0) + a.amount)
        next.hp = Math.min(next.maxHp, next.hp)
      } else if (a.kind === 'damage') {
        next.hp = Math.max(1, next.hp - a.amount)
      } else if (a.kind === 'upgrade-random') {
        const upgradable = next.deck.filter((c) => !c.upgraded && CARDS[c.defId].upgraded)
        if (upgradable.length > 0) {
          const { rand, getState } = makeRand(next.seedState)
          upgradable[Math.floor(rand() * upgradable.length)].upgraded = true
          next.seedState = getState()
        }
      } else if (a.kind === 'remove-card' && cardUid !== undefined) {
        next.deck = next.deck.filter((c) => c.uid !== cardUid)
      }
      setEvent(null)
      setRun(next)
      setScreen('map')
    },
    [run],
  )

  const backToTitle = useCallback(() => {
    setRun(null)
    setCombat(null)
    setReward(null)
    setEvent(null)
    setHasSave(loadRun() !== null)
    setScreen('title')
  }, [])

  const abandonRun = useCallback(() => {
    clearSave()
    setHasSave(false)
    backToTitle()
  }, [backToTitle])

  return (
    <div className="app">
      {screen === 'title' && (
        <TitleScreen hasSave={hasSave} onNewRun={startNewRun} onContinue={continueRun} />
      )}
      {screen === 'map' && run && (
        <MapScreen run={run} onSelectNode={selectNode} onAbandon={abandonRun} />
      )}
      {screen === 'combat' && run && combat && (
        <CombatScreen
          combat={combat}
          relics={run.relics}
          floor={run.floor}
          canPlay={(c: CardInstance) => canPlayCard(combat, c)}
          onPlayCard={onPlayCard}
          onEndTurn={onEndTurn}
          onFinished={onCombatFinished}
        />
      )}
      {screen === 'reward' && run && reward && (
        <RewardScreen cards={reward.cards} relic={reward.relic} onPick={onPickReward} />
      )}
      {screen === 'rest' && run && <RestScreen run={run} onChoose={onRest} />}
      {screen === 'event' && run && event && (
        <EventScreen event={event} run={run} onChoose={onEventChoice} />
      )}
      {screen === 'victory' && <EndScreen victory onBackToTitle={backToTitle} />}
      {screen === 'defeat' && <EndScreen victory={false} onBackToTitle={backToTitle} />}
    </div>
  )
}
