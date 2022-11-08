import React, { useState } from 'react';
import styled from 'styled-components';

export const StyledSelect = styled.select`
  width: 200px;
  height: 32px;
  border: 2px solid ${({ theme }) => theme.black};
  border-radius: 2px;
  box-shadow: 2px 2px 0px ${({ theme }) => theme.shadowBlack};
  box-sizing: border-box;
  font-size: 20px;
  background-color: ${({ theme }) => theme.seaBlue};
`;

export default StyledSelect;
