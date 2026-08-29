const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const project=JSON.parse(fs.readFileSync(path.join(root,'project.config.json'),'utf8'));
const app=JSON.parse(fs.readFileSync(path.join(root,'app.json'),'utf8'));
if(!/^wx[0-9a-f]{16}$/.test(project.appid)) throw new Error('Invalid AppID');
for(const page of app.pages){for(const ext of ['.js','.json','.wxml']){if(!fs.existsSync(path.join(root,page+ext)))throw new Error('Missing '+page+ext)}}
console.log(`release check passed: ${project.appid}, ${app.pages.length} pages`);
