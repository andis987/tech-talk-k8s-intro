# Quick start

## Locally

- `docker run --rm --name mongodb -p 27017:27017 mongo`
- `npm install`
- `npm run build`
- `npm run start`

## Docker

- `docker build -t demo-app .`
- `docker compose up`

## Kubernetes

- `kubectl config use-context rancher-desktop`
- `cd k8s && kubectl apply -f demo-config.yaml -f demo-app.yaml -f mongo.yaml`
