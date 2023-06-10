import { series } from 'async'
import { exec } from 'child_process'
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, write, writeFile } from 'fs'
if (!existsSync('./src/urlList.js')) copyFileSync('./src/urlList.example', './src/urlList.js')
import { urlList, options } from './src/urlList.js'

Object.prototype.isEmpty = (obj) => {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }

    return true;
}

const execResult = (err = null, out, outerr = null) => {

    let accessibilityScores = (!existsSync('./out/scores.json')) ? readFileSync('./src/scores.json') : readFileSync('./out/scores.json')

    const data = JSON.parse(out)
    const accessibilityScoresJSON = JSON.parse(accessibilityScores)
    const categoriesScoresObject = {}
    const optionCategories = options.categories ?? ["accessibility", "pwa", "best-practices", "performance", "seo"];

    optionCategories.forEach(category => {
        let categoryScore = data?.categories[category].score

        categoriesScoresObject[category] = categoryScore
    })

    accessibilityScoresJSON[data.requestedUrl] = categoriesScoresObject

    const newAccessibilityJSON = JSON.stringify(accessibilityScoresJSON)

    if (!existsSync('./out/')) mkdirSync('./out/')

    if (!existsSync('./out/logs')) mkdirSync('./out/logs')
    const rawOutputFilename = `./out/logs/${data.requestedUrl.split('.')[1]}_${Date.now()}.json`

    writeFileSync(rawOutputFilename, JSON.stringify(data), { flag: 'w' })
    return writeFileSync('./out/scores.json', newAccessibilityJSON, { flag: 'w' })
}

const testURL = (urlToCheck, options = {}) => {
    const isOptionsCategories = (!Object.isEmpty(options.categories) ?? false) ? `--only-categories=${lighthouseCategories(options?.categories ?? "accessibility")}` : ""
    const commandToRun = `lighthouse ${urlToCheck} ${isOptionsCategories} --output json`

    console.log(`running command: ${commandToRun}`)

    series([
        () => exec(commandToRun, execResult),
        // () => exec("lighthouse https://emptywork.my.id --output json >> dump", (err, stdout, stderr) => console.log(stdout))
    ])
}

const lighthouseCategories = (categories = []) => {
    if (typeof categories == "string") return categories
    return categories.join(',')
}

urlList.forEach(url => testURL(url, options))