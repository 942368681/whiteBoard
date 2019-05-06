const devConfig = require('./webpack.dev.js');
const prodConfig = require('./webpack.prod.js');

module.exports = env => {
    if (env.mode === 'dev') {
        return devConfig;
    } else {
        return prodConfig;
    }
}