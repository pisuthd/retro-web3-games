import React from 'react'
import { Modal, Frame, Avatar } from '@react95/core'
import { InfoBubble } from '@react95/icons'
import styled from 'styled-components';

const Logo = styled.img.attrs(() => ({ src: "./logo.gif" }))`
    width: 220px;
    height: 220px; 
    margin: 20px;
`

const About = ({
    closeModal
}) => {
    return (
        <Modal
            width="500"
            icon={<InfoBubble variant="32x32_4" />}
            title="Welcome"
            closeModal={closeModal}
            buttons={[{ value: "Close", onClick: closeModal }]}
            defaultPosition={{
                x: 500,
                y: 20,
            }}
        >
            <div style={{ textAlign: "center" }}>
                <Logo />
            </div>
            <Frame
                style={{ marginBottom: 10, fontSize: "14px", lineHeight: "18px" }}
                bg="white"
                boxShadow="in"
                height="100%"
                width="100%"
                padding="0px 5px"
            >
                {/* <h3><i>What is RetroWeb3.Games?</i></h3> */}
                <p>
                    RetroWeb3.Games revives the classic games from your childhood, turning them into fully on-chain play-to-earn experiences that utilize the Oasys blockchain and zero-knowledge technology.
                </p>
                <h3><i>How to play</i></h3>
                <p>
                    The rule is simple, you need to deposit OAS tokens before playing the game and keep playing. If you encounter a loss, the penalty will be deducted from your account and distributed among other players.
                </p>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{flex :1}}>
                        <h3><i>Game list</i></h3>
                        <p>
                            Minesweeper
                        </p>
                    </div>
                     
                </div>

            </Frame>
        </Modal>
    )
}

export default About