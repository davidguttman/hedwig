#!/usr/bin/env node

var request = require('request')
var open = require('open')

var ws = request.post('http://hedwig.in/create', function(err, res, body) {
  if (err) return console.error(err)

  var url = 'http://hedwig.in/' + body
  console.log('Deployed to', url)
  open(url)
})

process.stdin.pipe(ws)