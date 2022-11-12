import React from 'react';
import styled from 'styled-components';

import { ordinalEnding, parse5eToolsTags } from '../utils';
import _ from 'lodash';

const SpellCardContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.black};
  border-radius: 2px;
  padding: 10px;
  box-shadow: 2px 2px 0px ${({ theme }) => theme.shadowBlack};
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.tgtDarkBlue};
  * {
    font-family: 'Outfit', sans-serif;
    color: ${({ theme }) => theme.bone};
  }
`;

const SpellCardHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  div:first-child {
    font-size: 24px;
    line-height: 30px;
  }
  div:last-child {
    font-size: 12px;
    line-height: 15px;
    text-align: right;
  }
`;

const SpellCardMeta = styled.div`
  margin: 10px 0px;
  font-size: 12px;
  line-height: 15px;
`;

const SpellCardDescription = styled.div`
  & > div {
    margin: 10px 0px;
  }
  font-size: 16px;
  line-height: 20px;
`;

const SectionTitle = styled.span`
  font-weight: bold;
  font-style: italic;
  margin-right: 6px;
`;

const renderDuration = (duration) => {
  switch (duration?.type) {
    case "instant":
      return "Instantaneous";
    case "timed":
      return `${duration?.concentration ? 'Concentration, up to ' : ''} ${duration?.duration?.amount} ${duration?.duration?.type} ${duration?.duration?.amount !== 1 ? 's' : ''}`;
  }
}

const renderClasses = (spell) => {
  return _.chain([
    ...spell?.classes?.fromClassList?.map((spellClass) => spellClass.name) || [],
    ...spell?.classes?.fromSubclass?.map((spellSubclass) => `${spellSubclass?.class?.name} (${spellSubclass?.subclass.name})`) || []
  ])
  .flattenDeep()
  .uniq()
  .filter((spellClass) => _.every(['UA', 'PSA', 'Revised', 'Spell-less', 'Revisited'], (term) => !spellClass.includes(term)))
  .orderBy()
  .value()
  .join(', ');
}

export const SpellCard = ({ spell }) => (
  <SpellCardContainer>
    <SpellCardHeader>
      <div>
        <a id={spell?.name?.toLowerCase().replaceAll(' ', '-')} href={`https://www.dndbeyond.com/spells/${spell?.name?.toLowerCase().replaceAll(' ', '-')}`} target="_blank" rel="noreferrer">
          {spell?.name}
        </a>
      </div>
      <div>
        {spell?.level === 0 ? `${spell?.school} cantrip` : `${spell?.level}${ordinalEnding(spell?.level)} Level ${spell?.school}`}
        <br />
        {spell?.source}
      </div>
    </SpellCardHeader>
    <SpellCardMeta>
      <div>Cast time: {spell?.time?.[0]?.number} {spell?.time?.[0]?.unit === 'bonus' ? 'bonus action' : spell?.time?.[0]?.unit}</div>
      <div>Range: {spell?.range?.distance?.amount} {spell?.range?.distance?.type} {spell?.range?.type === 'radius' && 'radius'}</div>
      <div>Components: {_.filter([(spell?.components?.v && 'V'), (spell?.components?.s && 'S'), (spell?.components?.m && `M (${spell?.components?.m?.text || spell?.components?.m})`)]).join(', ')}</div>
      <div>Duration: {renderDuration(spell?.duration?.[0])}</div>
      <div>Classes: {renderClasses(spell)}</div>
    </SpellCardMeta>
    <SpellCardDescription>
      {spell?.entries?.map((entry, index) => {
        if (entry?.type === 'list') {
          return (
            <ul key={`spell-${spell?.name}-entry-${index}`}>
              {entry?.items?.map((item) => {
                if (item?.type === 'item') {
                  return <li key={item?.entries?.[0]}><SectionTitle>{item?.name}.</SectionTitle> {parse5eToolsTags(item?.entries?.[0])}</li>;
                } else {
                  return <li key={item}>{parse5eToolsTags(item)}</li>
                }
              })}
            </ul>
          );
        } else if (entry?.type === 'entries') {
          return <div key={`spell-${spell?.name}-entry-${index}`}>
            <SectionTitle>{entry?.name}.</SectionTitle>
            <span>{parse5eToolsTags(entry?.entries?.[0])}</span>
          </div>;
        }
        else if (typeof entry === 'string') {
          return <div key={`spell-${spell?.name}-entry-${index}`}>{parse5eToolsTags(entry)}</div>;
        }
      })}
      {spell?.entriesHigherLevel?.[0] && (
        <div>
          <SectionTitle>At Higher Levels.</SectionTitle>
          <span>{parse5eToolsTags(spell?.entriesHigherLevel?.[0]?.entries?.[0])}</span>
        </div>
      )}
    </SpellCardDescription>
  </SpellCardContainer>
)

export default SpellCard;
