#!/usr/bin/env node

var request = require('request')
var through = require('through')
var open = require('open')
var ujs = require('uglify-js')

var baseUrl = 'http://hedwig.in/'

// var ws = request.post(baseUrl + 'create', function(err, res, body) {
//   if (err) return console.error(err)

//   var url = baseUrl + body
//   console.log('Deployed to', url)
//   open(url)
// })

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

process.stdin.pipe(ugs)

ugs.on('data', function(minned) {
  createGist(minned, function(err, id) {
    if (err) return console.error(err)

    var url = baseUrl + 'g/' + id
    console.log('Deployed to', url)
    open(url)
  })
})

function createGist (code, cb) {
  var opts = createGistOpts(code)
  request(opts, function(err, res, body) {
    if (err) return cb(err)

    if (res.statusCode === 201) {
      var id = res.headers.location.split('github.com/gists/')[1]
      return cb(null, id)
    } 
    
    console.error('Error creating gist', res.headers.status)
    cb(new Error(res.headers.status))
  });
}

function createGistOpts (code) {
  var opts = {
    url: 'https://api.github.com/gists',
    method: 'POST',
    json: {
      description: 'hedwig bundle',
      "public": true,
      files: {
        'minified.js': {
          content: code
        }
      }
    },
    headers: {
      'User-Agent': 'request'
    }
  };

  return opts
}