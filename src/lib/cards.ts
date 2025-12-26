// src/lib/cards.ts
import type { Card } from '@/store/gameStore'

export const cards: Card[] = [
  {
    id: 1,
    name: 'Кринжовые истории на балконе',
    type: 'cringe_story',
    isStory: true,
    effect: (game) => {
      game.opponent.cring += 8
      game.me.mental = Math.min(150, game.me.mental + 6)
    },
  },
  {
    id: 2,
    name: 'Пакет Изабеллы (активная)',
    type: 'active',
    onPlay: (game) => {
      game.me.mental = Math.min(150, game.me.mental + 4)
    },
    onTurnStart: (game) => {
      game.opponent.cring += 1
    },
  },
  {
    id: 3,
    name: 'Чей-то друг (активная)',
    type: 'active',
    onTurnStart: (game) => {
      game.me.mental = Math.min(150, game.me.mental + 2)
    },
  },
  {
    id: 4,
    name: 'Зашиперили',
    type: 'normal',
    effect: (game) => {
      let dmg = 12
      if (game.opponent.field.some(c => c.id === 3)) dmg += 8
      game.opponent.cring += dmg
    },
  },
  {
    id: 5,
    name: 'Догон',
    type: 'instant',
    effect: (game) => {
      game.me.field = []
      game.opponent.field = []
      game.me.mental = Math.min(150, game.me.mental + 20)
      game.opponent.skippedTurn = true
    },
  },
  {
    id: 6,
    name: 'Слеза утконоса',
    type: 'normal',
    effect: (game) => {
      const meHasFriend = game.me.field.some(c => c.id === 3)
      const oppHasFriend = game.opponent.field.some(c => c.id === 3)

      game.me.cring += meHasFriend ? 10 : 25
      game.opponent.cring += oppHasFriend ? 10 : 25

      if (meHasFriend) game.me.field = game.me.field.filter(c => c.id !== 3)
      if (oppHasFriend) game.opponent.field = game.opponent.field.filter(c => c.id !== 3)
    },
  },
  {
    id: 7,
    name: 'Закрытый туалет (активная)',
    type: 'active',
    onTurnStart: (game) => {
      const stacks = game.opponent.field.filter(c => c.id === 7).length
      game.opponent.cring += 1 + stacks
    },
    removedByCardId: 8,
  },
  {
    id: 8,
    name: 'Выломать дверь',
    type: 'instant',
    autoPlayOnDraw: true,
    effect: (game) => {
      if (game.opponent.field.some(c => c.id === 7)) {
        game.opponent.field = game.opponent.field.filter(c => c.id !== 7)
      }
    },
  },
  {
    id: 9,
    name: 'Блейза (рандом, скрыто)',
    type: 'normal',
    hidden: true,
    effect: (game) => {
      if (Math.random() < 0.5) {
        game.opponent.cring += 18 // Джин
      } else {
        game.me.mental = Math.min(150, game.me.mental + 18) // Гранат
      }
    },
  },
  {
    id: 10,
    name: 'Поправил пипирку и поймал взгляд бабки',
    type: 'normal',
    effect: (game) => {
      const hasBalcony = game.me.field.some(c => c.id === 1)
      if (hasBalcony) {
        game.opponent.cring += 6
        game.me.mental = Math.min(150, game.me.mental + 12)
      } else {
        game.me.mental = Math.min(150, game.me.mental + 8)
      }
    },
  },
  {
    id: 11,
    name: 'Пукнул в тихую, но обосрался',
    type: 'active',
    onTurnStart: (game) => {
      if (!game.opponent.field.some(c => c.id === 7)) {
        game.opponent.cring += 3
      }
    },
  },
  {
    id: 12,
    name: 'Заглянуть не туда',
    type: 'normal',
    effect: (game) => {
      game.me.cring += 6
      game.me.passiveMentalPerTurn = (game.me.passiveMentalPerTurn || 0) + 3
      // этот бонус снимается при разыгрывании любой кринжовой истории
    },
  },
  {
    id: 13,
    name: 'Дикий зверь (кринжовая история)',
    type: 'cringe_story',
    isStory: true,
    effect: (game) => {
      const bonus = game.cringeStoriesPlayed * 3
      game.opponent.cring += 3 + bonus
    },
  },
  {
    id: 14,
    name: 'Блять, кто это сделал? (кринжовая история)',
    type: 'cringe_story',
    isStory: true,
    effect: (game) => {
      const base = Math.floor(Math.random() * 7) + 4 // 4–10
      const multiplier = game.doorEverKicked ? 2 : 1
      game.opponent.cring += base * multiplier
    },
  },
  {
    id: 15,
    name: 'Слава роду',
    type: 'normal',
    persistentOnHand: true,
    specialCheckOnDraw: true,
    effect: (game) => {
      // эффект срабатывает при доборе, если у обоих на руке одновременно
      // реализуется в drawCard() в gameStore
    },
  },
  {
    id: 16,
    name: 'Харкнуть в глаз',
    type: 'normal',
    effect: (game) => {
      let dmg = 20
      if (game.opponent.field.some(c => c.id === 7)) dmg += 15
      game.opponent.cring += dmg
    },
  },
  {
    id: 17,
    name: 'Собрать всех и не придти',
    type: 'normal',
    effect: (game) => {
      game.opponent.cring += 15
      game.me.mental = Math.min(150, game.me.mental + 20)
    },
  },
  {
    id: 18,
    name: 'Пёс (активная)',
    type: 'active',
    onTurnStart: (game) => {
      if (game.opponent.field.some(c => c.id === 19)) {
        game.opponent.cring += 10
      }
    },
  },
  {
    id: 19,
    name: 'Азиатские ножки (активная)',
    type: 'active',
    onTurnStart: (game) => {
      game.me.mental = Math.min(150, game.me.mental + 5)
    },
  },
  {
    id: 20,
    name: 'Хозяин хаты',
    type: 'normal',
    effect: (game) => {
      // игрок выбирает один из двух вариантов (в UI будет модалка)
      // пока реализуем рандом для простоты, потом заменим на выбор
      if (Math.random() < 0.5) {
        game.opponent.cring += 15
        game.me.delayedDamageToOpp = { turnsLeft: 4, amount: 30 }
      } else {
        game.me.mental = Math.min(150, game.me.mental + 5)
        game.me.delayedMental = { turnsLeft: 4, amount: 35 }
      }
    },
  },
{
  id: 21,
  name: 'Туалет для инвалидов (кринжовая история)',
  type: 'cringe_story',
  isStory: true,
  effect: (game) => {
    game.opponent.cring += 16
  },
},
{
  id: 22,
  name: 'Красные глаза (кринжовая история, активная)',
  type: 'active',
  isStory: true,
  onTurnStart: (game) => {
    const stacks = game.me.field.filter(c => c.id === 22).length
    game.opponent.cring += 1 + stacks
  },
  removedByCardId: 23,
},
{
  id: 23,
  name: 'Контрастный душ',
  type: 'instant',
  effect: (game) => {
    game.me.mental = Math.min(150, game.me.mental + 8)
    if (game.opponent.field.some(c => c.id === 22)) {
      game.opponent.field = game.opponent.field.filter(c => c.id !== 22)
    }
  },
},
{
  id: 24,
  name: 'Центровые',
  type: 'normal',
  effect: (game) => {
    const hasBercy = game.me.field.some(c => c.id === 25)
    game.opponent.cring += hasBercy ? 25 : 12
  },
},
{
  id: 25,
  name: 'Берцы (активная)',
  type: 'active',
  onTurnStart: (game) => {
    if (!game.me.field.some(c => c.id === 24) && !game.opponent.field.some(c => c.id === 24)) {
      game.me.mental = Math.min(150, game.me.mental + 4)
      game.opponent.cring += 3
    }
  },
  // эффект прекращается, как только кто-то сыграет "Центровые"
},
{
  id: 26,
  name: 'Пачка сигарет (активная)',
  type: 'active',
  maxCharges: 20,
  currentCharges: (game) => Math.min(20, game.cringeStoriesPlayed * 2),
  onTurnStart: (game) => {
    const charges = Math.min(20, game.cringeStoriesPlayed * 2)
    game.me.mental = Math.min(150, game.me.mental + charges)
  },
  losesChargeOnCardId: 27,
},
{
  id: 27,
  name: 'Расстрелять',
  type: 'instant',
  effect: (game) => {
    const oppPack = game.opponent.field.find(c => c.id === 26)
    if (oppPack && oppPack.currentCharges > 0) {
      const stolen = oppPack.currentCharges
      game.me.mental = Math.min(150, game.me.mental + 6 + stolen * 2)
      oppPack.currentCharges = 0
    } else {
      game.me.mental = Math.min(150, game.me.mental + 6)
    }
  },
},
{
  id: 28,
  name: 'Помойное ведро (кринжовая история)',
  type: 'cringe_story',
  isStory: true,
  effect: (game) => {
    game.opponent.cring += 12
    game.me.mental = Math.min(150, game.me.mental + 5)
  },
},
{
  id: 29,
  name: 'Чёрный кошелёк (кринжовая история)',
  type: 'cringe_story',
  isStory: true,
  effect: (game) => {
    game.opponent.cring += 18
  },
},
{
  id: 30,
  name: 'Нефоры и их истории (кринжовая история)',
  type: 'cringe_story',
  isStory: true,
  effect: (game) => {
    const bonus = game.cringeStoriesPlayed * 4
    game.opponent.cring += 6 + bonus
  },
},
{
  id: 31,
  name: 'Похер, танцуй',
  type: 'defense',
  effect: (game) => {
    game.me.nextCringReduction = 20 // следующий полученный кринж уменьшен на 20 (одноразово)
  },
},
{
  id: 32,
  name: 'Батя в здании',
  type: 'instant',
  effect: (game) => {
    game.opponent.activeCardsDisabledThisTurn = true
    game.me.mental = Math.min(150, game.me.mental + 15)
  },
},
{
  id: 33,
  name: 'Котлеты с пюрешкой',
  type: 'normal',
  effect: (game) => {
    game.me.mental = Math.min(150, game.me.mental + 30)
    game.me.nextTurnMaxCards = 1
  },
},
{
  id: 34,
  name: '"Да мне пох, я на гидре"',
  type: 'defense',
  effect: (game) => {
    game.me.ignoreOpponentActiveEffectsThisTurn = true
  },
},
{
  id: 35,
  name: 'Шаверма после алко',
  type: 'normal',
  effect: (game) => {
    game.me.mental = Math.min(150, game.me.mental + 15)
    game.me.cring += 10
  },
},
{
  id: 36,
  name: '"Ты чё, самый умный?"',
  type: 'instant',
  effect: (game) => {
    if (game.opponent.hand.length > 0) {
      const randomIndex = Math.floor(Math.random() * game.opponent.hand.length)
      game.opponent.hand.splice(randomIndex, 1)
    }
  },
},
{
  id: 37,
  name: 'Приоры на минималках',
  type: 'normal',
  effect: (game) => {
    let dmg = 10
    if (game.opponent.mental < 50) dmg += 10
    game.opponent.cring += dmg
  },
},
{
  id: 38,
  name: '"Зуб за зуб" (активная)',
  type: 'active',
  onOpponentTakesCring: (game, amount) => {
    game.opponent.cring += Math.floor(amount * 0.5)
  },
},
{
  id: 39,
  name: 'Сигма самец',
  type: 'active',
  onTurnStart: (game) => {
    game.me.cringDamageBonus = 4 // все твои карты с кринжем наносят +4
  },
},
{
  id: 40,
  name: 'Плаки-плаки',
  type: 'instant',
  effect: (game) => {
    game.opponent.skipNextDraw = true
  },
},
{
  id: 41,
  name: '"Я щас сдохну"',
  type: 'instant',
  effect: (game) => {
    if (game.me.mental <= 40) {
      game.opponent.cring += 40
    }
  },
},
{
  id: 42,
  name: 'Кушать подкаст (активная)',
  type: 'active',
  onTurnStart: (game) => {
    game.me.mental = Math.min(150, game.me.mental + 4)
  },
  playRestriction: (game) => game.me.playedThisTurn >= 1 ? false : true, // можно играть только 1 карту за ход
},
{
  id: 43,
  name: '"Бери шмотки и вали"',
  type: 'instant',
  effect: (game) => {
    const activeOppCards = game.opponent.field.filter(c => c.type === 'active')
    if (activeOppCards.length > 0) {
      const randomIdx = Math.floor(Math.random() * activeOppCards.length)
      game.opponent.field = game.opponent.field.filter((_, i) => i !== game.opponent.field.indexOf(activeOppCards[randomIdx]))
    }
  },
},
{
  id: 44,
  name: 'Теракт в метро',
  type: 'normal',
  effect: (game) => {
    game.me.cring += 20
    game.opponent.cring += 20
  },
},
{
  id: 45,
  name: '"Пацаны с раёна" (кринжовая история)',
  type: 'cringe_story',
  isStory: true,
  effect: (game) => {
    let dmg = 15
    if (game.me.field.some(c => c.id === 24 || c.id === 25)) dmg += 5
    game.opponent.cring += dmg
  },
},
{
  id: 46,
  name: 'Дед инсайд',
  type: 'instant',
  effect: (game) => {
    game.me.mental = Math.min(150, game.me.mental + 100)
    game.me.dedInsideTurnsLeft = 3 // через 3 хода — мгновенная смерть, если не выиграл
  },
},
{
  id: 47,
  name: '"Это база"',
  type: 'instant',
  effect: (game) => {
    if (game.lastPlayedCardByOpponent) {
      // копируем эффект последней сыгранной карты оппонента
      game.lastPlayedCardByOpponent.effect?.(game)
    }
  },
},
{
  id: 48,
  name: 'Мажор на Гелике',
  type: 'normal',
  effect: (game) => {
    game.opponent.cring += game.opponent.mental > 80 ? 25 : 8
  },
},
{
  id: 49,
  name: '"Я в домике"',
  type: 'defense',
  effect: (game) => {
    game.me.protectedNextTurn = true // следующий ход получаешь 0 кринжа
  },
},
{
  id: 50,
  name: 'Борщ с салом',
  type: 'normal',
  effect: (game) => {
    game.me.mental = Math.min(150, game.me.mental + 35)
  },
},
{
  id: 51,
  name: '"Слово пацана" (активная)',
  type: 'active',
  onFieldEffect: (game) => {
    // пока в поле — никто не может играть карты на себя (только на оппонента)
    game.me.cannotPlayOnSelf = true
    game.opponent.cannotPlayOnSelf = true
  },
},
{
  id: 52,
  name: 'Оливье 31 декабря (кринжовая история)',
  type: 'cringe_story',
  isStory: true,
  effect: (game) => {
    game.opponent.cring += 20
  },
},
{
  id: 53,
  name: '"Пацан к успеху шёл"',
  type: 'instant',
  effect: (game) => {
    // добор 3 карт, они не получают жар 1 ход (можно играть сразу)
    for (let i = 0; i < 3; i++) {
      if (game.me.deck.length > 0) {
        const card = game.me.deck.shift()!
        card.noHeatThisTurn = true
        game.me.hand.push(card)
      }
    }
  },
},
{
  id: 54,
  name: 'ТикТок Хаус (активная, считается как история)',
  type: 'active',
  isStory: true,
  onFieldEffect: (game) => {
    // каждая кринжовая история в игре наносит +2 дополнительно
    game.globalStoryBonus = 2
  },
},
{
  id: 55,
  name: '"Жиза"',
  type: 'normal',
  effect: (game) => {
    if (game.cringeStoriesPlayed >= 5) {
      game.opponent.cring += 35
    }
  },
},
{
  id: 56,
  name: 'Бабушкин компот',
  type: 'normal',
  effect: (game) => {
    game.me.mental = Math.min(150, game.me.mental + 20)
    game.opponent.mental = Math.min(150, game.opponent.mental + 20)
  },
},
{
  id: 57,
  name: '"Я устал, я ухожу"',
  type: 'instant',
  effect: (game) => {
    game.opponent.endTurnEarly = true // завершает текущий ход оппонента мгновенно
  },
},
{
  id: 58,
  name: 'Го в мак',
  type: 'normal',
  effect: (game) => {
    game.opponent.cring += 15
    game.opponent.nextTurnMaxCards = 1
  },
},
{
  id: 59,
  name: '"Это не я, это мой брат"',
  type: 'defense',
  effect: (game) => {
    game.me.redirectAllCringThisTurnToOpponent = true
  },
},
{
  id: 60,
  name: 'Легендарный "О нет, в любом случае"',
  type: 'instant',
  effect: (game) => {
    if (game.lastPlayedCardByOpponent) {
      // отменяем эффект + наносим 20 кринжа
      game.opponent.cring += 20
      // в продвинутой версии тут будет полная отмена эффекта через rollback стейт
    }
  },
},
]