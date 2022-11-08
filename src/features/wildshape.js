import React, { useState } from 'react';
import styled from 'styled-components';

import { Table } from 'antd';
import Page from '../components/page';
import Checkbox from '../components/checkbox';
import Select from '../components/select';
import OnlyAllNone from '../components/onlyAllNone';

import { calculateStrokeTextShadow } from '../utils';
import beasts from '../beasts.json';
import _ from 'lodash';

const FilterRow = styled.div`
  width: 600px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FilterHeader = styled.div`
  font-size: 24px;
  line-height: 26px;
  color: ${({ theme }) => theme.white};
  text-shadow: ${({ theme }) => calculateStrokeTextShadow({ radius: 1, color: theme.black, shadow: true })};
`;

const FilterInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  * {
    margin: 0px 2px;
  }
`;

const StyledTable = styled(Table).attrs({ border: 0 })`
  display: flex;
  flex-direction: row;
  border-radius: 2px;
  border: 4px solid ${({ theme }) => theme.black};
  drop-shadow: 4px 4px 0px ${({ theme }) => theme.shadowBlack};
  thead, tr, th, td {
    border-width: 0px;
  }
  th, td {
    min-width: 70px;
  }
  th:last-of-type {
    min-width: 0px;
  }
  th:first-of-type {
    min-width: 200px;
  }
  thead {
    background-color: ${({ theme }) => theme.seaBlue};
    font-size: 24px;
  }
  tr {
    height: 34px;
    line-height: 34px;
    td {
      font-size: 18px;
      color: ${({ theme }) => theme.white};
      text-align: center;
    }
    &:nth-child(odd) {
      background-color: ${({ theme }) => theme.tgtDarkBlue};
    }
    &:nth-child(even) {
      background-color: ${({ theme }) => theme.tgtVeryDarkBlue};
    }
  }
`;

const getAttackCount = (text, record) => {
  let attackCount = _.max(record?.action?.map((action) => {
    const makesAttacksMatch = action?.entries?.[0]?.match(/makes ([a-z]+)( [a-z]+)? attacks/)?.[1];
    if (makesAttacksMatch) {
      return numberWordToNumber(makesAttacksMatch); 
    } else {
      const numberWords = action?.entries?.[0]?.match(/(one|two|three)/);
      const isAttack = action?.entries?.[0]?.indexOf("one target") !== -1;
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

const getModifier = (text, record) => {
  return _.max(record?.action?.map((action) => action?.entries?.[0]?.match(/@hit ([0-9]{1,2})/)?.[1]));
};

const getDamagePerHit = (text, record) => {
  return _.max(record?.action?.map((action) => action?.entries?.[0]?.match(/{@h}([0-9]{1,2})/)?.[1]));
};

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

  const filteredBeasts = beasts.filter((beast) => {
    // Filter by CR
    const beastCR = beast?.cr || eval(beast?.cr)
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

  const setCreatureSizeFilter = (size, checked) => {
    let creatureSize = { ...filters.creatureSize, T: checked };
    if (_.keys(_.pickBy(creatureSize, _.identity)).length === 0) {
      creatureSize = initialState.creatureSize;
    }
    setFilters({ ...filters, creatureSize });
  }

  return (
    <Page>
      <FilterRow>
        <Filter>
          <FilterHeader>Druid Level</FilterHeader>
          <FilterInputContainer>
            <Select onChange={(e) => setFilters({ ...filters, level: e?.target?.value})}>
              {new Array(19).fill(null).map((a, i) => {
                return <option key={`druid-level-${i + 2}`} value={i + 2}>Level {i + 2}</option>
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
            <Checkbox sizeFactor={2} contents="T" defaultState={true} onChange={(checked) => setCreatureSizeFilter("T", checked)} />
            <Checkbox sizeFactor={2} contents="S" defaultState={true} onChange={(checked) => setCreatureSizeFilter("S", checked)} />
            <Checkbox sizeFactor={2} contents="M" defaultState={true} onChange={(checked) => setCreatureSizeFilter("M", checked)} />
            <Checkbox sizeFactor={2} contents="L" defaultState={true} onChange={(checked) => setCreatureSizeFilter("L", checked)} />
            <Checkbox sizeFactor={2} contents="H" defaultState={true} onChange={(checked) => setCreatureSizeFilter("H", checked)} />
            <Checkbox sizeFactor={2} contents="G" defaultState={true} onChange={(checked) => setCreatureSizeFilter("G", checked)} />
          </FilterInputContainer>
        </Filter>
      </FilterRow>
      <FilterRow>
        <OnlyAllNone onChange={(fly) => setFilters({ ...filters, fly })} label="Flight" />
        <OnlyAllNone onChange={(swim) => setFilters({ ...filters, swim })} label="Swim" />
        <OnlyAllNone onChange={(climb) => setFilters({ ...filters, climb })} label="Climb" />
      </FilterRow>
      <StyledTable
        bordered={false}
        scroll={{ y: 600 }}
        dataSource={filteredBeasts}
        columns={[
          { width: "14%", key: "name", title: "Name", dataIndex: "name" },
          { width: "8%", key: "size", title: "Size", render: (text, record) => sizeInitialToWord(record?.size?.[0]) },
          { width: "7%", key: "cr", title: "CR", dataIndex: "cr" },
          { width: "7%", key: "hp", title: "HP", dataIndex: ["hp", "average"] },
          { width: "7%", key: "ac", title: "AC", dataIndex: ["ac", 0, "ac"], render: (text, record) => record?.ac?.[0]?.ac || record?.ac?.[0] },
          { width: "7%", key: "survivability", title: "Surv.", render: (text, record) => ((Math.ceil(record?.hp?.average / 10)) * Math.max(Math.min(((27 - (record?.ac?.[0]?.ac || record?.ac?.[0])) / 20), 0.95), 0.05)).toFixed(2) },
          { width: "5%", key: "walk", title: "Walk", dataIndex: ["speed", "walk"] },
          { width: "5%", key: "swim", title: "Swim", dataIndex: ["speed", "swim"] },
          { width: "5%", key: "fly", title: "Fly", dataIndex: ["speed", "fly"] },
          { width: "5%", key: "climb", title: "Climb", dataIndex: ["speed", "climb"] },
          { width: "8%", key: "attacks", title: "Attacks", render: getAttackCount },
          { width: "8%", key: "modifier", title: "Modifier", render: getModifier },
          { width: "7%", key: "dph", title: "DPH", render: getDamagePerHit },
          { width: "7%", key: "dpr", title: "DPR", render: (text, record) => ((((6 + +getModifier(text, record)) / 20) * getDamagePerHit(text, record) * getAttackCount(text, record)) || 0).toFixed(1) },
        ]}
        pagination={false}
      />
    </Page>
  );
} 

export default Wildshape;
