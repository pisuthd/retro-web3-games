import React, { useContext, useState, useCallback, useEffect } from 'react'
import { Modal, Frame, Avatar, List, ProgressBar, Alert } from '@react95/core'
import styled from 'styled-components'

import Hand from '../components/Hand'
import { BlackjackContext } from '../hooks/useBlackjack'
import Control from '../components/Control'

const Body = styled.div`
    height: 50vh;
    background: #008000;
    margin: 0px; 
    position: relative;
`

const TopPanel = styled.div`
    position: absolute;  
    width: 100%;
    color: white;
    text-shadow: black 1px 2px;
`

const LoadingFrame = styled(Frame)`
    position: absolute;  
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
`



const Blackjack = ({ closeModal }) => {

    const { game, balance, deal, action } = useContext(BlackjackContext)

    console.log("game : ", game)

    const [loading, setLoading] = useState(false)

    const onDeal = useCallback(async (amount) => {
        setLoading(true)
        try {
            await deal(amount)
        } catch (e) {
        }
        setLoading(false)
    }, [deal])

    const onAction = useCallback(async (type) => {
        try {
            await action(type)
        } catch (e) {
        }
    }, [action])

    const message = game && game.state !== "userTurn" ? game.state : undefined

    return (
        <>
            <Modal
                width="700"
                icon={<img
                    src={"/icons/poker-2.png"}
                    height={16}
                    width={16}
                />}
                title="Blackjack"
                closeModal={closeModal}
                defaultPosition={{
                    x: 300,
                    y: 0,
                }}
                menu={[{
                    name: 'File',
                    list: <List>
                        <List.Item onClick={() => closeModal()}>Exit</List.Item>
                    </List>
                }]}
            >
                <Body>
                    <TopPanel>
                        <div style={{ display: "flex", padding: "10px" }}>
                            <div style={{ flex: 1 }}>
                                Balance: {balance}
                            </div>
                            <div style={{ flex: 1, textAlign: "center" }}>
                                {game && `Dealer Score: ${game.dealerScore}`}
                            </div>
                            <div style={{ flex: 1, textAlign: "right" }}>
                                {!game && "Not started"}
                                {game && `Bet: ${game.bet}`}
                            </div>
                        </div>

                    </TopPanel>
                    <Hand
                        game={game}
                        side="Dealer"
                    />
                    <Hand
                        game={game}
                        side="Player"
                    />
                    <Control
                        game={game}
                        onDeal={onDeal}
                        onAction={onAction}
                    />
                    {loading && (
                        <LoadingFrame w={250} h={60} padding={4}>
                            <Frame h="100%" boxShadow="in" style={{ display: "flex" }}>
                                <div style={{ margin: "auto" }}>
                                    Creating New Game...
                                </div>
                            </Frame>
                        </LoadingFrame>
                    )}
                    {!loading && message && (
                        <LoadingFrame w={250} h={60} padding={4}>
                            <Frame h="100%" boxShadow="in" style={{ display: "flex" }}>
                                <div style={{ margin: "auto" }}>
                                    <h2 style={{ padding: "0px", margin: "0px", textAlign : "center" }}>
                                        {message === "userWin" && "You've Won 🎉"}
                                        {message === "dealerWin" && "You've Lost 😢"}
                                        {message === "bust" && "Busted ❌"}
                                        {message === "tie" && "Tie"}

                                    </h2>
                                    <div style={{ fontSize: "13px", textAlign: "center", marginTop: "5px" }}>
                                        Your Score: {game && game.userScore}
                                    </div>
                                </div>

                            </Frame>
                        </LoadingFrame>
                    )}
                </Body>
            </Modal>
        </>
    )
}

export default Blackjack