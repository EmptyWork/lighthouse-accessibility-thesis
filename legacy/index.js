import { series } from 'async'
import { exec } from 'child_process'
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs'
if (!existsSync('./legacy/src/urlList.js')) copyFileSync('./legacy/src/urlList.example', './legacy/src/urlList.js')
import { urlList, options, execOptions } from './src/urlList.js'
import { makeCommandFromURL } from './src/lib/commandHandlers.js'
import { getCategoriesFromCategoriesFlags, getCurrentCategories } from './src/lib/categoriesHandlers.js'
import { getCategoriesFlags } from "./src/lib/categoriesHandlers.js"

Object.prototype.isEmpty = (obj) => {
    for (const prop in obj)
        if (Object.hasOwn(obj, prop)) return false

    return true
}

Array.prototype.isEmpty = (arr) => {
    return (arr === undefined || arr.length === 0) ? false : true
}

const execResult = (err = null, out, outerr = null) => {
    let accessibilityScores = (!existsSync('./out/scores.json')) ? readFileSync('./src/scores.json') : readFileSync('./out/scores.json')

    const data = JSON.parse(out)

    const { commandToRun } = makeCommandFromURL(data?.requestedUrl, options)
    if (options?.consoleLog ?? true) console.log(`Stopped Test on ${data?.requestedUrl}`)

    const accessibilityScoresJSON = JSON.parse(accessibilityScores)
    const categoriesScoresObject = {}
    const categories = getCategoriesFromCategoriesFlags(options?.categories)
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
        .join('-')}-${Date.now()}.json`

    writeFileSync(rawOutputFilename, JSON.stringify(data), { flag: 'w' })
    return writeFileSync('./out/scores.json', newAccessibilityJSON, { flag: 'w' })
}

const testURL = (urlToCheck, options = {}) => {
    const { commandToRun } = makeCommandFromURL(urlToCheck, options)
    if (options?.consoleLog ?? true) console.log(`Running Test on ${urlToCheck}`)

    series([
        () => exec(commandToRun, execOptions, execResult),
        // () => exec("lighthouse https://emptywork.my.id --output json >> dump", (err, stdout, stderr) => console.log(stdout))
        // () => exec("lighthouse --help", (err, stdout, stderr) => console.log(stdout))
    ])
}

const main = (urlList, options) => {
    const isOptionsCategories = getCategoriesFlags(options?.categories)
    const currentFlags = `${isOptionsCategories}--output json --disable-full-page-screenshot --chrome-flags="--no-sandbox --headless --disable-gpu"`

    console.log(`[Legacy] TLighthouse ${process.env.npm_package_version} - Thesis Example Code`)
    console.log(`Running with these Flags: ${currentFlags}\n`)

    urlList.forEach((url, index) => { testURL(url, options) })
}

main(urlList, options)