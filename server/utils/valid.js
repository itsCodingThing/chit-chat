let isRealString = (str) => {
    return str === 'string' && str.trim().lenght > 0;
};

module.exports = {isRealString};