pipeline {  
    agent any

    environment {
        IMAGE_NAME = "crypto_webapp"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Generate Git Tag') {
            steps {
                script {
                    env.IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Build & Push Backend Docker Image') {
            steps {
                script {
                    echo "Building Docker image for backend..."

                    def fullImageTag = "${DOCKER_USERNAME}/${IMAGE_NAME}:backend-${env.IMAGE_TAG}"

                    // Build de l'image
                    sh "docker build -t ${fullImageTag} ."

                    // Connexion au Docker Hub et push
                    withCredentials([usernamePassword(credentialsId: 'DHcrendential', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                        sh "docker push ${fullImageTag}"
                    }
                }
            }
        }
    }
}
