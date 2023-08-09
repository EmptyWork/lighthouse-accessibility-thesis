import ThesisLighthouse from "../../src/lib/application.class.js";
const Config = class {
    static urlList = [
        "https://emptywork.my.id", // my main website
        "https://js.emptywork.my.id", // my js playground website
    ]

    static appOptions = {
        "categories": ["accessibility", "seo"],
        "consoleLog": true
    }

    static execOptions = {
        "maxBuffer": 2048 * 1024
    }
}

const app = new ThesisLighthouse(Config)

test('urlList of Config', () => {
    expect(
        app.urlList
    ).toStrictEqual(["https://emptywork.my.id", "https://js.emptywork.my.id"])
})

test('appOptions of Config', () => {
    expect(
        app.options
    ).toStrictEqual({
        "categories": ["accessibility", "seo"],
        "consoleLog": true
    })
})

test('execOptions of Config', () => {
    expect(
        app.execOptions
    ).toStrictEqual({
        "maxBuffer": 2048 * 1024
    })
})