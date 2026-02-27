const https = require('https');

const data = JSON.stringify({
  messaging_product: 'whatsapp',
  pin: '252015'
});

const options = {
  hostname: 'graph.facebook.com',
  path: '/v18.0/1031996626658893/register',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer EAASdNfseThcBQ223yShx9ZCAEJw3LJ1eXOoQtj8ubZA8AY3sVSNrVmcIiSa1ZAA5S4QA59bxU4DRt3vzgUf9XygQAOXTAWimdSpkWZC6qZCU054aVNiY1JrHQH9FHF2YlK06dqtxaNL1ZCuZCnS7oLGkRO9iT6ZAqjPOabsiV8LtKiZCYPPb2VzofRYeDp9WNr0vDAAZDZD',
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(body));
});

req.write(data);
req.end();