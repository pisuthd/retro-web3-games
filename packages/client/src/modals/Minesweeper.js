import React, { useContext, useState, useCallback, useEffect } from 'react'
import { Modal, Frame, Avatar, List, ProgressBar, Alert } from '@react95/core'
import { Winmine1 } from '@react95/icons'
import styles from "./css/Minesweeper.module.css"
import DigitsDisplay from '../components/DigitsDisplay';
import Smiley from '../components/Smiley';
import Tile from "../components/Tile"
import { MinesweeperContext } from '../hooks/useMinesweeper';

const Minesweeper = ({
    closeModal
}) => {

    const { state, minesCounter, gameEnded, flags, revealTile, flagTile, newGame } = useContext(MinesweeperContext)

    const [processing, setProcessing] = useState(false)
    const win = minesCounter === 0 ? true : false

    const totalRow = state ? Math.ceil(state.length) / 16 : 0

    let rows = []

    for (let i = 0; i < totalRow; i++) {
        const items = state.slice((i * 16), (i * 16) + 16)
        rows.push(items)
    }

    const onNewGame = useCallback(async () => {
        if (processing) {
            return
        } 
        try {
            await newGame()
        } catch (e) {
            alert("The game is not over")
        }

    }, [processing, newGame])

    const handleClick = useCallback(async (e, coordinates, flag = false) => {
        if (processing) {
            return
        }
        setProcessing(true)
        try {
            if (flag) {
                await flagTile(coordinates)
            } else {
                await revealTile(coordinates)
            }
        } catch (e) {
            alert(e.reason || e.message)
        }
        setProcessing(false)
    }, [revealTile, flagTile, processing])

    console.log("state : ", state)

    return (
        <>
            <Modal
                // width="500"
                icon={<Winmine1 variant="32x32_4" />}
                title="Minesweeper"
                closeModal={closeModal}
                defaultPosition={{
                    x: 200,
                    y: 60,
                }}
                menu={[{
                    name: 'File',
                    list: <List>
                        <List.Item onClick={onNewGame}>New Game</List.Item>
                        {/* <List.Item onClick={() => setInfo(true)}>How To Play</List.Item> */}
                        <List.Divider />
                        <List.Item onClick={() => closeModal()}>Exit</List.Item>
                    </List>
                }]}
            >
                <div id="my-board" className={`${styles['game']} ${styles['outer-border']}`}>
                    <div className={`${styles['game-status']} ${styles['inner-border']}`}>
                        <DigitsDisplay digits={3} value={minesCounter} />
                        <Smiley
                            state={gameEnded ? (win ? 'WIN' : 'LOSE') : (processing ? 'SCARED' : 'NORMAL')}
                            onClick={onNewGame}
                        />
                        <DigitsDisplay digits={3} value={flags} />
                    </div>
                    <div className={styles['inner-border']}>
                        {
                            rows.map((items, y) => (
                                <div key={`col-${y}`} className={styles['row']}>
                                    {
                                        items.map((tile, x) => <Tile
                                            tile={tile}
                                            coordinates={{ x, y }}
                                            key={`${y}-${x}`}
                                            gameEnded={gameEnded}
                                            handleClick={handleClick}
                                            processing={processing}
                                        />)
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Minesweeper