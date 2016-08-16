var amqp = require('amqplib');

var _connParams = {
    protocol: 'amqp',
    host: 'localhost',
    port: '5672',
    vHost: '',
    username: '',
    password: '',
    queue: ''
}

O.t("Default params: '" + JSON.stringify(_connParams) + "'");

function connect(userConnectionParams, callback) {
    O.t("User params: '" + JSON.stringify(userConnectionParams) + "'");
    var params = extend(_connParams, userConnectionParams);

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
            callback(channel, params.queue);
        });

    }).then(null, function (err) {
        O.e("Error: '" + err + "'");
        process.exit(1);
    });
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
    connect: connect
}    
