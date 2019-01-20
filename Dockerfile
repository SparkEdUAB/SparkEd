FROM base/archlinux:latest
MAINTAINER Baptiste Rebillard aka. cluxter <contact@cluxter.org>

# Meteor requires at least one valid locale to be able to run
# For more details see: https://github.com/meteor/meteor/issues/4019
RUN (printf "\nen_US.UTF-8 UTF-8\n" >> /etc/locale.gen) && (/usr/bin/locale-gen)

# This script will install the Meteor binary installer (called the launchpad) in /usr/local and consequently requires to be root.
# Then, when we will run the "meteor" command later on for the first time, it will call the launchpad that will copy the Meteor binaries in ~/.meteor.
# This way every user can run Meteor under the user space.
RUN curl https://install.meteor.com/ | sh

# We now add a "meteor" user that will be used to avoid running Meteor with root privileges.
RUN useradd -m -G users -s /bin/bash meteor

# We switch to the "meteor" account.
USER meteor

# We call the "meteor" command for the first time which will install the Meteor binaries in ~/.meteor.
RUN cd /tmp && meteor --version



# When we will create an image of our app, we want it to be run with a non root account, so we switch to the "meteor" user.
ONBUILD USER meteor

# We create a dedicated folder in which the app will be copied.
ONBUILD RUN cd /home/meteor && mkdir app

# We copy the app in the said folder.
ONBUILD COPY . /home/meteor/app/.

# Since "COPY" ignores the "USER" command, files were copied as root. So we need to go back to the root account...
ONBUILD USER root

# ...change all the file permissions of the app to "meteor:meteor"...
ONBUILD RUN chown -R meteor:meteor /home/meteor/app

# ...clean the Meteor cache for a clean image...
ONBUILD RUN rm -rf /home/meteor/app/.meteor/local/*

# ...and go back to the "meteor" account again so Meteor will run as the "meteor" user.
ONBUILD USER meteor



# We expose port 3000 since Meteor runs as a Node.js application
EXPOSE 3000

# When we will run the image of our app, we simply want to run the "meteor" command.
# Consequently all the data will be kept in the current container of our app and will be destroyed when the container will be removed.
CMD cd /home/meteor/app && meteor --production