pipeline {
    agent any

    environment {
        ARGOCD_SERVER = 'argocd-server-url'
        ARGOCD_APP = 'your-argocd-app'
    }

    stages {
        stage('Clone') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            when {
                branch 'backend'
            }
            steps {
                script {
                    docker.build("backend:${env.BUILD_ID}", "./backend")
                }
            }
        }

        stage('Build Frontend Image') {
            when {
                branch 'frontend'
            }
            steps {
                script {
                    docker.build("frontend:${env.BUILD_ID}", "./frontend")
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    // Utiliser les credentials Jenkins
                    withCredentials([usernamePassword(credentialsId: 'DHcredential', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    // Push Backend
                    sh "docker tag backend:${env.BUILD_ID} ${DOCKER_USERNAME}/crypto_webapp:${env.BUILD_ID}"
                    sh "docker push ${DOCKER_USERNAME}/crypto_webapp:${env.BUILD_ID}"

                    // Push Frontend
                    sh "docker tag frontend:${env.BUILD_ID} ${DOCKER_USERNAME}/crypto_webapp:${env.BUILD_ID}"
                    sh "docker push ${DOCKER_USERNAME}/crypto_webapp:${env.BUILD_ID}"
                }
            }    
        }

        stage('Trigger ArgoCD Sync') {
            steps {
                script {
                    // Exécuter une commande ArgoCD pour synchroniser le déploiement
                    sh "argocd app sync ${ARGOCD_APP} --server ${ARGOCD_SERVER}"
                }
            }
        }
    }
}
