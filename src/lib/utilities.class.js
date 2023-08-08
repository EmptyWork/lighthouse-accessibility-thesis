class Utility {
    isEmpty = data => {
        let result;
        if (typeof data === 'array') result = this.#isArrayEmpty(data)
        if (typeof data === 'object') result = this.#isObjEmpty(data)

        return result
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