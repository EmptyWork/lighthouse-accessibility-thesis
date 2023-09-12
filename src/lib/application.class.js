import { series } from "async"
import { exec } from 'child_process'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { getCategoriesFlags, getCategoriesFromCategoriesFlags, getCurrentCategories } from "./categoriesHandlers.class.js"
import { Logger, LoggerType } from "./utilities.class.js"
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

    testURL = (urlToCheck, options = {}, currentIndex) => {
        const { commandToRun } = Command.make(urlToCheck, options)

        Logger(`Running Test on ${urlToCheck}`, LoggerType.info, options.consoleLog)

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
        Logger(`Stopped Test on ${data?.requestedUrl}`, LoggerType.info, this.options?.consoleLog)

        const newAccessibilityJSON = this.#produceNewJSON(data, accessibilityScores)

        this.#checkDirectory([`${this.#outputDir}`, `${this.#outputDir}logs`])
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
        const logFileNameBasedOnUrl = url.replace(REGEX_HTTPS_HTTP, '').replaceAll(":", "_").replaceAll("/", "").split('.').reverse().join('.')

        Logger(`Proccessed name will be ${logFileNameBasedOnUrl}`, LoggerType.info, this.options?.consoleLog)

        const fileName = `${logFileNameBasedOnUrl}-${this.#currentCategories.join('-')}-${currentTime}.json`

        Logger(`Data Saved to ${fileName}`, LoggerType.info, this.options?.consoleLog)

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

    #checkDirectory = (directories) => {
        switch (typeof directories) {
            case "object":
                directories.forEach(directory => this.#makeDirIfNotExists(directory))
                break;
            case "string":
                this.#makeDirIfNotExists(directories)
                break;
        }
    }

    #makeDirIfNotExists = (location) => {
        if (!existsSync(location)) mkdirSync(location)
    }

    start = () => {
        const isOptionsCategories = getCategoriesFlags(this.options?.categories)
        const currentFlags = `${isOptionsCategories}\n\t--output json \n\t--disable-full-page-screenshot \n\t--chrome-flags="\n\t\t--no-sandbox \n\t\t--headless \n\t\t--disable-gpu"`

        Logger(`Copyright (c) 2023 Stevarth`)
        Logger(`ThesisLighthouse ${process.env.npm_package_version} - Thesis Example Code`)
        Logger(this.options, LoggerType.info, this.options?.consoleLog)
        Logger(`Running with these flags: ${currentFlags}\n`)

        this.urlList.forEach((url, index) => { this.testURL(url, this.options, index) })
    }
}