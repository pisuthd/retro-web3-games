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
import '@react95/icons/icons.css';

// const BodyFontSizeOverride = createGlobalStyle`
//   body{
//     font-size: 15px
//   }
// `;

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
        <ModalProvider>
          <ThemeProvider>
            <GlobalStyle />
            {/* <BodyFontSizeOverride /> */}
            <App />
          </ThemeProvider>
        </ModalProvider>
      </AccountProvider>
    </Web3ReactProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
