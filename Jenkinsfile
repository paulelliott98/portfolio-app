pipeline {
    agent any
    
    tools {
        nodejs "nodejs"
    }
    
    environment {
        GITHUB_USERNAME = credentials('github-username')
        GITHUB_PASSWORD = credentials('github-password')
    }
    
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'npm install'
            }
        }
//         stage('Test') {
//             steps {
//                 echo 'Testing..'
//             }
//         }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                sh "gh-pages -d build -u $GITHUB_USERNAME -p $GITHUB_PASSWORD"
                
                // Deploy the project to GitHub Pages
//                 withCredentials([usernamePassword(credentialsId: 'portfolio-app-git-credentials', usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_PASSWORD')]) {
//                     sh "gh-pages -d build -u $GITHUB_USERNAME -p $GITHUB_PASSWORD"
//                 }
            }
        }
    }
}
