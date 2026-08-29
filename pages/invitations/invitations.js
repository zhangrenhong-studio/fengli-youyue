const api=require('../../services/data');
const demo=require('../../services/demo-content');
function normalizeInvitation(raw={}){
  const route=raw.route||{};
  const pace=raw.pace||'节奏可商量',budget=raw.budget_note||'';
  return {...raw,route:{...route,_id:route._id||raw.route_id||'',title:route.title||'这条路线正在等一位同行者'},start_time:raw.start_time||'时间可商量',meet_place:raw.meet_place||'集合地点待定',pace,companion_meta:budget?`${pace} · ${budget}`:pace,member_count:Number(raw.member_count)||0,max_people:Number(raw.max_people)||2};
}
Page({
  data:{items:[],tab:'open',loading:true,usingDemo:false,showQuestion:false,questionInvitation:null,questionBody:'',asking:false},
  async onShow(){this.getTabBar()?.setData({selected:'pages/invitations/invitations'});await this.load()},
  async load(){try{const raw=this.data.tab==='mine'?await api.myInvitations():await api.invitations();this.setData({items:(Array.isArray(raw)?raw:[]).map(normalizeInvitation),loading:false,usingDemo:false})}catch(e){this.setData({items:this.data.tab==='mine'?[]:demo.invitations.map(normalizeInvitation),loading:false,usingDemo:true})}},
  tab(e){const tab=e.currentTarget.dataset.tab;if(!tab||tab===this.data.tab)return;this.setData({tab,loading:true,items:[]});this.load()},
  async join(e){try{await api.join(e.currentTarget.dataset.id);await this.load();wx.showToast({title:'已加入这次同行',icon:'success'})}catch(err){wx.showToast({title:(err.message||'加入失败').slice(0,18),icon:'none'})}},
  openQuestion(e){const invitation=this.data.items.find(item=>item._id===e.currentTarget.dataset.id);if(invitation)this.setData({showQuestion:true,questionInvitation:invitation,questionBody:''})},
  questionInput(e){this.setData({questionBody:e.detail.value})},
  closeQuestion(){this.setData({showQuestion:false,questionInvitation:null,questionBody:''})},
  async submitQuestion(){const body=this.data.questionBody.trim(),inv=this.data.questionInvitation;if(!inv||!body)return wx.showToast({title:'写下想确认的事情再发送',icon:'none'});this.setData({asking:true});try{await api.askInvitation(inv._id,body);this.closeQuestion();wx.showToast({title:'已发送给发起人，回复后再决定是否加入',icon:'success'})}catch(e){wx.showToast({title:(e.message||'发送失败').slice(0,18),icon:'none'})}finally{this.setData({asking:false})}},
  chat(e){wx.navigateTo({url:'/pages/conversation/conversation?invitationId='+e.currentTarget.dataset.id})},
  async closeInvitation(e){const id=e.currentTarget.dataset.id;const r=await wx.showModal({title:'结束这场邀约？',content:'成员仍可回看路线和此前聊天，但不能再加入或发送消息。',confirmText:'结束邀约'});if(!r.confirm)return;try{await api.closeInvitation(id);await this.load();wx.showToast({title:'邀约已结束',icon:'success'})}catch(err){wx.showToast({title:(err.message||'操作失败').slice(0,18),icon:'none'})}},
  async leaveInvitation(e){const id=e.currentTarget.dataset.id;const r=await wx.showModal({title:'退出这场邀约？',content:'退出后将不能再进入本次路线私聊。',confirmText:'退出'});if(!r.confirm)return;try{await api.leave(id);await this.load();wx.showToast({title:'已退出邀约',icon:'success'})}catch(err){wx.showToast({title:(err.message||'操作失败').slice(0,18),icon:'none'})}},
  hostProfile(e){const userId=e.currentTarget.dataset.userId;if(userId)wx.navigateTo({url:'/pages/user-profile/user-profile?userId='+encodeURIComponent(userId)})},
  detail(e){wx.navigateTo({url:'/pages/route-detail/route-detail?id='+e.currentTarget.dataset.id})}
});
