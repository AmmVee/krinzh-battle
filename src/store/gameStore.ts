// src/store/gameStore.ts
import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { cards } from '@/lib/cards'
import { produce } from 'immer'

type Player = 'me' | 'opp'

export interface Card {
  id: number
  name: string
  type: 'normal' | 'active' | 'cringe_story' | 'instant' | 'defense'
  isStory?: boolean
  persistentOnHand?: boolean
  autoPlayOnDraw?: boolean
  hidden?: boolean
  effect?: (game: GameState, player: Player) => void
  onPlay?: (game: GameState) => void
  onTurnStart?: (game: GameState) => void
  onTurnEnd?: (game: GameState) => void
  onOpponentTakesCring?: (game: GameState, amount: number) => void
  onFieldEffect?: (game: GameState) => void
  removedByCardId?: number
  losesChargeOnCardId?: number
  maxCharges?: number
  currentCharges?: number
  noHeatThisTurn?: boolean
}

export interface PlayerState {
  userId: string
  username: string
  mental: number          // текущее здоровье (макс 150)
  cring: number           // текущий кринж
  maxCring: number        // порог кринжа (обычно 100, растёт от некоторых карт)
  hand: Card[]
  field: Card[]
  deck: Card[]
  discarded: Card[]
  skippedTurn: boolean
  nextTurnMaxCards: number
  protectedNextTurn: boolean
  ignoreOpponentActiveEffectsThisTurn: boolean
  cannotPlayOnSelf: boolean
  redirectAllCringThisTurnToOpponent: boolean
  nextCringReduction: number
  cringDamageBonus: number
  passiveMentalPerTurn: number
  dedInsideTurnsLeft: number
  playedThisTurn: number
}

export interface DelayedEffect {
  turnsLeft: number
  amount: number
}

export interface GameState {
  gameId: string
  status: 'waiting' | 'playing' | 'finished'
  me: PlayerState
  opponent: PlayerState
  turn: Player
  winner: string | null
  cringeStoriesPlayed: number
  doorEverKicked: boolean
  lastPlayedCardByOpponent: Card | null
  globalStoryBonus: number
  delayedDamageToOpp?: DelayedEffect
  delayedMental?: DelayedEffect
  turnNumber: number
}

const FULL_DECK = [...cards, ...cards, ...cards] // по 3 копии каждой карты = 180 карт

const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export const useGameStore = create<GameState & {
  initGame: (gameId: string, myUserId: string, oppUserId: string, oppUsername: string) => void
  playCard: (card: Card) => void
  endTurn: () => void
  drawCard: () => void
  applyTurnStartEffects: () => void
  checkVictory: () => void
  syncToSupabase: () => void
}>((set, get) => ({
  gameId: '',
  status: 'waiting',
  me: {
    userId: '',
    username: '',
    mental: 100,
    cring: 0,
    maxCring: 100,
    hand: [],
    field: [],
    deck: [],
    discarded: [],
    skippedTurn: false,
    nextTurnMaxCards: 999,
    protectedNextTurn: false,
    ignoreOpponentActiveEffectsThisTurn: false,
    cannotPlayOnSelf: false,
    redirectAllCringThisTurnToOpponent: false,
    nextCringReduction: 0,
    cringDamageBonus: 0,
    passiveMentalPerTurn: 0,
    dedInsideTurnsLeft: 0,
    playedThisTurn: 0,
  },
  opponent: {
    userId: '',
    username: '',
    mental: 100,
    cring: 0,
    maxCring: 100,
    hand: [],
    field: [],
    deck: [],
    discarded: [],
    skippedTurn: false,
    nextTurnMaxCards: 999,
    protectedNextTurn: false,
    ignoreOpponentActiveEffectsThisTurn: false,
    cannotPlayOnSelf: false,
    redirectAllCringThisTurnToOpponent: false,
    nextCringReduction: 0,
    cringDamageBonus: 0,
    passiveMentalPerTurn: 0,
    dedInsideTurnsLeft: 0,
    playedThisTurn: 0,
  },
  turn: 'me',
  winner: null,
  cringeStoriesPlayed: 0,
  doorEverKicked: false,
  lastPlayedCardByOpponent: null,
  globalStoryBonus: 0,
  turnNumber: 1,

  // ИНИЦИАЛИЗАЦИЯ ИГРЫ
  initGame: async (gameId, myUserId, oppUserId, oppUsername) => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', myUserId).single()

    const myDeck = shuffle(FULL_DECK)
    const oppDeck = shuffle(FULL_DECK)

    set({
      gameId,
      me: {
        ...get().me,
        userId: myUserId,
        username: profile.username,
        deck: myDeck,
        hand: myDeck.splice(0, 5),
      },
      opponent: {
        ...get().opponent,
        userId: oppUserId,
        username: oppUsername || 'Анонимный кринж',
        deck: oppDeck,
        hand: oppDeck.splice(0, 5),
      },
      status: 'playing',
    })

    // Подписка на реалтайм
    const channel = supabase.channel(`game:${gameId}`)
    channel
      .on('broadcast', { event: 'state' }, ({ payload }: { payload: { state: GameState } }) => {
        set(payload.state)
      })
      .subscribe()

    get().syncToSupabase()
  },

  // ДОБОР КАРТЫ
  drawCard: () => {
    const state = get()
    if (state.me.deck.length === 0 || state.me.skippedTurn) return

    const card = state.me.deck.shift()!
    set(produce((draft: GameState) => {
      draft.me.hand.push(card)
    }))

    // АВТО-РАЗЫГРЫШ "Выломать дверь"
    if (card.id === 8 && card.autoPlayOnDraw) {
      setTimeout(() => get().playCard(card), 300)
    }

    // "Слава роду" — проверка на одновременное наличие у обоих
    if (card.id === 15) {
      setTimeout(() => {
        const s = get()
        const meHas = s.me.hand.some(c => c.id === 15)
        const oppHas = s.opponent.hand.some(c => c.id === 15)
        if (meHas && oppHas) {
          set(produce((draft: GameState) => {
            draft.me.mental = Math.min(150, draft.me.mental + 25)
            draft.opponent.mental = Math.min(150, draft.opponent.mental + 25)
            draft.me.hand = draft.me.hand.filter(c => c.id !== 15)
            draft.opponent.hand = draft.opponent.hand.filter(c => c.id !== 15)
          }))
        }
      }, 100)
    }
  },

  // РАЗЫГРЫВАНИЕ КАРТЫ
  playCard: (card: Card) => {
    const state = get()
    if (state.turn !== 'me') return
    if (!state.me.hand.find(c => c.id === card.id)) return
    if (state.me.playedThisTurn >= state.me.nextTurnMaxCards) return
    if (card.noHeatThisTurn === false && state.me.hand.some(c => c.noHeatThisTurn)) return // жар

    // Убираем из руки
    set(produce((draft: GameState) => {
      draft.me.hand = draft.me.hand.filter(c => c.id !== card.id)
      draft.me.playedThisTurn += 1

      // Если активная — кладём в поле
      if (card.type === 'active' || card.type === 'cringe_story') {
        draft.me.field.push(card)
      }

      // Считаем кринжовые истории
      if (card.isStory) {
        draft.cringeStoriesPlayed += 1
      }

      // Запоминаем последнюю карту оппонента
      draft.lastPlayedCardByOpponent = card

      // Применяем эффект
      card.effect?.(draft, 'me')
      card.onPlay?.(draft)
    }))

    get().checkVictory()
    get().syncToSupabase()
  },

  // ЭФФЕКТЫ НА НАЧАЛО ХОДА
  applyTurnStartEffects: () => {
    set(produce((draft: GameState) => {
      const player = draft.turn === 'me' ? draft.me : draft.opponent
      const opponent = draft.turn === 'me' ? draft.opponent : draft.me

      // Пассивные эффекты с поля
      draft.me.field.forEach(card => card.onTurnStart?.(draft))
      draft.opponent.field.forEach(card => card.onTurnStart?.(draft))

      // Пассивная менталка
      player.mental = Math.min(150, player.mental + player.passiveMentalPerTurn)

      // Отложенные эффекты
      if (draft.delayedDamageToOpp && draft.turn === 'me') {
        draft.delayedDamageToOpp.turnsLeft -= 1
        if (draft.delayedDamageToOpp.turnsLeft <= 0) {
          draft.opponent.cring += draft.delayedDamageToOpp.amount
          draft.delayedDamageToOpp = undefined
        }
      }

      // Дед инсайд
      if (player.dedInsideTurnsLeft > 0) {
        player.dedInsideTurnsLeft -= 1
        if (player.dedInsideTurnsLeft === 0 && draft.winner === null) {
          draft.winner = draft.turn === 'me' ? draft.opponent.userId : draft.me.userId
        }
      }
    }))

    get().checkVictory()
  },

  // ЗАВЕРШЕНИЕ ХОДА
  endTurn: () => {
    const state = get()

    // Применяем эффекты конца хода
    state.me.field.forEach(card => card.onTurnEnd?.(state))
    state.opponent.field.forEach(card => card.onTurnEnd?.(state))

    set(produce((draft: GameState) => {
      draft.turn = draft.turn === 'me' ? 'opp' : 'me'
      draft.turnNumber += 1

      // Сброс одноразовых защит
      draft.me.protectedNextTurn = false
      draft.me.ignoreOpponentActiveEffectsThisTurn = false
      draft.me.redirectAllCringThisTurnToOpponent = false
      draft.me.nextCringReduction = 0
      draft.me.playedThisTurn = 0
      draft.me.nextTurnMaxCards = 999

      // Добор карты следующему игроку
      const nextPlayer = draft.turn === 'me' ? draft.me : draft.opponent
      if (!nextPlayer.skipNextDraw && nextPlayer.deck.length > 0) {
        const card = nextPlayer.deck.shift()!
        nextPlayer.hand.push(card)
      }
    }))

    get().applyTurnStartEffects()
    get().syncToSupabase()
  },

  checkVictory: () => {
    const state = get()
    if (state.me.cring >= state.me.maxCring) {
      set({ winner: state.opponent.userId, status: 'finished' })
      get().endGame(state.opponent.userId, state.me.userId)
    }
    if (state.opponent.cring >= state.opponent.maxCring) {
      set({ winner: state.me.userId, status: 'finished' })
      get().endGame(state.me.userId, state.opponent.userId)
    }
  },

  endGame: async (winnerId: string, loserId: string) => {
    // ELO расчёт и сохранение в БД
    const { data: winner } = await supabase.from('profiles').select('rating').eq('id', winnerId).single()
    const { data: loser } = await supabase.from('profiles').select('rating').eq('id', loserId).single()

    const k = 32
    const expectedWinner = 1 / (1 + Math.pow(10, (loser.rating - winner.rating) / 400))
    const ratingChange = Math.round(k * (1 - expectedWinner))

    await supabase.from('profiles')
      .update({ rating: winner.rating + ratingChange, wins: winner.wins + 1 })
      .eq('id', winnerId)

    await supabase.from('profiles')
      .update({ rating: loser.rating - ratingChange, losses: loser.losses + 1 })
      .eq('id', loserId)
  },

  syncToSupabase: () => {
    const state = get()
    supabase.channel(`game:${state.gameId}`).send({
      type: 'broadcast',
      event: 'state',
      payload: { state: get() }
    })
  },
}))