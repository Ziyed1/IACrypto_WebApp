pipeline {
    agent any
    environment {
        DOCKER_IMAGE_TAG = ''
    }
    
    stages {
        stage('Checkout') {
            steps {
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
                    echo "Building Docker image for frontend..."

                    // Construire l'image Docker pour le frontend
                    docker.build("frontend:${env.DOCKER_IMAGE_TAG}")

                    // Connexion au registre Docker Hub et push de l'image
                    withCredentials([usernamePassword(credentialsId: 'DHcrendential', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                        sh "docker tag frontend:${env.DOCKER_IMAGE_TAG} ${DOCKER_USERNAME}/crypto_webapp:frontend-${env.DOCKER_IMAGE_TAG}"
                        sh "docker push ${DOCKER_USERNAME}/crypto_webapp:frontend-${env.DOCKER_IMAGE_TAG}"
                    }
                }
            }
        }
    }
}
