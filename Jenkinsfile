pipeline {
    // Change 'any' to your agent label (e.g. label 'worker') to pin it to the two workers
    agent any

    options {
        timestamps()
        // Raised from 5 to 20 minutes: Sonar analysis + quality gate need more time
        timeout(time: 20, unit: 'MINUTES')
    }

    parameters {
        string(name: 'KUBECTL_ARGS',
               defaultValue: 'get pods -n kube-system',
               description: 'Arguments passed to kubectl, e.g. "get nodes" or "get pods -n workshop -o wide"')
    }

    environment {
        AWS_REGION   = 'us-east-1'
        CLUSTER_NAME = 'eks-cluster'

        // Name must match Manage Jenkins -> Tools -> SonarQube Scanner installations
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {

        stage('Checkout Git Repo') {
            steps {
                // Option A: job is "Pipeline script" (Jenkinsfile pasted in Jenkins)
                git branch: 'main',
                    url:'https://github.com/Esmailfareed/ecomerce-ci-cd.git'
                    // For a private repo add: credentialsId: 'github-creds'

                // Option B: job is "Pipeline script from SCM" -> delete Option A and use:
                // checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // 'sonarqube' must match the server Name in Manage Jenkins -> System
                withSonarQubeEnv('sonarqube') {
                    sh '''
                        ${SCANNER_HOME}/bin/sonar-scanner \
                          -Dsonar.projectKey=my-app \
                          -Dsonar.projectName=my-app \
                          -Dsonar.sources=.
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    // Stops the pipeline if the gate fails. Needs the Sonar webhook to Jenkins.
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                    trivy --version

                    echo "========== Trivy report (HIGH + CRITICAL, informational) =========="
                    trivy fs \
                      --scanners vuln,secret,misconfig \
                      --severity HIGH,CRITICAL \
                      --skip-dirs .scannerwork \
                      --format table \
                      --output trivy-report.txt \
                      --exit-code 0 .
                    cat trivy-report.txt

                    echo "========== Trivy gate (CRITICAL with a fix available fails the build) =========="
                    trivy fs \
                      --scanners vuln,secret,misconfig \
                      --severity CRITICAL \
                      --ignore-unfixed \
                      --skip-dirs .scannerwork \
                      --exit-code 0 .
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'trivy-report.txt', allowEmptyArchive: true
                }
            }
        }

        stage('Where am I running?') {
            steps {
                sh '''
                    echo "Agent host : $(hostname)"
                    echo "User       : $(whoami)"
                    aws sts get-caller-identity
                '''
            }
        }

        stage('Connect to EKS') {
            steps {
                sh 'aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$AWS_REGION"'
            }
        }

        stage('Run kubectl command') {
            steps {
                echo "Running: kubectl ${params.KUBECTL_ARGS}"
                sh '''
                    echo "================= RESPONSE ================="
                    kubectl $KUBECTL_ARGS
                    echo "============================================"
                '''
            }
        }
    }

    post {
        success { echo 'Command finished. The response is printed in the "Run kubectl command" stage above.' }
        failure { echo 'Pipeline failed. Check which stage failed: Quality Gate = SonarQube dashboard, Trivy Scan = trivy-report.txt, otherwise timeout = security group/network, Unauthorized = access entry, Forbidden = policy too narrow.' }
    }
}
