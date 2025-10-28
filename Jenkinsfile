pipeline {
    agent any

    environment {
        REGISTRY = "docker.io/${DOCKER_USERNAME}"
        BACKEND_IMAGE = "my-backend"
        FRONTEND_IMAGE = "my-frontend"
        SERVER_HOST = "3.107.161.103"
        SERVER_USER = "root"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/duongtien004/DevOps-Exercise.git',
                        credentialsId: 'github-pat'
                    ]]
                ])
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    dir('backend') {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                            usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            
                            sh """
                            docker build -t docker.io/$DOCKER_USER/$BACKEND_IMAGE:latest .
                            """
                        }
                    }
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    dir('frontend') {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                            usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            
                            sh """
                            docker build -t docker.io/$DOCKER_USER/$FRONTEND_IMAGE:latest .
                            """
                        }
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {

                    sh """
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push docker.io/$DOCKER_USER/$BACKEND_IMAGE:latest
                    docker push docker.io/$DOCKER_USER/$FRONTEND_IMAGE:latest
                    """
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-cred',
                        usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
                    string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI')
                ]) {
                    sshagent (credentials: ['server-ssh-key']) {
                        sh '''
                        # Copy docker-compose.yml sang server
                        scp -o StrictHostKeyChecking=no docker-compose.yml $SERVER_USER@$SERVER_HOST:/root/project/docker-compose.yml

                        # SSH vào server và deploy
                        ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "
                        cd /root/project && \
                        echo \\"DOCKER_USER=$DOCKER_USER\\" > .env && \
                        echo \\"DOCKER_PASS=$DOCKER_PASS\\" >> .env && \
                        echo \\"MONGODB_URI=$MONGODB_URI\\" >> .env && \
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin && \
                        docker compose --env-file .env pull && \
                        docker compose --env-file .env down && \
                        docker compose --env-file .env up -d && \
                        docker image prune -f
                        "
                        '''
                    }
                }
            }
        }
    }
}
