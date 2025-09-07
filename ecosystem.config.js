module.exports = {
  apps: [{
    name: 'logiszar-erp',
    cwd: '/var/www/logiszar-erp',
    script: 'node_modules/.bin/next',
    args: 'start -p 3000',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
