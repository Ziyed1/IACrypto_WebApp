pipeline {
    agent any

    environment {
        ARGOCD_SERVER = 'argocd-server-url'
        ARGOCD_APP = 'your-argocd-app'
        DOCKER_IMAGE_TAG = ''
        GIT_CREDENTIALS_ID = 'Github_IACrypto'
        K8S_MANIFESTS_REPO = 'git@github.com:Ziyed1/K8s-Manifests.git'
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
            steps {
                script {
                    docker.build("backend:${env.DOCKER_IMAGE_TAG}", "./backend")
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    docker.build("frontend:${env.DOCKER_IMAGE_TAG}", "./frontend")
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DHcredential', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                    }
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

        stage('Update K8s Manifests') {
            steps {
                script {
                    // Clone du repo des manifests
                    sh "rm -rf my-app-k8s-manifests"
                    sh "git clone ${K8S_MANIFESTS_REPO}"

                    // Mise à jour des images dans les fichiers YAML
                    sh """
                    sed -i 's|image:.*crypto_webapp:backend-.*|image: ${DOCKER_USERNAME}/crypto_webapp:backend-${env.DOCKER_IMAGE_TAG}|' my-app-k8s-manifests/backend-deployment.yaml
                    sed -i 's|image:.*crypto_webapp:frontend-.*|image: ${DOCKER_USERNAME}/crypto_webapp:frontend-${env.DOCKER_IMAGE_TAG}|' my-app-k8s-manifests/frontend-deployment.yaml
                    """

                    // Commit et push des modifications
                    dir('my-app-k8s-manifests') {
                        withCredentials([usernamePassword(credentialsId: GIT_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                            sh """
                            git config --global user.email "jenkins@yourdomain.com"
                            git config --global user.name "Jenkins"
                            git add .
                            git commit -m "Update images to backend-${env.DOCKER_IMAGE_TAG} and frontend-${env.DOCKER_IMAGE_TAG}"
                            git push origin main
                            """
                        }
                    }
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
