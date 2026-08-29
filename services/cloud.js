async function call(action,data={}) {
  try{
    const r=await wx.cloud.callFunction({name:'api',data:{action,...data}})
    const result=r&&r.result
    if(!result) throw new Error('服务暂时没有返回结果')
    if(result.error || result.errorMessage || result.errorCode) throw new Error(result.error||result.errorMessage||'服务请求失败')
    return result
  }catch(err){
    const raw=String(err&& (err.message||err.errMsg)||'').trim()
    // Cloud functions reject the Promise for both transport failures AND server-side
    // exceptions. Preserve server exception text so it is actionable instead of
    // collapsing every failure into the same misleading connection toast.
    const serverMessage=(raw.match(/(?:Error:|error:|errmsg[:：])\s*(.+)$/i)||[])[1]
    if(serverMessage&&serverMessage!==raw) throw new Error(serverMessage.slice(0,80))
    if(/function not found|network|timeout|socket|request:fail|network error/i.test(raw)) throw new Error('服务连接暂时不可用，请检查网络后重试')
    throw new Error(raw.slice(0,80)||'服务请求失败')
  }
}
function friendly(err){ return (err&&err.message)||'网络暂时不稳定，请稍后再试' }
module.exports={call,friendly}
