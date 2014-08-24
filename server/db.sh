#starts up the mongodb
echo "Making Data directory"
mkdir -p /data/db/genSynth

echo "Starting server"
mongod --dbpath /data/db/genSynth
