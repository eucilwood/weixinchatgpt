"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const o=require("./common/vendor.js");Math;const n={onLaunch:function(){console.log("App Launch")},onShow:function(){console.log("App Show")},onHide:function(){console.log("App Hide")},onShareAppMessage:function(){return{title:"23232323",success:function(o){console.log(o)},fail:function(o){console.log(err)}}}};function e(){return{app:o.createSSRApp(n)}}e().app.mount("#app"),exports.createApp=e;