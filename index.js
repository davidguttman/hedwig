#!/usr/bin/env node

var request = require('request')

var ws = request.post('http://hedwig.in/create', function(err, res, body) {
  if (err) return console.error(err)

  var url = 'http://hedwig.in/' + body
  console.log(url)
})

process.stdin.pipe(ws)