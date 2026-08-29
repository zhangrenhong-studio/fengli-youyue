const api=require('../../services/data');
Page({
  data:{profile:null,initial:'风',loading:true},
  async onLoad(q){
    try{const profile=await api.publicProfile(q.userId);this.setData({profile,initial:(profile.nickname||'风').slice(0,1),loading:false})}
    catch(e){this.setData({loading:false});wx.showToast({title:(e.message||'主页加载失败').slice(0,18),icon:'none'})}
  },
  back(){wx.navigateBack()}
});
