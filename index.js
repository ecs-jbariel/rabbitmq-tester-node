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

var _connParams = {};
_connParams.protocol = (process.env.CONN_PROTOCOL) ? process.env.CONN_PROTOCOL : 'amqp';
_connParams.host = (process.env.CONN_HOST) ? process.env.CONN_HOST : 'localhost';
_connParams.port = (process.env.CONN_PORT) ? process.env.CONN_PORT : '5672';
_connParams.vHost = (process.env.CONN_VHOST) ? process.env.CONN_VHOST : '';
_connParams.username = (process.env.CONN_USER) ? process.env.CONN_USER : '';
_connParams.password = (process.env.CONN_PASSWORD) ? process.env.CONN_PASSWORD : '';
_connParams.queue = (process.env.CONN_QUEUE) ? process.env.CONN_QUEUE : '';
_connParams.producerUsername = (process.env.CONN_PRODUCER_USER) ? process.env.CONN_PRODUCER_USER : '';
_connParams.producerPassword = (process.env.CONN_PRODUCER_PASSWORD) ? process.env.CONN_PRODUCER_PASSWORD : '';
_connParams.consumerUsername = (process.env.CONN_CONSUMER_USER) ? process.env.CONN_CONSUMER_USER : '';
_connParams.consumerPassword = (process.env.CONN_CONSUMER_PASSWORD) ? process.env.CONN_CONSUMER_PASSWORD : '';
_connParams.producer = process.env.PRODUCER || false;
_connParams.consumer = process.env.CONSUMER || false;

O.d("Params from env: '" + JSON.stringify(_connParams) + "'");

var params = extend(_connParams,fileConnParams);
O.d("Final params: '" + JSON.stringify(params) + "'");

connection.connectProducer(params, function (channel, queue) {
    send.start(channel, queue);
});

connection.connectConsumer(params, function (channel, queue) {
    receive.start(channel, queue);
});
