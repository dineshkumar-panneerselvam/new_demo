/**
 * @description - Everytime a new ticket is created, this app makes an API
 * request to httpbin.org and prints the response to the terminal window.
 */
var request = require('request');
var handler = require('./lib/handle-response');

exports = {
  onTicketCreateHandler: function (ticketData) {
      console.log("Received payload :"+ JSON.stringify(ticketData))
      handler.allocateAgent(ticketData);
  }
};

