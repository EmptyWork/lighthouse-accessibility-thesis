import { series } from 'async'
import { exec } from 'child_process'
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, write, writeFile } from 'fs'
if (!existsSync('./src/urlList.js')) copyFileSync('./src/urlList.example', './src/urlList.js')
import { urlList } from './src/urlList.js'

const execResult = (err = null, out, outerr = null) => {
    let accessibilityScores = (!existsSync('./out/scores.json')) ? readFileSync('./src/scores.json') : readFileSync('./out/scores.json')

    const data = JSON.parse(out)
    const accessibilityScoresJSON = JSON.parse(accessibilityScores)
    const URLaccessibilityScoreResult = data?.categories?.accessibility?.score

    accessibilityScoresJSON[data.requestedUrl] = URLaccessibilityScoreResult

    const newAccessibilityJSON = JSON.stringify(accessibilityScoresJSON)

    if (!existsSync('./out/')) mkdirSync('./out/')

    if (!existsSync('./out/logs')) mkdirSync('./out/logs')
    const rawOutputFilename = `./out/logs/${data.requestedUrl.split('.')[1]}_${Date.now()}.json`

    writeFileSync(rawOutputFilename, JSON.stringify(data), { flag: 'w' })
    return writeFileSync('./out/scores.json', newAccessibilityJSON, { flag: 'w' })
}

const testURL = (urlToCheck, options = {}) => {
    const commandToRun = `lighthouse ${urlToCheck} --only-categories=${lighthouseCategories(options?.categories ?? "accessibility")} --output json`
    console.log(`running command: ${commandToRun}`)
    series([
        () => exec(commandToRun, execResult)
    ])
}

const lighthouseCategories = (categories = []) => {
    if (typeof categories == "string") return categories
    return categories.join(',')
}

urlList.forEach(url => testURL(url,
    {
        "categories": [
            "accessibility",
            "performance"
        ]
    })
)