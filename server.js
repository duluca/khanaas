var express = require('express')
var sanitizer = require('sanitizer')
var ops = require('./lib/operations')
var path = require('path')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var serveFavicon = require('serve-favicon')
var serveStatic = require('serve-static')

var template = function (message, image) {
  return '<html> <head> <title>Khan As A Service (KHANAAS)</title> <meta charset="utf-8"> <style> span#message { font-family:"Helvetica Neue",Helvetica,Arial,sans-serif; padding-left: .2em; font-weight: bold; color: white; font-size: 10em; display: inline-block; white-space: nowrap; } </style> <script> (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=ri[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date()a=s.createElement(o), m=s.getElementsByTagName(o)[0]a.async=1a.src=gm.parentNode.insertBefore(a,m) })(window,document,"script","//www.google-analytics.com/analytics.js","ga") ga("create", "UA-62146225-1", "auto") ga("send", "pageview") </script> </head> <body background="' + image + '" style="background-size: 100% margin-top:40px"> <span id="message">' + message + '</span> </body> </html>'
}

var dooutput = function (res, message, image) {
  return res.format({
    "text/plain": function () {
      return res.send(message + " " + image)
    },
    "application/json": function () {
      return res.send(JSON.stringify({
        message: message,
        image: image
      }))
    },
    "text/html": function () {
      return res.send(template(message, image))
    }
  })
}

var app = express()

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(methodOverride())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  return next()
})

app.use(serveStatic('./public'))

app.use(serveFavicon(path.join(__dirname, 'public/favicon.ico')))

app.options("*", function (req, res) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  return res.end()
})

app.get('/kirk/:message', function (req, res) {
  var image, message
  message = ops.khan("" + req.params.message)
  image = "/images/kirk.jpg"
  return dooutput(res, message, image)
})

app.get('/spock/:message', function (req, res) {
  var image, message
  message = ops.khan("" + req.params.message)
  image = "/images/spock.jpg"
  return dooutput(res, message, image)
})

app.get('/jones/:message', function (req, res) {
  var image, message
  message = ops.jones("" + req.params.message)
  image = "/images/jones.jpg"
  return dooutput(res, message, image)
})

app.get('/khan/:message', function (req, res) {
  var image, message
  message = ops.khan("" + req.params.message)
  image = "/images/salkhan.jpg"
  return dooutput(res, message, image)
})

var port = process.env.PORT || 5000

app.listen(port, function() {
  console.log("KHANAAS Started on port " + port)
})
