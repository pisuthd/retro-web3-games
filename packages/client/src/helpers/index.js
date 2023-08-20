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