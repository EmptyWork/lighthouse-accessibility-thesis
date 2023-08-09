class Utility {
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