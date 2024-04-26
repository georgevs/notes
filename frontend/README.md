# ToDos

## Run the app locally

### Start node container
```bash
docker container run --rm \
  --name node-app \
  --network bridge-dev \
  --ip 172.20.0.101 \
  --user node \
  --workdir /home/node/frontend  \
  --volume "$PWD:/home/node/frontend" \
  -it node bash
```

### Install dependencies
```bash
npm install
```

### Run with Vite dev server (option #1)
```bash
npm run dev -- --host 172.20.0.101 --port 8080 --base=/todos/
```

### Run distribution build (option #2)
```bash
npm run build -- --base=/todos/ --outDir=dist/todos
npx http-server ./dist -c-1 -a 172.20.0.101 -p 8080
```
Open site at http://172.20.0.101:8080/todos/ (in LAN) or http://localhost:8080/todos/ (via proxy: `ssh -L 8080:172.20.0.101:8080 xps`)

## Publish to GitHub
```bash
git subtree split -P playground/todos -b github/todos
git push git@github.com:georgevs/todos.git github/todos:main
```

### Deploy to GitHub pages
[Vite: deploying to GitHub pages](https://vitejs.dev/guide/static-deploy#github-pages)  
```bash
npm run build -- --base=/todos/ --outDir=dist/todos
pushd dist/todos
touch .nojekyll
git init -b gh-pages
git add --all
git commit -m "$(date)"
git push git@github.com:georgevs/todos.git --force gh-pages
popd
```
Open site at https://georgevs.github.io/todos/
