pipeline {
    // Change 'any' to your agent label (e.g. label 'worker') to pin it to the two workers
    agent any

    options {
        timestamps()
        timeout(time: 5, unit: 'MINUTES')
    }

    parameters {
        string(name: 'KUBECTL_ARGS',
               defaultValue: 'get pods -n kube-system',
               description: 'Arguments passed to kubectl, e.g. "get nodes" or "get pods -n workshop -o wide"')
    }

    environment {
        AWS_REGION   = 'us-east-1'
        CLUSTER_NAME = 'eks-cluster'
    }

    stages {

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
        failure { echo 'Command failed. Read the error above: timeout = security group/network, Unauthorized = access entry, Forbidden = policy too narrow.' }
    }
}
