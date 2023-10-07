import React, { useContext, useEffect } from 'react'
import { Modal, Frame, Avatar, Button } from '@react95/core'
import { Dialmon200 } from '@react95/icons'
import styled from 'styled-components';
import { useCallback } from 'react';

import { AccountContext } from "../hooks/useAccount"
import { useWeb3React } from '@web3-react/core';

const StyledButton = styled(Button)`
    width: 150px;
    cursor: pointer;
    margin: 10px;
    margin-left:auto;
    margin-right: auto;
    img, h3 {
        cursor: pointer;
    }
`

const Text = styled.div`
    padding: 5px;
    font-size: 11px;
    text-align: center;
`


const SignIn = ({ closeModal }) => {

    const { account } = useWeb3React()

    const { connect } = useContext(AccountContext)

    const onConnect = useCallback(() => {
        if (!account) {
            connect()
        }
    }, [account])

    const onConnectTrust = useCallback(() => {
        if (!account) {
            connect(1)
        }
    }, [account])

    useEffect(() => {
        account && closeModal()
    }, [account])

    return (
        <Modal
            width="400"
            icon={<Dialmon200 variant="32x32_4" />}
            title="Connect Wallet"
            closeModal={closeModal}
            buttons={[{ value: "Close", onClick: closeModal }]}
            style={{ left: "40%", top: "5%", display: "flex" }}
        >
            <div style={{ display: "flex", flexDirection: "row" }}>
                <StyledButton
                    onClick={onConnect}
                >
                    <img
                        src={"/metamask-icon.svg"}
                        height={60}
                        width={60}
                        class="ml-auto mr-auto mt-2 mb-4"
                    />
                    <h3>MetaMask</h3>
                </StyledButton>
                <StyledButton
                    onClick={onConnectTrust}
                >
                    <img
                        src={"/trust-wallet-icon.svg"}
                        height={60}
                        width={60}
                        class="ml-auto mr-auto mt-2 mb-4"
                    />
                    <h3>Trust Wallet</h3>
                </StyledButton>
            </div>
            <Text>
                Support <a href="https://aagventures.readme.io/reference/saakuru-blockchain-environments" target="_blank">Saakuru Testnet</a> only
            </Text>
        </Modal>
    )
}

export default SignIn