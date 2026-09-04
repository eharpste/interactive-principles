const { merge } = require('webpack-merge');
const commonConfig = require('./config/webpack.common.config');

module.exports = (env) => {

    const determineAddons = (addons) => {
        return [...[addons]]
            .filter(addon => Boolean(addon))
            .map(addon => require(`./config/addons/webpack.${addon}.js`));
    };

    const envConfig = require(`./config/webpack.${env.env}.config`);

    return merge(commonConfig, envConfig, ...determineAddons(env.addons));
};