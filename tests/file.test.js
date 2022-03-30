const { calc } = require('./index');

describe('random test', () => {
    it('calc', () => {
        expect.hasAssertions();

        expect(1 + 1).toBe(2);
        expect(calc(1, 7, 8, 6)).toBe(22);
    });
});
