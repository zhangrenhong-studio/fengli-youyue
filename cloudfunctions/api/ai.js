'use strict';

const MAX_STOPS=6;
const clean=(value,max=300)=>String(value||'').trim().slice(0,max);

function extractJson(content){
  const text=String(content||'').trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
  const start=text.indexOf('{'),end=text.lastIndexOf('}');
  if(start<0||end<=start)throw new Error('AI 没有返回可用路线');
  return JSON.parse(text.slice(start,end+1));
}

function normalizeRoute(raw){
  const stops=Array.isArray(raw.stops)?raw.stops.slice(0,MAX_STOPS).map(item=>[
    clean(item&&item.time,30)||'待定',clean(item&&item.title,80),clean(item&&item.note,300)
  ]).filter(item=>item[1]):[];
  if(!clean(raw.title,80)||!stops.length)throw new Error('AI 返回的路线信息不完整');
  return {
    title:clean(raw.title,80),description:clean(raw.description,500),district:clean(raw.district,30)||'北京',
    duration:clean(raw.duration,20)||'待定',budget:clean(raw.budget,20)||'待定',
    transport:clean(raw.transport,30)||'步行 + 公共交通',route_kind:raw.route_kind==='place'?'place':'route',stops
  };
}

async function generateRoute({idea,profile}){
  const base=(clean(process.env.AI_PROVIDER_BASE_URL,300)||'https://api.deepseek.com').replace(/\/$/,'');
  const apiKey=clean(process.env.AI_PROVIDER_API_KEY||process.env.DEEPSEEK_API_KEY,500);
  const model=clean(process.env.AI_PROVIDER_MODEL,100)||'deepseek-chat';
  if(!base||!apiKey||!model)throw new Error('AI 路线服务尚未配置，请先连接模型服务');
  const system='你是“风里约行”的城市生活路线策划。只根据用户这一次的想法，设计现实、温和、可在任意空闲时间完成的中国城市路线。不要声称已经查询实时营业时间、票务、天气或位置；不确定时提示用户出发前自行确认。输出严格 JSON，不要 Markdown：{"title":"","description":"","district":"","duration":"","budget":"","transport":"","route_kind":"route 或 place","stops":[{"time":"","title":"","note":""}]}。stops 2 到 6 项，避免虚构具体店名。';
  const context=`用户想法：${clean(idea,120)}\n城市：${clean(profile&&profile.city,20)||'北京'}\n出发节奏：${clean(profile&&profile.pace,20)||'慢慢走'}\n常用时间：${clean(profile&&profile.availability,30)||'时间随缘'}`;
  let response;
  try{
    response=await fetch(`${base}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},body:JSON.stringify({model,temperature:0.7,response_format:{type:'json_object'},messages:[{role:'system',content:system},{role:'user',content:context}]})});
  }catch(err){throw new Error('AI 路线服务暂时无法连接');}
  if(!response.ok)throw new Error('AI 路线服务暂时不可用');
  const payload=await response.json();
  return normalizeRoute(extractJson(payload&&payload.choices&&payload.choices[0]&&payload.choices[0].message&&payload.choices[0].message.content));
}

module.exports={generateRoute,normalizeRoute,extractJson};
