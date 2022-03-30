const calc = (...numbers) => {
    let result = 0;

    numbers.forEach((number) => {
        result += number;
    });

    return result;
};

module.exports = { calc };
