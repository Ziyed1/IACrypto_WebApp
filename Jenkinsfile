pipeline {  
    agent any

    environment {
        MANIFEST_REPO = 'git@github.com:Ziyed1/K8s-Manifests.git'
        BRANCH = 'main'
        DOCKER_USERNAME = 'ziyed1'
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

        stage('Build & Push Frontend Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DHcrendential', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        echo "Building Docker image for frontend..."

                        // Création du tag d'image
                        def imageTag = "frontend:${env.IMAGE_TAG}"
                        docker.build(imageTag)

                        // Connexion à Docker Hub et push de l'image
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                        sh "docker tag ${imageTag} ${DOCKER_USERNAME}/crypto_webapp:frontend-${env.IMAGE_TAG}"
                        sh "docker push ${DOCKER_USERNAME}/crypto_webapp:frontend-${env.IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Update K8s Manifests') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: 'GitHubSSHKey', keyFileVariable: 'SSH_KEY')]) {
                        sh """
                        export GIT_SSH_COMMAND="ssh -i $SSH_KEY -o StrictHostKeyChecking=no"
                        git clone git@github.com:Ziyed1/K8s-Manifests.git
                        cd K8s-Manifests
                        sed -i 's|image: docker.io/DOCKER_USERNAME/crypto_webapp:frontend-.*|image: docker.io/${DOCKER_USERNAME}/crypto_webapp:frontend-${env.IMAGE_TAG}|' frontend-deployment.yaml
                        git add .
                        git commit -m "Update frontend image to frontend-${env.IMAGE_TAG}"
                        git push origin main

                        cd ..
                        rm -rf K8s-Manifests
                        """
}
                }
            }
        }
    }
}
