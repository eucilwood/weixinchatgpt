"use strict";const e=require("../../common/vendor.js"),t=require("../../common/assets.js"),o=e.defineComponent({__name:"index",setup(o){e.Es.importObject("checkContent");const a=e.Es.database();e.onShow((()=>{console.log("appshow")})),e.onMounted((()=>{const t=e.index.getStorageSync("token");t?_(t):f(),s(),i()}));let n=null;const s=()=>{e.index.createInterstitialAd&&(n=e.index.createInterstitialAd({adUnitId:"adunit-01a2e69817c90316"}),n.onLoad((()=>{console.log("插屏 广告加载成功")})),n.onError((e=>{console.log("插屏 广告加载失败",e)})),n.onClose((e=>{console.log("插屏 广告关闭",e)})))},i=()=>{n&&n.show().catch((e=>{console.error(e)}))};e.onLoad((()=>{})),e.onShareAppMessage((()=>(p.value=!0,{title:"为什么不问一问神奇海螺呢",imageUrl:t._imports_0,success:function(t){e.index.showToast({title:"分享成功"})},fail:function(e){console.log(e)}}))),e.onShow((()=>{e.wx$1.updateShareMenu({withShareTicket:!0,success(){}}),p.value&&(e.index.showToast({title:"分享成功！"}),p.value=!1)}));const c=e.ref(0),d=e.ref(0),l=e.ref(""),r=e.ref(""),u=e.ref(!1),h=e.reactive([]),p=e.ref(!1),g=e.index.getStorageSync("token"),_=async e=>{a.collection("uni-id-log").get().then((async t=>{if(console.log(t.result.data),void 0===t.result.data.find((t=>t.user_id===e)))a.collection("uni-id-log").add({user_id:e,user_count:10,share_count:5,date:(new Date).getTime()});else{c.value=t.result.data[0].user_count,d.value=t.result.data[0].share_count,t.result.data[0].date+864e5<(new Date).getTime()&&await a.collection("uni-id-log").where({user_id:g}).update({share_count:5})}}))},f=()=>{e.index.login({provider:"weixin",success:t=>{console.log(t),l.value=t.code,e.index.request({method:"GET",url:"https://api.weixin.qq.com/sns/jscode2session",data:{secret:"8ed1aad06f34363979cdb055965d7177",appid:"wx31001c9ca057a395",grant_type:"authorization_code",js_code:t.code},success:t=>{e.index.showToast({title:"登录成功"}),_(t.data.openid),e.index.setStorageSync("token",t.data.openid)}})}})},w=async(t=!0)=>{const o=await a.collection("uni-id-log").where({user_id:g});let n=0,s=0;if(await o.get().then((e=>{console.log(e),n=e.result.data[0].user_count,s=e.result.data[0].share_count})),t)await o.update({user_id:g,user_count:n+1,share_count:s-1<0?0:s-1}),e.index.showToast({title:"分享成功,提问次数+1"});else{if(0===n)return;await o.update({user_id:g,user_count:n-1})}_(g)},m=async()=>{console.log("发送消息----"),r.value&&(c.value<=0?e.index.showToast({title:"次数已用完",icon:"error"}):""!==r.value?(u.value=!0,e.index.request({method:"GET",url:"https://api.weixin.qq.com/cgi-bin/token",data:{secret:"8ed1aad06f34363979cdb055965d7177",appid:"wx31001c9ca057a395",grant_type:"client_credential"},header:{"Content-Type":"application/json"},success:t=>{console.log(t);let o=t.data.access_token;e.index.request({method:"POST",url:"https://api.weixin.qq.com/wxa/msg_sec_check?access_token="+o,data:{content:r.value},success:t=>{console.log(t),87014==t.data.errcode&&(e.index.showToast({title:"内容含有敏感信息！",icon:"none",duration:2e3}),u.value=!1,r.value=""),0==t.data.errcode&&(h.push({info:r.value,from:"my"}),e.index.request({url:"http://45.32.169.59:8090/chat",method:"GET",data:{prompt:r.value},success:e=>{let t="请重新发送一下";if(e.data.length>0){const o=e.data.indexOf("data"),a=e.data.lastIndexOf("'");t=e.data.slice(o+7,a)}h.push({info:t,from:"chatgpt"}),w(!1),u.value=!1,r.value=""},fail(){e.index.showToast({title:"请稍后再试!",icon:"error"}),u.value=!1}}))},fail(){u.value=!1}})}})):e.index.showToast({title:"请先输入内容",icon:"error"}))};return(o,a)=>({a:e.t(c.value),b:e.t(d.value),c:e.o(w),d:e.f(h,((o,a,n)=>e.e({a:"chatgpt"===o.from},"chatgpt"===o.from?{b:t._imports_0}:{},{c:e.t(o.info),d:"chatgpt"===o.from?1:"",e:"my"===o.from?1:""}))),e:r.value,f:e.o((e=>r.value=e.detail.value)),g:e.o(m),h:u.value})}});o.__runtimeHooks=2,wx.createPage(o);
