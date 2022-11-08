import React from 'react';
import styled from 'styled-components'
import { Routes, Route } from 'react-router-dom';

import Spells from './features/spells';
import Wildshape from './features/wildshape';
import Randumgeon from './features/randumgeon';
import NavButton from './components/navButton';

import { calculateStrokeTextShadow } from './utils';

const Container = styled.div`
  height: 100vh;
  background: linear-gradient(180deg, ${({ theme }) => theme.tgtBlue} 13.54%, ${({ theme }) => theme.tgtVeryDarkBlue} 100%);
`;

const Navbar = styled.div`
  height: 60px;
  box-sizing: border-box;
  border-bottom: 2px solid ${({ theme }) => theme.black};
  background-color: ${({ theme }) => theme.tgtDarkBlue};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 20px;
`;

const NavButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledLink = styled.a`
  text-decoration: none;
  display: flex;
  flex-direction: row;
`;

const HeaderTitle = styled.div`
  font-size: 40px;
  line-height: 44px;
  margin-right: 20px;
  color: ${({ theme }) => theme.bone};
  text-shadow: ${({ theme }) => calculateStrokeTextShadow({ radius: 2, color: theme.black, shadow: true })};
`;

const ProfilePic = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 32px;
  border: 2px solid ${({ theme }) => theme.black};
  box-shadow: 2px 2px 0px ${({ theme }) => theme.shadowBlack};
  overflow: hidden;
  margin-top: 3px;
`;

const ContentContainer = styled.div`
  height: calc(100% - 60px);
`;

function App() {
  return (
    <Container>
      <Navbar>
        <NavButtonContainer>
          <NavButton to="spells" title="Spells" />
          <NavButton to="wildshape" title="Wild Shape" />
          <NavButton to="randumgeon" title="Randumgeon" />
        </NavButtonContainer>
        <NavButtonContainer>
          <StyledLink href="https://twitch.tv/thegildedtroll" target="_blank" rel="noreferrer">
            <HeaderTitle>The Gilded Troll</HeaderTitle>
            <ProfilePic>
              <img height="32" width="32" src="/tgt-logo.jpg" />
            </ProfilePic>
          </StyledLink>
        </NavButtonContainer>
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
