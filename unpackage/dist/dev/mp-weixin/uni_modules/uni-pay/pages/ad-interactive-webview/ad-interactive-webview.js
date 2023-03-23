"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      url: ""
    };
  },
  onLoad(options) {
    if (options && options.url) {
      this.url = decodeURIComponent(options.url);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.url
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/eucilwood/Documents/HBuilderProjects/神奇海螺/uni_modules/uni-pay/pages/ad-interactive-webview/ad-interactive-webview.vue"]]);
wx.createPage(MiniProgramPage);
