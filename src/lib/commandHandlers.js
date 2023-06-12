import { getCategoriesFlags } from "./categoriesHandlers.js"

const makeCommandFromURL = (url, options) => {
    const isOptionsCategories = getCategoriesFlags(options?.categories)
    return `lighthouse ${url} ${isOptionsCategories}--output json --disable-full-page-screenshot`
}

export { makeCommandFromURL }