const app = getApp();
const GhossModal = require("../../lib/ghoss-modal/gmodal.util.js");
// import { GhossModal } from "../../lib/ghoss-modal/gmodal.util.js";
var _this;
var title = "弹窗标题";
var content = "弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内。";
Page({

  data: {
    theme: {
      range: ["normal", "wx-android", "wx-ios"],
      index: 1,
      value: "wx-android",
    },
    animation: {
      range: ["none", "zoom-in-out", "fading-in-out", "fading-zoom-in-out"],
      index: 1,
      value: "fading-zoom-in-out",
    }
  },

  onLoad() {
    _this = this;
    // 初始化gmodal
    _this.gmodal = new GhossModal(this);


    // _this.onTapShowAlert();

  },

  onSubmitShowModal(event) {
    const value = event.detail.value;

    value.confirm = (res) => {
      wx.showToast({ title: "confirm", icon: "none" })
    };

    value.cancel = (res) => {
      wx.showToast({ title: "cancel", icon: "none" })
    };

    value.complete = (res) => {
      console.log("complete：", res)
    };

    // value.animation = "none";
    // value.animation = "zoom-in-out";
    // value.animation = "fading-in-out";

    console.log("value:", value)

    _this.gmodal.show("gmodal.showModal", value);
  },

  onChangeTheme(event) {
    let idx = parseInt(event.detail.value);
    _this.setData({
      "theme.index": idx,
      "theme.value": _this.data.theme.range[idx]
    });
  },
  onChangeAnimation(event) {
    let idx = parseInt(event.detail.value);
    _this.setData({
      "animation.index": idx,
      "animation.value": _this.data.animation.range[idx]
    });
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

  onTapButtonColor() {
    _this.gmodal.show("gmodal.showModal", {
      title, content,
      theme: "wx-ios",
      confirmColor: "blue",
      cancelColor: "#ff0000",
      confirm(res) { },
    });
  },

})
