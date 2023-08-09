import Categories from "../../src/lib/categoriesHandlers.class.js"

const firstTestCategories = ["accessibility"]
const secondTestCategories = ["accessibility", "seo", "pwa"]

test('getCategories from an Array', () => {
    expect(
        Categories.getFlags(firstTestCategories)
    ).toStrictEqual("--only-categories=accessibility ");
});

test('getCategories from an Array with more than one item', () => {
    expect(
        Categories.getFlags(secondTestCategories)
    ).toStrictEqual("--only-categories=accessibility,seo,pwa ");
});

test('getCurrent from Array', () => {
    expect(
        Categories.getCurrent(firstTestCategories)
    ).toStrictEqual(["accessibility"])
});

test('getCurrent from Array with more than one item', () => {
    expect(
        Categories.getCurrent(secondTestCategories)
    ).toStrictEqual(["accessibility", "seo", "pwa"])
});

test('lighthouse from Array', () => {
    expect(
        Categories.lighthouse(firstTestCategories)
    ).toStrictEqual("accessibility")
})

test('lighthouse from Array with more than one item', () => {
    expect(
        Categories.lighthouse(secondTestCategories)
    ).toStrictEqual("accessibility,seo,pwa")
})

test('getFromFlags from Array', () => {
    expect(
        Categories.getFromFlags(firstTestCategories)
    ).toStrictEqual(["accessibility"])
})

test('getFromFlags from empty Array', () => {
    expect(
        Categories.getFromFlags([])
    ).toBe(undefined)
})