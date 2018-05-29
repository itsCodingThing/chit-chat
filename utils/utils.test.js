const utils = require('./utils.js');

it('should add two number', () => {
let res = utils.add(10,30);
    if (res != 40) {
        throw new Error(`expected 40 but got ${res}`);
    }
});

it('should square the number', () => {
    let multi = utils.square(3);
    if (multi != 9) {
        throw new Error(`expected 9 but got ${multi}`);
    }
});