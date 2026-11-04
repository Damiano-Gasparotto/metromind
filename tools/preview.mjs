import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.xml':'application/xml','.txt':'text/plain; charset=utf-8','.webmanifest':'application/manifest+json'};
createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let path=resolve(root,'.'+pathname);
    if(!path.startsWith(root+sep)&&path!==root || pathname.split('/').some(part=>part.startsWith('.'))){res.writeHead(403);res.end();return;}
    if((await stat(path)).isDirectory())path=resolve(path,'index.html');
    const body=await readFile(path);
    res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(body);
  }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Page not found');}
}).listen(Number(process.env.METROMIND_PREVIEW_PORT || 8765),'127.0.0.1',function(){
  console.log(`MetroMind preview: http://127.0.0.1:${this.address().port}`);
});
