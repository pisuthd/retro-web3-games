import AddStake from "@/panels/AddStake"
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"

export const PanelContext = createContext()

const PANEL = {
    NONE: "NONE",
    MINT: "MINT"
}

const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            panel: PANEL.NONE,
            slug : undefined
        }
    )

    const { slug, panel } = values

    const showMintPanel = (slug) => {
        dispatch({
            panel: PANEL.MINT,
            slug
        })
    }

    const closePanel = () => {
        dispatch({
            panel: PANEL.NONE,
            slug: undefined
        })
    }

    const panelContext = useMemo(
        () => ({
            showMintPanel
        }),
        [
        ]
    )

    return (
        <PanelContext.Provider value={panelContext}>
            <AddStake
                visible={panel === PANEL.MINT}
                close={closePanel}
                slug={slug}
            />
            {children}
        </PanelContext.Provider>
    )

}

export default Provider