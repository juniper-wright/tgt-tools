import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Page = ({ children }) => (
  <PageContainer>
    {children}
  </PageContainer>
);

export default Page;
