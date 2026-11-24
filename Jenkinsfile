pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "bytenews_ci_${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                echo '1. Descargando codigo fuente desde GitHub...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo '2. Preparando entorno y construyendo contenedores Docker de la Entrega 1...'
                sh 'cp .env.example .env'
                sh 'docker compose build'
            }
        }

        stage('Test') {
            steps {
                echo '3. Levantando servicios y verificando comunicacion interna entre web y api...'
                sh '''
                    docker compose up -d
                    sleep 5
                    echo "Verificando servidor Web (Nginx)..."
                    docker compose exec -T web wget -qO- http://127.0.0.1:80 > /dev/null
                    echo "Verificando comunicacion Web -> API (/api/noticias)..."
                    RESPUESTA=$(docker compose exec -T web wget -qO- http://127.0.0.1:80/api/noticias)
                    echo "Respuesta de la API recibida a traves de Nginx: $RESPUESTA"
                    echo "$RESPUESTA" | grep -q "\\[" || (echo "ERROR: Fallo la comunicacion entre contenedores" && exit 1)
                '''
            }
        }
    }

    post {
        always {
            echo 'Limpiando contenedores temporales de prueba...'
            sh 'docker compose down -v || true'
        }
        success {
            echo 'RESULTADO: Pipeline completado con exito.'
        }
        failure {
            echo 'RESULTADO: El pipeline fallo. Revisa los logs.'
        }
    }
}