// src/store/gameStore.ts
import { create } from 'zustand'
import { produce } from 'immer'
import { supabase } from '@/lib/supabase'
import { cards } from '@/lib/cards'
import { shuffle } from '@/lib/utils'

type Player = 'me' | 'opponent'

export interface Card {
  id: number
  name: string
  type: 'normal' | 'active' | 'instant' | 'story'
  cring?: number
  mental?: number
  isStory?: boolean
  effect?: (state: GameState, player: Player) => void
  onTurnStart?: (state: GameState) => void
  instanceId?: string
}

export interface PlayerState {
  userId: string
  username: string
  mental: number
  cring: number
  maxCring: number
  hand: Card[]
  field: Card[]
  deck: Card[]
  skippedTurn: boolean
  protectedTurn: boolean
  ignoreEffects: boolean
}

export interface GameState {
  gameId: string
  me: PlayerState
  opponent: PlayerState
  turn: Player
  winner: string | null
  storiesPlayed: number
  doorKicked: boolean
}

const FULL_DECK = shuffle([...cards, ...cards, ...cards]).map((card, i) => ({
  ...card,
  instanceId: `${card.id}-${i}`
}))

export const useGameStore = create<GameState & {
  initGame: (gameId: string, myId: string, oppId: string, oppName: string) => void
  drawCard: () => void
  playCard: (card: Card) => void
  endTurn: () => void
  checkWin: () => void
}>((set, get) => ({
  gameId: '',
  me: {
    userId: '',
    username: '',
    mental: 100,
    cring: 0,
    maxCring: 100,
    hand: [],
    field: [],
    deck: [],
    skippedTurn: false,
    protectedTurn: false,
    ignoreEffects: false,
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
    skippedTurn: false,
    protectedTurn: false,
    ignoreEffects: false,
  },
  turn: 'me',
  winner: null,
  storiesPlayed: 0,
  doorKicked: false,

  initGame: (gameId, myId, oppId, oppName) => {
    const myDeck = shuffle([...FULL_DECK])
    const oppDeck = shuffle([...FULL_DECK])

    set({
      gameId,
      me: {
        ...get().me,
        userId: myId,
        username: 'ТЫ',
        deck: myDeck,
        hand: myDeck.splice(0, 5),
      },
      opponent: {
        ...get().opponent,
        userId: oppId,
        username: oppName,
        deck: oppDeck,
        hand: oppDeck.splice(0, 5),
      },
    })

    // Авто-добор первой карты
    setTimeout(() => get().drawCard(), 1000)
  },

  drawCard: () => {
    const state = get()
    if (state.me.deck.length === 0 || state.turn !== 'me') return

    const card = state.me.deck.shift()!
    
    set(produce((draft: GameState) => {
      draft.me.hand.push(card)
    }))

    // Авто-разыгрывание "Выломать дверь"
    if (card.id === 8) {
      setTimeout(() => get().playCard(card), 500)
    }
  },

  playCard: (card: Card) => {
    const state = get()
    if (state.turn !== 'me' || state.me.hand.every(c => c.instanceId !== card.instanceId)) return

    set(produce((draft: GameState) => {
      draft.me.hand = draft.me.hand.filter(c => c.instanceId !== card.instanceId)
      
      if (card.type === 'active' || card.type === 'story') {
        draft.me.field.push(card)
      }

      if (card.isStory) draft.storiesPlayed += 1
      if (card.id === 8) draft.doorKicked = true

      card.effect?.(draft, 'me')
    }))

    get().checkWin()
  },

  endTurn: () => {
    set(produce((draft: GameState) => {
      draft.me.field.forEach(card => card.onTurnStart?.(draft))
      draft.turn = 'opponent'
      
      setTimeout(() => {
        draft.opponent.field.forEach(card => card.onTurnStart?.(draft))
        draft.turn = 'me'
        get().drawCard()
      }, 1500)
    }))
  },

  checkWin: () => {
    const state = get()
    if (state.me.cring >= state.me.maxCring) {
      set({ winner: state.opponent.userId })
    } else if (state.opponent.cring >= state.opponent.maxCring) {
      set({ winner: state.me.userId })
    }
  },
}))