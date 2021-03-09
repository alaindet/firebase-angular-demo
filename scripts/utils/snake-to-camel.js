const snakeToCamelSingle = words => {
  return words
    .split('_')
    .map((word, index) => {
      return index === 0
        ? word.toLowerCase()
        : word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};

const snakeToCamel = (words, preserve = null) => {
  return preserve
    ? words.split(preserve).map(i => snakeToCamelSingle(i)).join(preserve)
    : snakeToCamelSingle(words);
};

module.exports = snakeToCamel;
