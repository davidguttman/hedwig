#!/usr/bin/env node

var request = require('request')
var through = require('through')
var open = require('open')
var ujs = require('uglify-js')

var ws = request.post('http://hedwig.in/create', function(err, res, body) {
  if (err) return console.error(err)

  var url = 'http://hedwig.in/' + body
  console.log('Deployed to', url)
  open(url)
})

var buffer = ''
var ugs = through(function onData (data) {
  buffer += data
}, function onEnd () {
  var minned = ujs.minify(buffer, {
      fromString: true
    , compress: true
    , mangle: true
  })

  this.queue(minned.code)
  this.queue(null)
})

process.stdin.pipe(ugs).pipe(ws)