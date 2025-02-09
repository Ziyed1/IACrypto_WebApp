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

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    // Construire l'image pour le frontend
                    echo "Building Docker image for frontend..."
                    docker.build("frontend:${env.DOCKER_IMAGE_TAG}", "./frontend")
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    // Construire l'image pour le backend
                    echo "Building Docker image for backend..."
                    docker.build("backend:${env.DOCKER_IMAGE_TAG}", "./backend")
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    // Se connecter à Docker Hub et pousser les images
                    withCredentials([usernamePassword(credentialsId: 'DockerHubCred', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                        
                        // Pousser les images frontend et backend
                        sh "docker push ${DOCKER_USERNAME}/frontend:${env.DOCKER_IMAGE_TAG}"
                        sh "docker push ${DOCKER_USERNAME}/backend:${env.DOCKER_IMAGE_TAG}"
                    }
                }
            }
        }
    }
}
