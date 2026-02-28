module.exports = {
  apps: [{
    name: 'mission-control-backend',
    script: './venv/bin/uvicorn',
    args: 'main:app --host 100.117.111.36 --port 8000 --reload',
    cwd: '/home/aprastitis/.openclaw/workspace/mission-control/backend',
    env: {
      PATH: './venv/bin',
      PYTHONPATH: './'
    },
    instances: 1,
    autorestart: true,
    watch: ['main.py'],
    max_memory_restart: '512M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};