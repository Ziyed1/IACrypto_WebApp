pipeline {  
    agent any

    environment {
        MANIFEST_REPO = 'git@github.com:Ziyed1/K8s-Manifests.git'
        BRANCH = 'main'
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

                    // Création du tag d'image
                    def imageTag = "backend:${env.IMAGE_TAG}"
                    docker.build(imageTag)

                    // Connexion à Docker Hub et push de l'image
                    withCredentials([usernamePassword(credentialsId: 'DHcrendential', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                        sh "docker tag ${imageTag} ${DOCKER_USERNAME}/crypto_webapp:backend-${env.IMAGE_TAG}"
                        sh "docker push ${DOCKER_USERNAME}/crypto_webapp:backend-${env.IMAGE_TAG}"
                    }
                }
            }
        }

        stage("Update K8s Manifests") {
            steps {
                script {
                    sh """
                    git clone ${MANIFEST_REPO}
                    cd K8s-Manifests

                    sed -i '-s|image: docker.io/DOCKER_USERNAME/crypto_webapp:backend-.*|image: docker.io/${DOCKER_USERNAME}/crypto_webapp:backend-${env.IMAGE_TAG}|' backend-deployment.yaml

                    git config --global user.email "ci-bot@example.com"
                    git config --global user.name "Jenkins CI"
                    git add .
                    git commit -m "Update backend image to backend-${env.IMAGE_TAG}"
                    git push origin ${BRANCH}

                    cd ..
                    rm -rf K8s-Manifests
                    """
                }
            }
        }
    }
}