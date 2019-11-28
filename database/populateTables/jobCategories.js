
const { connectionPool } = require('../connection.js');

const mysql = require('mysql');

const array = [

    { soc: 11302100, name: 'Computer and Information Systems Managers', description: `Plan or coordinate activities in fields like information systems, and computer programming.` },
    { soc: 15111100, name: 'Computer and Information Research Scientists', description: `Conduct research into elemental computer and information science as theorists or inventors.` },
    { soc: 15112100, name: 'Computer Systems Analysts', description: `Analyze science, engineering, and other data storage problems to implement computer systems.` },
    { soc: 15112200, name: 'Information Security Analysts', description: `Plan, implement or monitor security measures to protect computer networks and information.` },
    { soc: 15113100, name: 'Computer Programmers', description: `Create, modify, and test the code, forms, and script that allow computer applications to run.` },
    { soc: 15113200, name: 'Software Developers, Applications', description: `Develop, create, and modify general or specialized computer applications software.` },
    { soc: 15113300, name: 'Software Developers, Systems Software', description: `Research, develop, and test operating systems-level software for general computing applications.` },
    { soc: 15113400, name: 'Web Developers', description: `Analyze user needs to implement Web site content, graphics, performance, and capacity.` },
    { soc: 15114100, name: 'Database Administrators', description: `Administer and implement computer databases, using knowledge of database management system.` },
    { soc: 15114200, name: 'Network and Computer Systems Administrators', description: `Install, configure, and support an organization's Internet systems.` },
    { soc: 15114300, name: 'Computer Network Architects', description: `Implement computer and information networks. Perform network modeling, analysis, and planning.` },
    { soc: 15115100, name: 'Computer User Support Specialists', description: `Provide technical assistance to computer users in person, or via telephone or electronically.` },
    { soc: 15115200, name: 'Computer Network Support Specialists', description: `Analyze, test, troubleshoot, and evaluate existing network systems.` },
    { soc: 15119900, name: 'Computer Occupations, All Other', description: `Not specified.` },

    { soc: 15112101, name: 'Informatics Nurse Specialists', description: `Assist in the design, development, and ongoing modification of computerized health care systems.` },
    { soc: 15119901, name: 'Software Quality Assurance Engineers and Testers', description: `Develop and execute software test plans in order to identify software problems and their causes.` },
    { soc: 15119902, name: 'Computer Systems Engineers/Architects', description: `Design and develop solutions to complex applications problems or network concerns.` },
    { soc: 15119903, name: 'Web Administrators', description: `Manage web environment design, deployment, development and maintenance activities. ` },
    { soc: 15119904, name: 'Geospatial Information Scientists and Technologists', description: `Research or develop geospatial technologies by producing databases or perform applications.` },
    { soc: 15119905, name: 'Geographic Information Systems Technicians', description: `Assist scientists in building, maintaining or using geographic information systems databases.` },
    { soc: 15119906, name: 'Database Architects', description: `Design strategies for enterprise database systems. Design and construct large relational databases.` },
    { soc: 15119907, name: 'Data Warehousing Specialists', description: `Program and configure warehouses of database information and provide support to its users.` },
    { soc: 15119908, name: 'Business Intelligence Analysts', description: `Build financial and market intelligence by querying data repositories and creating reports.` },
    { soc: 15119909, name: 'Information Technology Project Managers', description: `Plan, initiate and manage information technology projects while assessing business implications.` },
    { soc: 15119910, name: 'Search Marketing Strategists', description: `Examine search query behaviors on general or specialty search engines.` },
    { soc: 15119911, name: 'Video Game Designers', description: `Design core features of video games. Create and maintain design documentation.` },
    { soc: 15119912, name: 'Document Management Specialists', description: `Administer document management systems that allow companies to interact with electronic records.` },
    { soc: 15114301, name: 'Telecommunications Engineering Specialists', description: `Construct  data communications systems. Inspect installation and post-installation service.` },


]

const populateJobCategories = () => {
    return new Promise((resolve, reject) => {

        console.log('populateJobCategories... ');

        let concatenatedSQL = ''

        array.forEach(item => {
            const { soc, name, description } = item
            concatenatedSQL += `INSERT INTO JobCategories (soc, name, description) VALUES ('${soc}',${mysql.escape(name)},${mysql.escape(description)});`
        })

        connectionPool.query(concatenatedSQL, (error, result) => {
            if (error) {
                reject(error)
            } else {

                console.log('populateJobCategories... DONE');
                resolve()
            }
        })

    }) //End promise
}


exports.populateJobCategories = populateJobCategories