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
                {/* <h3><i>RetroWeb3.Games</i></h3> */}
                <p>
                    RetroWeb3.Games collects the classic games and turns it into fully on-chain play-to-earn experiences that utilize the Oasys blockchain and zero-knowledge proof technology.
                </p>
                
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{flex :1}}>
                        <h4><i>Game Available</i></h4>
                        <ul>
                            <li>Minesweeper - A puzzle game where you flag hidden mines with OAS tokens and the person who flags the last mine will win the prize pool.</li>
                        </ul>
                    </div>
                     
                </div>

            </Frame>
        </Modal>
    )
}

export default About