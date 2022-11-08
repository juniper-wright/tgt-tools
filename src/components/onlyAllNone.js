import React, { useState } from 'react';
import styled from 'styled-components';

const OnlyAllNoneContainer = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  height: 25px;
  background-color: ${({ theme }) => theme.seaBlue};
  border: solid ${({ theme }) => theme.black};
  border-width: 2px 0px;
  border-radius: 2px;
  font-size: 16px;
  line-height: 21px;
`;

const StyledLabel = styled.label`
  border: 0px solid ${({ theme }) => theme.black};
  border-left-width: 2px;
  &:last-of-type {
    border-right-width: 2px;
    border-bottom-right-radius: ${({ checked }) => checked ? 0 : 2}px;
  }
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 8px 0px 10px;
  box-sizing: border-box;
  &:not(:first-of-type) {
    box-shadow: ${({ checked }) => checked ? 'inset 2px 2px' : '2px 4px'} 0px ${({ theme }) => theme.shadowBlack}; 
  }
  background-color: ${({ checked, theme }) => checked ? theme.tgtGold : theme.seaBlue};
  cursor: pointer;
`;

const HiddenRadio = styled.input.attrs({ type: "radio" })`
  display: none;
`

export const Checkbox = ({ label, defaultState, onChange }) => {
  const [radioId] = useState(`radio-${Math.random()}`)
  const [state, setState] = useState(defaultState || null);

  const handleChange = (newState) => {
    setState(newState);
    typeof onChange === "function" && onChange(newState);
  }

  return (
    <OnlyAllNoneContainer>
      <StyledLabel style={{ cursor: 'auto' }}>{label}</StyledLabel>
      <StyledLabel htmlFor={`${radioId}-only`} checked={state === true}>Only</StyledLabel>
      <StyledLabel htmlFor={`${radioId}-all`} checked={state === null}>All</StyledLabel>
      <StyledLabel htmlFor={`${radioId}-none`} checked={state === false}>None</StyledLabel>
      <HiddenRadio id={`${radioId}-only`} name={radioId} checked={state === 'only'} onChange={() => handleChange(true)} />
      <HiddenRadio id={`${radioId}-all`} name={radioId} checked={state === 'all'} onChange={() => handleChange(null)} />
      <HiddenRadio id={`${radioId}-none`} name={radioId} checked={state === 'none'} onChange={() => handleChange(false)} />
    </OnlyAllNoneContainer>
  );
};

export default Checkbox;
