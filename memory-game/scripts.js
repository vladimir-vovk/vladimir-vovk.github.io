// ** Gloval variables **
let state = {} // Game state

const confetti = new window.ConfettiGenerator({ // Confetti
  target: 'confetti',
  max: 100,
  clock: 25
})

// ** Functions **
function flipCard () {
  // Second card flipped, first and second cards don't match, waiting for unflip both
  if (state.secondCardFlipped) {
    return
  }

  this.classList.add('flipped')
  this.removeEventListener('click', flipCard)

  if (state.firstCardFlipped) {
    flipSecondCard(this)
  } else {
    flipFirstCard(this)
  }
}

function flipFirstCard (firstCard) {
  state = {
    ...state,
    firstCardFlipped: true,
    firstCard,
    movesCount: state.movesCount + 1
  }

  displayMoves()
}

function flipSecondCard (secondCard) {
  state = {
    ...state,
    secondCard,
    secondCardFlipped: true,
    movesCount: state.movesCount + 1
  }

  displayMoves()

  const { firstCard } = state
  // Check if cards match
  firstCard.dataset.name === secondCard.dataset.name ? cardsMatch() : cardsDontMatch()
}

function cardsDontMatch () {
  const { firstCard, secondCard } = state

  setTimeout(() => {
    firstCard.classList.remove('flipped')
    firstCard.addEventListener('click', flipCard)
    secondCard.classList.remove('flipped')
    secondCard.addEventListener('click', flipCard)
    state = {
      ...state,
      firstCardFlipped: false,
      secondCardFlipped: false,
      firstCard: null,
      secondCard: null
    }
  }, 1000)
}

function cardsMatch () {
  state = {
    ...state,
    firstCardFlipped: false,
    secondCardFlipped: false,
    firstCard: null,
    secondCard: null,
    matchCount: state.matchCount + 1
  }

  if (state.matchCount === state.cardsCount / 2) {
    gameFinished()
  }
}

function gameFinished () {
  setTimeout(() => {
    confettiStart()
  }, 1000)
}

function startGame () {
  state = {
    firstCardFlipped: false,
    secondCardFlipped: false,
    firstCard: null,
    secondCard: null,
    movesCount: 0,
    matchCount: 0,
    cardsCount: 12
  }

  const cards = Array.from(document.querySelectorAll('.card'))
  cards.forEach(card => {
    card.removeEventListener('click', flipCard)
    card.classList.remove('flipped')
  })

  displayMoves()
  confettiStop()

  // Waiting for flip animation end
  setTimeout(() => {
    shuffleCards(cards)
  }, 1000)
}

function shuffleCards (cards) {
  const shuffled = cards
    .map(card => ({ sort: Math.random(), value: card }))
    .sort((a, b) => a.sort - b.sort)
    .map(item => item.value)

  shuffled.forEach(card => card.addEventListener('click', flipCard))
  const gameContainer = document.getElementsByClassName('game-container')[0]

  // Remove cards
  while (gameContainer.firstChild) {
    gameContainer.removeChild(gameContainer.firstChild)
  }

  // Add shuffled cards
  shuffled.forEach(card => gameContainer.appendChild(card))
}

function confettiStart () {
  confetti.render()
}

function confettiStop () {
  confetti.clear()
}

function displayMoves () {
  const el = document.getElementById('moves')
  el.innerText = `Moves: ${state.movesCount}`
}

// ** Staritng game **
startGame()
