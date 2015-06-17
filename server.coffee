express = require 'express'
sanitizer = require 'sanitizer'
ops = require './lib/operations'
path = require 'path'
bodyParser = require 'body-parser'
methodOverride = require 'method-override'
serveFavicon = require 'serve-favicon'
serveStatic = require 'serve-static'

template = (message, image) -> '
<html>
  <head>
    <title>Khan As A Service (KHANAAS)</title>
    <meta charset="utf-8">
    <style>
        span#message {
        	font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
        	padding-left: .2em;
        	font-weight: bold;
        	color: white;
        	font-size: 10em;
        	display: inline-block;
        	white-space: nowrap;
        }
	</style>
	<script>
	  (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,"script","//www.google-analytics.com/analytics.js","ga");

	  ga("create", "UA-62146225-1", "auto");
	  ga("send", "pageview");

	</script>
  </head>
  <body background="'+image+'" style="background-size: 100%; margin-top:40px;">
        <span id="message">'+message+'</span>
  </body>
</html>'

dooutput = (res, message, image) ->
  res.format
    "text/plain": ->
      res.send "#{message} #{image}"
    "application/json": ->
      res.send JSON.stringify { message: message, image: image }
    "text/html": ->
      res.send template(message,image)

app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(methodOverride())

app.use (req, res, next) ->
  res.header 'Access-Control-Allow-Origin', '*'
  res.header 'Access-Control-Allow-Methods', 'GET, OPTIONS'
  res.header 'Access-Control-Allow-Headers', 'Content-Type'
  next()

app.use(serveStatic('./public'))
app.use(serveFavicon(path.join(__dirname, 'public/favicon.ico')));

app.options "*", (req, res) ->
  res.header 'Access-Control-Allow-Origin', '*'
  res.header 'Access-Control-Allow-Methods', 'GET, OPTIONS'
  res.header 'Access-Control-Allow-Headers', 'Content-Type'
  res.end()

app.get '/kirk/:message', (req, res) ->
  message = ops.khan("#{req.params.message}")
  image = "/images/kirk.jpg"
  dooutput(res, message, image)

app.get '/spock/:message', (req, res) ->
  message = ops.khan("#{req.params.message}") 
  image = "/images/spock.jpg"
  dooutput(res, message, image)

app.get '/jones/:message', (req, res) ->
  message = ops.jones("#{req.params.message}") 
  image = "/images/jones.jpg"
  dooutput(res, message, image)

app.get '/khan/:message', (req, res) ->
  message = ops.khan("#{req.params.message}")
  image = "/images/salkhan.jpg"
  dooutput(res, message, image)

port = process.env.PORT || 5000
app.listen port
console.log "KHANAAS Started on port #{port}"
