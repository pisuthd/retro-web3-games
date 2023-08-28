const Deck = require("./deck.json")

const Deal = {
    dealer: "dealer",
    user: "user",
    hidden: "hidden"
}

const GameState = {
    init: "init",
    bet: "bet",
    userTurn: "userTurn",
    dealerTurn: "dealerTurn",
    bust: 'bust',
    userWin: 'userWin',
    dealerWin: 'dealerWin',
    tie: 'tie'
}

const calculate = (cards, ignoreHidden = false) => {
    let total = 0;
    cards.forEach((card) => {
        if ((ignoreHidden || card.hidden === false) && card.value !== 'A') {
            switch (card.value) {
                case 'K':
                    total += 10;
                    break;
                case 'Q':
                    total += 10;
                    break;
                case 'J':
                    total += 10;
                    break;
                default:
                    total += Number(card.value);
                    break;
            }
        }
    });
    const aces = cards.filter((card) => {
        return card.value === 'A';
    });
    aces.forEach((card) => {
        if (ignoreHidden || card.hidden === false) {
            if ((total + 11) > 21) {
                total += 1;
            }
            else if ((total + 11) === 21) {
                if (aces.length > 1) {
                    total += 1;
                }
                else {
                    total += 11;
                }
            }
            else {
                total += 11;
            }
        }
    });
    return total
}

const calculateAll = (state) => {
    state.userScore = calculate(state.userCards)
    state.dealerScore = calculate(state.dealerCards, true)
    return state
}

const hit = (state) => {
    state = drawCard(state, Deal.user)
    state = calculateAll(state)
    state = checkUserTurn(state)

    if (state.state !== GameState.bust) {
        state = checkDealerTurn(state, Deal.hidden)
        state = calculateAll(state)
        if (state.dealerScore > 21) {
            state.state = GameState.userWin
        } else if (state.state === GameState.dealerTurn) {
            state.state = GameState.userTurn
        }
    }
    return state
}

const stand = (state) => {
    state = calculateAll(state)

    while (state.dealerScore < 17) {
        state = checkDealerTurn(state)
        state = calculateAll(state)
    }
    state = checkWin(state)
    return state
}

const checkUserTurn = (state) => {
    state.state = GameState.dealerTurn
    if (state.userScore > 21) {
        state.state = GameState.bust
    }
    return state
}

const checkDealerTurn = (state, dealType = Deal.dealer) => {
    if (state.dealerScore < 17) {
        state = drawCard(state, dealType);
    }
    return state
}

const checkWin = (state) => {

    if (state.userScore > state.dealerScore || state.dealerScore > 21) {
        state.state = GameState.userWin
    }
    else if (state.dealerScore > state.userScore) {
        state.state = GameState.dealerWin
    }
    else {
        state.state = GameState.tie
    }
    return state
}

const dealCard = (state, dealType, value, suit) => {

    switch (dealType) {
        case Deal.user:
            state.userCards.push({ 'value': value, 'suit': suit, 'hidden': false });
            break;
        case Deal.dealer:
            state.dealerCards.push({ 'value': value, 'suit': suit, 'hidden': false });
            break;
        case Deal.hidden:
            state.dealerCards.push({ 'value': value, 'suit': suit, 'hidden': true });
            break;
        default:
            break;
    }

    return state
}

const drawCard = (state, dealType) => {

    if (state.deck.length > 0) {
        const randomIndex = Math.floor(Math.random() * state.deck.length);
        const card = state.deck[randomIndex];
        state.deck.splice(randomIndex, 1);
        switch (card.suit) {
            case 'spades':
                state = dealCard(state, dealType, card.value, card.suit);
                break;
            case 'diamonds':
                state = dealCard(state, dealType, card.value, card.suit);
                break;
            case 'clubs':
                state = dealCard(state, dealType, card.value, card.suit);
                break;
            case 'hearts':
                state = dealCard(state, dealType, card.value, card.suit);
                break;
            default:
                break;
        }
    }
    else {
        // alert('All cards have been drawn');
    }
    return state
}

const initialGameState = (betSize) => {
    return {
        state: GameState.init,
        deck: Deck.cards,
        userCards: [],
        userScore: 0,
        dealerCards: [],
        dealerScore: 0,
        bet: Number(betSize)
    }
}

const drawAtStart = (state) => {

    state = drawCard(state, Deal.user)
    state = drawCard(state, Deal.hidden);
    state = drawCard(state, Deal.user);
    state = drawCard(state, Deal.dealer);

    state.state = GameState.userTurn

    return state
}

exports.initialGameState = initialGameState
exports.drawAtStart = drawAtStart
exports.hit = hit
exports.stand = stand
exports.calculate = calculate