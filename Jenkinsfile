pipeline {
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Push Frontend Docker Image') {
            steps {
                script {
                    echo "Building Docker image for frontend..."

                    // Construire l'image Docker pour le frontend avec le tag basé sur le numéro de build
                    def imageTag = "frontend:v.-${env.BUILD_NUMBER}"
                    docker.build(imageTag)

                    // Connexion au registre Docker Hub et push de l'image
                    withCredentials([usernamePassword(credentialsId: 'DHcrendential', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                        sh "docker tag ${imageTag} ${DOCKER_USERNAME}/crypto_webapp:frontend-${env.BUILD_NUMBER}"
                        sh "docker push ${DOCKER_USERNAME}/crypto_webapp:frontend-${env.BUILD_NUMBER}"
                    }
                }
            }
        }
    }
}
