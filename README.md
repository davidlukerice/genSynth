genSynth
========

An evolutionary art platform for evolving new synthetic musical instruments.
Branch of a showcased instrument below or evolve your own!

### Install Instructions
 - Install [MongoDB](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/) (Currently using 2.6.5)
 - Install Node, global bower, global grunt-cli, and global ember-cli 0.0.46
 - Update Config Keys
   - /app/app/index.html: Change AddThis pub-ID && Google Analytics Id
   - /app/config/providers: Change urls and Facebook-Connect
   - /app/config/environment.js: Change contentSecurityPolicy connect-src
   - /server/server/config/env/production dev & test
 - `ember init` in /app (saying no to replacing any files). This should install all npm and bower dependencies.
 - `sudo npm install` in the server folder

 Running the ember app separately
 - `ember server` in /app and `grunt dev` in /server

 Running both app and server together
 - `./build.sh` in the /app folder to build the application and copy it to the server/appDist/ folder
 - Run `grunt devfull` or `grunt prod` in /server. Or manually start the `server.js` and `app-server.js` scripts in node.

Notes for running with PM2
 - after building, run `sudo NODE_ENV=production pm2 start server.js` and `sudo NODE_ENV=production pm2 start app-server.js`
 - If you have issues binding on port 80, use `sudo setcap 'cap_net_bind_service=+ep' /usr/bin/nodejs` or `sudo setcap 'cap_net_bind_service=+ep' /usr/bin/node` depending
   on where the non symlinked version of node is

Note on hosting with port 80
 - Node often has issues listening directly on port 80, so it's easiest to listen to a different port (like 8080) and redirecting all 80 traffic with the iptables: `sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080`

### Acknowledgements
The base server is a modified version of the Full Stack JS Boilerplate is created by [Martin Genev](http://www.twitter.com/cyberseer) of [Gemini Connect](http://www.geminiconnect.com) and is largely based on the work of [Amos Haviv](https://twitter.com/amoshaviv) on [meanjs.org](http://www.meanjs.org)

### License
The MIT License (MIT)

Copyright (c) 2014 David Rice

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
