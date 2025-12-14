# 🚀 Guía de Despliegue Rápida

## Comandos Esenciales

### Despliegue Simple (1 comando)
```bash
docker-compose up -d
```

### Despliegue con Script
```bash
./deploy.sh
```

### Despliegue Manual
```bash
docker build -t exp2-backend:latest . && \
docker run -d --name exp2-backend -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:oracle:thin:@gibi3xseta997y7i_tp \
  -e SPRING_DATASOURCE_USERNAME=ADMIN \
  -e SPRING_DATASOURCE_PASSWORD=aWxpYqvej@bUin3P!tbP \
  exp2-backend:latest
```

---

## Comandos Útiles

```bash
# Ver logs
docker logs -f exp2-backend

# Reiniciar
docker-compose restart

# Detener
docker-compose down

# Reconstruir
docker-compose up -d --build

# Verificar
curl http://localhost:8080/authenticate
```

---

## Troubleshooting

```bash
# Ver estado del contenedor
docker ps -a

# Ver logs de error
docker logs exp2-backend

# Entrar al contenedor
docker exec -it exp2-backend sh

# Limpiar todo
docker stop exp2-backend && docker rm exp2-backend && docker rmi exp2-backend:latest
```

