npx create-react-app rudn-master
npm i -D react-router-dom
npm install react-icons --save
npm install recharts
npm install elliptic
npm install crypto-js



npm i gh-pages --save-dev
    package.json -> "homepage": "https://ramisoul84.github.io/rudn-master"
    package.json -> scripts -> 
        "predeploy": "npm run build",
        "deploy": "gh-pages -d build"


git add -A
git commit -m "fix home page"
git push -u origin main

npm run deploy
        
