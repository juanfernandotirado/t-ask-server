
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

/////////////////////////////////////////////////////////////////


const randombetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const getFakeComparison = () => {

    var max = 100;
    var r1 = randombetween(1, max - 3);
    var r2 = randombetween(1, max - 2 - r1);
    var r3 = randombetween(1, max - 1 - r1 - r2);
    var r4 = randombetween(1, max - 1 - r1 - r2 - r3);
    var r5 = max - r1 - r2 - r3 - r4;

    return [r1, r2, r3, r4, r5]
}

/**
 * Returns a value that is a proportion to the "p".
 */
const getValueBasedPis = (p, otherValue) => {

    let vP = otherValue / p
    return vP
}

/////////////////////////////////////////////////////////////////
// EXPORTED METHODS:
/////////////////////////////////////////////////////////////////

const getFakeDataTrends = (arrayOfArrays) => {
    return new Promise((resolve, reject) => {

        const a = arrayOfArrays.map(item => {
            return getFakeComparison(item)
        })

        resolve(a)

    })//end promise
}

module.exports.getFakeDataTrends = getFakeDataTrends

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
const getValuesInProportion = (array) => {

    // let total_highestRanking = (array.length * array[0].length) - array.length

    const finalArrayOfArrays = []

    //Gives a ranking for each individual array items:
    array.forEach(itemArray => {
        finalArrayOfArrays.push(getRankedArray(itemArray))
    })

    //Now gives ranking for all items in all arrays:
    console.log('---overall ranking: -----');
    console.log(finalArrayOfArrays);


    return getValuesInProportionX(finalArrayOfArrays)

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