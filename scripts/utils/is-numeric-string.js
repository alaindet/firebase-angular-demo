// https://gist.github.com/alaindet/a0c79ef833a6d6e231d39fcf024ccf24
const isNumericString = (digits) => {
  return (typeof digits === 'string')
    ? digits.match(/^\d+$/)
    : false;
};

module.exports = isNumericString;
