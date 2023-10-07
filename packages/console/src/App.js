 
import React, { useState } from 'react'; 
import styled from 'styled-components';
import Taskbar from './components/Taskbar';
import Desktop from "./components/Desktop"

const Wrapper = styled.div` 
  height: 100vh;
  background: ${({ theme }) => theme.desktopBackground};
`;

function App() {

  return (
    <Wrapper>
        <Taskbar/>
        <Desktop/>
    </Wrapper>
  );
}

export default App;
