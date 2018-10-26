const app = getApp();
const GhossModal = require("../../utils/ghoss-modal-util.js");
var _this;
var title = "弹窗标题";
var content = "弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内。";
Page({
  data: {
    button: {
      show: false,
      tap: "",
      text: "自定义按钮",
    },
  },

  onLoad() {
    _this = this;
    _this.gmodal = new GhossModal(this);


    _this.onTapShowIOSTheme();

  },

  onTapShowNormal() {
    _this.gmodal.show("ghossModal.showModal", {
      title, content,
      confirm(res) { },
    });

  },

  onTapShowAndroidTheme() {
    _this.gmodal.show("ghossModal.showModal", {
      title, content,
      theme: "wx-android",
      confirm(res) { },
    });
  },

  onTapShowIOSTheme() {
    _this.gmodal.show("ghossModal.showModal", {
      title, content,
      theme: "wx-ios",
      confirm(res) { },
    });
  },

})
