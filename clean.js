import { existsSync, rmSync } from 'fs'

const cleanDirectory = () => {
    if (!existsSync('./out/')) return console.error(`failed: dir out not exist`)
    rmSync('./out/', { recursive: true })
    console.log(`complete: dir out has been deleted`)
}

cleanDirectory()