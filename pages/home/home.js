const api=require('../../services/data');
const demo=require('../../services/demo-content');
function nextPlan(plans){const live=(plans||[]).filter(item=>item&&item.status!=='completed'),order={active:0,scheduled:1,saved:2};return live.sort((a,b)=>(order[a.status]??9)-(order[b.status]??9))[0]||null}
Page({
  data:{route:null,invitations:[],nextPlan:null,latestRecord:null,loading:true,usingDemo:false,navHeight:76},
  async onShow(){
    this.setData({navHeight:getApp().globalData.nav?.navHeight||76});
    this.getTabBar()?.setData({selected:'pages/home/home'});
    try{
      await api.boot();
      const [rs,ivs,plans,records]=await Promise.all([api.routes('system'),api.invitations(),api.plans(),api.lifeRecords()]);
      this.setData({route:rs[0]||demo.routes[0],invitations:ivs.slice(0,2),nextPlan:nextPlan(plans),latestRecord:(records||[])[0]||null,loading:false,usingDemo:false});
    }catch(e){
      this.setData({route:demo.routes[0],invitations:demo.invitations,nextPlan:null,latestRecord:null,loading:false,usingDemo:true});
    }
  },
  openRoute(){if(this.data.route)wx.navigateTo({url:'/pages/route-detail/route-detail?id='+this.data.route._id})},
  openPlan(){const id=this.data.nextPlan?._id;if(id)wx.navigateTo({url:'/pages/plan-detail/plan-detail?id='+id})},
  goRoutes(){wx.switchTab({url:'/pages/discover/discover'})},
  goMood(e){getApp().globalData.routeMood=e.currentTarget.dataset.mood||'all';this.goRoutes()},
  goCreate(){wx.switchTab({url:'/pages/create/create'})},
  goCommunity(){wx.showModal({title:'北京风里有约群',content:'社群入口已在首页预留。等线上路线、邀约和群成员规则验证完成后，会在这里开放加入。',showCancel:false,confirmText:'知道了'})},
  goRecord(){wx.navigateTo({url:'/pages/life-record/life-record'})},
  goInvites(){wx.switchTab({url:'/pages/invitations/invitations'})}
});
