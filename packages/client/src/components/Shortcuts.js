import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Icon, List, Frame, Avatar } from '@react95/core'
import Blockies from 'react-blockies';
import { Sol1, Access219, Progman42, Progman11, Progman24, Ulclient1002, MicrosoftExchange, Progman39, Dialer1, Winmine1, InfoBubble, Dialmon200, Progman36, Msrating109, Textchat2, Write1 } from "@react95/icons"
import { ModalContext } from '../hooks/useModal'
import { useWeb3React } from '@web3-react/core'
import { AccountContext } from '../hooks/useAccount'
import { shortAddress } from '../helpers';

const Wrapper = styled.div`
  padding: 20px; 
  display: flex;
  flex-direction: row;
`

const LeftCol = styled.div`
  flex: 1; 
  display: flex;
  flex-direction: column;
  max-width: 100px;
`

const RightCol = styled.div`
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

  // const [totalEth, setTotalEth] = useState()

  const { corrected, getBalance } = useContext(AccountContext)
  const {
    showAboutModal,
    showSignInModal,
    showMinesweeperModal,
    showMarketplaceModal,
    showChatModal,
    showInventoryModal,
    showFaucetModal
  } = useContext(ModalContext)

  // useEffect(() => {
  //   account && getBalance().then(setTotalEth)
  // }, [account])

  return (
    <Wrapper>
      <LeftCol>
        {!corrected && (
          <IconContainer
            onClick={() => !account && showSignInModal()}
          >
            <img
              src={"/icons/metamask-icon.png"}
              height={32}
              width={32}
              className="pointer"
            />
            Connect
            <br />
            Wallet
          </IconContainer>
        )}

        {/* <IconContainer
          onClick={() => {
            if (account && corrected) {
              showChatModal()
            } else {
              alert("Connect wallet first!")
            }
          }}
        >
          <img
            src={"/icons/talk-icon.png"}
            height={32}
            width={32}
            className="pointer"
          />
          Community<br />Chat
        </IconContainer> */}

        <IconContainer
          onClick={() => alert("Coming Soon")}
        >
          <img
            src={"/icons/poker-2.png"}
            height={32}
            width={32}
            className="pointer"
          />
          Blackjack
        </IconContainer>

        <IconContainer
          onClick={() => showMinesweeperModal()}
        >
          <img
            src={"/icons/minesweeper-icon.png"}
            height={32}
            width={32}
            className="pointer"
          />
          Minesweeper
        </IconContainer>

        <IconContainer
          onClick={() => showMarketplaceModal()}
        >
          <Access219
            title={"NFT Marketplace"}
            variant="32x32_4"
            className='pointer'
          />
          Marketplace
        </IconContainer>
        <IconContainer
          onClick={() => showFaucetModal()}
        >
          <Progman42
            title={"Testnet Faucet"}
            variant="32x32_4"
            className='pointer'
          />
          Testnet<br />Faucet
        </IconContainer>
        <IconContainer
          onClick={() => showAboutModal()}
        >
          <InfoBubble
            title={"About"}
            variant="32x32_4"
            className='pointer'
          />
          RetroWeb3
          <br />
          .Games
        </IconContainer>

        {corrected && (
          <>
            <IconContainer
              onClick={() => showInventoryModal()}
            >
              <Progman24
                title={"My Inventory"}
                variant="32x32_4"
                className='pointer'

              />
              My Inventory
            </IconContainer>
            {/* <IconContainer
              onClick={() => !account && showSignInModal()}
            >
              <Progman3
                title={"Transaction History"}
                variant="32x32_4"
                className='pointer'

              />
              Transaction<br />
              History
            </IconContainer> */}
          </>
        )

        }

      </LeftCol>
      {/* <RightCol>
        <div style={{ margin: "auto", marginRight: "10px", display: "flex", flexDirection: "column" }}>
          <IconContainer
            onClick={() => !account && showSignInModal()}
          >
            <Person116
              title={"Connect Web3 Wallet"}
              style={{ width: "32px", height: "32px" }}
              className='pointer'

            />
            My Inventory
          </IconContainer>
          <IconContainer
            onClick={() => !account && showSignInModal()}
          >
            <Dialmon200
              title={"Connect Web3 Wallet"}
              variant="32x32_4"
              className='pointer'

            />
            Transaction<br />
            History
          </IconContainer>
        </div>
      </RightCol> */}

    </Wrapper>
  )
}


export default Shortcuts