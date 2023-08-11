class Utility {
    LoggerType = {
        'info': "Info",
        'warning': "Warning",
        'error': "Error",
        'empty': ""
    }

    isEmpty = data => {
        switch (typeof data) {
            case "array":
                return this.#isArrayEmpty(data)
            case 'object':
                return this.#isObjEmpty(data)
            default:
                return false
        }
    }

    Logger = (text, type = LoggerType.empty, condition = true) => {
        const typeFormatted = (type === LoggerType.empty) ? `${type}` : `${type}:`
        if (condition) console.log(`${typeFormatted}`, text)
    }

    #isArrayEmpty = (data = []) => {
        return (data === undefined || data.length === 0) ? false : true
    }

    #isObjEmpty = (data = {}) => {
        for (const prop in data)
            if (Object.hasOwn(data, prop)) return false
        return true
    }
}

export default new Utility()
export const { Logger, LoggerType } = new Utility()