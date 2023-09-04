import React from 'react';
import { createGlobalStyle } from 'styled-components';
import ReactDOM from 'react-dom/client';
import { ethers } from "ethers";
import { Web3ReactProvider } from '@web3-react/core';
// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, GlobalStyle } from '@react95/core';
import ModalProvider from "./hooks/useModal"
import AccountProvider from "./hooks/useAccount"
import MinesweeperProvider from './hooks/useMinesweeper';
import InventoryProvider from "./hooks/useInventory"
import BlackjackProvider from "./hooks/useBlackjack"
import TomoProvider from "./hooks/useTomo"
import '@react95/icons/icons.css';
import styled from 'styled-components';

const getRandomWallpaper = () => {
  const allWallpapers = ["wallpaper-1.png", "wallpaper-2.png"]
  const item = allWallpapers[Math.floor(Math.random() * allWallpapers.length)];
  return item
}

const BackgroundOverride = createGlobalStyle`
  body {
    ${props => props.wallpaper && `background-image: url("${props.wallpaper}");`} 
    background-size: cover;
    background-repeat: no-repeat;
  }
`

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Web3ReactProvider getLibrary={getLibrary}>
      <AccountProvider>
        <MinesweeperProvider>
          <BlackjackProvider>
            <InventoryProvider>
              <TomoProvider>
                <ModalProvider>
                  <ThemeProvider>
                    <GlobalStyle />
                    <BackgroundOverride wallpaper={getRandomWallpaper()} />
                    <App />
                  </ThemeProvider>
                </ModalProvider>
              </TomoProvider>
            </InventoryProvider>
          </BlackjackProvider>
        </MinesweeperProvider>
      </AccountProvider>
    </Web3ReactProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
