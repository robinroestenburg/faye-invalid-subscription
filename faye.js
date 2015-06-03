var faye = require('faye'),
    http = require('http'),
    server, bayeux;

var superSecret = process.env.SECRET || 'X';

server = http.createServer(),

bayeux = new faye.NodeAdapter({ mount: '/faye', timeout: 45 });
bayeux.addExtension({
  incoming: function(message, callback) {
    if (message.channel === '/meta/subscribe') {
      if (message.ext.signature !== superSecret) {
        message.error = '403::Authentication required';
      }
    }
    callback(message);
  }
});
bayeux.attach(server);

server.listen(9292);
