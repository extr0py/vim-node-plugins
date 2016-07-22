"use strict";
var argv = global["browserArgs"];
var serverName = argv.servername;
var pluginName = argv.pluginname;
var apiPath = argv.apipath;
var pluginPath = argv.pluginpath;
process.chdir(argv.cwd);
var Vim = require(apiPath);
global["vim"] = new Vim.default(serverName, pluginName);
require(pluginPath);