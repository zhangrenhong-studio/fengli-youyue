const api=require('../../services/data');
const statusText={saved:'还没定下时间',scheduled:'已经安排好',active:'正在出发',completed:'已经完成'};
const clean=value=>String(value||'').trim();
const stopsToText=stops=>(stops||[]).map(item=>[item[0],item[1],item[2]].join('｜')).join('\n');
const textToStops=text=>clean(text).split('\n').map(line=>line.split('｜').map(clean)).filter(parts=>parts[1]).map(parts=>[parts[0]||'待定',parts[1],parts[2]||'']);

Page({
  data:{plan:null,route:null,statusLabel:'',scheduledAt:'',loading:true,saving:false,showInviteForm:false,inviteCount:3,startTime:'时间可商量',meetPlace:'集合地点待定',inviteNote:'',editing:false,editForm:{title:'',district:'',duration:'',budget:'',description:'',stopsText:''}},
  async onLoad(q){this.planId=q.id;await this.load();},
  async load(){
    try{const plan=await api.plan(this.planId);const detail=await api.route(plan.route_id);this.setData({plan,route:detail.route,statusLabel:statusText[plan.status]||'我的计划',scheduledAt:plan.scheduled_at||'',loading:false});}
    catch(e){this.setData({loading:false});wx.showToast({title:(e.message||'计划加载失败').slice(0,18),icon:'none'});}
  },
  timeInput(e){this.setData({scheduledAt:e.detail.value});},
  async arrange(){const time=clean(this.data.scheduledAt);if(!time)return wx.showToast({title:'先留一个大概时间',icon:'none'});this.setData({saving:true});try{await api.updatePlan(this.planId,{status:'scheduled',scheduled_at:time});await this.load();wx.showToast({title:'已留进你的安排',icon:'success'});}catch(e){wx.showToast({title:(e.message||'保存失败').slice(0,18),icon:'none'});}finally{this.setData({saving:false});}},
  async changeStatus(e){const status=e.currentTarget.dataset.status;this.setData({saving:true});try{await api.updatePlan(this.planId,{status});await this.load();wx.showToast({title:status==='active'?'祝你出发愉快':'已记为完成',icon:'success'});}catch(err){wx.showToast({title:(err.message||'操作失败').slice(0,18),icon:'none'});}finally{this.setData({saving:false});}},
  openEdit(){const snap=this.data.plan.route_snapshot||{};this.setData({editing:true,editForm:{title:snap.title||'',district:snap.district||'',duration:snap.duration||'',budget:snap.budget||'',description:snap.description||'',stopsText:stopsToText(snap.stops)}});},
  closeEdit(){this.setData({editing:false});},
  editInput(e){this.setData({['editForm.'+e.currentTarget.dataset.field]:e.detail.value});},
  async saveEdit(){const form=this.data.editForm;const stops=textToStops(form.stopsText);if(!clean(form.title)||!stops.length)return wx.showToast({title:'请补齐路线名称和至少一站',icon:'none'});this.setData({saving:true});try{await api.updatePlan(this.planId,{route_snapshot:{title:clean(form.title),district:clean(form.district),duration:clean(form.duration),budget:clean(form.budget),description:clean(form.description),stops}});this.setData({editing:false});await this.load();wx.showToast({title:'已更新我的计划',icon:'success'});}catch(e){wx.showToast({title:(e.message||'保存失败').slice(0,18),icon:'none'});}finally{this.setData({saving:false});}},
  async openInvite(){if(!this.data.route)return;if(this.data.route.visibility==='private'){const res=await wx.showModal({title:'先公开这条路线？',content:'同行邀约会展示路线内容；你的原始想法和生活记录仍保持私密。',confirmText:'公开路线'});if(!res.confirm)return;try{await api.publishRoute(this.data.route._id);await this.load();}catch(e){return wx.showToast({title:(e.message||'公开失败').slice(0,18),icon:'none'});}}this.setData({showInviteForm:true});},
  pickCount(e){this.setData({inviteCount:Number(e.currentTarget.dataset.value)});},
  inviteInput(e){this.setData({[e.currentTarget.dataset.field]:e.detail.value});},
  closeInvite(){this.setData({showInviteForm:false});},
  async submitInvite(){try{await api.createInvitation({planId:this.planId,start_time:this.data.startTime,meet_place:this.data.meetPlace,max_people:this.data.inviteCount,pace:'慢慢走',budget_note:this.data.plan.route_snapshot.budget,note:this.data.inviteNote||'想按这条路线慢慢走，先聊聊再决定。'});this.setData({showInviteForm:false});wx.showModal({title:'同行邀约已发布',content:'已为这次同行创建专属路线私聊。',confirmText:'去看邀约',success:()=>wx.switchTab({url:'/pages/invitations/invitations'})});}catch(e){wx.showToast({title:(e.message||'发起失败').slice(0,18),icon:'none'});}},
  record(){wx.navigateTo({url:'/pages/life-record/life-record?planId='+encodeURIComponent(this.planId)+'&routeId='+encodeURIComponent(this.data.plan.route_id||'')});},
  back(){wx.navigateBack();}
});
