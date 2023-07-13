import { series } from "async"
import { exec } from 'child_process'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { getCategoriesFlags, getCategoriesFromCategoriesFlags, getCurrentCategories } from "./categoriesHandlers.class.js"
import { makeCommandFromURL } from "./commandHandlers.js"

Object.prototype.isEmpty = (obj) => {
    for (const prop in obj) (Object.hasOwn(obj, prop)) ? false : true
}

Array.prototype.isEmpty = (arr) => {
    return (arr === undefined || arr.length === 0) ? false : true
}

export default class ThesisLighthouse {
    options
    execOptions
    urlList
    constructor({ urlList, appOptions, execOptions }) {
        this.options = appOptions
        this.execOptions = execOptions
        this.urlList = urlList

        if (this.options?.consoleLog) console.log(this.options)

        const isOptionsCategories = getCategoriesFlags(this.options?.categories)
        const currentFlags = `${isOptionsCategories}\n\t--output json \n\t--disable-full-page-screenshot \n\t--chrome-flags="\n\t\t--no-sandbox \n\t\t--headless \n\t\t--disable-gpu"`

        console.log(`ThesisLighthouse ${process.env.npm_package_version} - Thesis Example Code`)
        console.log(`Running with these flags: ${currentFlags}\n`)

        this.urlList.forEach((url, index) => { this.testURL(url, this.options) })
    }

    testURL(urlToCheck, options = {}) {
        const { commandToRun } = makeCommandFromURL(urlToCheck, options)
        if (options?.consoleLog ?? true) console.log(`Running Test on ${urlToCheck}`)

        series([
            () => exec(commandToRun, this.execOptions, this.execResult.bind(this))
        ])
    }

    execResult(err = null, out, outerr = null) {
        const currentTime = new Date().toLocaleTimeString().replaceAll(":", "_")
        let accessibilityScores = (!existsSync('./out/scores.json')) ? readFileSync('./src/scores.json') : readFileSync('./out/scores.json')

        const data = JSON.parse(out)

        // const { commandToRun } = makeCommandFromURL(data?.requestedUrl, this.options)
        if (this.options?.consoleLog) console.log(`Stopped Test on ${data?.requestedUrl}`)

        const accessibilityScoresJSON = JSON.parse(accessibilityScores)
        const categoriesScoresObject = {}
        const categories = getCategoriesFromCategoriesFlags(this.options?.categories)
        const optionCategories = getCurrentCategories(categories)

        optionCategories.forEach(category => {
            let categoryScore = data?.categories[category].score

            categoriesScoresObject[category] = categoryScore
        })

        accessibilityScoresJSON[data?.requestedUrl] = categoriesScoresObject

        const newAccessibilityJSON = JSON.stringify(accessibilityScoresJSON)

        if (!existsSync('./out/')) mkdirSync('./out/')

        if (!existsSync('./out/logs')) mkdirSync('./out/logs')

        const REGEX_HTTPS_HTTP = /^(http|https):\/\/(www.|)/g

        const logFileNameBasedOnUrl = data?.requestedUrl.replace(REGEX_HTTPS_HTTP, '').replaceAll("/", "").split('.').reverse().join('.')
        const rawOutputFilename = `./out/logs/${logFileNameBasedOnUrl}-${optionCategories
            .join('-')}-${currentTime}.json`

        writeFileSync(rawOutputFilename, JSON.stringify(data), { flag: 'w' })
        return writeFileSync('./out/scores.json', newAccessibilityJSON, { flag: 'w' })
    }
}