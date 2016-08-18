var amqp = require('amqplib');

var __consumerChannel;
var __producerChannel;

function connect(params, callback) {
    O.d("Using params: '" + JSON.stringify(params) + "'");

    var authStr = ((params.username && params.password) ? params.username + ':' + params.password + '@' : '');
    O.d("Auth string: '" + authStr + "'");

    var connStr = params.protocol + '://' + authStr + params.host + ((params.port) ? ':' + params.port : '') + ((params.vHost) ? '/' + params.vHost : '');
    O.d("Connection string: '" + connStr + "'");

    var myConn = amqp.connect(connStr + '?heartbeat=5')
    myConn.then(function (conn) {
        process.once('SIGINT', conn.close.bind(conn));
        O.i("Connected to RabbitMQ!!!");

        createChannel(conn, function (channel) {
            callback(channel);
        });

    }).then(null, function (err) {
        O.e("Error: '" + err + "'");
        process.exit(1);
    });
}

function generateConnectionString(params, username, password) {
    O.d("Using params: '" + JSON.stringify(params) + "'");

    var authStr = ((params.username && params.password) ? params.username + ':' + params.password + '@' : '');
    O.d("Auth string: '" + authStr + "'");

    var connStr = params.protocol + '://' + authStr + params.host + ((params.port) ? ':' + params.port : '') + ((params.vHost) ? '/' + params.vHost : '');
    O.d("Connection string: '" + connStr + "'");
}

function connectConsumer(params, callback) {
    if (params.consumer && params.consumer === 'true') {
        O.i("Creating consumer...");
        if (producerAndConsumerAreSameUser(params) && __producerChannel) {
            __consumerChannel = __producerChannel;
            callback(__consumerChannel, params.queue);
        }
        else {
            connect(params, function (channel) {
                __consumerChannel = channel;
                callback(__consumerChannel, params.queue);
            });
        }
    }
    else {
        O.d("Not creating consumer");
    }
}

function connectProducer(params, callback) {
    if (params.producer && params.producer === 'true') {
        O.i("Creating producer...");
        if (producerAndConsumerAreSameUser(params) && __consumerChannel) {
            __producerChannel = __consumerChannel;
            callback(__producerChannel, params.queue);
        }
        else {
            connect(params, function (channel) {
                __producerChannel = channel;
                callback(__producerChannel, params.queue);
            });
        }
    }
    else {
        O.d("Not creating producer");
    }
}

function producerAndConsumerAreSameUser(params) {
    var un = params.username;
    var pw = params.password;
    var cUn = params.consumerUsername;
    var cPw = params.consumerPassword;
    var pUn = params.producerUsername;
    var pPw = params.producerPassword;

    return (!cUn && !cPw && !pUn && !pPw) || (cUn === pUn && cPw === pPw);
}

function createChannel(conn, callback) {
    O.t('Starting createChannel...');
    conn.createConfirmChannel().then(function (channel) {
        O.d('No errors, trying to add handlers to channel');
        myChannel = channel.on('close', function () {
            O.i("Channel closed...");
        }).on('error', function (err) {
            O.e("Channel error: '" + err + "'");
        }).on('return', function (msg) {
            O.w("Message returned: '" + msg + "'");
        }).on('drain', function () {
            O.i("Channel draining...");
        });

        O.d('Channel setup, calling back...');
        callback(channel);
    });
    O.t('Ending createChannel...');
}

module.exports = {
    connectProducer: connectProducer,
    connectConsumer: connectConsumer,
}    
