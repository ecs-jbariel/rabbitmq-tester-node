function start(channel, queue) {
    channel.consume(queue, function (msg) {
        O.i("   Received message: '" + msg.content.toString() + "'");
        channel.ack(msg);
    });
}

module.exports = {
    start: start
}    
