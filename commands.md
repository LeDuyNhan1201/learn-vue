```bash
sudo apt install npm
sudo npm install -g pnpm

pnpm setup
source ~/.bashrc
pnpm add -g vite
pnpm add <package-name>
pnpm run dev
pnpm update --latest

export PATH="/path/to/node24/bin:$PATH"

pnpm -v
vite -v

pnpm create vite to-do-list --template vue-ts

pnpm add -D \
  eslint \
  prettier \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-vue \
  eslint-plugin-prettier \
  eslint-config-prettier

pnpm lint
pnpm format

```