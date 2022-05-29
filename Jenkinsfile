pipeline {
    agent {
        docker {
            image 'node:lts-bullseye-slim' 
            args '-p 3000:3000' 
        }
    }
    environment {
        CI = 'true'
        HOME = '.'
        npm_config_cache = 'npm-cache'
    }
    stages {
        stage('Install Packages') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test and Build') {
            parallel {
                stage('Run test') {
                    steps {
                        sh 'npm run test'
                    }
                }
                stage('Create Build Artifacts') {
                    steps {
                        sh 'npm run build'
                    }
                }
            }
        }
    }
}