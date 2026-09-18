const api=require('../../services/data');
const demo=require('../../services/demo-content');
Page({
  data:{route:null,invitations:[],planId:'',loading:true,usingDemo:false,showChoices:false,showInviteForm:false,inviteCount:3,startTime:'时间可商量',meetPlace:'集合地点待定',inviteNote:''},
  async onLoad(q){this.routeId=q.id;try{const x=await api.route(q.id);this.setData({route:x.route,invitations:x.invitations||[],loading:false,usingDemo:false})}catch(e){const route=demo.byId(q.id);if(route)this.setData({route,invitations:demo.invitations.filter(inv=>inv.route._id===route._id),loading:false,usingDemo:true});else{this.setData({loading:false});wx.showToast({title:'路线暂时无法打开',icon:'none'})}}},
  back(){wx.navigateBack()},
  async adopt(){if(this.data.usingDemo)return wx.showToast({title:'示例路线仅供体验，云端恢复后可保存为我的计划',icon:'none'});try{const x=await api.adopt(this.data.route._id);this.setData({planId:x.planId,showChoices:true})}catch(e){wx.showToast({title:(e.message||'采用失败').slice(0,18),icon:'none'})}},
  solo(){wx.showToast({title:'已留进我的计划，自己慢慢去吧',icon:'none'});this.setData({showChoices:false})},
  invite(){this.setData({showChoices:false,showInviteForm:true})},
  pickCount(e){this.setData({inviteCount:Number(e.currentTarget.dataset.value)});},
  inviteInput(e){this.setData({[e.currentTarget.dataset.field]:e.detail.value})},
  async submitInvite(){if(this.data.usingDemo)return wx.showToast({title:'示例路线暂不能发起真实同行',icon:'none'});let planId=this.data.planId;try{if(!planId){const x=await api.adopt(this.data.route._id);planId=x.planId}await api.createInvitation({planId,start_time:this.data.startTime,meet_place:this.data.meetPlace,max_people:this.data.inviteCount,pace:'慢慢走',budget_note:this.data.route.budget,note:this.data.inviteNote||'想按这条路线慢慢走，先聊聊再决定。'});this.setData({showChoices:false,showInviteForm:false});wx.showModal({title:'同行邀约已发布',content:'已为这次同行创建专属路线私聊。',confirmText:'去看邀约',success:()=>wx.switchTab({url:'/pages/invitations/invitations'})})}catch(e){wx.showToast({title:(e.message||'发起失败').slice(0,18),icon:'none'})}},
  async join(e){if(this.data.usingDemo)return wx.showToast({title:'这是模拟用户的示例邀约，云端恢复后可加入',icon:'none'});try{await api.join(e.currentTarget.dataset.id);wx.showToast({title:'已加入，去路线私聊看看吧',icon:'none'});const x=await api.route(this.data.route._id);this.setData({invitations:x.invitations||[]})}catch(err){wx.showToast({title:(err.message||'加入失败').slice(0,18),icon:'none'})}},
  chat(e){wx.navigateTo({url:'/pages/conversation/conversation?invitationId='+e.currentTarget.dataset.id})}
});
