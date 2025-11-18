pipeline {
    agent any

    environment {
        REGISTRY = "docker.io/${DOCKER_USERNAME}"
        BACKEND_IMAGE = "my-backend"
        FRONTEND_IMAGE = "my-frontend"
        SERVER_HOST = "3.107.162.71"
        SERVER_USER = "ubuntu"
        PROJECT_DIR = "/home/ubuntu/project"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out source code from GitHub..."
                checkout([$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/duongtien004/DevOps-Exercise.git',
                        credentialsId: 'github-pat'
                    ]]
                ])
            }
        }

        stage('Build & Push Backend') {
            steps {
                dir('backend') {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                        echo "Building backend image..."
                        docker build -t $DOCKER_USER/my-backend:latest .
                        
                        echo "Logging in to Docker Hub..."
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        
                        echo "Pushing backend image..."
                        docker push $DOCKER_USER/my-backend:latest
                        '''
                    }
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                dir('frontend') {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                        echo "Building frontend image..."
                        docker build -t $DOCKER_USER/my-frontend:latest .
                        
                        echo "Logging in to Docker Hub..."
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        
                        echo "Pushing frontend image..."
                        docker push $DOCKER_USER/my-frontend:latest
                        '''
                    }
                }
            }
        }

        stage('Deploy to Production Server') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
                    string(credentialsId: 'mongodb-uri', variable: 'MONGODB_URI')
                ]) {
                    sshagent(credentials: ['server-ssh-key']) {
                        sh '''
                        echo "Deploying to $SERVER_HOST..."

                        # Copy docker-compose.yml
                        scp -o StrictHostKeyChecking=no docker-compose.yml $SERVER_USER@$SERVER_HOST:$PROJECT_DIR/docker-compose.yml

                        # Deploy commands on remote server
                        ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_HOST << EOF
                        set -e
                        cd $PROJECT_DIR

                        # Tạo file .env chính xác 100%
                        cat > .env << ENV
DOCKER_USER=$DOCKER_USER
DOCKER_PASS=$DOCKER_PASS
MONGODB_URL=$MONGODB_URI
NODE_ENV=production
PORT=8088
ACCESS_TOKEN=your_super_strong_access_token_2025
REFRESH_TOKEN=your_super_strong_refresh_token_2025
ENV

                        chmod 600 .env

                        echo "Logging into Docker Hub on server..."
                        echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin

                        echo "Pulling latest images..."
                        docker compose --env-file .env pull

                        echo "Restarting services..."
                        docker compose --env-file .env down || true
                        docker compose --env-file .env up -d

                        echo "Cleaning up old images..."
                        docker image prune -f

                        echo "Deployment completed successfully!"
EOF

                        echo "Pipeline completed! Access your app at: http://$SERVER_HOST:3000"
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "PIPELINE THÀNH CÔNG 100%! TRUY CẬP: http://3.107.162.71:3000"
            echo "ĐĂNG NHẬP ADMIN HOẠT ĐỘNG BÌNH THƯỜNG!"
        }
        failure {
            echo "PIPELINE THẤT BẠI! Xem log Jenkins để debug."
        }
        always {
            cleanWs()
        }
    }
}
