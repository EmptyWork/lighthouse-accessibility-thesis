import Utility from './utilities.class.js'

class Categories {
    // getCategoriesFlags = array => {
    getFlags = array => {
        return (!Utility.isEmpty(array) ?? false) ? `--only-categories=${lighthouseCategories(array ?? "accessibility")} ` : ""
    }

    // getCurrentCategories = categories => {
    getCurrent = categories => {
        return categories ?? ["accessibility", "pwa", "best-practices", "performance", "seo"]
    }

    // lighthouseCategories = (categories = []) => {
    lighthouse = (categories = []) => {
        return (typeof categories == "string") ? categories : categories.join(',')
    }

    // getCategoriesFromCategoriesFlags = array => {
    getFromFlags = array => {
        return (!Utility.isEmpty(array)) ? array : undefined
    }
}

export const {
    getFlags: getCategoriesFlags, // deprecated: only use this for non-class implementation 
    lighthouse: lighthouseCategories, // deprecated: only use this for non-class implementation 
    getCurrent: getCurrentCategories, // deprecated: only use this for non-class implementation 
    getFromFlags: getCategoriesFromCategoriesFlags // deprecated: only use this for non-class implementation 
} = new Categories()
export default new Categories()