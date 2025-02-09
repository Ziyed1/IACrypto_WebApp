pipeline {
    agent any
    environment {
        DOCKER_IMAGE_TAG = ''
        DOCKER_USERNAME = 'ziyed1'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Récupérer le code du repository
                checkout scm
            }
        }

        stage('Set Variables') {
            steps {
                script {
                    // Générer un tag basé sur le commit
                    env.DOCKER_IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Build & Push Frontend Docker Image') {
            steps {
                script {
                    def branch = env.BRANCH_NAME

                    if (branch == 'frontend') {
                        echo "Building Docker image for frontend..."

                        // Assure-toi que le code de la branche 'frontend' est bien checkouté
                        sh "git checkout frontend"

                        // Construire l'image Docker pour le frontend
                        docker.build("frontend:${env.DOCKER_IMAGE_TAG}")

                        withCredentials([usernamePassword(credentialsId: 'DHcredential', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                            sh "docker tag frontend:${env.DOCKER_IMAGE_TAG} ${DOCKER_USERNAME}/crypto_webapp:frontend-${env.DOCKER_IMAGE_TAG}"
                            sh "docker push ${DOCKER_USERNAME}/crypto_webapp:frontend-${env.DOCKER_IMAGE_TAG}"
                        }
                    } else {
                        echo "Branch ${branch} is not 'frontend'. Skipping frontend build."
                    }
                }
            }
        }

        stage('Build & Push Backend Docker Image') {
            steps {
                script {
                    def branch = env.BRANCH_NAME

                    if (branch == 'backend') {
                        echo "Building Docker image for backend..."

                        // Assure-toi que le code de la branche 'backend' est bien checkouté
                        sh "git checkout backend"

                        // Construire l'image Docker pour le backend
                        docker.build("backend:${env.DOCKER_IMAGE_TAG}")

                        withCredentials([usernamePassword(credentialsId: 'DHcredential', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                            sh "docker tag backend:${env.DOCKER_IMAGE_TAG} ${DOCKER_USERNAME}/crypto_webapp:backend-${env.DOCKER_IMAGE_TAG}"
                            sh "docker push ${DOCKER_USERNAME}/crypto_webapp:backend-${env.DOCKER_IMAGE_TAG}"
                        }
                    } else {
                        echo "Branch ${branch} is not 'backend'. Skipping backend build."
                    }
                }
            }
        }
    }
}
