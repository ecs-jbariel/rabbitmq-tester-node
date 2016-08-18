O = require('./out');

__IS_TRACE = process.env.DO_TRACE || false;
__IS_DEBUG = process.env.DO_DEBUG || false;

if (__IS_DEBUG || __IS_TRACE) {
    O.level(((__IS_TRACE) ? O.LogLevel.TRACE : O.LogLevel.DEBUG));
}

extend = require("xtend");

var connection = require('./connection');
var send = require('./send');
var receive = require('./receive');

var fs = require('fs');

var _propFile = (process.env.PROPS) ? process.env.PROPS : 'props.json';
var fileConnParams = {};

O.d("Looking for properties file: '" + _propFile + "'");
try {
    fs.accessSync(_propFile, fs.F_OK);
    fileConnParams = JSON.parse(fs.readFileSync(_propFile, 'utf-8'));
} catch (e) {
    O.w("Could not find or access file '" + _propFile + "'");
}

O.d("Params from file: '" + JSON.stringify(fileConnParams) + "'");

var defaultConnectionParams = {
    "protocol": "amqp",
    "host": "localhost",
    "port": "5672",
    "vHost": "",
    "queue": "",
    "producerUsername": "",
    "producerPassword": "",
    "consumerUsername": "",
    "consumerPassword": "",
    "producer": "false",
    "consumer": "false"
};

var params = extend(defaultConnectionParams, fileConnParams);
O.d("Final params: '" + JSON.stringify(params) + "'");

connection.connectProducer(params, function (channel, queue) {
    send.start(channel, queue);
});

connection.connectConsumer(params, function (channel, queue) {
    receive.start(channel, queue);
});
