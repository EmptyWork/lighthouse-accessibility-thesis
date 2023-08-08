import Utility from "../../src/lib/utilities.class.js"

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

