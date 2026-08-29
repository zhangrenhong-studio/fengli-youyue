// 正式接入时：将 API_BASE 替换为已备案并配置到微信小程序“合法请求域名”的 HTTPS 域名。
// 当前页面调用 services/data.js 的本地演示数据；不可把本地 storage 当成正式多人数据。
const API_BASE = 'https://REPLACE_WITH_YOUR_HTTPS_API_DOMAIN'
function request(path, method='GET', data={}) {
  return new Promise((resolve,reject)=>wx.request({url:API_BASE+path,method,data,header:{'content-type':'application/json'},success:r=>r.statusCode<400?resolve(r.data):reject(r.data),fail:reject}))
}
module.exports={API_BASE,request}
