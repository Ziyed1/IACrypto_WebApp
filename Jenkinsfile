pipeline {
    agent any

    environment {
        ARGOCD_SERVER = 'https://15.237.196.94:8080'
        ARGOCD_APP = 'webapp'
        DOCKER_IMAGE_TAG = ''
        GIT_CREDENTIALS_ID = 'Github_IACrypto'
        K8S_MANIFESTS_REPO = 'git@github.com:Ziyed1/K8s-Manifests.git'
    }

    stages {
        stage('Checkout SCM') {
            steps {
                script {
                    echo "Checkout branch: ${env.BRANCH_NAME}"
                    // Checkout de la branche en cours (frontend ou backend)
                    sh "git checkout ${env.BRANCH_NAME}"
                }
            }
        }

        stage('Set Variables') {
            steps {
                script {
                    // Set Docker image tag using the current commit hash
                    env.DOCKER_IMAGE_TAG = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Build & Push Images') {
            steps {
                script {
                    def branch = env.BRANCH_NAME

                    if (branch == 'backend' || branch == 'frontend') {
                        echo "Building and pushing Docker image for ${branch}..."

                        // Change the context to the root directory or appropriate subdirectory if needed
                        docker.build("${branch}:${env.DOCKER_IMAGE_TAG}", ".") // Utiliser '.' pour le contexte racine

                        withCredentials([usernamePassword(credentialsId: 'DHcredential', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                            sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                            sh "docker tag ${branch}:${env.DOCKER_IMAGE_TAG} ${DOCKER_USERNAME}/crypto_webapp:${branch}-${env.DOCKER_IMAGE_TAG}"
                            sh "docker push ${DOCKER_USERNAME}/crypto_webapp:${branch}-${env.DOCKER_IMAGE_TAG}"
                        }
                    } else {
                        echo "Branch ${branch} is not 'backend' or 'frontend'. Skipping..."
                    }
                }
            }
        }

        stage('Update K8s Manifests') {
            when { expression { return env.BRANCH_NAME == 'backend' || env.BRANCH_NAME == 'frontend' } }
            steps {
                script {
                    sh "rm -rf my-app-k8s-manifests || true"
                    sh "git clone ${K8S_MANIFESTS_REPO} my-app-k8s-manifests"
                    
                    def branch = env.BRANCH_NAME
                    def yamlFile = branch == 'backend' ? 'backend-deployment.yaml' : 'frontend-deployment.yaml'

                    sh """
                    sed -i 's|image:.*crypto_webapp:${branch}-.*|image: ${DOCKER_USERNAME}/crypto_webapp:${branch}-${env.DOCKER_IMAGE_TAG}|' my-app-k8s-manifests/${yamlFile}
                    """

                    dir('my-app-k8s-manifests') {
                        withCredentials([usernamePassword(credentialsId: GIT_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                            sh """
                            git config --global user.email "jenkins@yourdomain.com"
                            git config --global user.name "Jenkins"
                            git add ${yamlFile}
                            git commit -m "Update ${branch} image to ${env.DOCKER_IMAGE_TAG}"
                            git push origin main
                            """
                        }
                    }
                }
            }
        }

        stage('Trigger ArgoCD Sync') {
            when { expression { return env.BRANCH_NAME == 'backend' || env.BRANCH_NAME == 'frontend' } }
            steps {
                script {
                    sh "argocd app sync ${ARGOCD_APP} --server ${ARGOCD_SERVER}"
                }
            }
        }
    }
}
