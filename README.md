This is the implementation for group project III and IV in DD2448 taken at KTH spring 2017. 

<b>bin/www</b> containts the TLS implementation.

<b>app.js</b> contains the "/"-routing and also the implementations of sessions and storing them in the database.

<b>controllers/controller.js</b> contains all the rendering and routing of all the pages. It handles the requests and sends them to passport for authentication. It also checks whether a user has access to different routes. 

<b>controllers/passport.js</b> contains the strategy for Facebook-login, that is, the handling of user when he or she is logged in. How to add to database etc. 
