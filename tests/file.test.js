const addition = require('./addition');

describe('random test', () => {
    it('calc', () => {
        expect.hasAssertions();

        expect(1 + 3).toBe(4);

        expect(addition(2, 6, 9)).toBe(17);
    });
});
