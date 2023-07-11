import { useContext, useState } from "react"
import Shortcuts from "./Shortcuts"
import { ModalContext } from "../hooks/useModal"
import { MODAL } from "../hooks/useModal"
import About from "../modals/About"
import SignIn from "../modals/SignIn"
import Minesweeper from "../modals/Minesweeper"

const Desktop = () => {

    const  { modals, closeAboutModal, closeSignInModal, closeMinesweeperModal } = useContext(ModalContext)
 
    return (
        <div>
            <Shortcuts/>
            { modals.find(item => item === MODAL.ABOUT) && <About closeModal={closeAboutModal}/>}
            { modals.find(item => item === MODAL.SIGN_IN) && <SignIn closeModal={closeSignInModal}/>} 
            { modals.find(item => item === MODAL.MINESWEEPER) && <Minesweeper closeModal={closeMinesweeperModal}/>} 
        </div>
    )
}

export default Desktop