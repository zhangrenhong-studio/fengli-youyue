const api=require('../../services/data');
const demo=require('../../services/demo-content');
const moodTabs=[['all','全部'],['culture','看点东西'],['outdoor','出去走走'],['food','吃点好的'],['move','动一动'],['solo','一个人待会'],['friends','和朋友见面'],['fresh','玩点不一样'],['family','带家人'],['night','看演出']];
Page({
  data:{routes:[],source:'all',mood:'all',loading:true,usingDemo:false,sourceTabs:[['all','全部'],['system','系统精选'],['community','大家分享']],moodTabs},
  async onShow(){this.getTabBar()?.setData({selected:'pages/discover/discover'});const app=getApp(),requested=app.globalData.routeMood||'all';if(requested!==this.data.mood){this.setData({mood:requested});app.globalData.routeMood='all'}await this.load()},
  async load(){try{this.setData({loading:true,routes:await api.routes(this.data.source,this.data.mood),loading:false,usingDemo:false})}catch(e){this.setData({loading:false,routes:demo.filterRoutes(this.data.source,this.data.mood),usingDemo:true})}},
  sourceTab(e){this.setData({source:e.currentTarget.dataset.source});this.load()},
  moodTab(e){this.setData({mood:e.currentTarget.dataset.mood});this.load()},
  open(e){wx.navigateTo({url:'/pages/route-detail/route-detail?id='+e.currentTarget.dataset.id})},
  create(){wx.switchTab({url:'/pages/create/create'})}
});
