import React, { useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as Checkmark } from '../assets/checkmark.svg';

const CheckboxContainer = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: ${({ sizeFactor }) => 16 * sizeFactor}px;
  width: ${({ sizeFactor }) => 16 * sizeFactor}px;
  font-size: ${({ sizeFactor }) => 12 * sizeFactor}px;
  svg {
    height: ${({ sizeFactor }) => 12 * sizeFactor}px;
    width: ${({ sizeFactor }) => 12 * sizeFactor}px;
  }
  background-color: ${({ theme, checked }) => checked ? theme.tgtGold : theme.seaBlue};
  border: ${({ sizeFactor }) => 1 * sizeFactor}px solid ${({ theme }) => theme.black};
  box-shadow: ${({ checked }) => checked && 'inset'} ${({ sizeFactor }) => `${1 * sizeFactor}px ${1 * sizeFactor}px`} 0px ${({ theme }) => theme.shadowBlack};
  border-radius: 2px;
  cursor: pointer;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  display: none;
`

export const Checkbox = ({ sizeFactor = 1, contents, defaultState, onChange }) => {
  const [checkboxId] = useState(`checkbox-${Math.random()}`)
  const [state, setState] = useState(defaultState);

  const handleChange = (e) => {
    setState(e?.target?.checked);
    typeof onChange === "function" && onChange(e?.target?.checked);
  }

  return (
    <>
      <CheckboxContainer htmlFor={checkboxId} checked={!!state} sizeFactor={sizeFactor}>
        {contents || (state ? <Checkmark /> : '')}
      </CheckboxContainer>
      <HiddenCheckbox id={checkboxId} checked={!!state} onChange={handleChange} />
    </>
  );
};

export default Checkbox;
