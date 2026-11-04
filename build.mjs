import { cp, mkdir, rm } from 'node:fs/promises';
import './tools/generate-content.mjs';

const output = new URL('./dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of ['index.html', 'game.html', 'maps.html', 'style.css', 'maps.css', 'maps.js', 'network.js', 'lisbon.js', 'vienna.js', 'barcelona.js', 'berlin.js', 'paris.js', 'london.js', 'app.js', 'daily.js', 'translations.js', 'home.css', 'home.js', 'service-worker.js', 'manifest.webmanifest', 'icon.svg', 'ads.txt']) {
  await cp(new URL(`./${file}`, import.meta.url), new URL(`./dist/${file}`, import.meta.url));
}
await cp(new URL('./fonts/', import.meta.url), new URL('./dist/fonts/', import.meta.url), { recursive: true });
for (const file of ['content.css','content-language.js','guida.html','progetto.html','privacy.html','robots.txt','sitemap.xml']) {
  await cp(new URL(`./${file}`, import.meta.url), new URL(`./dist/${file}`, import.meta.url));
}
for (const directory of ['citta','en']) await cp(new URL(`./${directory}/`, import.meta.url), new URL(`./dist/${directory}/`, import.meta.url), { recursive:true });
console.log('Static site ready in dist/');
