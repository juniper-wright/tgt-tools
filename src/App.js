import React from 'react';
import styled from 'styled-components'
import { Routes, Route } from 'react-router-dom';

import Spells from './features/spells';
import Wildshape from './features/wildshape';
import Randumgeon from './features/randumgeon';
import NavButton from './components/navButton';

const Navbar = styled.div`
  height: 60px;
  box-sizing: border-box;
  border-bottom: 2px solid ${({ theme }) => theme.black};
  background-color: ${({ theme }) => theme.tgtDarkBlue};
  display: flex;
  flex-direction: row;
  padding: 13px 20px;
`;

const Container = styled.div`
  height: 100vh;
  background: linear-gradient(180deg, ${({ theme }) => theme.tgtBlue} 13.54%, ${({ theme }) => theme.tgtVeryDarkBlue} 100%);
`;

const ContentContainer = styled.div`
  height: calc(100% - 60px);
`;

function App() {
  return (
    <Container>
      <Navbar>
        <NavButton to="spells" title="Spells" />
        <NavButton to="wildshape" title="Wild Shape" />
        <NavButton to="randumgeon" title="Randumgeon" />
      </Navbar>
      <ContentContainer>
        <Routes>
          <Route index element={<Spells />} />
          <Route path="spells" element={<Spells />} />
          <Route path="wildshape" element={<Wildshape />} />
          <Route path="randumgeon" element={<Randumgeon />} />
        </Routes>
      </ContentContainer>
    </Container>
  );
}

export default App;
