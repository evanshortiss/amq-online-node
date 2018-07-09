'use strict'

const env = require('env-var')
const express = require('express')
const parser = require('body-parser')
const log = require('./lib/log')
const queue = require('./lib/queue')

// const HOST = env.get('HOST', '0.0.0.0').asString()
const PORT = env.get('PORT', '8080').asIntPositive()

const app = express()

app.post('/order', parser.json(), (req, res, next) => {
  try {
    queue.send(req.body)
    res.end('success')
  } catch (e) {
    next(e)
  }
})

app.get('/health', (req, res) => {
  log.info('responded to health check')
  res.end('ok')
})

app.use((err, req, res, next) => {
  log.error('internal error')
  log.error(err)

  res.status(500).json({
    msg: 'internal server error',
    stack: err.stack
  })
})

app.listen(PORT, err => {
  if (err) {
    throw err
  }

  log.info(`orders service listnening on ${PORT}`)
})
