pipeline {
    agent any

    environment {
        REGISTRY = "docker.io/${DOCKER_USERNAME}"
        BACKEND_IMAGE = "my-backend"
        FRONTEND_IMAGE = "my-frontend"
        SERVER_HOST = "3.107.161.103"
        SERVER_USER = "ubuntu"   // ⚠️ Dùng 'ubuntu' chứ không phải 'root'
        DEPLOY_PATH = "/home/ubuntu/project"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "📦 Checking out source code..."
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
                            echo "🔧 Building backend Docker image..."
                            docker build -t $REGISTRY/$BACKEND_IMAGE:latest .
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
                            echo "🎨 Building frontend Docker image..."
                            docker build -t $REGISTRY/$FRONTEND_IMAGE:latest .
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
                    echo "📤 Pushing Docker images to Docker Hub..."
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $REGISTRY/$BACKEND_IMAGE:latest
                    docker push $REGISTRY/$FRONTEND_IMAGE:latest
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
                    echo "🚀 Deploying to production server..."
                    sshagent (credentials: ['server-ssh-key']) {
                        sh '''
                        # Copy docker-compose.yml lên server
                        scp -o StrictHostKeyChecking=no docker-compose.yml $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/docker-compose.yml

                        # SSH vào server để deploy
                        ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST "
                            set -e
                            cd $DEPLOY_PATH
                            echo '🧩 Cập nhật file .env...'
                            echo \\"DOCKER_USER=$DOCKER_USER\\" > .env
                            echo \\"DOCKER_PASS=$DOCKER_PASS\\" >> .env
                            echo \\"MONGODB_URI=$MONGODB_URI\\" >> .env

                            echo '🔐 Login Docker Hub...'
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                            echo '📦 Pulling latest images...'
                            docker compose --env-file .env pull

                            echo '🧹 Stopping old containers...'
                            docker compose down

                            echo '🚀 Starting new containers...'
                            docker compose --env-file .env up -d

                            echo '🧼 Cleaning up unused images...'
                            docker image prune -f

                            echo '✅ Deployment completed successfully.'
                        "
                        '''
                    }
                }
            }
        }
    }

    post {
        failure {
            echo "❌ Pipeline failed! Check Jenkins logs for errors."
        }
        success {
            echo "✅ CI/CD pipeline finished successfully!"
        }
    }
}
