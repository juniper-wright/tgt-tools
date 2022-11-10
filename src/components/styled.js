import React, { useState } from 'react';
import styled from 'styled-components';

import { calculateStrokeTextShadow } from '../utils';

export const FilterRow = styled.div`
  min-width: 600px;
  max-width: 800px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const Filter = styled.div`
  display: flex;
  margin: 0px 20px;
  &:first-child {
    margin-left: 0px;
  }
  &:last-child {
    margin-right: 0px;
  }
  flex-direction: column;
  align-items: center;
`;

export const FilterHeader = styled.div`
  font-size: 24px;
  line-height: 26px;
  color: ${({ theme }) => theme.white};
  text-shadow: ${({ theme }) => calculateStrokeTextShadow({ radius: 2, color: theme.black, shadow: true })};
`;

export const Select = styled.select`
  width: 200px;
  height: 32px;
  border: 2px solid ${({ theme }) => theme.black};
  border-radius: 2px;
  box-shadow: 2px 2px 0px ${({ theme }) => theme.shadowBlack};
  box-sizing: border-box;
  font-size: 20px;
  padding: 0px 5px;
  background-color: ${({ theme }) => theme.seaBlue};
`;

export const Button = styled.button`
  height: 32px;
  padding: 3px 8px;
  font-size: 20px;
  line-height: 22px;
  background-color: ${({ theme }) => theme.seaBlue};
  border: 2px solid ${({ theme }) => theme.black};
  border-radius: 2px;
  outline: none;
  box-sizing: border-box;
  box-shadow: 2px 2px 0px ${({ theme }) => theme.shadowBlack};
  &:active {
    box-shadow: inset 2px 2px 0px ${({ theme }) => theme.shadowBlack};
    padding: 5px 8px 3px 10px;
    background-color: ${({ theme }) => theme.tgtGold};
  }
`;
