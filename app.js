App({
  globalData:{brand:'风里有约',cloudEnv:'fengli-yuexing-dev-d5cdica839176',routeMood:'all',nav:{statusBarHeight:20,menuTop:28,menuHeight:32,navHeight:76}},
  onLaunch(){
    if(!wx.cloud){console.error('当前基础库不支持云开发')}else{wx.cloud.init({env:this.globalData.cloudEnv,traceUser:true})}
    try{
      const system=wx.getSystemInfoSync(),menu=wx.getMenuButtonBoundingClientRect();
      const status=system.statusBarHeight||20;
      this.globalData.nav={statusBarHeight:status,menuTop:menu.top,menuHeight:menu.height,navHeight:menu.bottom+8};
    }catch(e){/* use conservative default navigation metrics */}
  }
})
