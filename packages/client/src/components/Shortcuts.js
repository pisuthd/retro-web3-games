import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Icon, List, Frame, Avatar } from '@react95/core'
import Blockies from 'react-blockies';
import { WindowsExplorer, Progman39, Dialer1, Winmine1, InfoBubble, Dialmon200, Progman36 } from "@react95/icons"
import { ModalContext } from '../hooks/useModal'
import { useWeb3React } from '@web3-react/core'
import { AccountContext } from '../hooks/useAccount'
import { shortAddress } from '../helpers';

const Wrapper = styled.div`
  padding: 20px; 
  display: flex;
  flex-direction: row;
`

const MenuCol = styled.div`
  flex: 1; 
  display: flex;
  flex-direction: column;
  max-width: 100px;
`

const ContentCol = styled.div`
  flex: 8; 
  display: flex;
  flex-direction: column;
`

const IconContainer = styled.button`
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;  
  border: none; 
  background-color: transparent; 
  margin-bottom: 15px;

  i,
  :hover {
    cursor: pointer;
  }

  i {
    margin-bottom: 8;
  }

  :hover {
    box-shadow: out;
  }
`;

const Shortcuts = () => {

  const { account } = useWeb3React()

  const [totalEth, setTotalEth] = useState()

  const { corrected, getBalance } = useContext(AccountContext)
  const { showAboutModal, showSignInModal, showMinesweeperModal } = useContext(ModalContext)

  useEffect(() => {
    account && getBalance().then(setTotalEth)
  }, [account])

  return (
    <Wrapper>
      <MenuCol>
        <IconContainer
          onClick={() => !account && showSignInModal()}
        >
          <Dialmon200
            title={"Connect Web3 Wallet"}
            variant="32x32_4"
            className='pointer'

          />
          Connect
          <br />
          Wallet
        </IconContainer>
        {/* <IconContainer>
          <Progman36
            title={"Deposit OAS tokens"}
            variant="32x32_4"
            className='pointer'
            onClick={() => alert("hello")}
          />
          Deposit
          <br />
          OAS
        </IconContainer> */}
        <IconContainer
          onClick={() => {
            if (account && corrected) {
              showMinesweeperModal()
            } else {
              alert("Connect wallet first!")
            }
          }}
        >
          <Winmine1
            title={"Play Minesweeper"}
            variant="32x32_4"
            className='pointer'
          />
          Minesweeper
        </IconContainer>

        <IconContainer
          onClick={() => showAboutModal()}
        >
          <InfoBubble
            variant="32x32_4"
            className='pointer'
          />
          RetroWeb3
          <br />
          .Games
        </IconContainer>
      </MenuCol>

      <ContentCol>
        <Frame w={300} padding={4} style={{ marginLeft: "auto" }}>
          <Frame padding={10} h="100%" boxShadow="in">

            {!account && (
              <div style={{ textAlign: "center", padding: "10px", paddingBottom: "5px" }}>
                <div>Not Connected</div>
              </div>
            )}

            {(account && !corrected) && (
              <div style={{ textAlign: "center", padding: "10px", paddingBottom: "5px" }}>
                <div>Please switch to Oasys SAND Verse (Id: 20197 )</div>
              </div>
            )}

            {(account && corrected) && (
              <div style={{ textAlign: "center", padding: "10px", paddingBottom: "5px" }}>
                <div>{shortAddress(account)}</div>
              </div>
            )}

          </Frame>
        </Frame>
      </ContentCol>

    </Wrapper>
  )
}


export default Shortcuts