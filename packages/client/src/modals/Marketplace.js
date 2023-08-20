import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Modal, Frame, Avatar, ProgressBar, Button } from '@react95/core'
import { Access219 } from '@react95/icons'
import styled from 'styled-components';
import { InventoryContext } from '../hooks/useInventory';
import { parseError } from '../helpers';

const Panel = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`

const ItemContainer = styled.div`
    width: 150px;
    min-height: 200px;
    margin: 5px; 

`

const StyledButton = styled(Button)`
    width: 100%;
    :not(:last-child) {
        margin-bottom: 5px;
    }
`

const Info = styled.div`
    font-size: 11px;
    margin-right: 10px;
    b {
         
    }
    >div {
        margin-top: 5px;
    }
    
`

const Marketplace = ({
    closeModal
}) => {


    return (
        <Modal
            width="800"
            icon={<Access219 variant="32x32_4" />}
            title="NFT Marketplace"
            closeModal={closeModal}
            buttons={[{ value: "Close", onClick: closeModal }]}
            defaultPosition={{
                x: 300,
                y: 80,
            }}
        >
            <Item
                title="Flag"
                description="The in-game asset used in the in the Minesweeper game to make hidden mines. You will receive deposited flags back and/or more as rewards when winning the game determined by the time taken to complete the game."
                image={"https://img.tamagonft.xyz/retroweb3-games/retro-flag.png"}
                options={[100]}
                tokenId={1}
                applications="Minesweeper"
                unitPrice={"0.1 OAS = 100 Units"}
            />
            <Item
                title="Gold Coin"
                description="The Gold Coin NFT is used in the blackjack game, a classic card game that challenges players to reach a card value of 21 or get as close to it as possible without exceeding."
                image={"https://img.tamagonft.xyz/retroweb3-games/retro-coin.png"}
                options={[1000, 3000]}
                tokenId={2}
                applications="Blackjack"
                unitPrice={"0.1 OAS = 1,000 Units"}
            />
        </Modal>
    )
}

const Item = ({
    title,
    image,
    tokenId,
    options,
    description,
    unitPrice,
    applications
}) => {

    const [errorMessage, setErrorMessage] = useState()

    const { mint, sellAll, increaseTick } = useContext(InventoryContext)

    const onMint = useCallback(async (amount) => {

        try {

            setErrorMessage()

            const tx = await mint(tokenId, amount, tokenId === 1 ? amount * 0.001 : amount * 0.0001)

            setErrorMessage("Minting...")

            await tx.wait()

            setErrorMessage("Done")

            increaseTick()
        } catch (e) {
            console.log(e)
            setErrorMessage(parseError(e))
        }

    }, [tokenId, mint, increaseTick])

    const onSell = useCallback(async () => {

        try {

            setErrorMessage()

            const tx = await sellAll(tokenId)

            setErrorMessage("Executing...")

            await tx.wait()

            setErrorMessage("Done")

            increaseTick()
        } catch (e) {
            console.log(e)
            setErrorMessage(parseError(e))
        }

    }, [tokenId, sellAll, increaseTick])

    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <Frame w={"80%"} h={150} boxShadow="in" marginBottom={10} >
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <img
                        src={image}
                        width="140px"
                        height="140px"
                        style={{ margin: "5px" }}
                    />
                    <div style={{ marginLeft: "10px" }}>
                        <h3 style={{ padding: "0px", marginBottom: "5px" }}>
                            {title}
                        </h3>
                        <div style={{ height: "50px" }}>
                            {description}
                        </div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <Info>
                                <b>Type</b>
                                <div>
                                    ERC-1155
                                </div>
                            </Info>
                            <Info>
                                <b>Application</b>
                                <div>
                                    {applications}
                                </div>
                            </Info>
                            <Info>
                                <b>Unit Price</b>
                                <div>
                                    {unitPrice}
                                </div>
                            </Info>
                            <Info>
                                <b>Buyback Price At</b>
                                <div>
                                    30%
                                </div>
                            </Info>
                        </div>
                    </div>
                </div>
            </Frame>
            <div style={{ display: "flex", padding: "10px", flex: 1 }}>
                <div style={{ margin: "auto" }}>
                    {options.map((option, index) => {
                        return (
                            <StyledButton onClick={() => { 
                                onMint(option)
                            }} key={index}>Mint {option.toLocaleString()} Units</StyledButton>
                        )
                    })}
                    <StyledButton onClick={onSell}>Sell Them All</StyledButton>
                    <div style={{ margin: "3px", height: "18px", color: "blue", textAlign: "center" }}>
                        {errorMessage}
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Marketplace