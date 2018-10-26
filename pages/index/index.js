const app = getApp();
const GhossModal = require("../../lib/ghoss-modal/gmodal.js");
var _this;
var title = "弹窗标题";
var content = "弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内。";
Page({

  data: {},

  onLoad() {
    _this = this;
    // 初始化gmodal
    _this.gmodal = new GhossModal(this);


    // _this.onTapShowAlert();

  },

  onTapShowNormal() {
    _this.gmodal.show("gmodal.showModal", {
      title, content, formId: true,
      confirm(res) {
        wx.showToast({ title: "你点击了确定！！！", icon: "none" })
      },
      cancel(res) {
        wx.showToast({ title: "你点击了取消！！！", icon: "none" })
      },
      complete(res) {
        console.log("complete：", res)
      },
    });

  },

  onTapShowAndroidTheme() {
    _this.gmodal.show("gmodal.showModal", {
      title, content,
      theme: "wx-android",
      confirm(res) { },
    });
  },

  onTapShowIOSTheme() {
    _this.gmodal.show("gmodal.showModal", {
      title, content,
      theme: "wx-ios",
      confirm(res) { },
    });
  },

  onTapShowAlert() {
    _this.gmodal.alert(title, content, () => {
      setTimeout(() => {
        _this.gmodal.alert(`这里是无标题的alert！`);
      }, 500)
    });
  },

})
