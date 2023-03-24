"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_defineComponent = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    common_vendor.Es.importObject("checkContent");
    const db = common_vendor.Es.database();
    const token = common_vendor.index.getStorageSync("token");
    common_vendor.onShow(() => {
      console.log("appshow");
    });
    common_vendor.onMounted(() => {
      const res = common_vendor.index.getStorageSync("token");
      if (!res) {
        login();
      } else {
        userInfo(res);
      }
      loadad();
      showAd();
    });
    let interstitialAd = null;
    let interstitialEncourageAd = null;
    const loadad = async () => {
      if (common_vendor.index.createInterstitialAd) {
        interstitialAd = common_vendor.index.createInterstitialAd({
          adUnitId: "adunit-01a2e69817c90316"
        });
        interstitialEncourageAd = common_vendor.index.createRewardedVideoAd({
          adUnitId: "adunit-bc43d546ecab1ed0"
        });
        interstitialAd.onLoad(() => {
          console.log("插屏 广告加载成功");
        });
        interstitialAd.onError((err) => {
          console.log("插屏 广告加载失败", err);
        });
        interstitialAd.onClose((res) => {
          console.log("插屏 广告关闭", res);
        });
        interstitialEncourageAd.onLoad(() => {
          console.log("激励 广告加载成功");
        });
        interstitialEncourageAd.onError((err) => {
          console.log("激励 广告加载失败", err);
        });
        interstitialEncourageAd.onClose(async (res) => {
          console.log("激励 广告关闭", res);
          if (res.isEnded) {
            const res2 = await db.collection("uni-id-log").where({
              user_id: token
            });
            let count2 = 0;
            await res2.get().then((rep) => {
              count2 = rep.result.data[0].user_count;
            });
            await res2.update({
              user_count: count2 + 2
            });
            common_vendor.index.showToast({
              title: "观看成功,提问次数+2"
            });
            userInfo(token);
          }
        });
      }
    };
    const showAd = () => {
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err);
        });
      }
    };
    const showEncourageAd = () => {
      console.log("激励");
      if (interstitialEncourageAd) {
        interstitialEncourageAd.show().catch((err) => {
          console.error(err);
        });
      }
    };
    common_vendor.onLoad(() => {
    });
    common_vendor.onShareAppMessage(() => {
      isShare.value = true;
      return {
        title: "为什么不问一问神奇海螺呢",
        imageUrl: common_assets._imports_4,
        success: function(res) {
          common_vendor.index.showToast({
            title: "分享成功"
          });
        },
        fail: function(res) {
          console.log(res);
        }
      };
    });
    common_vendor.onShow(() => {
      common_vendor.wx$1.updateShareMenu({
        withShareTicket: true,
        success() {
        }
      });
      if (isShare.value) {
        common_vendor.index.showToast({
          title: "分享成功！"
        });
        isShare.value = false;
      }
    });
    const count = common_vendor.ref(0);
    const sharecount = common_vendor.ref(0);
    const login_code = common_vendor.ref("");
    const message = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const messageList = common_vendor.reactive([
      { from: "chatgpt", info: "hi,我是神奇海螺🐚你有什么问题想问我吗？" }
    ]);
    const isShare = common_vendor.ref(false);
    const userInfo = async (id) => {
      db.collection("uni-id-log").get().then(async (res) => {
        console.log(res.result.data);
        let obj = res.result.data.find((item) => item.user_id === id);
        if (obj === void 0) {
          db.collection("uni-id-log").add({
            user_id: id,
            // 每个用户有10次提问
            user_count: 10,
            // 每天分享次数,
            share_count: 5,
            // 记录时间24小时刷新每天分享次数
            date: new Date().getTime()
          });
        } else {
          count.value = res.result.data[0].user_count;
          sharecount.value = res.result.data[0].share_count;
          let dbDate = res.result.data[0].date;
          if (dbDate + 864e5 < new Date().getTime()) {
            await db.collection("uni-id-log").where({
              user_id: token
            }).update({
              share_count: 5
            });
          }
        }
      });
    };
    const login = () => {
      common_vendor.index.login({
        provider: "weixin",
        success: (res) => {
          console.log(res);
          login_code.value = res.code;
          common_vendor.index.request({
            method: "GET",
            url: "https://api.weixin.qq.com/sns/jscode2session",
            data: {
              secret: "8ed1aad06f34363979cdb055965d7177",
              appid: "wx31001c9ca057a395",
              grant_type: "authorization_code",
              js_code: res.code
            },
            success: (res2) => {
              common_vendor.index.showToast({
                title: "登录成功"
              });
              userInfo(res2.data.openid);
              common_vendor.index.setStorageSync("token", res2.data.openid);
            }
          });
        }
      });
    };
    const shareAddSubtract = async (type = true) => {
      const res = await db.collection("uni-id-log").where({
        user_id: token
      });
      let count2 = 0;
      let sharecount2 = 0;
      await res.get().then((rep) => {
        console.log(rep);
        count2 = rep.result.data[0].user_count;
        sharecount2 = rep.result.data[0].share_count;
      });
      if (type) {
        await res.update({
          user_id: token,
          user_count: count2 + 1,
          share_count: sharecount2 - 1 < 0 ? 0 : sharecount2 - 1
        });
        common_vendor.index.showToast({
          title: "分享成功,提问次数+1"
        });
      } else {
        if (count2 === 0)
          return;
        await res.update({
          user_id: token,
          user_count: count2 - 1
        });
      }
      userInfo(token);
    };
    const sendMessage = async () => {
      console.log("发送消息----");
      if (!message.value)
        return;
      if (count.value <= 0) {
        common_vendor.index.showToast({
          title: "次数已用完",
          icon: "error"
        });
        messageList.push({
          from: "chatgpt",
          info: "你的次已经使用完,观看广告可以获得2次提问机会哦！"
        });
        return;
      }
      if (message.value === "") {
        common_vendor.index.showToast({
          title: "请先输入内容",
          icon: "error"
        });
        return;
      }
      loading.value = true;
      common_vendor.index.request({
        method: "GET",
        url: "https://api.weixin.qq.com/cgi-bin/token",
        data: {
          secret: "8ed1aad06f34363979cdb055965d7177",
          appid: "wx31001c9ca057a395",
          grant_type: "client_credential"
        },
        header: {
          "Content-Type": "application/json"
        },
        success: (res_token) => {
          console.log(res_token);
          let access_token = res_token.data.access_token;
          common_vendor.index.request({
            method: "POST",
            url: "https://api.weixin.qq.com/wxa/msg_sec_check?access_token=" + access_token,
            data: {
              content: message.value
            },
            success: (rep) => {
              console.log(rep);
              if (rep.data.errcode == 87014) {
                common_vendor.index.showToast({
                  title: "内容含有敏感信息！",
                  icon: "none",
                  duration: 2e3
                });
                loading.value = false;
                message.value = "";
              }
              if (rep.data.errcode == 0) {
                messageList.push({
                  info: message.value,
                  from: "my"
                });
                common_vendor.index.request({
                  url: "http://45.32.169.59:8090/chat",
                  method: "GET",
                  data: {
                    prompt: message.value
                  },
                  success: (resm) => {
                    let v = "请重新发送一下";
                    if (resm.data.length > 0) {
                      const s = resm.data.indexOf("data");
                      const e = resm.data.lastIndexOf("'");
                      v = resm.data.slice(s + 7, e);
                    }
                    messageList.push({
                      info: v,
                      from: "chatgpt"
                    });
                    shareAddSubtract(false);
                    loading.value = false;
                    message.value = "";
                  },
                  fail() {
                    common_vendor.index.showToast({
                      title: "请稍后再试!",
                      icon: "error"
                    });
                    loading.value = false;
                  }
                });
              }
            },
            fail() {
              loading.value = false;
            }
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_assets._imports_1,
        c: common_assets._imports_2,
        d: common_assets._imports_3,
        e: common_vendor.t(count.value),
        f: common_vendor.t(sharecount.value),
        g: common_vendor.o(shareAddSubtract),
        h: sharecount.value === 0,
        i: common_vendor.o(showEncourageAd),
        j: common_vendor.f(messageList, (item, k0, i0) => {
          return common_vendor.e({
            a: item.from === "chatgpt"
          }, item.from === "chatgpt" ? {
            b: common_assets._imports_4
          } : {}, {
            c: common_vendor.t(item.info),
            d: item.from === "chatgpt" ? 1 : "",
            e: item.from === "my" ? 1 : ""
          });
        }),
        k: message.value,
        l: common_vendor.o(($event) => message.value = $event.detail.value),
        m: common_vendor.o(sendMessage),
        n: loading.value
      };
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 2;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__file", "C:/Users/eucilwood/Documents/HBuilderProjects/神奇海螺/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
