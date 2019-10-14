const {query} = require('./promise-mysql.js')

const {cp} = require('./languagesCRUD.js')

query(cp, 'DROP TABLE IF EXISTS dogs; CREATE TABLE dogs (name varchar (255), dog_id int AUTO_INCREMENT, PRIMARY KEY (dog_id));')
.then(result=>query(cp,'INSERT INTO  dogs (name)  VALUES ("Trotsky")'))
.then(result=>query(cp, 'SELECT * FROM dogs;'))
.then(result=>{console.log(result)})
.then(()=>{console.log('exit');process.exit();})
.catch(error=>{console.log(error)})