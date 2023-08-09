import Command from "../../src/lib/commandHandlers.class.js";

test('Create a command with options', () => {
    expect(
        Command.make('test', {
            "categories": ["accessibility", "seo"],
            "consoleLog": false
        })
    ).toStrictEqual({
        commandToRun: 'lighthouse test --only-categories=accessibility,seo --output json --disable-full-page-screenshot --chrome-flags="--no-sandbox --headless --disable-gpu"',
        currentFlags: '--only-categories=accessibility,seo --output json --disable-full-page-screenshot --chrome-flags="--no-sandbox --headless --disable-gpu"'
    });
});

test('Create a command without options', () => {
    expect(
        Command.make('test')
    ).toStrictEqual({
        commandToRun: 'lighthouse test --only-categories=accessibility --output json --disable-full-page-screenshot --chrome-flags="--no-sandbox --headless --disable-gpu"',
        currentFlags: '--only-categories=accessibility --output json --disable-full-page-screenshot --chrome-flags="--no-sandbox --headless --disable-gpu"'
    });
});