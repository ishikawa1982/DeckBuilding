// ドット絵スプライト定義。
// 文字列配列 = ピクセルマトリクス(1文字 = パレットのキー、'.' と ' ' は透明)

export interface SpriteDef {
  pal: Record<string, string>
  frames: string[][]
}

// 1ピクセル下にずらしたフレームを作る(上下ボブのアイドルアニメ用)
function bob(rows: string[]): string[] {
  const width = rows[0].length
  const blank = '.'.repeat(width)
  return [blank, ...rows.slice(0, rows.length - 1)]
}

const withBob = (pal: Record<string, string>, rows: string[]): SpriteDef => ({
  pal,
  frames: [rows, bob(rows)],
})

// ===== スライム =====
const slimePal = { G: '#1e5c2e', L: '#4fce6a', M: '#2f9e4b', W: '#c8ffd4', E: '#0a1f10', D: '#10331a' }
const slimeA = [
  '................',
  '....GGGGGGG.....',
  '...GLLLLLLMG....',
  '..GLWWLLLLLMG...',
  '.GLWWLLLLLLLMG..',
  '.GLWLLLLLLLLMG..',
  'GLLLLLLLLLLLLMG.',
  'GLLEELLLLEELLMG.',
  'GLLEELLLLEELLMG.',
  'GLLLLLLLLLLLLMG.',
  'GLLLLLDDLLLLLMG.',
  'GMLLLLLLLLLLMMG.',
  '.GMMLLLLLLMMMG..',
  '..GGMMMMMMMGG...',
]
// つぶれフレーム(ぷるぷる)
const slimeB = [
  '................',
  '................',
  '....GGGGGGG.....',
  '..GGLLLLLLMGG...',
  '.GLWWLLLLLLLMG..',
  'GLWWLLLLLLLLLMG.',
  'GLWLLLLLLLLLLMG.',
  'GLLEELLLLEELLMG.',
  'GLLEELLLLEELLMG.',
  'GLLLLLLLLLLLLMG.',
  'GLLLLLDDLLLLLMG.',
  'GMLLLLLLLLLLMMG.',
  'GMMLLLLLLLLMMMG.',
  '.GGMMMMMMMMMGG..',
]

// ===== カルト信者(鳥面の狂信者) =====
const cultistPal = {
  K: '#10141f', H: '#2a3454', W: '#e8e4f0', E: '#ff4a6a', Y: '#ffd166',
  R: '#3450a0', r: '#243870', F: '#e8b48a', D: '#ffd166',
}
const cultistA = [
  '....KKKKK.......',
  '...KHHHHHK......',
  '..KHHHHHHHK.....',
  '..KWWWWWWWK.....',
  '..KWEWWWEWK.....',
  '..KWWWWWWWKYY...',
  '...KWWWWYYYY....',
  '....KWWK........',
  '...KRRRRRK......',
  '..KRRRRRRRK.....',
  '.KRRRRRRRRRK....',
  '.KRFRRRRRFRK....',
  '.KRRRDDRRRRK....',
  '.KRRRDDRRRRK....',
  '.KRrRRRRRrRK....',
  '.KRrRRRRRrRK....',
  '.KRRRRRRRRRK....',
  '.KKKKKKKKKKK....',
]

// ===== 盗賊 =====
const banditPal = {
  K: '#0d0a14', H: '#3d3548', F: '#e8b48a', E: '#ffffff', P: '#241c30',
  S: '#c8ccd8', s: '#7a8090', B: '#8a2438', L: '#38302a',
}
const banditA = [
  '....KKKKKK......',
  '...KHHHHHHK.....',
  '...KHHHHHHK.....',
  '...KFFEFFEK.....',
  '....KFFFFK......',
  '....KKBBKK......',
  '...KBBBBBBK.SS..',
  '..KBBPBBPBBKsS..',
  '..KBPBBBBPBK.S..',
  '.KFKBBBBBBKS.S..',
  '.KFKBPBBPBKSSS..',
  '..KKBBBBBBK.....',
  '...KPPKKPP......',
  '...KPPK.KPP.....',
  '...KLLK.KLL.....',
  '..KLLLK.KLLK....',
  '..KKKK...KKKK...',
  '................',
]

// ===== 毒キノコ =====
const fungusPal = {
  K: '#1a0a20', C: '#b83a8a', c: '#8a2468', W: '#f0d8ff', S: '#e8dcc8',
  s: '#b8a890', E: '#3d1050', P: '#6bd490',
}
const fungusA = [
  '.....KKKKKK.....',
  '...KKCCCCCCKK...',
  '..KCCWWCCCCCK...',
  '.KCCWWCCCWWCCK..',
  '.KCCCCCCCWWCCK..',
  'KCCCCWWCCCCCCCK.',
  'KCcCCWWCCCCcCCK.',
  'KccccccccccccCK.',
  '.KKKKKKKKKKKKK..',
  '...KSSSSSSSK....',
  '...KSESSSES.....',
  '...KSSSSSSSK....',
  '...KSSPPSSSK....',
  '...KsSSSSSsK....',
  '...KssSSSssK....',
  '....KKKKKKK.....',
]

// ===== 森の精(トレント) =====
const treantPal = {
  K: '#0d1408', G: '#2f7e3b', g: '#1e5c2e', L: '#4fce6a', B: '#5c4a2e',
  b: '#3d3020', E: '#ffd166', D: '#241c10',
}
const treantA = [
  '....KGGGGGK.....',
  '..KGGLGGLGGGK...',
  '.KGLGGGGGGLGGK..',
  'KGGGGLGGGLGGGGK.',
  'KGLGGGGGGGGGLGK.',
  'KGGGGLGGGLGGGGK.',
  '.KGGGGGGGGGGGK..',
  '..KKGGGGGGGKK...',
  '...KBBBBBBBK....',
  '...KBEBBBEBK....',
  '...KBBBBBBBK....',
  '...KBBDDDBBK....',
  '..KBBBBBBBBK....',
  '.KBbKBBBBKbBK...',
  'KBbK.KBBK.KbBK..',
  'KbK..KBBK..KbK..',
  '.....KBBK.......',
  '....KBBBBK......',
  '...KbbKKbbK.....',
  '...KKK..KKK.....',
]

// ===== グレムリンの王(エリート) =====
const gremlinPal = {
  K: '#140a0a', R: '#c94a3a', r: '#8a2e24', F: '#e8735c', E: '#ffef9a',
  G: '#ffd166', g: '#b8802a', W: '#fff', L: '#5c4a38', l: '#38302a',
}
const gremlinA = [
  '..G.....G.....G.....',
  '..GG...GG....GG.....',
  '..KGGGGGGGGGGK......',
  '..KGgGGgGGgGGK......',
  '..KRRRRRRRRRRK......',
  '.KRRFRRRRRFRRRK.....',
  '.KRFEERRRREEFRK.....',
  '.KRFEERRRREEFRK.....',
  '.KRRRRRrrRRRRRK.....',
  '.KRRRWWWWWWRRRK.....',
  '..KRRWKWKWWRRK..LL..',
  '...KRRRRRRRRK..KLLK.',
  '..KRRRRRRRRRRK.KLLK.',
  '.KFRKRRRRRRKRFKLLK..',
  '.KFRKRrrrrRKRFKLLK..',
  '..KKKRRRRRRKKKKLK...',
  '....KRRKKRRK.KLLK...',
  '...KRRK..KRRKLLK....',
  '...KrrK..KrrK.......',
  '...KKKK..KKKK.......',
]

// ===== ストーンゴーレム(エリート) =====
const golemPal = {
  K: '#0d0d14', S: '#7a8090', s: '#5c6270', D: '#3d424e', E: '#4cc9f0',
  M: '#9aa2b0', C: '#2a2e38',
}
const golemA = [
  '....KKKKKKKKKK......',
  '...KSSSSSSSSSSK.....',
  '...KSMSSSSSSMSK.....',
  '...KSSEESSEESSK.....',
  '...KSSEESSEESSK.....',
  '...KsSSSSSSSSsK.....',
  '...KsSSKKKKSSsK.....',
  '..KKSSSSSSSSSSKK....',
  '.KSSSKSSSSSSKSSSK...',
  'KSSSSKSMSSMSKSSSSK..',
  'KSDSSKSSSSSSKSSDSK..',
  'KSSSSKSSssSSKSSSSK..',
  'KsSSsKSssssSKsSSsK..',
  '.KKKKKSSSSSSKKKKK...',
  '.....KSSKKSSK.......',
  '....KSSSKKSSSK......',
  '....KSDSKKSDSK......',
  '....KsSsKKsSsK......',
  '...KKKKKKKKKKKK.....',
]

// ===== 深淵の王(ボス) =====
const bossPal = {
  K: '#10060e', R: '#c92a55', r: '#8a1838', D: '#4a0c20', Y: '#ffd166',
  W: '#fff5d8', E: '#ffef9a', P: '#7a2ea0', p: '#4a1a68', F: '#e8735c',
}
const bossA = [
  '..K.................K...',
  '..KK...............KK...',
  '..KRK.....KKK.....KRK...',
  '..KRRK...KYYYK...KRRK...',
  '..KRRRKKKYYYYYKKKRRRK...',
  '..KRRRRRRYKYKYRRRRRRK...',
  '.KRRRRRRRRRRRRRRRRRRRK..',
  '.KRRREERRRRRRRRREERRRK..',
  '.KRRREERRRRRRRRREERRRK..',
  '.KRRRRRRRrrrrRRRRRRRRK..',
  '.KRRRRRWWWWWWWWRRRRRRK..',
  '..KRRRRWKWKWKWWRRRRRK...',
  '...KRRRRRRRRRRRRRRRK....',
  '..KPPRRRRRRRRRRRRPPK....',
  '.KPPPPRRRRRRRRRRPPPPK...',
  '.KPpPPRRRDDRRRRPPPpPK...',
  'KFPPPPKRRDDRRRKPPPPPFK..',
  'KFFKPPKRRRRRRRKPPKFFK...',
  '.KKKPPKRrrrrRRKPPKKK....',
  '....KKKRRRRRRRKKK.......',
  '.....KRRKKKKRRK.........',
  '....KRRK....KRRK........',
  '....KrrK....KrrK........',
  '....KKKK....KKKK........',
]

// ===== 主人公(騎士) =====
const heroPal = {
  K: '#10141f', S: '#9aa8c0', s: '#5c6a85', W: '#e8eef8', F: '#e8b48a',
  E: '#203050', B: '#3450a0', b: '#243870', G: '#ffd166', g: '#b8802a',
  L: '#38302a',
}
const heroIdle = [
  '.....KKKKK....W.',
  '....KSSSSSK..KWK',
  '....KSWWWSK..KWK',
  '....KsFFFsK..KWK',
  '....KFEFEFK..KWK',
  '.....KFFFK...KWK',
  '....KKBBBKK..KWK',
  '...KBBBBBBBK.KWK',
  '..KSKBBBBBKSKGGK',
  '..KSKBbBbBKSSGGK',
  '..KFKBBBBBK.KgK.',
  '..KFKBbBbBK.KgK.',
  '...KKBBBBBK..K..',
  '....KbbKbbK.....',
  '....Kbb.KbbK....',
  '....KLL.KLLK....',
  '...KLLK..KLLK...',
  '...KKK....KKK...',
]
// 攻撃ポーズ(剣を前方水平に)
const heroAttack = [
  '.....KKKKK......',
  '....KSSSSSK.....',
  '....KSWWWSK.....',
  '....KsFFFsK.....',
  '....KFEFEFK.....',
  '.....KFFFK......',
  '....KKBBBKK.....',
  '...KBBBBBBBK....',
  '..KSKBBBBBKSSKGGKWWWWWWW',
  '..KSKBbBbBKSSKGGKWWWWWWW',
  '..KFKBBBBBK..KgK........',
  '..KFKBbBbBK..K..........',
  '...KKBBBBBK.............',
  '....KbbKbbK.....',
  '....Kbb.KbbK....',
  '....KLL.KLLK....',
  '...KLLK..KLLK...',
  '...KKK....KKK...',
]

// ===== エフェクト =====
const slashPal = { W: '#ffffff', Y: '#ffef9a', O: '#ff9a4a' }
const slashA = [
  '..........W.',
  '.........WY.',
  '........WYY.',
  '.......WYO..',
  '......WYO...',
  '.....WYO....',
  '....WYO.....',
  '...WYO......',
  '..WYO.......',
  '.WYO........',
  'WYY.........',
  'WY..........',
]

// ===== アイコン =====
const swordPal = { S: '#d8e0f0', s: '#8a94b0', G: '#ffd166', g: '#8a5f1e', K: '#10141f' }
const swordIcon = [
  '..........SK',
  '.........SSK',
  '........SSK.',
  '.......SSK..',
  '......SSK...',
  '..K..SSK....',
  '..KGSSK.....',
  '...KGK......',
  '..GKKG......',
  '.GKK.K......',
  'KKK.........',
]
const bashPal = { S: '#d8d0c0', s: '#8a8070', K: '#10141f', L: '#5c4a38' }
const bashIcon = [
  '.....S......',
  '..S.KSK.S...',
  '...KSSSK....',
  '.SKSSsSSKS..',
  '..KSsssSK...',
  '.SKSSsSSKS..',
  '...KSSSK....',
  '..S.KSK.S...',
  '.....KL.....',
  '.....KL.....',
  '.....KL.....',
  '....KLLK....',
]
const shieldPal = { B: '#3f9fc9', b: '#1e5c78', W: '#c8ecff', K: '#0a2030', G: '#ffd166' }
const shieldIcon = [
  '.KKKKKKKKKK.',
  'KBWBBBBBBBBK',
  'KWBBBGGBBBbK',
  'KBBBBGGBBBbK',
  'KBBGGGGGGBbK',
  'KBBGGGGGGBbK',
  '.KBBBGGBBbK.',
  '.KBBBGGBBbK.',
  '..KBBBBBbK..',
  '...KBBBbK...',
  '....KBbK....',
  '.....KK.....',
]
const poisonPal = { P: '#8adf5c', p: '#4a9d2e', K: '#10240a', W: '#d8ffc0' }
const poisonIcon = [
  '.....KK.....',
  '....KPPK....',
  '....KPPK....',
  '...KPPPPK...',
  '..KPPWPPPK..',
  '.KPPWWPPPPK.',
  '.KPPWPPPPpK.',
  'KPPPPPPPPppK',
  'KPPPPPPPpppK',
  'KpPPPPPppppK',
  '.KppppppppK.',
  '..KKKKKKKK..',
]
const drawPal = { C: '#e8e4f5', c: '#9a92b8', K: '#241c40', B: '#4cc9f0' }
const drawIcon = [
  '..KKKKKK....',
  '..KCCCCK....',
  '..KCBBCKKK..',
  '..KCBBCCCK..',
  '..KCCCCBBK..',
  '.KKKKKCBBK..',
  '.KCCCCKCCK..',
  '.KCBBCKCCK..',
  '.KCBBCKKK...',
  '.KCCCCK.....',
  '.KCCCCK.....',
  '.KKKKKK.....',
]
const energyPal = { B: '#4cc9f0', b: '#1e5c78', W: '#d8f5ff', K: '#0a2030' }
const energyIcon = [
  '.....KK.....',
  '....KBWK....',
  '...KBWWK....',
  '..KBBWK.....',
  '.KBBBWKKK...',
  'KBBBBBBBBK..',
  '.KKKBBBBK...',
  '...KBBBK....',
  '...KBBK.....',
  '..KBBK......',
  '..KBK.......',
  '..KK........',
]
const powerPal = { Y: '#ffd166', y: '#b8802a', W: '#fff5d8', K: '#3d2408', R: '#ff6b4a' }
const powerIcon = [
  '.....KK.....',
  '....KYYK....',
  '...KYWWYK...',
  '..KYWWWWYK..',
  '.KYYWWWWYYK.',
  'KYYYYWWYYYYK',
  '.KYYYYYYYYK.',
  '..KYYYYYYK..',
  '..KYRYYRYK..',
  '...KYYYYK...',
  '....KYYK....',
  '.....KK.....',
]
const aoePal = { W: '#ffffff', Y: '#ffef9a', O: '#ff9a4a', R: '#e84a2a' }
const aoeIcon = [
  'W....Y....W.',
  '.Y...O...Y..',
  '..O..R..O...',
  '...YORO.....',
  '..YOROROY...',
  'YOR.RRR.ROY.',
  '..YOROROY...',
  '...YORO.....',
  '..O..R..O...',
  '.Y...O...Y..',
  'W....Y....W.',
  '............',
]
const healPal = { R: '#ff6b8a', r: '#c92a55', W: '#ffd8e0', K: '#4a0c20' }
const healIcon = [
  '..KK...KK...',
  '.KRRK.KRRK..',
  'KRWRRKRRRRK.',
  'KRWRRRRRRRK.',
  'KRRRRRRRRRK.',
  '.KRRRRRRRK..',
  '..KRRRRRK...',
  '...KRRRK....',
  '....KRK.....',
  '.....K......',
  '............',
  '............',
]

// ===== マップノードアイコン =====
const firePal = { O: '#ff9a4a', Y: '#ffd166', W: '#fff5d8', R: '#e84a2a', L: '#5c4a38' }
const fireIcon = [
  '....O.....',
  '....OO....',
  '...ROO....',
  '...ROYO...',
  '..ROYYO...',
  '..ROYWYO..',
  '.ROYWWYO..',
  '.ROYWWYYO.',
  '..OYYYYO..',
  '...OOOO...',
  '..LLLLLL..',
  '...LLLL...',
]
const skullPal = { W: '#e8e4f5', K: '#10141f', R: '#ff4a6a' }
const skullIcon = [
  '..KKKKKKK...',
  '.KWWWWWWWK..',
  'KWWWWWWWWWK.',
  'KWWWWWWWWWK.',
  'KWKKWWWKKWK.',
  'KWKRKWWKRKWK',
  'KWWWWKWWWWK.',
  '.KWWWWWWWK..',
  '.KWKWKWKWK..',
  '..KWKWKWK...',
  '..KKKKKKK...',
  '............',
]
const qPal = { P: '#c090ff', K: '#241c40' }
const qIcon = [
  '...PPPPP....',
  '..PPKKKPP...',
  '..PK...PP...',
  '.......PP...',
  '......PP....',
  '.....PP.....',
  '.....PP.....',
  '.....PP.....',
  '............',
  '.....PP.....',
  '.....PP.....',
  '............',
]
const bossFacePal = { R: '#c92a55', r: '#8a1838', Y: '#ffd166', K: '#10141f', W: '#fff' }
const bossFaceIcon = [
  '.K..........K.',
  '.KK........KK.',
  '.KRK..KK..KRK.',
  '.KRRKKRRKKRRK.',
  'KRRRRRRRRRRRRK',
  'KRYYKRRRRKYYRK',
  'KRYWKRRRRKWYRK',
  'KRRRRRRRRRRRRK',
  'KRRKWKWKWKKRRK',
  '.KRRKKKKKKRRK.',
  '..KRRRRRRRRK..',
  '...KKKKKKKK...',
]

// ===== レリック =====
const relicHeartPal = { R: '#ff4a6a', r: '#c92a55', O: '#ff9a4a', Y: '#ffd166', K: '#4a0c20' }
const relicHeart = [
  '.....Y......',
  '....YOY.....',
  '..KKYOYKK...',
  '.KRRKOKRRK..',
  'KRRRRKRRRRK.',
  'KRRRRRRRRRK.',
  'KRRRRRRRRRK.',
  '.KRRRRRRRK..',
  '..KRRRRRK...',
  '...KRRRK....',
  '....KRK.....',
  '.....K......',
]
const relicScalePal = { S: '#9aa8c0', s: '#5c6a85', W: '#d8e4f0', K: '#1a2030' }
const relicScale = [
  '.KKKKKKKKK..',
  'KSWSSSSSSSK.',
  'KWSKSKSKSsK.',
  'KSSSSSSSSsK.',
  'KSKSKSKSKsK.',
  'KSSSSSSSSsK.',
  'KSKSKSKSKsK.',
  'KSSSSSSSSsK.',
  '.KsSSSSSsK..',
  '..KsSSSsK...',
  '...KKKKK....',
  '............',
]
const relicBootPal = { B: '#8a5f2e', b: '#5c3c18', W: '#ffd166', K: '#241505' }
const relicBoot = [
  '...KKKK.....',
  '...KBBK.....',
  '...KBBK.....',
  '...KBBK..W..',
  '...KBBK.W...',
  '...KBBKW....',
  '...KBBBK....',
  '..KBBBBBKK..',
  '.KBBBBBBBBK.',
  '.KbbbbbbbbK.',
  '.KKKKKKKKKK.',
  '............',
]
const relicFangPal = { G: '#6bd490', g: '#2a9d5c', W: '#e8fff0', K: '#0a2414' }
const relicFang = [
  '.KK......KK.',
  'KGGK....KGGK',
  'KGGGK..KGGGK',
  '.KGGGKKGGGK.',
  '.KGWGGGGWGK.',
  '..KGWGGWGK..',
  '..KGGGGGGK..',
  '...KGGGGK...',
  '...KGGGGK...',
  '....KGGK....',
  '....KGGK....',
  '.....KK.....',
]
const relicFlagPal = { R: '#e84a2a', r: '#a12a12', Y: '#ffd166', L: '#5c4a38', K: '#241505' }
const relicFlag = [
  '.KL.........',
  '.KLKKKKKK...',
  '.KLRRRRRRK..',
  '.KLRYYYRRK..',
  '.KLRYRYRRK..',
  '.KLRYYYRRK..',
  '.KLRRRRRK...',
  '.KLRRRRK....',
  '.KLKKKK.....',
  '.KL.........',
  '.KL.........',
  '.KL.........',
]

export const ENEMY_SPRITES: Record<string, SpriteDef> = {
  slime: { pal: slimePal, frames: [slimeA, slimeB] },
  cultist: withBob(cultistPal, cultistA),
  bandit: withBob(banditPal, banditA),
  fungus: withBob(fungusPal, fungusA),
  treant: withBob(treantPal, treantA),
  'gremlin-lord': withBob(gremlinPal, gremlinA),
  'stone-golem': withBob(golemPal, golemA),
  'abyss-king': withBob(bossPal, bossA),
}

export const HERO_SPRITE: SpriteDef = withBob(heroPal, heroIdle)
export const HERO_ATTACK_SPRITE: SpriteDef = { pal: heroPal, frames: [heroAttack] }
export const SLASH_SPRITE: SpriteDef = { pal: slashPal, frames: [slashA] }

// カードID → アイコン。なければタイプ別デフォルト
const CARD_ICONS: Record<string, SpriteDef> = {
  strike: { pal: swordPal, frames: [swordIcon] },
  'twin-strike': { pal: swordPal, frames: [swordIcon] },
  'iron-wave': { pal: shieldPal, frames: [shieldIcon] },
  bash: { pal: bashPal, frames: [bashIcon] },
  bludgeon: { pal: bashPal, frames: [bashIcon] },
  clothesline: { pal: bashPal, frames: [bashIcon] },
  uppercut: { pal: bashPal, frames: [bashIcon] },
  defend: { pal: shieldPal, frames: [shieldIcon] },
  'shrug-it-off': { pal: shieldPal, frames: [shieldIcon] },
  impervious: { pal: shieldPal, frames: [shieldIcon] },
  'second-wind': { pal: shieldPal, frames: [shieldIcon] },
  'flame-barrier': { pal: aoePal, frames: [aoeIcon] },
  'poison-stab': { pal: poisonPal, frames: [poisonIcon] },
  'venom-cloud': { pal: poisonPal, frames: [poisonIcon] },
  'quick-draw': { pal: drawPal, frames: [drawIcon] },
  adrenaline: { pal: energyPal, frames: [energyIcon] },
  offering: { pal: healPal, frames: [healIcon] },
  cleave: { pal: aoePal, frames: [aoeIcon] },
  whirlwind: { pal: aoePal, frames: [aoeIcon] },
  'battle-cry': { pal: powerPal, frames: [powerIcon] },
  'demon-form': { pal: powerPal, frames: [powerIcon] },
  'shield-stance': { pal: powerPal, frames: [powerIcon] },
}
const DEFAULT_ICONS: Record<string, SpriteDef> = {
  attack: { pal: swordPal, frames: [swordIcon] },
  skill: { pal: shieldPal, frames: [shieldIcon] },
  power: { pal: powerPal, frames: [powerIcon] },
}
export function cardIcon(defId: string, type: string): SpriteDef {
  return CARD_ICONS[defId] ?? DEFAULT_ICONS[type] ?? DEFAULT_ICONS.attack
}

export const NODE_ICONS: Record<string, SpriteDef> = {
  battle: { pal: swordPal, frames: [swordIcon] },
  elite: { pal: skullPal, frames: [skullIcon] },
  rest: { pal: firePal, frames: [fireIcon] },
  event: { pal: qPal, frames: [qIcon] },
  boss: { pal: bossFacePal, frames: [bossFaceIcon] },
}

export const MISC_ICONS: Record<string, SpriteDef> = {
  sword: { pal: swordPal, frames: [swordIcon] },
  shield: { pal: shieldPal, frames: [shieldIcon] },
  fire: { pal: firePal, frames: [fireIcon] },
  heart: { pal: healPal, frames: [healIcon] },
  power: { pal: powerPal, frames: [powerIcon] },
}

// ===== イベント =====
const fountainPal = { B: '#4cc9f0', W: '#d8f5ff', S: '#7a8090', s: '#5c6270', K: '#10141f' }
const fountainIcon = [
  '....KBBK....',
  '...KBWWBK...',
  '..KBBWWBBK..',
  '....KBBK....',
  '..KKKBBKKK..',
  '.KBWBBBBWBK.',
  'KBBBBBBBBBBK',
  '.KKKKKKKKKK.',
  '..KSSSSSSK..',
  '..KsSSSSsK..',
  '.KSSSSSSSSK.',
  '.KKKKKKKKKK.',
]
const anvilPal = { S: '#9aa2b0', s: '#5c6270', K: '#10141f', O: '#ff9a4a' }
const anvilIcon = [
  '.....O......',
  '....O.O.....',
  '.KKKKKKKKK..',
  'KSSSSSSSSSK.',
  '.KKSSSSSKK..',
  '...KsSsK....',
  '...KsSsK....',
  '..KsSSSsK...',
  '.KSSSSSSSK..',
  '.KKKKKKKKK..',
  '............',
  '............',
]
const shrinePal = { S: '#8a92a8', s: '#5c6478', K: '#141824', M: '#2a3040' }
const shrineIcon = [
  '..KKKKKKKK..',
  '.KSSSSSSSSK.',
  '.KSMSSSSMSK.',
  '.KSSSSSSSSK.',
  '.KSSMMMMSSK.',
  '.KSSSSSSSSK.',
  '.KKsSSSSsKK.',
  '..KsSSSSsK..',
  '.KsSSSSSSsK.',
  '.KKKKKKKKKK.',
  '............',
  '............',
]
const chestPal = { B: '#8a5f2e', b: '#5c3c18', G: '#ffd166', K: '#241505' }
const chestIcon = [
  '.KKKKKKKKKK.',
  'KBBBBBBBBBBK',
  'KBbBBBBBBbBK',
  'KKKKKKKKKKKK',
  'KBBBBKGKBBBK',
  'KBbBBKGKBbBK',
  'KBBBBBBBBBBK',
  '.KKKKKKKKKK.',
  '............',
  '............',
  '............',
  '............',
]

export const EVENT_ICONS: Record<string, SpriteDef> = {
  spring: { pal: fountainPal, frames: [fountainIcon] },
  blacksmith: { pal: anvilPal, frames: [anvilIcon] },
  shrine: { pal: shrinePal, frames: [shrineIcon] },
  'cursed-chest': { pal: chestPal, frames: [chestIcon] },
}

export const RELIC_SPRITES: Record<string, SpriteDef> = {
  'burning-heart': { pal: relicHeartPal, frames: [relicHeart] },
  'iron-scale': { pal: relicScalePal, frames: [relicScale] },
  'swift-boots': { pal: relicBootPal, frames: [relicBoot] },
  'poison-fang': { pal: relicFangPal, frames: [relicFang] },
  'war-banner': { pal: relicFlagPal, frames: [relicFlag] },
}
