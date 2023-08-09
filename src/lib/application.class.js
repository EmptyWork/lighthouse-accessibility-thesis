import { series } from "async"
import { exec } from 'child_process'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { getCategoriesFlags, getCategoriesFromCategoriesFlags, getCurrentCategories } from "./categoriesHandlers.class.js"
import Command from "./commandHandlers.class.js"

export default class ThesisLighthouse {
    #outputDir = './out/'
    #sourceDir = './src/'
    #currentCategories
    options
    execOptions
    urlList
    constructor({ urlList, appOptions, execOptions }) {
        this.options = appOptions
        this.execOptions = execOptions
        this.urlList = urlList

        const categories = getCategoriesFromCategoriesFlags(this.options?.categories)
        this.#currentCategories = getCurrentCategories(categories)
    }

    testURL = (urlToCheck, options = {}) => {
        const { commandToRun } = Command.make(urlToCheck, options)
        if (options?.consoleLog ?? true) console.log(`Running Test on ${urlToCheck}`)

        series([
            () => exec(commandToRun, this.execOptions, this.execResult.bind(this))
        ])
    }

    execResult = (err = null, out, outerr = null) => {
        let accessibilityScores = this.#readFileFrom(
            `${this.#outputDir}scores.json`,
            `${this.#sourceDir}scores.json`
        )

        const data = JSON.parse(out)
        if (this.options?.consoleLog) console.log(`Stopped Test on ${data?.requestedUrl}`)

        const newAccessibilityJSON = this.#produceNewJSON(data, accessibilityScores)

        this.#checkDir()
        const rawOutputFilename = this.#createFileName(data?.requestedUrl)

        writeFileSync(rawOutputFilename, JSON.stringify(data), { flag: 'w' })
        return writeFileSync(
            `${this.#outputDir}scores.json`,
            newAccessibilityJSON,
            { flag: 'w' }
        )
    }

    #createFileName = (url) => {
        const currentTime = new Date().toLocaleTimeString().replaceAll(":", "_")
        const REGEX_HTTPS_HTTP = /^(http|https):\/\/(www.|)/g
        const logFileNameBasedOnUrl = url.replace(REGEX_HTTPS_HTTP, '').replaceAll("/", "").split('.').reverse().join('.')

        const fileName = `${logFileNameBasedOnUrl}-${this.#currentCategories.join('-')}-${currentTime}.json`

        return `${this.#outputDir}logs/${fileName}`
    }

    #produceNewJSON = (data, accessibilityScores) => {
        const accessibilityScoresJSON = JSON.parse(accessibilityScores)
        const categoriesScoresObject = {}

        this.#currentCategories.forEach(category => {
            let categoryScore = data?.categories[category].score
            categoriesScoresObject[category] = categoryScore
        })

        accessibilityScoresJSON[data?.requestedUrl] = categoriesScoresObject

        return JSON.stringify(accessibilityScoresJSON)
    }

    #readFileFrom = (location, backup) => {
        return (!existsSync(location)) ? readFileSync(backup) : readFileSync(location)
    }

    #checkDir = () => {
        if (!existsSync(`${this.#outputDir}`)) mkdirSync(`${this.#outputDir}`)
        if (!existsSync(`${this.#outputDir}logs`)) mkdirSync(`${this.#outputDir}logs`)
    }

    start = () => {
        if (this.options?.consoleLog) console.log(this.options)

        const isOptionsCategories = getCategoriesFlags(this.options?.categories)
        const currentFlags = `${isOptionsCategories}\n\t--output json \n\t--disable-full-page-screenshot \n\t--chrome-flags="\n\t\t--no-sandbox \n\t\t--headless \n\t\t--disable-gpu"`

        console.log(`ThesisLighthouse ${process.env.npm_package_version} - Thesis Example Code`)
        console.log(`Running with these flags: ${currentFlags}\n`)

        this.urlList.forEach((url, index) => { this.testURL(url, this.options) })
    }
}