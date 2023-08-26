import React, { useCallback, useEffect, useState } from 'react'
import { Modal, Frame, Avatar } from '@react95/core'
import { Progman42 } from '@react95/icons'
import styled from 'styled-components';
import useFaucet from '../hooks/useFaucet';
import { parseError } from '../helpers';
import { useWeb3React } from '@web3-react/core';

const ErrorBox = styled.div`
    height: 20px;
    text-align: center; 
`

const Faucet = ({
    closeModal
}) => {

    const [balance, setBalance] = useState("N/A")
    const [tick, setTick] = useState(0)
    const [address, setAddress] = useState()

    const { account } = useWeb3React()

    const { claim, getBalance } = useFaucet()

    const [errorMessage, setErrorMessage] = useState()

    useEffect(() => {
        account && setAddress(account)
    }, [account])

    useEffect(() => {
        setTimeout(() => {
            getBalance().then(setBalance)
        }, tick === 0 ? 0 : 5000)
    }, [tick])

    const onClaim = useCallback(async () => {

        try {

            setErrorMessage("Sending...")

            await claim(address)

            setErrorMessage()

            setTick(tick + 1)

        } catch (e) {
            console.log(e)
            setErrorMessage(parseError(e))
        }

    }, [claim, tick, address])

    return (
        <Modal
            width="300"
            icon={<Progman42 variant="32x32_4" />}
            title="Testnet Faucet"
            closeModal={closeModal}
            buttons={[{ value: "Send Me OAS", onClick: onClaim }, { value: "Close", onClick: closeModal }]}
            defaultPosition={{
                x: 450,
                y: 40,
            }}
        >
            <div style={{ textAlign: "center", padding: "10px", fontSize: "13px" }}>
                We provide the faucet for Saakuru Testnet, allowing you to claim 0.1 OAS per request, please note that this is not real money
            </div>
            <div style={{ textAlign: "center", padding: "10px" }}>
                Faucet Available : {balance}
            </div>
            <div style={{ textAlign: "center" }}>
                <input type="text" style={{ width: "100%", marginTop: "5px" }} onChange={(e) => setAddress(e.target.value)} value={address} placeholder='0x12345678' />
            </div>
            <ErrorBox>
                {errorMessage && <span style={{ color: "blue" }}>{errorMessage}</span>}
            </ErrorBox>
        </Modal>
    )
}

export default Faucet