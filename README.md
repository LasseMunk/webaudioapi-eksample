# webaudioapi-example
simple fm synth using WebAudioAPI, socket.io, express, node.js and (processing) p5.js

# chrome shortcuts

Mobile mode:

 	alt+cmd+i 
 	
 	cmd+shift+m 

# Node.js

costumizable webserver for javascript

interface with node through the **terminal**

### Terminal commands:

**cd path** : (eg. /Applications)

**cd ..** go up one level

**pwd path** for directory

**ls** list what is in directory

**clear** will clear the view

**open .** will open current folder in Finder

### Node commands:

**node path-to-file.js** will run that javascript


## nodemon
[https://github.com/remy/nodemon]()

restarts the server when there is a change in the server.js file

## NPM - Node Package Manager
https://www.youtube.com/watch?v=s70-Vsud9Vk

A package is a library for javascript. It could be the 'Twit' library which helps you interface with the Twitter API. 

**settings.json** is your settings for your project. You might put other dependencies in your settings.json

### npm commands:
**npm init** will help you create your package.json

**npm install name-of-package** will install a package

**npm install name-of-package --save** will install a package and save a reference to this particuliar package in your settings.json file
		

# Socket.io
[https://www.youtube.com/watch?v=bjULmG8fqc8]()
Daniel Shiffman about socket.io

**in the server:**

	- require socket.io
	- connect it to this particuliar webserver
	- write function which handles new connections
	- add code which can send messages to all other 
	  clients
	  
**in the client:**

	- import socket.io (from src=....) in index.html
	- open a connection to the server that has the
	  socket server on it, in our javascript (e.g. 
	  p5 sketch).
	- add code which can send messages to server

**This example is using port 3000**


