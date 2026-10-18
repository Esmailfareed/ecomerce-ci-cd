pipeline {
    // Change 'any' to your agent label (e.g. label 'worker') to pin the job to the two workers
    agent any

    options {
        timestamps()
        timeout(time: 10, unit: 'MINUTES')
    }

    environment {
        AWS_REGION   = 'us-east-1'
        CLUSTER_NAME = 'eks-cluster'
        NAMESPACE    = 'workshop'
    }

    stages {

        stage('Hello') {
            steps {
                echo '=============================='
                echo ' Jenkinsfile test: it works!'
                echo '=============================='
                echo "Job: ${env.JOB_NAME}  Build: #${env.BUILD_NUMBER}"
                echo "Branch: ${env.BRANCH_NAME ?: env.GIT_BRANCH}"
                sh '''
                    echo "Running on host: $(hostname)"
                    echo "Running as user: $(whoami)"
                    echo "Workspace: $(pwd)"
                    date
                '''
            }
        }

        stage('Repo contents') {
            steps {
                sh '''
                    echo "--- files in repo root ---"
                    ls -la
                    echo "--- last commit ---"
                    git log -1 --oneline
                '''
            }
        }

        stage('Tool versions') {
            steps {
                sh '''
                    echo "--- tools installed on this agent ---"
                    git --version
                    docker --version
                    aws --version
                    kubectl version --client
                    eksctl version
                    helm version --short
                    java -version 2>&1 | head -n1
                '''
            }
        }

        stage('Internet check') {
            steps {
                sh 'curl -sS -m 10 -I https://github.com | head -n1'
            }
        }

        stage('AWS identity') {
            steps {
                // Shows which IAM role the worker is using (should be eks-describe-jinkins)
                sh 'aws sts get-caller-identity'
            }
        }

        stage('EKS connection') {
            steps {
                // UNSTABLE (yellow) instead of FAILED (red) if the cluster is not reachable yet
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    sh '''
                        aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "$AWS_REGION"
                        kubectl get nodes
                        kubectl get pods -n "$NAMESPACE"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'RESULT: all test stages passed.'
        }
        unstable {
            echo 'RESULT: pipeline ran, but a stage was unstable (check the EKS connection stage).'
        }
        failure {
            echo 'RESULT: a stage failed. Read the stage log above to see which tool or command broke.'
        }
        always {
            echo 'Pipeline finished.'
        }
    }
}
