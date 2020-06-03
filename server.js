const cds = require('@sap/cds')

cds.on('bootstrap', (app)=>{
  // add your own middleware before any by cds are added



})

cds.on('listening', ()=>{
    // add more middleware ...
})

module.exports = cds.server // delegate to default server.js