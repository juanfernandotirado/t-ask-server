/////////////////////////////////////////////////////////////////
// EXPORTED METHODS:
/////////////////////////////////////////////////////////////////

/**
 * Receives:
 * [
 *  [base-value, value, value, value, value],
 *  [base-value, value, value, value, value],
 *  [base-value, value, value, value, value]
 * ]
 * 
 * And returns:
 * [
 *  [1, value, value, value, value],
 *  [1, value, value, value, value],
 *  [1, value, value, value, value]
 * ]
 * 
 * value -> Is a float based like, 0.7727272727272727
 */
const getValuesInProportionX = (array) => {

    const finalArrayOfArrays = []

    array.forEach(itemArray => {

        const newArray = itemArray.map((item, index) => {
            if (index == 0) {
                return 1
            } else {
                return getValueBasedPis(itemArray[0], item)
            }
        })

        finalArrayOfArrays.push(newArray)
    })

    return finalArrayOfArrays

}

module.exports.getValuesInProportion = getValuesInProportionX


/**
 * Receives an array:
 * [1,2,3,4,5,6,7,8,9,10,11,12]
 * 
 * And returns:
 *  [
 *     [1,2,3,4,5],
 *     [1,6,7,8,9],
 *     [1,10,11,12]
 *  ]
 */
const getComparisonArrays = (languages) => {
    return new Promise((resolve, reject) => {

        let arrayLanguages = getSplitArrays(languages)
        resolve(arrayLanguages)

    })//end promise
}

module.exports.getComparisonArrays = getComparisonArrays

/////////////////////////////////////////////////////////////////
//Utility METHODS:
/////////////////////////////////////////////////////////////////

const getSplitArrays = (languages, size = 4) => {

    let arraysForComparison = [[]]
    let count = 0

    languages.forEach(item => {

        if (count != size) {

            arraysForComparison[arraysForComparison.length - 1].push(item)

        } else {
            arraysForComparison.push([languages[0], item])
            count = 0
        }

        if (arraysForComparison[0].length != 1) {
            count++
        }
    })

    return arraysForComparison
}

/**
 * Returns a value that is a proportion to the "p".
 */
const getValueBasedPis = (p, otherValue) => {

    let vP = otherValue / p
    return vP
}

const getRankedArray = (array) => {
    let maxRankInner = array.length
    let rankArray = []

    array.forEach(_ => {

        let highestIndex = getIndexHighest(array)

        //By now we have the highest index.
        rankArray[highestIndex] = maxRankInner--
        array[highestIndex] = -1
    })

    return rankArray
}

const getIndexHighest = (array) => {

    //Gets first available index:
    array.forEach((item, index) => {
        if (item > 0) {
            highestIndex = index
        }
    })

    for (let index = 0; index < array.length; index++) {
        const element = array[index];

        if (element > array[highestIndex]) {
            highestIndex = index
        }
    }

    return highestIndex
}