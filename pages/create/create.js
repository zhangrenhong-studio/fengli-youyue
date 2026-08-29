const api=require('../../services/data');

Page({
  data:{mode:'ai',idea:'',budget:'100–200 元',kind:'place',visibility:'private',submitting:false},
  onShow(){this.getTabBar()?.setData({selected:'pages/create/create'});},
  choose(e){const mode=e.currentTarget.dataset.mode;this.setData({mode,visibility:mode==='publish'?'public':'private'});},
  input(e){this.setData({idea:e.detail.value});},
  pick(e){const {type,value}=e.currentTarget.dataset;this.setData({[type]:value});},
  async submit(){
    const {idea,mode,budget,kind,visibility}=this.data;
    const input=idea.trim();
    if(!input)return wx.showToast({title:'先写下想去的地方或想法',icon:'none'});
    this.setData({submitting:true});
    wx.showLoading({title:mode==='ai'?'正在为你排路线':'正在发布'});
    try{
      let routeId;
      if(mode==='ai'){
        const route=await api.generateAiRoute(input);
        routeId=route.routeId;
      }else{
        const stops=kind==='place'?[['待定',input,'把这个地方留进计划里，再慢慢安排。']]:[['开始',input,'从这个想法出发。'],['中途','一段顺路的停留','按当下的心情慢慢走。'],['收尾','一顿饭或一杯饮料','给这段空闲时间一个舒服的结束。']];
        const result=await api.createRoute({title:input,description:'我想这样安排一段空闲时间。',district:'北京',duration:'待定',budget,stops,visibility,source_type:'community',route_kind:kind});
        routeId=result.routeId;
      }
      wx.navigateTo({url:'/pages/route-detail/route-detail?id='+routeId+'&created=1'});
    }catch(e){
      wx.showToast({title:(e.message||'操作失败').slice(0,18),icon:'none'});
    }finally{
      wx.hideLoading();this.setData({submitting:false});
    }
  }
});
