import React, { useContext, useEffect } from 'react'
import { Modal, Frame, Avatar, Button } from '@react95/core'
import { Dialmon200 } from '@react95/icons'
import styled from 'styled-components';
import { useCallback } from 'react';

import { AccountContext } from "../hooks/useAccount"
import { useWeb3React } from '@web3-react/core';

const StyledButton = styled(Button)`
    width: 200px;
    cursor: pointer;
    margin: 10px;
    margin-left:auto;
    margin-right: auto;
    img, h3 {
        cursor: pointer;
    }
`

const SignIn = ({ closeModal }) => {

    const { account } = useWeb3React()

    const { connect } = useContext(AccountContext)

    const onConnect = useCallback(() => {

        if (!account) {
            connect()
        } 

    },[account])

    useEffect(() => {
        account && closeModal()
    },[account])

    return (
        <Modal
            width="300"
            icon={<Dialmon200 variant="32x32_4" />}
            title="Connect Wallet"
            closeModal={closeModal}
            buttons={[{ value: "Close", onClick: closeModal }]}
            style={{ left: "40%", top: "5%", display: "flex" }}
        >
            <StyledButton
                onClick={onConnect}
            >
                <img
                    src={"/metamask-icon.svg"}
                    height={80}
                    width={80}
                    class="ml-auto mr-auto mt-2 mb-4"
                />
                <h3>MetaMask</h3>
            </StyledButton>
            <div style={{ padding: "5px", fontSize: "11px", textAlign :"center" }}>
                Support <a href="https://docs.oasys.games/docs/staking/rpc-endpoint/1-1-rpc-endpoint" target="_blank">Oasys Testnet</a> only
            </div>
        </Modal>
    )
}

export default SignIn