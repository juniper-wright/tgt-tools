export const calculateStrokeTextShadow = ({ radius, color, shadow }) => {
  // number of separate shadows (bigger radius needs more granularity)
  const n = Math.ceil(4 * Math.PI * radius)

  let stroke = new Array(n).fill(null).map((a, i) => {
    return `${radius * Math.cos(2 * Math.PI * i / n)}px ${radius * Math.sin(2 * Math.PI * i / n)}px 0px ${color}`
  }).join(',')

  if (shadow) {
    stroke += `,${radius + 1}px ${radius + 1}px 0px ${color}`;
  }

  return stroke;
}

export const ordinalEnding = (i) => {
  if (i % 10 === 1 && i % 100 !== 11) {
    return 'st';
  } else if (i % 10 === 2 && i % 100 !== 12) {
    return 'nd';
  } else if (i % 10 === 3 && i % 100 !== 13) {
    return 'rd';
  } else {
    return 'th';
  }
}

export const parse5eToolsTags = (string) => {
  const matches = string.match(/{@[^}]+}/g);
  if (matches === null) {
    return string;
  } else {
    for (var match of matches) {
      switch (match.substring(2, match.indexOf(' '))) {
        // A lot of tags are just {@tag name}, so we can just render those easily
        case 'damage':
        case 'dice':
        case 'condition':
        case 'sense':
        case 'action':
        case 'skill':
          string = string.replace(match, match.substring(match.indexOf(' ') + 1, match.length - 1));
          break;

        // Some tags have multiple arguments separated by a '|', but we only ever want the first one.
        case 'filter':
        case 'book':
          string = string.replace(match, match.substring(match.indexOf(' ') + 1, match.indexOf('|')));

        // Handle {@tag entityName|data|humanReadableName}-type tags
        // Only some have a third argument that specifies a human-readable string. Some don't need it so we go with the first argument.
        case 'item':
        case 'creature':
        case 'scaledamage':
        case 'scaledice':
          const entityName = match.split('|')?.[2]?.slice(0, -1) || match.substring(match.indexOf(' ') + 1, match.indexOf('|'));
          string = string.replace(match, entityName);
          break;

        // @quickref apparently has five arguments but sometimes we only want the first
        case 'quickref':
          const refName = match.split('|')?.[4]?.slice(0, -1) || match.substring(match.indexOf(' ') + 1, match.indexOf('|'));
          string = string.replace(match, refName);
          break;

        // Spells are a special case because we need to render an <a> tag to link to the spell.
        case 'spell':
          // TODO: <a> tags are not rendering
          const spellName = match.substring(match.indexOf(' ') + 1, match.length - 1);
          string = string.replace(match, `<a href="#${spellName.replaceAll(' ', '-')}">${spellName}</a>`);
          break;

        case 'note':
          console.log('relevant match:', match)
        case 'classFeature':
        case 'race':
        case 'i':
        case 'atk':
        case 'h':
        case 'dc':
        case 'recharge':
        case 'table':
        case 'hit':
          break;
      }
    }
  }

  return string;
}
