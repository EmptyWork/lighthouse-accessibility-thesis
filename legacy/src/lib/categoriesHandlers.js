
const getCategoriesFlags = array => {
    return (!Array.isEmpty(array) ?? false) ? `--only-categories=${lighthouseCategories(array ?? "accessibility")} ` : ""
}

const getCurrentCategories = categories => {
    return categories ?? ["accessibility", "pwa", "best-practices", "performance", "seo"]
}

const lighthouseCategories = (categories = []) => {
    return (typeof categories == "string") ? categories : categories.join(',')
}

const getCategoriesFromCategoriesFlags = array => {
    return (!Array.isEmpty(array)) ? array : undefined
}

export { getCategoriesFlags, lighthouseCategories, getCurrentCategories, getCategoriesFromCategoriesFlags }