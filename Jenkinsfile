pipeline {
    agent any

    environment {
        ARGOCD_SERVER = 'argocd-server-url'
        ARGOCD_APP = 'your-argocd-app'
        DOCKER_IMAGE_TAG = ''
    }

    stages {
        stage('Set Variables') {
            steps {
                script {
                    env.DOCKER_IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Build Backend Image') {
            when {
                branch 'backend'
            }
            steps {
                script {
                    docker.build("backend:${env.DOCKER_IMAGE_TAG}", "./backend")
                }
            }
        }

        stage('Build Frontend Image') {
            when {
                branch 'frontend'
            }
            steps {
                script {
                    docker.build("frontend:${env.DOCKER_IMAGE_TAG}", "./frontend")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh "docker tag backend:${env.DOCKER_IMAGE_TAG} ${DOCKER_USERNAME}/crypto_webapp:backend-${env.DOCKER_IMAGE_TAG}"
                    sh "docker push ${DOCKER_USERNAME}/crypto_webapp:backend-${env.DOCKER_IMAGE_TAG}"

                    sh "docker tag frontend:${env.DOCKER_IMAGE_TAG} ${DOCKER_USERNAME}/crypto_webapp:frontend-${env.DOCKER_IMAGE_TAG}"
                    sh "docker push ${DOCKER_USERNAME}/crypto_webapp:frontend-${env.DOCKER_IMAGE_TAG}"
                }
            }    
        }

        stage('Trigger ArgoCD Sync') {
            steps {
                script {
                    sh "argocd app sync ${ARGOCD_APP} --server ${ARGOCD_SERVER}"
                }
            }
        }
    }
}
