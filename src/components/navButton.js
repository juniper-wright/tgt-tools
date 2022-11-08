import React from 'react';
import styled from 'styled-components';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';

const StyledLink = styled(Link)`
  margin-right: 10px;
  height: 32px;
  padding: 3px 8px;
  box-sizing: border-box;
  border-radius: 2px;
  border: 2px solid ${({ theme }) => theme.black};
  font-size: 20px;
  line-height: 22px;
  text-decoration: none;
  color: ${({ theme }) => theme.black};
  background-color: ${({ active, theme }) => active ? theme.tgtGold : theme.seaBlue};
  box-shadow: ${({ active }) => active && 'inset'} 2px 2px 0px ${({ theme }) => theme.shadowBlack};
`;

export const NavButton = ({ to, title }) => {
  const resolved = useResolvedPath(to);
  const active = useMatch({ path: resolved.pathname, end: true });

  return (
    <StyledLink to={to} active={active}>{title}</StyledLink>
  );
} 

export default NavButton;
