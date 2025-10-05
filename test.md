# 🚀 Deploying a Gallery App with Docker, Jenkins, and EC2

`#devops` `#docker` `#project` `#cicd`

In this article, we’ll walk through the journey of building, containerizing, scanning, and deploying a React + Firebase Gallery App using Docker, Jenkins CI/CD, and AWS EC2.  
This guide is written so that even if you are new to DevOps or cloud deployment, you can follow step by step and understand why each part matters.

**Project Repo Link..**

---

## 📸 About the Project

This is a simple Gallery App built with:

- React (frontend)  
- Firebase (authentication + storage)  
- TailwindCSS (styling)  

The app allows you to:

✅ Upload and download images  
✅ Log in/out securely  
✅ Manage your personal gallery

While the app itself is simple, the real power comes in how we deploy it. We’ll use modern DevOps practices to ensure the app can be shipped quickly, securely, and reliably.

---

## ⚡ Step 1: Running Locally

Before thinking about Docker or Jenkins, you should always confirm the app runs locally.

```
1. Clone the repo:
git clone https://github.com/your-username/gallery-app.git
cd gallery-app

2. Install dependencies:
npm install

3. Start development server:
npm run dev
```
By default, the app is available at: 👉 http://localhost:5173
```
4. For a production build:
npm run bu
```
This creates a dist/ folder containing optimized static assets.

## 🐳 Step 2: Containerizing with Docker

Instead of manually building and serving files, let’s use Docker. Docker helps us ship the app anywhere without worrying about environment differences.

### Dockerfile
```
# Stage 1: Build the app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
## 👉 Why multi-stage?

1. First stage (node:18-alpine) builds the React app.

2. Second stage (nginx:alpine) serves only the optimized static files.

3. This keeps the final image lightweight and production-ready.
```
docker build -t gallery-app:latest .
docker run -d -p 80:80 --name gallery-app-cont gallery-app:latest
```
Now, open http://localhost
and your app is live 🎉...

## ⚙️ Step 3: Automating with Jenkins

Manual builds are fine for testing, but in real-world projects we use CI/CD pipelines to automate everything.

We’ll use Jenkins on EC2 to:

Clone the code

Build Docker image

Scan image with Trivy (security scan)

Push to DockerHub

Deploy container on EC2

👉 A Jenkinsfile is already included in the repository. Make sure to review it for the full pipeline definition.

## 🔒 Step 4: Security Scanning with Trivy

Security is critical. That’s why before pushing our image to DockerHub, First check that trivy install and update..
```
trivy image gallery-app:latest
```
This checks for vulnerabilities in our base images (node:18-alpine, nginx:alpine) and dependencies.

## 📤 Step 5: Pushing to DockerHub

Once the image is scanned, the pipeline pushes it to DockerHub.

If something fails in the pipeline, you can also push manually:
```
docker tag gallery-app:latest your-dockerhub-username/gallery-app:latest
docker push your-dockerhub-username/gallery-app:latest
```

🌍 Step 6: Deploying on EC2

Finally, we deploy on our EC2 server.

1. If the pipeline succeeds, this is automatic.

2. If not, you can also do it manually:
```
docker pull your-dockerhub-username/gallery-app:latest
docker run -d -p 80:80 --name gallery-app-cont your-dockerhub-username/gallery-app:latest
```

Now, visit your EC2 public IP in the browser and your Gallery App is live..... 🚀

## ✅ Overall Flow

1. Run locally (npm run dev)
2. Build and serve with Docker
3. Jenkins pipeline automates build → scan → push → deploy
4. App runs on EC2, accessible on port 80

## 🤝 Contributing

If you like this project:

⭐ Star the repo
🍴 Fork it and experiment
🛠️ Contribute via pull requests

## Thanks for supporting this project 💙
🔗 Follow Me for More Content

LinkedIn

GitHub

🔥 With this setup, you have not only built a cool Gallery App, but also learned how to apply DevOps practices (CI/CD, Docker, Scanning, Deployment) to make your app production-ready.
