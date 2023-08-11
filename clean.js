import { existsSync, rmSync } from 'fs'
import { Logger, LoggerType } from "./src/lib/utilities.class.js"

const cleanDirectory = () => {
    if (!existsSync('./out/')) return Logger(`\`./out\` not exist`, LoggerType.warning)
    rmSync('./out/', { recursive: true })
    Logger(`\`./out\` has been deleted`, LoggerType.info)
}

cleanDirectory()