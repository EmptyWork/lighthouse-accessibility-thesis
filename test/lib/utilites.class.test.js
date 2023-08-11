import Utility, { LoggerType } from "../../src/lib/utilities.class.js"

test('isEmpty of an empty Array', () => {
    expect(
        Utility.isEmpty([])
    ).toBe(true);
});

test('isEmpty of not an empty Array', () => {
    expect(
        Utility.isEmpty(["ada"])
    ).toBe(false);
});

test('isEmpty of an empty Object', () => {
    expect(
        Utility.isEmpty({})
    ).toBe(true);
});

test('isEmpty of not an empty Object', () => {
    expect(
        Utility.isEmpty({ options: "ada" })
    ).toBe(false);
});

// Reverse of isEmpty
test('Not isEmpty of an empty Array', () => {
    expect(
        !Utility.isEmpty([])
    ).toBe(false);
});

test('Not isEmpty of not an empty Array', () => {
    expect(
        !Utility.isEmpty(["ada"])
    ).toBe(true);
});

test('Not isEmpty of an empty Object', () => {
    expect(
        !Utility.isEmpty({})
    ).toBe(false);
});

test('Not isEmpty of not an empty Object', () => {
    expect(
        !Utility.isEmpty({ options: "ada" })
    ).toBe(true);
});

test('Logger test', () => {
    const spyOn = jest.spyOn(console, 'log')
    Utility.Logger("Running Test on localhost", "Info", false)
    expect(
        spyOn
    ).not.toHaveBeenCalled()
})

test('Logger test', () => {
    const spyOn = jest.spyOn(console, 'log')
    Utility.Logger("Running Test on localhost", "Info")
    expect(
        spyOn
    ).toHaveBeenCalledWith("Info:", "Running Test on localhost")
})

test('LoggerType.empty', () => {
    expect(LoggerType.empty).toStrictEqual("")
})