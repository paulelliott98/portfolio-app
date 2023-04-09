pipeline {
    agent any
    
    tools {
        nodejs "nodejs"
    }
    
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'npm install'
                sh 'npm install -g gh-pages'
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
                
                // Deploy the project to GitHub Pages
                withCredentials([usernamePassword(credentialsId: 'portfolio-app-git-credentials', usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_PASSWORD')]) {
                    sh 'git remote set-url origin https://$GITHUB_USERNAME:$GITHUB_PASSWORD@github.com/paulgan98/my-portfolio.git'
//                     sh 'gh-pages -d build -u $GITHUB_USERNAME -p $GITHUB_PASSWORD'
                    sh 'npm run deploy'
                }
            }
        }
    }
}
