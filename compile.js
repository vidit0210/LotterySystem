const path = require('path');
const fs = require('fs');
const solc = require('solc');

const path_to_file = path.resolve(__dirname,'Contracts','Inbox.sol');
const source  = fs.readFileSync(path_to_file,'utf8');

module.exports = solc.compile(source,1).contracts[':Inbox'];