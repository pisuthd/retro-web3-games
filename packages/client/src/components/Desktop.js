import { useContext, useState } from "react"
import Shortcuts from "./Shortcuts"
import { ModalContext } from "../hooks/useModal"
import { MODAL } from "../hooks/useModal"
import About from "../modals/About"
import SignIn from "../modals/SignIn"
import Minesweeper from "../modals/Minesweeper"
import Faucet from "../modals/Faucet"
import Inventory from "../modals/Inventory"
import Marketplace from "../modals/Marketplace"

const Desktop = () => {

    const  { modals, closeAboutModal, closeSignInModal, closeMinesweeperModal, closeFaucetModal, closeInventoryModal, closeMarketplaceModal } = useContext(ModalContext)
 
    return (
        <div>
            <Shortcuts/>
            { modals.find(item => item === MODAL.ABOUT) && <About closeModal={closeAboutModal}/>}
            { modals.find(item => item === MODAL.SIGN_IN) && <SignIn closeModal={closeSignInModal}/>} 
            { modals.find(item => item === MODAL.FAUCET) && <Faucet closeModal={closeFaucetModal}/>} 
            { modals.find(item => item === MODAL.INVENTORY) && <Inventory closeModal={closeInventoryModal}/>} 
            { modals.find(item => item === MODAL.MINESWEEPER) && <Minesweeper closeModal={closeMinesweeperModal}/>} 
            { modals.find(item => item === MODAL.MARKETPLACE) && <Marketplace closeModal={closeMarketplaceModal}/>} 
        </div>
    )
}

export default Desktop