import React, { useContext } from 'react'
import { TaskBar, List } from '@react95/core'
import styled from 'styled-components'
import { ModalContext } from '../hooks/useModal';
import { ReaderClosed, WindowsExplorer, Progman39, Winmine1, Progman36, Dialer1, InfoBubble, Dialmon200, Computer3, FolderExe2 } from '@react95/icons';
import { AccountContext } from '../hooks/useAccount';
import { useWeb3React } from '@web3-react/core';

const Link = styled.a`

`

const Taskbar = () => {
    
    const  {account } = useWeb3React()

    const { disconnect } = useContext(AccountContext) 

    const { showAboutModal, showSignInModal } = useContext(ModalContext)

    const toggleSecond = (x) => {

    }

    const toggleFirst = (x) => {

    }

    return (
        <TaskBar
            list={
                <List> 
                    <List.Item
                        icon={<Dialmon200 variant="32x32_4" />}
                        onClick={() => {
                            !account && showSignInModal();
                        }}
                    >
                        Connect Wallet
                    </List.Item>
                    <List.Item
                        icon={<Progman36 variant="32x32_4" />}
                        onClick={() => {
                            toggleFirst(true);
                        }}
                    >
                        Deposit OAS
                    </List.Item>
                    <List.Item icon={<FolderExe2 variant="32x32_4" />}>
                        <List>
                            <List.Item icon={<Winmine1 variant="16x16_4" />}>
                                Minesweeper
                            </List.Item>
                        </List>
                        Programs
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
            }
        />
    )
}

export default Taskbar