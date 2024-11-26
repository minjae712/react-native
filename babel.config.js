module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    ignore: ['asset/images/login_bg.svg'],
  };
};
