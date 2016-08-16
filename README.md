# RabbitMQ tester for NodeJS
NodeJS Producer/Consumer for RabbitMQ.

# Getting started
Clone the repo, and run `npm install` to get the dependencies.

# Usage
This uses command line parameters to conenct to a RabbitMQ instance.

For example, if you want to see trace level logging, you would run:
`DO_TRACE=true node index.js`

The full list of parameters are:
* `DO_TRACE=true` :: Enables trace level logging, (default: `false`)
* `DO_DEBUG=true` :: Enables debug level logging, (default: `false`)
* `CONN_PROTOCOL=[amqp | amqps]` :: Determines if the connection is TLS supported (default: `amqp`)
* `CONN_HOST=<hostname>` :: Sets the hostname of the RabbitMQ server (default: `localhost`)
* `CONN_PORT=<portNumber>` :: Sets the port to connect to the RabbitMQ server (default: `5672`)
* `CONN_VHOST=<vhost>` :: Sets the virtual host to use (default: `<empty>`)
* `CONN_USER=<user>` :: User to authenticate RabbitMQ connection (default: `<empty>`)
* `CONN_PASSWORD=<password>` :: Password for provided user (default: `<empty>`)
* `CONN_QUEUE=<queueName>` :: Name of queue to read/write to (default: `<empty>`)

# Issues
Please use the [Issues tab](https://github.com/ecs-jbariel/rabbitmq-tester-node/issues) to report any problems or feature requests.
