/*

Here are some configurations that you can change

port - The port of webserver will use.
datapath - This will secure all levels, accounts, and the SQLite database.

Only these two, if you change other than that, errors and bugs may occur.

*/

// change this ONLY - configuration
global.config = {
    port: 8000,
    datapath: "/data", 
    securekey: false
}

// System Configuration
global.system = {
    mainpath: __dirname
}

require('./cores/database/database');
require('./cores/server');

// you can add some code if you want too..

const tools = require ("./cores/lib/account");
tools.createaccount("famry", "123456", "famry@localhost");
tools.createaccount("dexter", "123456", "dext@localhost");