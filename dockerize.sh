meteor build --directory /tmp/export-meteor/build
cat >/tmp/export-meteor/Dockerfile <<ENDHERE
FROM ulexus/meteor
COPY build /home/meteor/www
RUN chown -R meteor:meteor /home/meteor/
ENDHERE
cd /tmp/export-meteor
docker build -t myapp .
docker push myapp