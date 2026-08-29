const ci=require('miniprogram-ci');
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const keyPath=process.env.MINIPROGRAM_PRIVATE_KEY_PATH;
if(!keyPath || !fs.existsSync(keyPath)) throw new Error('Set MINIPROGRAM_PRIVATE_KEY_PATH to the downloaded WeChat code-upload private-key (.key) file.');
const project=JSON.parse(fs.readFileSync(path.join(root,'project.config.json'),'utf8'));
(async()=>{const result=await ci.upload({
  project:new ci.Project({appid:project.appid,type:'miniProgram',projectPath:root,privateKeyPath:keyPath,ignores:['node_modules/**/*','cloudfunctions/**/*','cloudbase/**/*','design-prototype/**/*','design-prototype-v2/**/*','design-prototype-v3/**/*','design-prototype-v4/**/*','design-prototype-v5/**/*','ui-preview-v1/**/*','ui-preview-v2/**/*','ui-preview-v3/**/*','ui-preview-v4/**/*','ui-preview-v5/**/*','ui-preview-v6/**/*','ui-preview-v7/**/*','ui-preview-v8/**/*','ui-preview-v9/**/*','ui-preview-v10/**/*','ui-preview-v11/**/*','.frontend-backups/**/*','preview-qr*.png','README.md','scripts/**/*','package-lock.json','package.json']}),
  version:'0.4.6',desc:'风里有约：云函数异常回传与客户端连接诊断修复',setting:{es6:true,enhance:true,minify:false,ignoreUploadUnusedFiles:true}
}); console.log(JSON.stringify({uploaded:true,result},null,2));})().catch(e=>{console.error(e.stack||e);process.exit(1)});
