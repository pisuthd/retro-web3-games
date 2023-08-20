
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { useWeb3React } from "@web3-react/core"

export const ModalContext = createContext()

export const MODAL = {
    ABOUT: "ABOUT",
    SIGN_IN: "SIGN_IN",
    MINESWEEPER: "MINESWEEPER",
    FAUCET: "FAUCET",
    INVENTORY: "INVENTORY"
}

const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            // modals: [MODAL.ABOUT]
            modals: []
        }
    )

    const { modals } = values

    const closeAboutModal = useCallback(() => {
        dispatch({ modals: modals.filter(item => item !== MODAL.ABOUT) })
    }, [modals])

    const showMinesweeperModal = useCallback(() => {
        dispatch({ modals: modals.concat([MODAL.MINESWEEPER]) })
    }, [modals])

    const showAboutModal = useCallback(() => {
        dispatch({ modals: modals.concat([MODAL.ABOUT]) })
    }, [modals])

    const closeMinesweeperModal = useCallback(() => {
        dispatch({ modals: modals.filter(item => item !== MODAL.MINESWEEPER) })
    }, [modals])

    const closeSignInModal = useCallback(() => {
        dispatch({ modals: modals.filter(item => item !== MODAL.SIGN_IN) })
    }, [modals])

    const showSignInModal = useCallback(() => {
        dispatch({ modals: modals.concat([MODAL.SIGN_IN]) })
    }, [modals])

    const showInventoryModal = useCallback(() => {
        dispatch({ modals: modals.concat([MODAL.INVENTORY]) })
    }, [modals])

    const closeInventoryModal = useCallback(() => {
        dispatch({ modals: modals.filter(item => item !== MODAL.INVENTORY) })
    }, [modals])

    const showMarketplaceModal = useCallback(() => {
        alert("showMarketplaceModal")
    }, [modals])

    const closeMarketplaceModal = useCallback(() => {

    }, [modals])

    const showChatModal = useCallback(() => {
        alert("showChatModal")
    }, [modals])

    const closeChatModal = useCallback(() => {

    }, [modals])

    const showFaucetModal = useCallback(() => {
        dispatch({ modals: modals.concat([MODAL.FAUCET]) })
    }, [modals])

    const closeFaucetModal = useCallback(() => {
        dispatch({ modals: modals.filter(item => item !== MODAL.FAUCET) })
    }, [modals])

    const modalContext = useMemo(
        () => ({
            modals,
            closeAboutModal,
            showAboutModal,
            closeSignInModal,
            showSignInModal,
            showMinesweeperModal,
            closeMinesweeperModal,
            showInventoryModal,
            closeInventoryModal,
            showChatModal,
            closeChatModal,
            showMarketplaceModal,
            closeMarketplaceModal,
            showFaucetModal,
            closeFaucetModal
        }),
        [modals]
    )

    return (
        <ModalContext.Provider value={modalContext}>
            {children}
        </ModalContext.Provider>
    )
}

export default Provider