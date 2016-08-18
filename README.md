# RabbitMQ tester for NodeJS
NodeJS Producer/Consumer for RabbitMQ.

# Getting started
Clone the repo, and run `npm install` to get the dependencies.

# Usage
This uses file based JSON parameters to conenct to a RabbitMQ instance.  To see an example file, you can view [props.json.example](props.json.example)

Additional parameters can be provided via the environment.

For example, if you want to see trace level logging, you would run (cygwin/unix):

`DO_TRACE=true node index.js`

or (cmd on Windows):

`
set DO_TRACE=true
node index.js
`

The full list of parameters are:
* `DO_TRACE=true` :: Enables trace level logging, (default: `false`)
* `DO_DEBUG=true` :: Enables debug level logging, (default: `false`)
* `PROPS=<path-to-json-properties-file>` :: Property file location ([see example](props.json.example)) (default: `props.json`)

# Issues
Please use the [Issues tab](../../issues) to report any problems or feature requests.
