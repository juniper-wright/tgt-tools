import React, { useState } from 'react';
import styled from 'styled-components';

import Page from '../components/page';
import { Button, FilterRow, Filter, FilterHeader, Select } from '../components/styled';
import SpellCard from '../components/spellCard';
import allSpells from '../assets/spells.json';
import _ from 'lodash';

export const Randumgeon = () => {
  const [selectedClass, setSelectedClass] = useState('Artificer');
  const [classLevel, setClassLevel] = useState(1);
  const [spellcastingModifier, setSpellcastingModifier] = useState(0);

  const [chosenSpells, setChosenSpells] = useState([]);

  function randomizeSpells () {
    let numberOfSpells = 0;
    if (['Artificer', 'Paladin'].includes(selectedClass)) {
      numberOfSpells = Math.floor(+classLevel / 2) + +spellcastingModifier;
    } else {
      numberOfSpells = +classLevel + +spellcastingModifier;
    }
    numberOfSpells = Math.max(numberOfSpells, 1);
    const castableSpells = allSpells.filter(isCastable);
    let spellsToSelect = [];
    while (spellsToSelect.length < numberOfSpells) {
      const randomSpell = castableSpells[Math.floor(Math.random() * castableSpells.length)];
      if (_.findIndex(spellsToSelect, (spell) => spell.name === randomSpell.name) === -1) {
        spellsToSelect.push(randomSpell);
      }
    }
    setChosenSpells(spellsToSelect);
  }

  function isCastable (spell) {
    if (
      !_.some(spell?.classes?.fromClassList, (spellClass) => selectedClass === spellClass.name) &&
      !_.some(spell?.classes?.fromClassListVariant, (spellClass) => selectedClass === spellClass.name)
    ) {
      return false;
    }

    let maxCastableLevel = 0;
    if (['Artificer', 'Paladin'].includes(selectedClass)) {
      maxCastableLevel = Math.ceil(classLevel / 4);
      // Level 1 paladins can't cast spells, but level 1 artificers can
      if (selectedClass === 'Paladin' && classLevel === 1) {
        maxCastableLevel = 0;
      }
    } else {
      maxCastableLevel = Math.ceil(classLevel / 2);
    }
    if (spell.level === 0 || spell.level > maxCastableLevel) {
      return false;
    }
    return true;
  }

  return (
    <Page>
      <FilterRow>
        <Filter>
          <FilterHeader>Class</FilterHeader>
          <Select onChange={(e) => setSelectedClass(e?.target?.value)} >
            {['Artificer', 'Cleric', 'Druid', 'Paladin', 'Wizard'].map((option, index) => (
              <option key={`Class-${index}`} value={option}>{option}</option>
            ))}
          </Select>
        </Filter>
        <Filter>
          <FilterHeader>Level</FilterHeader>
          <Select onChange={(e) => setClassLevel(e?.target?.value)} >
            {new Array(20).fill(null).map((option, index) => (
              <option key={`Level-${index}`} value={index + 1}>{index + 1}</option>
            ))}
          </Select>
        </Filter>
        <Filter>
          <FilterHeader>Spellcasting Modifier</FilterHeader>
          <Select onChange={(e) => setSpellcastingModifier(e?.target?.value)} value={spellcastingModifier}>
            {new Array(9).fill(null).map((a, index) => (
              <option key={`Modifier-${index - 3}`} value={index - 3}>{index < 3 ? '' : '+'}{index - 3}</option>
            ))}
          </Select>
        </Filter>
        <Filter>
          <FilterHeader>&nbsp;</FilterHeader>
          <Button onClick={randomizeSpells}>
            RANDOMIZE
          </Button>
        </Filter>
      </FilterRow>
        {_.chain(chosenSpells)
          .orderBy(['level', 'name'], ['asc', 'asc'])
          .map((spell) => (
            <SpellCard key={spell.name} spell={spell} />
          ))
          .value()
        }
    </Page>
  );
} 

export default Randumgeon;
