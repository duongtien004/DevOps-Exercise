pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "my-backend"
        FRONTEND_IMAGE = "my-frontend"
        SERVER_HOST = "3.27.40.49"
        SERVER_USER = "ubuntu"      // ⚠️ Không dùng root
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
                            sh '''
                            echo "🔐 Logging in to Docker Hub..."
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                            
                            echo "🔧 Building backend Docker image..."
                            docker build -t docker.io/$DOCKER_USER/$BACKEND_IMAGE:latest .
                            '''
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
                            sh '''
                            echo "🔐 Logging in to Docker Hub..."
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                            
                            echo "🎨 Building frontend Docker image..."
                            docker build -t docker.io/$DOCKER_USER/$FRONTEND_IMAGE:latest .
                            '''
                        }
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    echo "📤 Pushing Docker images to Docker Hub..."
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push docker.io/$DOCKER_USER/$BACKEND_IMAGE:latest
                    docker push docker.io/$DOCKER_USER/$FRONTEND_IMAGE:latest
                    echo "✅ Push completed successfully!"
                    '''
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
                        echo "📦 Copying docker-compose.yml to server..."
                        scp -o StrictHostKeyChecking=no docker-compose.yml $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/docker-compose.yml

                        echo "⚙️ Running deployment commands on server..."
                        ssh -i -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST << 'EOF'
                            set -e
                            cd $DEPLOY_PATH
                            echo "DOCKER_USER=$DOCKER_USER" > .env
                            echo "DOCKER_PASS=$DOCKER_PASS" >> .env
                            echo "MONGODB_URI=$MONGODB_URI" >> .env

                            echo "🔐 Logging in Docker Hub..."
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

                            echo "🧹 Stopping old containers..."
                            docker compose down || true

                            echo "📥 Pulling latest images..."
                            docker compose --env-file .env pull

                            echo "🚀 Starting containers..."
                            docker compose --env-file .env up -d

                            echo "🧼 Cleaning unused images..."
                            docker image prune -f

                            echo "✅ Deployment completed successfully!"
                        EOF
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed! Check Jenkins logs for details."
        }
    }
}
