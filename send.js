function start(channel, queue) {
    sendMessage(channel, queue);
}

function sendMessage(channel, queue) {
    channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from("Test message: " + (new Date()).toISOString()), {}, function (err, ok) {
        if (err) {
            O.w('Message nacked!');
        }
        if (ok) {
            O.d('Message acked');
        }
    });
    O.d("Sent message...");
    setTimeout(function () { sendMessage(channel, queue) }, 1000);
}

module.exports = {
    start: start
}    
