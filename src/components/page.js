import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageContents = styled(PageContainer)`
  width: 100%;
  max-width: 1400px;
  padding: 20px;
  box-sizing: border-box;
`;

export const Page = ({ children }) => (
  <PageContainer>
    <PageContents>
      {children}
    </PageContents>
  </PageContainer>
);

export default Page;
