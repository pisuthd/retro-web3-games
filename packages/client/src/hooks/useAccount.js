import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import useEagerConnect from "./useEagerConnect";
import useInactiveListener from "./useInactiveListener";
import { ethers } from "ethers"
import { Connectors, SUPPORT_CHAINS } from "../constants"

export const AccountContext = createContext()

const Provider = ({ children }) => {

    const context = useWeb3React()

    const { account, activate, deactivate, error, chainId, library } = context

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = useState()

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect()

    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector)

    const connect = (walletType = 0) => {
        switch (walletType) {
            case 1:
                setActivatingConnector(Connectors[0].connector)
                activate(Connectors[0].connector)
                break
            default:
                setActivatingConnector(Connectors[0].connector)
                activate(Connectors[0].connector)
        }

    }

    const disconnect = () => {
        deactivate()
        setActivatingConnector()
        activate()
    }

    const corrected = SUPPORT_CHAINS.includes(chainId)

    const getBalance = useCallback(async () => {
        const balance = await library.getBalance(account)
        return ethers.utils.formatEther(balance)
    }, [account, library])

    const accountContext = useMemo(
        () => ({
            corrected,
            connect,
            getBalance,
            disconnect
        }),
        [corrected, getBalance]
    )

    return (
        <AccountContext.Provider value={accountContext}>
            {children}
        </AccountContext.Provider>
    )
}

export default Provider