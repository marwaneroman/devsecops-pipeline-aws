pipeline{
    agent any
    tools{
        jdk 'jdk17'
        nodejs 'node18'
    }
    environment {
        SCANNER_HOME=tool 'sonar-scanner'
    }
    stages {
        stage('clean workspace'){
            steps{
                cleanWs()
            }
        }
        stage('Checkout from Git'){
            steps{
                git branch: 'main', url: 'https://github.com/marwaneroman/netflix.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh "npm install --force"
            }
        }
        stage('Unit Tests with Coverage') {
            steps {
                sh "npm run test:coverage"
            }
        }
        stage("Sonarqube Analysis "){
            steps{
                withSonarQubeEnv('sonar-server') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=Netflix \
                    -Dsonar.projectKey=Netflix '''
                }
            }
        }
        stage("quality gate"){
           steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonarqube' 
                }
            } 
        }
        stage('OWASP FS SCAN') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage('TRIVY FS SCAN') {
            steps {
                sh "trivy fs . > trivyfs.txt"
            }
        }
        stage("Docker Build & Push"){
        steps{
            script{
                withDockerRegistry(credentialsId: 'docker'){   
                    sh "docker build --build-arg TMDB_V3_API_KEY=462940d1a1baeda52352117984cab98c -t netflix ."
                    sh "docker tag netflix marwane04/netflix:latest"
                    sh "docker push marwane04/netflix:latest"
                    }
                }
            }
        }
        stage("TRIVY"){
            steps{
                sh "trivy image marwane04/netflix:latest > trivyimage.txt" 
            }
        }
        stage('Deploy to container'){
            steps{
                sh 'docker run -d -p 8081:80 marwane04/netflix:latest'
            }
        }
    }
    post {
    always {
        emailext attachLog: true,
            subject: "*** ${currentBuild.result}***",
            body: "Project: ${env.JOB_NAME}<br/>" +
                  "Build Number: ${env.BUILD_NUMBER}<br/>" +
                  "URL: ${env.BUILD_URL}<br/>",
            to: "mr.tricks788@gmail.com",
            attachmentsPattern: 'trivyfs.txt,trivyimage.txt'
    }
}
    
}