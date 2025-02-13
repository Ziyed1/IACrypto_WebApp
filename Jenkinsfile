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

        stage('Build & Push Backend Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DHcrendential', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        echo "Building Docker image for backend..."

                        // Création du tag d'image
                        def imageTag = "backend:${env.IMAGE_TAG}"
                        docker.build(imageTag)

                        // Connexion à Docker Hub et push de l'image
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                        sh "docker tag ${imageTag} ${DOCKER_USERNAME}/crypto_webapp:backend-${env.IMAGE_TAG}"
                        sh "docker push ${DOCKER_USERNAME}/crypto_webapp:backend-${env.IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Update K8s Manifests') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: 'GitHubSSHKey', keyFileVariable: 'SSH_KEY')]) {
                        sh """
                        eval \$(ssh-agent -s)
                        ssh-add $SSH_KEY
                        ssh -o StrictHostKeyChecking=no git@github.com || true

                        git clone ${MANIFEST_REPO}
                        cd K8s-Manifests

                        git config --global user.email "ci-bot@example.com"
                        git config --global user.name "Jenkins CI"

                        sed -i 's|  image: docker.io/${DOCKER_USERNAME}/crypto_webapp:backend-[^ ]*|  image: docker.io/${DOCKER_USERNAME}/crypto_webapp:backend-${env.IMAGE_TAG}|' backend-deployment.yaml
                        
                        git add backend-deployment.yaml
                        git commit -m "Update backend image to backend-${env.IMAGE_TAG}"
                        git push origin ${BRANCH}

                        cd ..
                        echo "Path actuel : \$PWD" 
                        rm -rf K8s-Manifests
                        """
                    }
                }
            }
        }
    }
}
