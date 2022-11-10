import React, { useState } from 'react';
import styled from 'styled-components';

import Page from '../components/page';
import Checkbox from '../components/checkbox';
import OnlyAllNone from '../components/onlyAllNone';
import { FilterRow, Filter, FilterHeader, Select } from '../components/styled';

import beasts from '../assets/beasts.json';
import _ from 'lodash';

const FilterInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  * {
    margin: 0px 2px;
  }
`;

const StyledTable = styled.div`
  border-radius: 2px;
  border: 4px solid ${({ theme }) => theme.black};
  drop-shadow: 4px 4px 0px ${({ theme }) => theme.shadowBlack};
  width: 100%;
  min-width: 1000px;
  max-width: 1400px;
  font-size: 18px;
  line-height: 34px;
  color: ${({ theme }) => theme.white};
  div.thead {
    font-size: 24px;
    color ${({ theme }) => theme.black};
    background-color: ${({ theme }) => theme.seaBlue};
    border-bottom: 4px solid ${({ theme }) => theme.black};
    padding-right: 24px;
    div.td {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      border-right: 4px solid ${({ theme }) => theme.black};
      box-sizing: border-box;
    }
  }
  div.tr {
    height: 34px;
    display: flex;
    flex-direction: row;
    text-align: center;
  }
  div.tbody {
    max-height: ${() => Math.max(document?.documentElement?.clientHeight || 0, window?.innerHeight || 0) - 269}px;
    overflow-y: scroll;
    scrollbar-color: ${({ theme }) => `${theme.tgtDarkBlue} ${theme.seaBlue}`};
    scrollbar-width: 24px;
    div.tr {
      border-right: 4px solid ${({ theme }) => theme.black};
      &:nth-child(odd) {
        background-color: ${({ theme }) => theme.tgtDarkBlue};
      }
      &:nth-child(even) {
        background-color: ${({ theme }) => theme.tgtVeryDarkBlue};
      }
    }

    ::-webkit-scrollbar {
      width: 24px;
      padding: 1px;
      background: ${({ theme }) => theme.tgtDarkBlue};
    }
    ::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.seaBlue};
      border: 1px solid ${({ theme }) => theme.tgtDarkBlue};
      border-radius: 2px;
      box-shadow: ${({ theme }) => ['2px 2px', '2px -2px', '-2px 2px', '-2px -2px'].map((p) => `inset ${p} 0px ${theme.black}`).join(',')};
    }
  }
`;

const ChevronContainer = styled.span`
  margin-top: ${({ up }) => up ? 8 : -4}px;
  color: ${({ theme }) => theme.tgtGold};
`;

const getAttackCount = (record) => {
  let attackCount = _.max(record?.action?.map((action) => {
    const makesAttacksMatch = action?.entries?.[0]?.match(/makes ([a-z]+)( [a-z]+)? attacks/)?.[1];
    if (makesAttacksMatch) {
      return numberWordToNumber(makesAttacksMatch); 
    } else {
      const numberWords = action?.entries?.[0]?.match(/(one|two|three)/);
      const isAttack = action?.entries?.[0]?.includes("ft., one");
      if (numberWords && !isAttack) {
        return _.sum(numberWords.map(numberWordToNumber));
      } else {
        return 1;
      }
    }
  })) || 0;

  attackCount += _.max(record?.trait?.map((trait) => {
    return !!trait?.entries?.[0]?.match(/attack.*as a bonus action/)?.[0]
  })) ? 0.5 : 0;

  return attackCount;
};

const numberWordToNumber = (word) => {
  switch(word) {
    case 'three':
      return 3;
    case 'two':
      return 2;
    case 'one':
    default:
      return 1;
  }
}

const sizeInitialToWord = (initial) => {
  switch(initial) {
    case "T":
      return "Tiny";
    case "S":
      return "Small";
    case "M":
      return "Medium";
    case "L":
      return "Large";
    case "H":
      return "Huge";
    case "G":
      return "Gargantuan";
  }
}

const getModifier = (record) => {
  return _.max(record?.action?.map((action) => action?.entries?.[0]?.match(/@hit ([0-9]{1,2})/)?.[1]));
};

const getDamagePerHit = (record) => {
  return _.max(record?.action?.map((action) => action?.entries?.[0]?.match(/{@h}([0-9]{1,2})/)?.[1]));
};

const columns = [
  { width: "14%", key: "name", title: "Name", dataIndex: "name" },
  { width: "8%", key: "size", title: "Size", render: (record) => sizeInitialToWord(record?.size?.[0]) },
  { width: "7%", key: "cr", title: "CR", dataIndex: "cr" },
  { width: "7%", key: "hp", title: "HP", dataIndex: ["hp", "average"] },
  { width: "7%", key: "ac", title: "AC", dataIndex: ["ac", 0, "ac"], render: (record) => record?.ac?.[0]?.ac || record?.ac?.[0] },
  { width: "7%", key: "survivability", title: "Surv.", render: (record) => ((Math.ceil(record?.hp?.average / 10)) * Math.max(Math.min(((6 + (record?.ac?.[0]?.ac || record?.ac?.[0])) / 20), 0.95), 0.05)).toFixed(2) },
  { width: "5%", key: "walk", title: "Walk", dataIndex: ["speed", "walk"] },
  { width: "5%", key: "swim", title: "Swim", dataIndex: ["speed", "swim"] },
  { width: "5%", key: "fly", title: "Fly", dataIndex: ["speed", "fly"] },
  { width: "5%", key: "climb", title: "Climb", dataIndex: ["speed", "climb"] },
  { width: "8%", key: "attacks", title: "Attacks", render: getAttackCount },
  { width: "8%", key: "modifier", title: "Modifier", render: getModifier },
  { width: "7%", key: "dph", title: "DPH", render: getDamagePerHit },
  { width: "7%", key: "dpr", title: "DPR", render: (record) => ((((6 + +getModifier(record)) / 20) * getDamagePerHit(record) * getAttackCount(record)) || 0).toFixed(1) },
];

export const Wildshape = () => {
  const initialState = {
    level: 2,
    moon: true,
    creatureSize: {
      T: true,
      S: true,
      M: true,
      L: true,
      H: true,
      G: true
    },
    fly: null,
    swim: null,
    climb: null
  };

  const [filters, setFilters] = useState(initialState);
  const [sortField, setSortField] = useState(columns[0]);
  const [sortDirection, setSortDirection] = useState('asc');

  const setCreatureSizeFilter = (size, checked) => {
    let creatureSize = { ...filters.creatureSize, T: checked };
    if (_.keys(_.pickBy(creatureSize, _.identity)).length === 0) {
      creatureSize = initialState.creatureSize;
    }
    setFilters({ ...filters, creatureSize });
  }

  const filteredBeasts = beasts.filter((beast) => {
    // Filter by CR
    const beastCR = (parseInt(beast?.cr?.split('/')[0], 10) / parseInt(beast?.cr?.split('/')[1], 10)) || beast?.cr
    if (filters.moon) {
      if (beast.type === "elemental" && filters.level < 10) {
        return false;
      }
      if ((filters.level < 6 && beastCR > 1) || (filters.level < 9 && beastCR > 2) || (beast.type === "beast" && filters.level < 12 && beastCR > 3) || (beast.type === "beast" && filters.level < 15 && beastCR > 4) || (beast.type === "beast" && filters.level < 18 && beastCR > 5)) {
        return false;
      }
    } else {
      if ((filters.level < 4 && beastCR > 0.25) || (filters.level < 8 && beastCR > 0.5) || (beastCR > 1)) {
        return false;
      }
    }

    // Filter by size
    if (!_.keys(_.pickBy(filters.creatureSize, _.identity)).includes(beast?.size?.[0])) {
      return false;
    }

    // Filter by speeds
    if (filters.fly !== null && !!beast.speed.fly !== filters.fly) {
      return false;
    }
    if (filters.swim !== null && !!beast.speed.swim !== filters.swim) {
      return false;
    }
    if (filters.climb !== null && !!beast.speed.climb !== filters.climb) {
      return false;
    }

    return true;
  });

  const updateSort = (newSortField) => {
    setSortDirection(sortField.key === newSortField.key && sortDirection === 'desc' ? 'asc' : 'desc');
    setSortField(newSortField);
  }

  const sortIterator = (beast, column) => {
    switch (column.key) {
      case 'cr':
        return (parseInt(beast?.cr?.split('/')[0], 10) / parseInt(beast?.cr?.split('/')[1], 10)) || beast?.cr
      case 'size':
        return Object.keys(initialState.creatureSize).indexOf(beast?.size?.[0]);
      case 'name':
        return _.get(beast, column.dataIndex);
      default:
        return Number.parseFloat(column?.render?.(beast) || _.get(beast, column.dataIndex) || 0);
    }
  }

  return (
    <Page>
      <FilterRow>
        <Filter>
          <FilterHeader>Druid Level</FilterHeader>
          <FilterInputContainer>
            <Select onChange={(e) => setFilters({ ...filters, level: e?.target?.value})}>
              {new Array(17).fill(null).map((a, i) => {
                return <option key={`druid-level-${i + 2}`} value={i + 2}>Level {i + 2}{i === 16 && '+'}</option>
              })}
            </Select>
          </FilterInputContainer>
        </Filter>
        <Filter>
          <FilterHeader>Moon?</FilterHeader>
          <Checkbox sizeFactor={2} defaultState={true} onChange={(moon) => setFilters({ ...filters, moon })} />
        </Filter>
        <Filter>
          <FilterHeader>Creature Size</FilterHeader>
          <FilterInputContainer>
            {Object.keys(initialState.creatureSize).map((size) => (
              <Checkbox key={`checkbox-${size}`} sizeFactor={2} contents={size} defaultState={true} onChange={(checked) => setCreatureSizeFilter(size, checked)} />
            ))}
          </FilterInputContainer>
        </Filter>
      </FilterRow>
      <FilterRow>
        <OnlyAllNone onChange={(fly) => setFilters({ ...filters, fly })} label="Flight" />
        <OnlyAllNone onChange={(swim) => setFilters({ ...filters, swim })} label="Swim" />
        <OnlyAllNone onChange={(climb) => setFilters({ ...filters, climb })} label="Climb" />
      </FilterRow>
      <StyledTable>
        <div className="thead tr">
          {columns.map((column) => (
            <div key={`header-${column.key}`} className="td" style={{ width: column.width }} onClick={() => updateSort(column)}>
              {column.title}
              {sortField.key === column.key && (
                <ChevronContainer up={sortDirection === 'asc'}>{sortDirection === 'asc' ? '⌃' : '⌄'}</ChevronContainer>
              )}
            </div>
          ))}
        </div>
        <div className="tbody">
          {_.orderBy(filteredBeasts, (beast) => sortIterator(beast, sortField), sortDirection).map((beast, index) => (
            <div className="tr" key={`beast-${index}`}>        
              {columns.map((column) => (
                <div key={`beast-${index}-${column.key}`} className="td" style={{ width: column.width }}>{column?.render?.(beast) || _.get(beast, column.dataIndex)}</div>
              ))}
            </div>
          ))}
        </div>
      </StyledTable>
    </Page>
  );
} 

export default Wildshape;
