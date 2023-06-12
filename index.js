import { series } from 'async'
import { exec } from 'child_process'
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs'
if (!existsSync('./src/urlList.js')) copyFileSync('./src/urlList.example', './src/urlList.js')
import { urlList, options, execOptions } from './src/urlList.js'
import { makeCommandFromURL } from './src/lib/commandHandlers.js'
import { getCategoriesFromCategoriesFlags, getCurrentCategories } from './src/lib/categoriesHandlers.js'

Object.prototype.isEmpty = (obj) => {
    for (const prop in obj)
        if (Object.hasOwn(obj, prop)) return false

    return true
}

Array.prototype.isEmpty = (arr) => {
    if (arr === undefined || arr.length === 0) return false
    return true
}

const execResult = (err = null, out, outerr = null) => {
    let accessibilityScores = (!existsSync('./out/scores.json')) ? readFileSync('./src/scores.json') : readFileSync('./out/scores.json')

    const data = JSON.parse(out)

    const commandToRun = makeCommandFromURL(data?.requestedUrl, options)
    console.log(`command stopped: ${commandToRun}`)

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

    const logFileNameBasedOnUrl = data?.requestedUrl.replace(/^(http|https):\/\/(www.|)/g, '').replaceAll("/", "").split('.').reverse().join('.')
    const rawOutputFilename = `./out/logs/${logFileNameBasedOnUrl}-${optionCategories
        .join('-')}-${Date.now()}.json`

    writeFileSync(rawOutputFilename, JSON.stringify(data), { flag: 'w' })
    return writeFileSync('./out/scores.json', newAccessibilityJSON, { flag: 'w' })
}

const testURL = (urlToCheck, options = {}) => {
    const commandToRun = makeCommandFromURL(urlToCheck, options)

    console.log(`running command: ${commandToRun}`)

    series([
        () => exec(commandToRun, execOptions, execResult),
        // () => exec("lighthouse https://emptywork.my.id --output json >> dump", (err, stdout, stderr) => console.log(stdout))
        // () => exec("lighthouse --help", (err, stdout, stderr) => console.log(stdout))
    ])
}

urlList.forEach(url => testURL(url, options))