import React, { useContext, forwardRef, createContext } from 'react'
import { TaskBar, List, Frame, ModalContext as ModalContextSDK, Tooltip } from '@react95/core'
import styled from 'styled-components'
import { ModalContext } from '../hooks/useModal';
import { Access219, Progman24, Sol1, Progman11, Logo, ReaderClosed, WindowsExplorer, Progman39, Winmine1, Progman36, Dialer1, InfoBubble, Dialmon200, Computer3, FolderExe2 } from '@react95/icons';
import { AccountContext } from '../hooks/useAccount';
import { useWeb3React } from '@web3-react/core';
import WindowButton from './WindowButton';
import { shortAddress } from "../helpers"

const Truncate = styled.span`
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-align: left;
`;

const StyledTooltip = styled(Tooltip)`
  div:first-child {
    right: 0;
  }
`;

const Taskbar = forwardRef(({ list }, ref) => {

    const [showList, toggleShowList] = React.useState(false);
    const [activeStart, toggleActiveStart] = React.useState(false);
    const { showBlackjackModal, showAboutModal, showSignInModal, showMinesweeperModal, showInventoryModal, showMarketplaceModal, showPetSitterModal } = useContext(ModalContext)
    const { windows, activeWindow, setActiveWindow } = React.useContext(ModalContextSDK);

    const { account } = useWeb3React()
    const { disconnect, corrected } = useContext(AccountContext)

    return (
        <Frame
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            display="flex"
            justifyContent="space-between"
            h={28}
            w="100%"
            padding={2}
            zIndex="taskbar"
            ref={ref}
        >
            {showList && (
                <Frame
                    position="absolute"
                    bottom="28"
                    onClick={() => {
                        toggleActiveStart(false);
                        toggleShowList(false);
                    }}
                >
                    <List>

                        {corrected && (
                            <List.Item icon={<FolderExe2 variant="32x32_4" />}>
                                <List>
                                    <List.Item
                                        icon={<img
                                            src={"/icons/poker-2.png"}
                                            height={16}
                                            width={16}
                                        />}
                                        onClick={() => showBlackjackModal()}
                                    >
                                        Blackjack
                                    </List.Item>
                                    <List.Item
                                        icon={<Winmine1 variant="16x16_4" />}
                                        onClick={() => {
                                            if (account && corrected) {
                                                showMinesweeperModal()
                                            } else {
                                                alert("Connect wallet first!")
                                            }
                                        }}
                                    >
                                        Minesweeper
                                    </List.Item>
                                    <List.Item
                                        icon={<img
                                            src={"/pet-sitter-icon.png"}
                                            height={16}
                                            width={16}
                                        />}
                                        onClick={() => showPetSitterModal()}
                                    >
                                        Tomo Playground
                                    </List.Item>
                                    {/* <List.Item
                                        icon={<img
                                            src={"/icons/marketplace-icon-3.png"}
                                            height={16}
                                            width={16} 
                                          />}
                                        onClick={() => showMinesweeperModal()}
                                    >
                                        NFT Marketplace
                                    </List.Item> */}
                                </List>
                                Programs
                            </List.Item>
                        )

                        }
                        {corrected && (
                            <List.Item
                                icon={<Progman24
                                    title={"My Inventory"}
                                    variant="32x32_4"
                                    className='pointer'

                                />}
                                onClick={() => showInventoryModal()}
                            >
                                My Inventory
                            </List.Item>
                        )}
                        {!corrected && (
                            <List.Item
                                icon={<img
                                    src={"/icons/metamask-icon.png"}
                                    height={32}
                                    width={32}
                                />}
                                onClick={() => {
                                    !account && showSignInModal();
                                }}
                            >
                                Connect Wallet
                            </List.Item>
                        )}


                        {/* <List.Item
                            icon={  <img
                                src={"/icons/talk-icon.png"}
                                height={32}
                                width={32} 
                              />}
                            onClick={() => {
                                showAboutModal();
                            }}
                        >
                            Community Chat
                        </List.Item> */}
                        <List.Item
                            icon={<Access219
                                variant="32x32_4"

                            />}
                            onClick={() => showMarketplaceModal()}
                        >
                            Marketplace
                        </List.Item>

                        <List.Item
                            icon={<InfoBubble variant="32x32_4" />}
                            onClick={() => {
                                showAboutModal();
                            }}
                        >
                            About
                        </List.Item>
                        <List.Divider />
                        <List.Item
                            icon={<Computer3 variant="32x32_4" />}
                            onClick={() => {
                                disconnect();
                            }}
                        >
                            Shut Down...
                        </List.Item>
                    </List>
                </Frame>
            )}
            <WindowButton
                small
                icon={<img
                    src={"/retro-icon.png"}
                    height={27}
                    width={56}
                    class="ml-auto mr-auto"
                />}
                active={activeStart}
                onClick={() => {
                    toggleActiveStart(!activeStart);
                    toggleShowList(!showList);
                }}
            >
                Start
            </WindowButton>
            <Frame boxShadow="none" w="100%" paddingLeft={0} ml={2} display="flex">
                {Object.entries(windows).map(
                    ([windowId, { icon, title, hasButton }]) =>
                        hasButton && (
                            <WindowButton
                                key={windowId}
                                icon={icon}
                                active={windowId === activeWindow}
                                onClick={() => setActiveWindow(windowId)}
                                small={false}
                            >
                                <Truncate>{title}</Truncate>
                            </WindowButton>
                        ),
                )}
            </Frame>

            {/* wallet status */}
            <Frame
                boxShadow="in"
                bg="transparent"
                px={6}
                py={2}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <StyledTooltip>
                    {!account && (
                        <div>Not Connected</div>
                    )}
                    {(account && !corrected) && (
                        <div>Wrong Network</div>
                    )}
                    {(account && corrected) && (
                        <div style={{ flex: "row", flexDirection: "row" }}>
                            <div>Connected</div>
                        </div>
                    )}
                </StyledTooltip>
            </Frame>
        </Frame>
    )
})

export default Taskbar