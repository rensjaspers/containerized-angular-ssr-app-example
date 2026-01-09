# Containerized Angular SSR App Example

This repository is a working example for the blog post: [Dockerizing an Angular SSR App for Production: Single-Origin API Proxy & Working Transfer Cache](https://www.rensjaspers.nl/blog/dockerizing-an-angular-ssr-app-for-production-single-origin-api-proxy-working-transfer-cache)

## Running the Project

Start the containerized application using Docker Compose:

```bash
docker compose up --build
```

Once the container is running, navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Verifying the Transfer Cache

To verify that HTTP state transfer cache is working correctly:

1. Open your browser's Developer Tools (F12)
2. Go to the **Network** tab
3. Refresh the page
4. Notice that there is **no additional HTTP call** to fetch the todos data — the data is transferred from the server-side render and reused on the client side, avoiding duplicate requests
