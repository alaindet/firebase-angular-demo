const asBoolean = arg => {
  return arg === 'false' ? false : (arg || arg === '');
};

module.exports = asBoolean;
