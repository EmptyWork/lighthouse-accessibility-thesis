import { getCategoriesFlags } from "./categoriesHandlers.js"

const makeCommandFromURL = (url, options) => {
    const isOptionsCategories = getCategoriesFlags(options?.categories)
    const currentFlags = `${isOptionsCategories}--output json --disable-full-page-screenshot --chrome-flags="--no-sandbox --headless --disable-gpu"`
    const commandToRun = `lighthouse ${url} ${currentFlags}`
    return { commandToRun, currentFlags }
}

export { makeCommandFromURL }