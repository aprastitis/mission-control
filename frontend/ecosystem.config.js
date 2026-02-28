module.exports = {
  apps: [{
    name: 'mission-control-frontend',
    script: 'npm',
    args: 'run dev',
    cwd: '/home/aprastitis/.openclaw/workspace/mission-control/frontend',
    env: {
      HOST: '0.0.0.0',
      PORT: 3000,
      NODE_ENV: 'development'
    },
    instances: 1,
    autorestart: true,
    watch: ['src'],
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};