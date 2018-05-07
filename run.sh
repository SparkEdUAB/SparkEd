#!/bin/bash

# This requires meteor to be installed on your dev machine
# if you don't have meteor you can run this to install it
meteor npm install
# if the above line doesn't suffice then the below lines should work

### curl https://install.meteor.com | /bin/sh

# meteor npm install --save react react-dom react-mounter

# meteor npm install --save react react-addons-pure-render-mixin

meteor add react-meteor-data

# meteor npm install request

# meteor npm install body-parser

# meteor npm install --save bcrypt

mkdir -p uploads/tmp 

chmod 777 uploads/

meteor 
