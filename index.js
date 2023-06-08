import { series } from 'async';
import { exec } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
if (!existsSync('./src/urlList.js')) copyFileSync('./src/urlList.example', './src/urlList.js')
import { urlList } from './src/urlList.js';

const execResult = (err = null, out, outerr = null) => {
    let accessibilityScores = (!existsSync('./out/scores.json')) ? readFileSync('./src/scores.json') : readFileSync('./out/scores.json')

    const data = JSON.parse(out);
    const accessibilityScoresJSON = JSON.parse(accessibilityScores)
    const URLaccessibilityScoreResult = data?.categories?.accessibility?.score
    accessibilityScoresJSON[data.requestedUrl] = URLaccessibilityScoreResult
    const newAccessibilityJSON = JSON.stringify(accessibilityScoresJSON)
    if (!existsSync('./out/')) mkdirSync('./out/')
    return writeFileSync('./out/scores.json', newAccessibilityJSON, { flag: 'w' })
}

const testURL = (urlToCheck) => {
    const commandToRun = `lighthouse ${urlToCheck} --only-categories=accessibility --output json`

    series([
        () => exec(commandToRun, execResult)
    ])
}

urlList.forEach(url => testURL(url))