const api=require('../../services/data');
Page({
  data:{invitationId:'',conversationId:'',messages:[],text:'',loading:true,readOnly:false,showReport:false,reportReason:'',reporting:false},
  async onLoad(q){this.setData({invitationId:q.invitationId});await this.load();},
  async load(){try{const x=await api.conversation(this.data.invitationId);this.setData({conversationId:x.conversationId,messages:x.messages,readOnly:x.invitationStatus!=='open',loading:false});}catch(e){this.setData({loading:false});wx.showToast({title:(e.message||'暂时不能进入私聊').slice(0,18),icon:'none'});}},
  input(e){this.setData({text:e.detail.value});},
  async send(){if(this.data.readOnly)return;const text=this.data.text.trim();if(!text)return;try{await api.sendMessage(this.data.conversationId,text);this.setData({text:''});await this.load();}catch(e){wx.showToast({title:(e.message||'发送失败').slice(0,18),icon:'none'});}},
  more(){this.setData({showReport:true});},
  reportInput(e){this.setData({reportReason:e.detail.value});},
  closeReport(){this.setData({showReport:false,reportReason:''});},
  async submitReport(){const reason=this.data.reportReason.trim();if(!reason)return wx.showToast({title:'请说明需要处理的情况',icon:'none'});this.setData({reporting:true});try{await api.report({target_type:'invitation_conversation',target_id:this.data.invitationId,reason});this.closeReport();wx.showToast({title:'已提交，我们会尽快处理',icon:'success'});}catch(e){wx.showToast({title:(e.message||'提交失败').slice(0,18),icon:'none'});}finally{this.setData({reporting:false});}},
  back(){wx.navigateBack();}
});
