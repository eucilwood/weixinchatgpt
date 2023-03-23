"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./uni_modules/uni-pay/pages/success/success.js";
  "./uni_modules/uni-pay/pages/ad-interactive-webview/ad-interactive-webview.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
  onShareAppMessage: function() {
    return {
      title: "23232323",
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {
        console.log(err);
      }
    };
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/eucilwood/Documents/HBuilderProjects/神奇海螺/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
