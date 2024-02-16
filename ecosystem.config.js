module.exports = {
  apps: [{
    name: 'zerossl',
    script: 'ts-node',
    args: '-P tsconfig.json ./src/sslCronJob.ts',
    interpreter: 'none',
    cron_restart: "30 6 * * 0",
    autorestart: false, // Prevents PM2 from restarting the script after it exits
  }]
};


