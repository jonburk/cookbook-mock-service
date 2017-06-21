'use strict'

var app = require('express')()
var cors = require('cors')
var serverPort = 8080

app.use(cors())

// Start the server
app.listen(serverPort, function () {
  console.log(`Mock cookbook service ready on port ${serverPort}`)
})
