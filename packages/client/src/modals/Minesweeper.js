import React, { useContext, useState, useCallback, useEffect } from 'react'
import { Modal, Frame, Avatar, List, ProgressBar, Alert } from '@react95/core'
// import styled from 'styled-components';
import { Winmine1 } from '@react95/icons'
import styles from "./css/Minesweeper.module.css"
import DigitsDisplay from '../components/DigitsDisplay';
import Smiley from '../components/Smiley';
import Tile from "../components/Tile"
import { MinesweeperContext } from '../hooks/useMinesweeper';

const Minesweeper = ({
    closeModal
}) => {

    const { loading, minesCounter, gameEnded, newGame, state, revealTile, flagTile, deposit } = useContext(MinesweeperContext)

    const [processing, setProcessing] = useState(false)
    const [info, setInfo] = useState(false)

    const win = minesCounter === 0 ? true : false

    const totalRow = state ? Math.ceil(state.length) / 16 : 0

    let rows = []

    for (let i = 0; i < totalRow; i++) {
        const items = state.slice((i * 16), (i * 16) + 16)
        rows.push(items)
    }

    // useEffect(() => {
    //     function handleContextMenu(e) {
    //         e.preventDefault(); // prevents the default right-click menu from appearing
    //     }
    //     // add the event listener to the component's root element
    //     const rootElement = document.getElementById('my-board');
    //     rootElement.addEventListener('contextmenu', handleContextMenu);
    //     // remove the event listener when the component is unmounted

    //     return () => {
    //         rootElement.removeEventListener('contextmenu', handleContextMenu);
    //     };
    // }, []);

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

    const onNewGame = useCallback(async () => {

        if (processing) {
            return
        }

        setProcessing(true)

        try {
            await newGame()
        } catch (e) {
            alert(e.reason || e.message)
        }

        setProcessing(false)

    }, [processing])

    console.log("state : ", state)

    return (
        <>
            {info && <Alert title="How to play" type={"info"} message="Left-click to reveal the cell. Right-click to flag a bomb and deposit 0.01 OAS. The person who flags the last bomb will receive the prize pool." closeAlert={() => setInfo(false)}   buttons={[{
        value: 'OK',
        onClick: () => setInfo(false)
      }]} />}
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
                        <List.Item onClick={() => setInfo(true)}>How To Play</List.Item>
                        <List.Divider />
                        <List.Item onClick={() => closeModal()}>Exit</List.Item>
                    </List>
                }]}
            >
                {loading
                    ?
                    <Frame w={500} h={150} padding={4}>
                        <Frame h="100%" boxShadow="in" style={{ display: "flex" }}>
                            <div style={{ margin: "auto" }}>
                                <ProgressBar width={200} percent={49} />
                                <p style={{ textAlign: "center" }}>Loading data...</p>
                            </div>
                        </Frame>
                    </Frame>
                    :
                    <div id="my-board" className={`${styles['game']} ${styles['outer-border']}`}>
                        <div className={`${styles['game-status']} ${styles['inner-border']}`}>
                            <DigitsDisplay digits={3} value={minesCounter} />
                            <Smiley
                                state={gameEnded ? (win ? 'WIN' : 'LOSE') : (processing ? 'SCARED' : 'NORMAL')}
                                onClick={onNewGame}
                            />
                            {/* <DigitsDisplay digits={4} value={0} /> */}
                            <div style={{ textAlign: "right" }}>
                                Prize Pool
                                <div style={{ marginTop: "3px" }}>{deposit} OAS</div>

                            </div>

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
                                            // onMouseDown={(e) => e.button === 0 && setMouseDownOnTile(true)}
                                            // onMouseUp={(e) => e.button === 0 && setMouseDownOnTile(false)}
                                            />)
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                }
            </Modal>
        </>
    )
}

export default Minesweeper