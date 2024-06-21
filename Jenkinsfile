pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials-id')
    KUBECONFIG_CREDENTIALS = credentials('kubeconfig-credentials-id')
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'master', url: 'https://github.com/RamenManna/node-mongo-devops-app.git'
      }
    }

    stage('Build Test') {
      steps {
        sh 'npm install'
        sh 'npm test'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          docker.build("ramendev2001/node-mongo-devops-app:${env.BUILD_ID}")
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', "${DOCKERHUB_CREDENTIALS}") {
            docker.image("ramendev2001/node-mongo-devops-app:${env.BUILD_ID}").push()
          }
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        script {
          withKubeConfig([credentialsId: "${KUBECONFIG_CREDENTIALS}", namespace: 'default', serverUrl: 'https://kubernetes.default.svc.cluster.local']) {
            sh 'kubectl apply -f mongo-configmap.yaml -f mongo-pvc.yaml -f mongo-pv.yaml -f mongo-deployment.yaml -f mongo-service.yaml -f nodejs-deployment.yaml -f nodejs-service.yaml'

            sh 'kubectl set image deployment/node-mongo-devops-app node-mongo-devops-app=ramendev2001/node-mongo-devops-app:${env.BUILD_ID}'
          }
        }
      }
    }
  }
}
