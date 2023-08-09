import { existsSync, copyFileSync } from 'fs'

if (!existsSync('./src/urlList.class.js')) copyFileSync('./src/urlList.class.example', './src/urlList.class.js')