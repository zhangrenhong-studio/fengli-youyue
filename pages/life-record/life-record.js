const api=require('../../services/data');
Page({
  data:{body:'',mood:'此刻',saving:false,records:[],loading:true,moods:['此刻','轻松','平静','有点累','很开心']},
  onLoad(q){this.planId=q.planId||'';this.routeId=q.routeId||''},
  async onShow(){try{this.setData({records:await api.lifeRecords(),loading:false})}catch(e){this.setData({loading:false});wx.showToast({title:'记录加载失败',icon:'none'})}},
  input(e){this.setData({body:e.detail.value})},
  choose(e){this.setData({mood:e.currentTarget.dataset.value})},
  async save(){const body=this.data.body.trim();if(!body)return wx.showToast({title:'先写下一点想留下的话',icon:'none'});this.setData({saving:true});try{await api.createLifeRecord({body,mood:this.data.mood,plan_id:this.planId,route_id:this.routeId});this.setData({body:'',records:await api.lifeRecords()});wx.showToast({title:'已经替你留好了',icon:'success'})}catch(e){wx.showToast({title:(e.message||'保存失败').slice(0,18),icon:'none'})}finally{this.setData({saving:false})}},
  back(){wx.navigateBack()}
});
