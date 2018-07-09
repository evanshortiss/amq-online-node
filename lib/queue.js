'use strict'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const rhea = require('rhea')
const env = require('env-var')
const log = require('./log')

const AMQ_HOST = env
  .get('AMQ_HOST', 'messaging-maas-evanshortisszgmailzcom.6a63.fuse-ignite.openshiftapps.com')
  .required()
  .asString()

const AMQ_PORT = env
  .get('AMQ_PORT', '443')
  .required()
  .asIntPositive()

const AMQ_USER = env
  .get('AMQ_USER', 'node-orders')
  .required()
  .asString()

const AMQ_PASS = env
  .get('AMQ_PASS')
  .required()
  .asString()

let sender = null

rhea.on('error', (err) => {
  log.error('error in connection', err)
})

rhea.on('connection_open', context => {
  log.info('amq connection opened')
  context.connection.open_sender('orders')
})

rhea.on('disconnected', () => {
  log.info('ampp disconnected')
})

rhea.on('connection_close', context => {
  log.info('amq connection closed')
})

rhea.once('sendable', context => {
  log.info('amq ready to send messages')
  sender = context.sender
})

rhea.on('accepted', function () {
  log.info('rhea accepted event')
})

rhea.connect({
  port: AMQ_PORT,
  host: AMQ_HOST,
  username: AMQ_USER,
  password: AMQ_PASS,
  transport: 'tls',
  rejectUnauthorized:false
})

/**
 * Sends the given order to the AMQ instance
 * @param {Object} order
 */
exports.send = (order) => {
  log.info('sending order %j', order)

  if (sender) {
    c.send({
      body: JSON.stringify(order)
    })
  } else {
    throw new Error('unable to send. sender is not defined')
  }
}



