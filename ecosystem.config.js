module.exports = {
  apps: [
    {
      name: "cloud-vibe",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/var/www/cloud-vibe",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
