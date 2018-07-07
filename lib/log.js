'use strict'

const env = require('env-var')

const LOG_LEVEL = env
  .get('LOG_LEVEL', 'info')
  .asEnum(['trace', 'debug', 'info', 'warn', 'error'])

module.exports = require('pino')({
  level: LOG_LEVEL
})
