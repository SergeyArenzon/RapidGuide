# Development Guide

This guide explains how to set up and use the development environment with hot reloading for HuddleHub.

## Prerequisites

Before starting, make sure you have the following tools installed:

- [Docker](https://docs.docker.com/get-docker/)
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [Skaffold](https://skaffold.dev/docs/install/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)

## Quick Start

1. **Start the development environment:**
   ```bash
   ./dev.sh
   ```

2. **Make changes to your code** - they will automatically reload!

3. **Stop the development environment:**
   ```bash
   ./cleanup.sh
   ```

## How It Works

### Development Dockerfiles

We use separate development Dockerfiles (`Dockerfile.dev`) for each service that:

- Install all dependencies (including dev dependencies)
- Run the services in development mode with `nest start --watch`
- Enable hot reloading through Skaffold's file sync

### Skaffold Configuration

The `skaffold.dev.yaml` configuration:

- Uses development Dockerfiles instead of production ones
- Configures manual file sync for TypeScript files
- Automatically rebuilds and redeploys when files change

### File Sync

Skaffold monitors these file patterns and syncs them to the running containers:
- `src/**/*.ts` - TypeScript source files
- `src/**/*.json` - JSON configuration files

## Manual Commands

If you prefer to run commands manually:

### Start Kind cluster:
```bash
kind create cluster --config k8s/kind/kind-config.yaml --name kind
```

### Run Skaffold in development mode:
```bash
skaffold dev --config-file skaffold.dev.yaml --port-forward
```

### Stop Skaffold:
Press `Ctrl+C` in the terminal where Skaffold is running

### Delete Kind cluster:
```bash
kind delete cluster --name kind
```

## Troubleshooting

### Services not updating

1. **Check if Skaffold is running:**
   ```bash
   skaffold dev --config-file skaffold.dev.yaml --port-forward
   ```

2. **Verify file sync is working:**
   - Look for sync messages in the Skaffold output
   - Check that your files match the sync patterns in `skaffold.dev.yaml`

3. **Restart the development environment:**
   ```bash
   ./cleanup.sh
   ./dev.sh
   ```

### Port conflicts

If you get port conflicts, you can modify the port mappings in `k8s/kind/kind-config.yaml`.

### Database issues

Make sure the databases are running and accessible. The development environment includes:
- PostgreSQL for user service
- PostgreSQL for tour service

## Production vs Development

- **Development**: Uses `Dockerfile.dev` with hot reloading
- **Production**: Uses `Dockerfile` with optimized builds

To deploy to production, use the original `skaffold.yaml` configuration.
