
const { connectionPool } = require('../connection.js');

const array = [
    
    { soc: 113021, name: 'Computer and Information Systems Managers' },
    { soc: 151111, name: 'Computer and Information Research Scientists' },
    { soc: 151121, name: 'Computer Systems Analysts' },
    { soc: 151122, name: 'Information Security Analysts' },
    { soc: 151131, name: 'Computer Programmers' },
    { soc: 151132, name: 'Software Developers, Applications' },
    { soc: 151133, name: 'Software Developers, Systems Software' },
    { soc: 151134, name: 'Web Developers' },
    { soc: 151141, name: 'Database Administrators' },
    { soc: 151142, name: 'Network and Computer Systems Administrators' },
    { soc: 151143, name: 'Computer Network Architects' },
    { soc: 151151, name: 'Computer User Support Specialists' },
    { soc: 151152, name: 'Computer Network Support Specialists' },
    { soc: 151199, name: 'Computer Occupations, All Other' }
]


let currentIndex = 0

const addJobCategory = (soc, name) => {

    return new Promise((resolve, reject) => {

        let sql = `INSERT INTO JobCategories (soc, name) VALUES ('${soc}', '${name}');`

        connectionPool.query(sql, (error, result) => {
            if (error) {
                reject(error)
            } else { resolve(result) }
        })
    })
}

const populateJobCategories = () => {

    return new Promise((resolve, reject) => {

        if (currentIndex < array.length) {

            const {soc, name} = array[currentIndex]

            addJobCategory(soc, name)
                .then(() => {

                    console.log('populateJobCategories ', soc, name);

                    currentIndex++
                    resolve(populateJobCategories())
                })

        } else {
            resolve()
        }
    })
}


exports.populateJobCategories = populateJobCategories