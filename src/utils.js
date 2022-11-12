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
  const matches = string.match(/({@[^}]+})/g);
  if (matches === null) {
    return string;
  } else {
    for (var match of matches) {
      switch (match.substring(2, match.indexOf(' '))) {
        case 'damage':
        case 'dice':
          string = string.replace(match, match.substring(match.indexOf(' '), match.length - 1));
          console.log('string:', string)
        // TODO: Handle all of these
        case 'item':
        case 'quickref':
        case 'condition':
        case 'damage':
        case 'dice':
        case 'scaledamage':
        case 'b':
        case 'spell':
        case 'sense':
        case 'creature':
        case 'action':
        case 'filter':
        case 'adventure':
        case 'hit':
        case 'chance':
        case 'd20':
        case 'skill':
        case 'scaledice':
        case 'book':
        case 'note':
        case 'classFeature':
        case 'race':
        case 'i':
        case 'atk':
        case 'h':
        case 'dc':
        case 'recharge':
        case 'table':
          break;
      }
    }
  }

  return string;
}
