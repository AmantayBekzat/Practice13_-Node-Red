const path = require('node:path');
const parseJSON = require('body-parser').json({limit:'2kb',strict:false});
const safeHeaders=(req,res,next)=>{
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('X-Frame-Options','DENY');
 res.setHeader('Cache-Control','no-store');
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
 next();
};
module.exports = {
 uiPort:1882,uiHost:'127.0.0.1',
 httpAdminRoot:'/red',httpNodeRoot:'/',
 flowFile:path.join(__dirname,'flows.json'),
 userDir:path.join(__dirname,'.runtime'),
 httpStatic:[{path:path.join(__dirname,'public'),root:'/',options:{setHeaders(res){
   res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');
   res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'");
 }}}],
 apiMaxLength:'2kb',
 httpNodeMiddleware:[safeHeaders,(req,res,next)=>{
   if(req.method==='POST'){
     if(req.headers.origin&&req.headers.origin!==`http://${req.headers.host}`)return res.status(403).json({error:'Origin rejected'});
     if((req.headers['content-type']||'').split(';')[0]!=='application/json')return res.status(415).json({error:'JSON required'});
   }
   if(req.method==='POST') return parseJSON(req,res,err=>{
     if(err) return res.status(err.status===413?413:400).json({error:err.status===413?'Request too large':'Malformed JSON'});
     next();
   });
   next();
 }],
 // Local editor only. No cloud connectors or external modules are configured.
 functionExternalModules:false,
 externalModules:{autoInstall:false,palette:{allowInstall:false,allowUpload:false},modules:{allowInstall:false}},
 contextStorage:{default:{module:'memory'}},
 logging:{console:{level:'info',metrics:false,audit:false}},
 editorTheme:{page:{title:'Practice 12 - Smart Campus'}}
};
