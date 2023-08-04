import { existsSync, copyFileSync } from 'fs'
import ThesisLighthouse from './src/lib/application.class.js'
if (!existsSync('./src/urlList.class.js')) copyFileSync('./src/urlList.class.example', './src/urlList.class.js')
import Config from "./src/urlList.class.js"

const app = new ThesisLighthouse(Config)