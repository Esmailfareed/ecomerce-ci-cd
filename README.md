# 🛒 E-Commerce CI/CD Pipeline on AWS EKS

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![SonarQube](https://img.shields.io/badge/SonarQube-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white)
![Trivy](https://img.shields.io/badge/Trivy-1904DA?style=for-the-badge)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![AWS](https://img.shields.io/badge/AWS_EKS-232F3E?style=for-the-badge&logo=amazonwebservices&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

A full-stack e-commerce application (React, Node.js/Express, MongoDB) containerized with Docker and delivered through a Jenkins CI/CD pipeline with built-in security checks: **SonarQube** for code quality analysis and **Trivy** for container image vulnerability scanning. The app is deployed to Amazon EKS on Kubernetes.

## 🎥 Demo Video

<!-- TODO: paste your video here (see options below) -->
[Screencast from 2026-10-19 05-05-10.webm](https://github.com/user-attachments/assets/cf9ec934-f326-4f1d-86ca-8a479b482b1e)


## 📐 Architecture

![Architecture diagram](docs/architecture.png)  <!-- TODO: add your diagram -->

**Flow:** Developer pushes code → Jenkins pulls the code → SonarQube analyzes it → Docker images are built → Trivy scans the images → images are pushed to the registry → deployed to EKS → traffic routed through the AWS Load Balancer Controller and Ingress.

## ✨ Features

- Containerized frontend (React), backend (Node.js/Express), and database (MongoDB) with Docker
- Automated CI/CD pipeline with Jenkins
- **Code quality and security analysis with SonarQube** (bugs, vulnerabilities, code smells)
- **Container image vulnerability scanning with Trivy**
- Kubernetes Deployments, Services, and Ingress on Amazon EKS
- External traffic routing with the AWS Load Balancer Controller
- Persistent storage for MongoDB using the CSI driver
- IAM permissions configured for cluster components

## 🛠 Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React |
| Backend | Node.js, Express |
| Database | MongoDB |
| Containers | Docker |
| CI/CD | Jenkins, Git |
| Code Quality | SonarQube |
| Security Scanning | Trivy |
| Orchestration | Kubernetes (Amazon EKS) |
| Cloud | AWS (IAM, Load Balancer Controller, CSI) |

## 📁 Project Structure

```text
.
├── frontend/        # TODO: confirm folder names
├── backend/
├── k8s/             # Deployments, Services, Ingress
├── Jenkinsfile
└── README.md
```

## 🔄 CI/CD Pipeline

1. **Checkout**: pull source code from GitHub
2. **SonarQube Analysis**: static code analysis for bugs, vulnerabilities, and code smells
3. **Quality Gate**: pipeline stops if the code fails the SonarQube quality gate (TODO: remove if not used)
4. **Build**: build Docker images for frontend and backend
5. **Trivy Scan**: scan the images for known vulnerabilities (OS packages and dependencies)
6. **Push**: push images to the container registry (TODO: Docker Hub or ECR?)
7. **Deploy**: deploy to EKS with `kubectl apply`

> TODO: adjust the order and stage names to match your Jenkinsfile.

### Security Scans

**SonarQube** checks the source code for bugs, security hotspots, code smells, and duplication.

![SonarQube report](docs/sonarqube.png)  <!-- TODO: screenshot -->

**Trivy** scans each Docker image for vulnerabilities by severity.

```bash
trivy image <IMAGE_NAME>:<TAG>
# example: fail the build on serious issues
trivy image --severity HIGH,CRITICAL --exit-code 1 <IMAGE_NAME>:<TAG>
```

![Trivy report](docs/trivy.png)  <!-- TODO: screenshot -->

![Pipeline run](docs/jenkins-pipeline.png)  <!-- TODO: screenshot -->

## 🚀 Getting Started

### Prerequisites
- AWS account with an EKS cluster
- AWS CLI, kubectl, Docker installed
- Jenkins server with Docker, kubectl, and Trivy installed
- A running SonarQube server, connected to Jenkins with a token
- AWS Load Balancer Controller and CSI driver installed on the cluster

### Run locally (TODO: confirm commands)
```bash
git clone https://github.com/Esmailfareed/ecomerce-ci-cd.git
cd ecomerce-ci-cd
docker compose up --build   # only if you have a compose file
```

### Deploy to EKS
```bash
aws eks update-kubeconfig --name <CLUSTER_NAME> --region <REGION>
kubectl apply -f k8s/
kubectl get pods
kubectl get ingress
```

## 🧹 Cleanup
```bash
kubectl delete -f k8s/
```

## 📸 Screenshots

![App](docs/app.png)  <!-- TODO -->

## 🧠 What I Learned

- Containerizing a multi-service application
- Building a Jenkins pipeline from commit to deployment
- Adding security to CI/CD (DevSecOps) with SonarQube and Trivy
- Exposing apps on EKS with Ingress and the AWS Load Balancer Controller
- Configuring IAM and persistent storage for stateful workloads

## 📫 Contact

**Esmail Fareed** · [LinkedIn](https://www.linkedin.com/in/esmailfareed) · esmailfareed2@gmail.com
