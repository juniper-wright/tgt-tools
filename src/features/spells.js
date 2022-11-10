import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Page from '../components/page';
import Checkbox from '../components/checkbox';
import SpellCard from '../components/spellCard';
import OnlyAllNone from '../components/onlyAllNone';

import { ReactComponent as FilterIcon } from '../assets/filter.svg';
import allSpells from '../assets/spells.json';
import { ordinalEnding } from '../utils';
import _ from 'lodash';

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 30px;
  padding: 4px;
  border: 2px solid ${({ theme }) => theme.black};
  background-color: ${({ theme }) => theme.tgtDarkBlue};
  border-radius: 2px;
  box-shadow: 2px 2px 0px ${({ theme }) => theme.shadowBlack};
  text-align: center;
  color: ${({ theme }) => theme.bone};
  font-size: 20px;
  outline: none;
  ::placeholder {
    color: ${({ theme }) => theme.seaBlue};
  }
`;

const FiltersContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  display: ${({ showFilters }) => showFilters ? 'flex' : 'none'};
  flex-direction: row;
  justify-content: space-between;
`;

const FilterContainer = styled.div`
  height: 400px;
  min-width: 120px;
  margin-bottom: 4px;
  border: 2px solid ${({ theme }) => theme.black};
  background-color: ${({ theme }) => theme.tgtDarkBlue};
  box-shadow: 2px 2px 0px ${({ theme }) => theme.shadowBlack};
  & > div:first-child {
    display: flex;
    flex-direction: row;
    border-bottom: 2px solid ${({ theme }) => theme.black};
  }
  width: 16%;
  &:first-child, &:last-child {
    width: 32%;
  }
`;

const AllNoneButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  line-height: 22px;
  padding: 5px;
  background-color: ${({ active, theme }) => active ? theme.tgtGold : theme.seaBlue};
  cursor: ${({ active }) => active ? 'default' : 'pointer'};
  &:first-child {
    border-right: 2px solid ${({ theme }) => theme.black};
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: calc(100% - 34px);
  margin-right: -2px;
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
`;

const Option = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 20px;
  padding: 2px 10px 2px ${({ indent }) => indent ? '20px' : '10px'};
  color: ${({ theme }) => theme.bone};
  font-size: 12px;
  font-weight: ${({ header }) => header ? 'bold' : 'normal'};
  line-height: 20px;
  border-right: 2px solid ${({ theme }) => theme.black};
  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.tgtBlue};
  }
  span {
    font-family: 'Outfit', sans-serif !important;
    margin-right: 10px;
  }
  label {
    margin-top: 2px;
  }
`;

const SpellsContainer = styled.div`
  width: 100%;
`;

export const Spells = () => {
  const [availableClasses] = useState(calculateAvailableClasses(false));
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [availableSpellLevels, setAvailableSpellLevels] = useState(calculateAvailableSpellLevels(false));
  const [selectedSpellLevels, setSelectedSpellLevels] = useState([]);
  const [availableSpellSchools, setAvailableSpellSchools] = useState(calculateAvailableSpellSchools(false));
  const [selectedSpellSchools, setSelectedSpellSchools] = useState([]);
  const [availableSpells, setAvailableSpells] = useState(allSpells);
  const [selectedSpells, setSelectedSpells] = useState([]);

  const [spellNameSearch, setSpellNameSearch] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [ritualFilter, setRitualFilter] = useState(null);

  useEffect(() => {
    setAvailableSpells(calculateAvailableSpells());
  }, [selectedClasses, selectedSpellLevels, selectedSpellSchools]);

  function calculateAvailableClasses () {
    return _
      .chain(allSpells).map((spell) => {
        return [
          ...spell?.classes?.fromClassList?.map((spellClass) => spellClass.name) || [],
          ...spell?.classes?.fromSubclass?.map((spellSubclass) => `${spellSubclass?.class?.name} (${spellSubclass?.subclass.name})`) || []
        ];
      })
      .flattenDeep()
      .uniq()
      .filter((spellClass) => _.every(['UA', 'PSA', 'Revised', 'Spell-less', 'Revisited'], (term) => !spellClass.includes(term)))
      .orderBy()
      .value();
  }

  function calculateAvailableSpellLevels () {
    return _
      .chain(allSpells).filter((spell) => filterSpell(spell, { class: true }))
      .map((spell) => spell.level)
      .uniq()
      .orderBy(_.identity, 'asc')
      .value();
  }

  function calculateAvailableSpellSchools () {
    return _
      .chain(allSpells).filter((spell) => filterSpell(spell, { class: true, level: true }))
      .map((spell) => spell.school)
      .uniq()
      .orderBy(_.identity, 'asc')
      .value();
  }

  function calculateAvailableSpells () {
    return _
      .chain(allSpells).filter((spell) => filterSpell(spell, { class: true, level: true, school: true }))
      .uniq()
      .orderBy(_.identity, 'asc')
      .value();
  }

  function filterSpell (spell, options) {
    // Filter based on text input
    if (options.spell) {
      const textFilterMatch = spell?.name?.toLowerCase().includes(spellNameSearch.toLowerCase())
      console.log('textFilterMatch', textFilterMatch, spellNameSearch);
      if (!textFilterMatch && spellNameSearch.length) {
        return false;
      } else if (textFilterMatch && spellNameSearch.length) {
        // If we searched for a spell, display it. Even if it doesn't match our other filters.
        return true;
      }
    }

    // Filter based on classes (comparing the spell's class list vs the selected classes)
    if (options.class) {
      const availableClassMatch = (
        _.some(spell?.classes?.fromClassList, (spellClass) => availableClasses.includes(spellClass.name)) ||
        _.some(spell?.classes?.fromClassListVariant, (spellClass) => availableClasses.includes(spellClass.name)) ||
        _.some(spell?.classes?.fromSubclass, (spellSubclass) => availableClasses.includes(`${spellSubclass?.class?.name} (${spellSubclass?.subclass.name})`))
      );
      const selectedClassMatch = selectedClasses.length === 0 || (
        _.some(spell?.classes?.fromClassList, (spellClass) => selectedClasses.includes(spellClass.name)) ||
        _.some(spell?.classes?.fromClassListVariant, (spellClass) => selectedClasses.includes(spellClass.name)) ||
        _.some(spell?.classes?.fromSubclass, (spellSubclass) => selectedClasses.includes(`${spellSubclass?.class?.name} (${spellSubclass?.subclass.name})`))
      );
      if (!availableClassMatch || !selectedClassMatch) {
        return false;
      }
    }

    // Filter based on spell level
    if (options.level) {
      const availableLevelMatch = availableSpellLevels.includes(spell?.level);
      const selectedLevelMatch = selectedSpellLevels.length === 0 || selectedSpellLevels.includes(spell?.level);
      if (!availableLevelMatch || !selectedLevelMatch) {
        return false;
      }
    }

    // Filter based on spell school
    if (options.school) {
      const availableSchoolMatch = availableSpellSchools.includes(spell.school);
      const selectedSchoolMatch = selectedSpellSchools.length === 0 || selectedSpellSchools.includes(spell.school);
      if (!availableSchoolMatch || !selectedSchoolMatch) {
        return false;
      }
    }

    // Filter based on spell selection
    if (options.spell) {
      const availableSpellMatch = availableSpells.map((spell) => spell.name).includes(spell.name);
      const selectedSpellMatch = selectedSpells.length === 0 || selectedSpells.includes(spell.name);
      if (!availableSpellMatch || !selectedSpellMatch) {
        return false;
      }
    }

    // Filter based on ritual options
    if (options.spell) {
      if (ritualFilter !== spell?.meta?.ritual && ritualFilter !== null) {
        return false;
      }
    }

    return true;
  }

  const updateSelectedList = (selectedList, setSelectedList, value) => {
    if (selectedList.includes(value)) {
      const index = selectedList.indexOf(value);
      setSelectedList([...selectedList.slice(0, index), ...selectedList.slice(index + 1)]);
    } else {
      setSelectedList([...selectedList, value]);
    }
  }

  return (
    <Page>
      <SearchContainer>
        <SearchInput placeholder="Search by title" onChange={(e) => setSpellNameSearch(e?.target?.value)} />
        <Checkbox sizeFactor={2} style={{ margin: '5px 0px 0px 10px' }} contents={<FilterIcon />} defaultState={showFilters} onChange={(checked) => setShowFilters(checked)} />
      </SearchContainer>
      <FiltersContainer showFilters={showFilters}>
        <FilterContainer>
          <div>
            <AllNoneButton active={selectedClasses.length === availableClasses.length} onClick={() => setSelectedClasses(availableClasses)}>All</AllNoneButton>
            <AllNoneButton active={selectedClasses.length === 0} onClick={() => setSelectedClasses([])}>None</AllNoneButton>
          </div>
          <OptionsContainer>
            {_.map(_.groupBy(availableClasses, (spellClass) => spellClass.split(' ')[0]), (subclasses, majorClass) => {
              return (
                <>
                  <Option header key={`class-group-${majorClass}`}><span>{majorClass}</span></Option>
                  {subclasses.map((subclass) => (
                    <Option indent key={`class-${subclass}`}>
                      <span>{subclass}</span>
                      <Checkbox value={selectedClasses.includes(subclass)} onChange={(checked) => updateSelectedList(selectedClasses, setSelectedClasses, subclass)} />
                    </Option>
                  ))}
                </>
              );
            })}
          </OptionsContainer>
        </FilterContainer>
        <FilterContainer>
          <div>
            <AllNoneButton active={_.every(availableSpellLevels, (spellLevel) => selectedSpellLevels.includes(spellLevel))} onClick={() => setSelectedSpellLevels(availableSpellLevels)}>All</AllNoneButton>
            <AllNoneButton active={selectedSpellLevels.length === 0} onClick={() => setSelectedSpellLevels([])}>None</AllNoneButton>
          </div>
          <OptionsContainer>
            {availableSpellLevels.map((spellLevel) => (
              <Option key={`spell-level-${spellLevel}`}>
                <span>{spellLevel === 0 ? 'Cantrip' : `${spellLevel}${ordinalEnding(spellLevel)} Level`}</span>
                <Checkbox value={selectedSpellLevels.includes(spellLevel)} onChange={(checked) => updateSelectedList(selectedSpellLevels, setSelectedSpellLevels, spellLevel)} />
              </Option>
            ))}
          </OptionsContainer>
        </FilterContainer>
        <FilterContainer>
          <div>
            <AllNoneButton active={_.every(availableSpellSchools, (spellSchool) => selectedSpellSchools.includes(spellSchool))} onClick={() => setSelectedSpellSchools(availableSpellSchools)}>All</AllNoneButton>
            <AllNoneButton active={selectedSpellSchools.length === 0} onClick={() => setSelectedSpellSchools([])}>None</AllNoneButton>
          </div>
          <OptionsContainer>
            {availableSpellSchools.map((spellSchool) => (
              <Option key={`spell-school-${spellSchool}`}>
                <span>{spellSchool}</span>
                <Checkbox value={selectedSpellSchools.includes(spellSchool)} onChange={(checked) => updateSelectedList(selectedSpellSchools, setSelectedSpellSchools, spellSchool)} />
              </Option>
            ))}
          </OptionsContainer>
        </FilterContainer>
        <FilterContainer>
          <div>
            <AllNoneButton active={_.every(availableSpells, (spell) => selectedSpells.includes(spell.name))} onClick={() => setSelectedSpells(availableSpells.map((spell) => spell.name))}>All</AllNoneButton>
            <AllNoneButton active={selectedSpells.length === 0} onClick={() => setSelectedSpells([])}>None</AllNoneButton>
          </div>
          <OptionsContainer>
            {_.map(_.groupBy(availableSpells, 'level'), (spells, spellLevel) => {
              return (
                <>
                  <Option header key={`spell-group-${spellLevel}`}><span>{spellLevel == 0 ? 'Cantrip' : `${spellLevel}${ordinalEnding(spellLevel)} Level`}</span></Option>
                  {_.orderBy(spells, 'name').map((spell) => (
                    <Option indent key={`spell-${spell.name}`}>
                      <span>{spell.name}</span>
                      <Checkbox value={selectedSpells.includes(spell.name)} onChange={(checked) => updateSelectedList(selectedSpells, setSelectedSpells, spell.name)} />
                    </Option>
                  ))}
                </>
              )
            })}
          </OptionsContainer>
        </FilterContainer>
      </FiltersContainer>
      <SpellsContainer>
        {_.chain(allSpells)
          .filter((spell) => filterSpell(spell, { class: true, level: true, school: true, spell: true }))
          .orderBy(['level', 'name'], ['asc', 'asc'])
          .map((spell) => (
            <SpellCard key={spell.name} spell={spell} />
          ))
          .value()
        }
      </SpellsContainer>
    </Page>
  );
} 

export default Spells;
