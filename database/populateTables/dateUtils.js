const fixZero = (value) => {

    if (value < 10) {
        return "0" + value
    }

    return value
}

const getFullDate = (date) => {
    return date.getFullYear() + "-" + fixZero(date.getMonth() + 1) + "-" + fixZero(date.getDate())
}

exports.getFullDate = getFullDate;