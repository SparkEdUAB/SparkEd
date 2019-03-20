#!/bin/bash
echo "logging out first to clear wrong credentials"
docker logout
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
echo "pushing the docker image to docker hub"
docker push olivierjm/spark
