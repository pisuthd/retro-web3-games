export const shortAddress = (address, first = 6, last = -4) => {
    return `${address.slice(0, first)}...${address.slice(last)}`
}

export const parseError = (e) => {
    if (e && e.reason) {
        return e.reason.replaceAll("execution reverted:", "")
    }
    return e.message
}

export const isAddressesEqual = (address1, address2) => {
    return address1.toLowerCase() === address2.toLowerCase()
}

export const tileNumberToVal = (input) => {
    let val
    switch (Number(input)) {
        case 1:
            val = "pressed"
            break
        case 2:
            val = "bombflagged"
            break
        case 3:
            val = "bombrevealed"
            break
        case 4:
            val = "bombmisflagged"
            break
        case 5:
            val = "bombdeath"
            break
        case 6:
            val = "open0"
            break
        case 7:
            val = "open1"
            break
        case 8:
            val = "open2"
            break
        case 9:
            val = "open3"
            break
        case 10:
            val = "open4"
            break
        case 11:
            val = "open5"
            break
        case 12:
            val = "open6"
            break
        case 13:
            val = "open7"
            break
        case 14:
            val = "open8"
            break
        default:
            val = "blank"
    }
    return val
}

export const randomGreeting = () => {

    const sentences = [
        "how's it going?",
        "ahoy",
        "how do?",
        "what's cooking?",
        "good day",
        "what's new?",
        "what's the dilly?",
        "what's crack-a-lackin'?",
        "yello",
        "yo",
        "greetings",
        "what's shaking?",
        "what's cooking?",
        "hola",
        "what's the dizzle?",
        "what's cooking?",
        "whazzup ?",
        "what's new?",
        "how goes it ?",
        "whazzup ?",
        "aloha",
        "what up ?",
        "what's happening?",
        "how's it hanging?",
        "salutations",
        "how goes it ?",
        "yo",
        "what's crackin' ?",
        "what's poppin' ?"
    ]

    return sentences[Math.floor(Math.random() * sentences.length)]
}