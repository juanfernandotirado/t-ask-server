
const { connectionPool } = require('../connection.js');

const array = [

    { soc: 11302100, name: 'Computer and Information Systems Managers' },
    { soc: 15111100, name: 'Computer and Information Research Scientists' },
    { soc: 15112100, name: 'Computer Systems Analysts' },
    { soc: 15112200, name: 'Information Security Analysts' },
    { soc: 15113100, name: 'Computer Programmers' },
    { soc: 15113200, name: 'Software Developers, Applications' },
    { soc: 15113300, name: 'Software Developers, Systems Software' },
    { soc: 15113400, name: 'Web Developers' },
    { soc: 15114100, name: 'Database Administrators' },
    { soc: 15114200, name: 'Network and Computer Systems Administrators' },
    { soc: 15114300, name: 'Computer Network Architects' },
    { soc: 15115100, name: 'Computer User Support Specialists' },
    { soc: 15115200, name: 'Computer Network Support Specialists' },
    { soc: 15119900, name: 'Computer Occupations, All Other' },
    
    { soc: 15112101, name: 'Informatics Nurse Specialists' },
    { soc: 15119901, name: 'Software Quality Assurance Engineers and Testers' },
    { soc: 15119902, name: 'Computer Systems Engineers/Architects' },
    { soc: 15119903, name: 'Web Administrators' },
    { soc: 15119904, name: 'Geospatial Information Scientists and Technologists' },
    { soc: 15119905, name: 'Geographic Information Systems Technicians' },
    { soc: 15119906, name: 'Database Architects' },
    { soc: 15119907, name: 'Data Warehousing Specialists' },
    { soc: 15119908, name: 'Business Intelligence Analysts' },
    { soc: 15119909, name: 'Information Technology Project Managers' },
    { soc: 15119910, name: 'Search Marketing Strategists' },
    { soc: 15119911, name: 'Video Game Designers' },
    { soc: 15119912, name: 'Document Management Specialists' },
    { soc: 15114301, name: 'Telecommunications Engineering Specialists' },
    	

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

            const { soc, name } = array[currentIndex]

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