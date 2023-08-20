import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Modal, Frame, Avatar, ProgressBar } from '@react95/core'
import { Progman24 } from '@react95/icons'
import styled from 'styled-components';
import useFaucet from '../hooks/useFaucet';
import { parseError } from '../helpers';
import { useWeb3React } from '@web3-react/core';
import { AccountContext } from '../hooks/useAccount';
import { InventoryContext } from '../hooks/useInventory';

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

const Inventory = ({
    closeModal
}) => {

    const { account } = useWeb3React()

    const [totalEth, setTotalEth] = useState()

    const { getBalance } = useContext(AccountContext)
    const { collections, loading } = useContext(InventoryContext)

    useEffect(() => {
        account && getBalance().then(setTotalEth)
    }, [account])

    return (
        <Modal
            width="500"
            icon={<Progman24 variant="32x32_4" />}
            title="My Inventory"
            closeModal={closeModal}
            buttons={[{ value: "Close", onClick: closeModal }]}
            defaultPosition={{
                x: 500,
                y: 40,
            }}
        >

            <div style={{ textAlign: "center", padding: "5px", fontSize: "13px" }}>
                Balance:
            </div>
            <div style={{ textAlign: "center", padding: "5px", fontSize: "20px" }}>
                {totalEth} OAS
            </div>

            <div style={{ textAlign: "center", padding: "5px", paddingBottom: "0px", fontSize: "13px" }}>
                NFTs:
            </div>

            {loading && (
                <div style={{ textAlign: "center", padding: "20px", paddingBottom: "0px", fontSize: "16px", fontStyle: "italic" }}>
                    Loading...
                </div>
            )

            }

            {!loading && collections.length === 0 && (
                <div style={{ textAlign: "center", padding: "20px", paddingBottom: "0px", fontSize: "16px", fontStyle: "italic" }}>
                    None
                </div>
            )}

            <Panel>
                {!loading && collections.map((item, index) => {
                    return (
                        <ItemContainer key={index}>
                            <Item
                                item={item}
                                delay={index * 300}
                            />
                        </ItemContainer>
                    )
                })}
            </Panel>
        </Modal>
    )
}

const Item = ({ item, delay }) => {

    const { getInfo } = useContext(InventoryContext)

    const [info, setInfo] = useState()

    useEffect(() => {

        setTimeout(() => {
            const { tokenType, tokenId, address } = item
            getInfo(tokenType, address, tokenId).then(setInfo)

        }, delay)

    }, [delay, item])

    return (
        <Frame
            style={{ marginBottom: 10, fontSize: "14px", lineHeight: "18px", height: "100%", display: "flex", flexDirection: "column" }}
            bg="white"
            boxShadow="in"
            height="100%"
            width="100%"
            padding="0px 5px"
        >
            <div style={{ marginLeft: "auto", marginRight: "auto", padding: "5px", paddingBottom: "0px" }}>
                <img
                    src={info && info.image ? info.image : "https://img.tamagonft.xyz/retroweb3-games/retro-logo.png"}
                    width="100%"
                />
            </div>
            <h3 style={{ marginLeft: "auto", marginRight: "auto", padding: "0px", margin: "0px", textAlign: "center" }}>
                {info && info.name ? info.name : "UNNAMED"}
            </h3>
            <div style={{ textAlign: "center", fontSize: "11px", fontStyle: "italic" }}>
                {info && info.application ? info.application : "UNNAMED"}
            </div>
            <div style={{ textAlign: "center", fontSize: "11px" }}>
                {item && item.tokenType === "ERC1155" ? `Amount: ${Number(item.value).toLocaleString()}` : "ERC-721"}
            </div>
        </Frame>
    )
}

export default Inventory