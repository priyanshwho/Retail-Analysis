module.exports = {
  apps: [
    {
      name: "retail-backend",
      cwd: "/home/priyanshu/Retail-Analysis/backend",
      script: "/home/priyanshu/Retail-Analysis/backend/.venv/bin/uvicorn",
      args: "app.main:app --host 127.0.0.1 --port 8005 --workers 2",
      interpreter: "none",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
