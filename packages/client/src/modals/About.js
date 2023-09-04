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
                <p>
                    RetroWeb3.Games is a platform for classic/retro/mini games in Web3 on the Oasys L-2 Sakuuru blockchain utilizing Merkle Tree verification for a fully on-chain experience and enjoys a secure and transparent gaming environment.
                </p>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div style={{ flex: 1 }}>
                        <h4><i>Game Available</i></h4>
                        <ul>
                            <li>Minesweeper - A puzzle game where you flag hidden mines with Flag NFT and the person who flags the last mine will win the prize pool.</li>
                            <li>Blackjack - A classic card game where the objective is to have a hand value as close to 21 as possible and compete against the dealer.</li>
                            <li>Tomo Playground - A mini-game where Tomo's virtual pet can socialize with others and earn happiness points.</li>
                        </ul>
                    </div>
                </div>
                <p>
                    
                </p>
            </Frame>
        </Modal>
    )
}

export default About