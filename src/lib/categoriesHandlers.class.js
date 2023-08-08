import Utility from './utilities.class.js'

class Categories {
    getCategoriesFlags = array => {
        return (!Array.isEmpty(array) ?? false) ? `--only-categories=${lighthouseCategories(array ?? "accessibility")} ` : ""
    }

    getCurrentCategories = categories => {
        return categories ?? ["accessibility", "pwa", "best-practices", "performance", "seo"]
    }

    lighthouseCategories = (categories = []) => {
        return (typeof categories == "string") ? categories : categories.join(',')
    }

    getCategoriesFromCategoriesFlags = array => {
        return (!Utility.isEmpty(array)) ? array : undefined
    }
}

export const { getCategoriesFlags, lighthouseCategories, getCurrentCategories, getCategoriesFromCategoriesFlags } = new Categories()
export default Categories