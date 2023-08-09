import { getCategoriesFlags } from "./categoriesHandlers.class.js"

class Command {
    make = (url, options) => {
        const isOptionsCategories = getCategoriesFlags(options?.categories)
        const currentFlags = `${isOptionsCategories}--output json --disable-full-page-screenshot --chrome-flags="--no-sandbox --headless --disable-gpu"`
        const commandToRun = `lighthouse ${url} ${currentFlags}`
        return { commandToRun, currentFlags }
    }
}

export const {
    make: makeCommandFromURL // deprecated: only use this for non-class implementation 
} = new Command()
export default new Command()