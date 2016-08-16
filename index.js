O = require('./out');

__IS_TRACE = process.env.DO_TRACE || false;
__IS_DEBUG = process.env.DO_DEBUG || false;

if (__IS_DEBUG || __IS_TRACE) {
    O.level(((__IS_TRACE) ? O.LogLevel.TRACE : O.LogLevel.DEBUG));
}

extend = require("xtend");

var connection = require('./connection');
var send = require('./send');
var recieve = require('./recieve');

var _connParams = {};
_connParams.protocol = (process.env.CONN_PROTOCOL) ? process.env.CONN_PROTOCOL : 'amqp';
_connParams.host = (process.env.CONN_HOST) ? process.env.CONN_HOST : 'localhost';
_connParams.port = (process.env.CONN_PORT) ? process.env.CONN_PORT : '5672';
_connParams.vHost = (process.env.CONN_VHOST) ? process.env.CONN_VHOST : '';
_connParams.username = (process.env.CONN_USER) ? process.env.CONN_USER : '';
_connParams.password = (process.env.CONN_PASSWORD) ? process.env.CONN_PASSWORD : '';
_connParams.queue = (process.env.CONN_QUEUE) ? process.env.CONN_QUEUE : '';

var _PRODUCER = process.env.PRODUCER || false;
var _CONSUMER = process.env.CONSUMER || false;

connection.connect(_connParams, function (channel, queue) {
    if (_PRODUCER) {
        O.i("Creating producer...");
        send.start(channel,queue);
    }

    if (_CONSUMER) {
        O.i("Creating consumer...");
        recieve.start(channel,queue);
    }
});
