
echo "clearing old dist"
sudo rm -rf ../server/appDist

echo "building"
ember build --environment=production

echo "copying to server dist folder"
sudo cp -a dist/ ../server/appDist
