const app = getApp();
const GhossModal = require("../../utils/fun.js");
var _this;
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


    // _this.onTapShowButton();

    _this.gmodal.show("ghossModal.showModal", null, {
      title: "弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题",
      content: "弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内。",
      autoClose: true,
      confirm(res) {
        console.log("res:", res)

        // wx.showModal({
        //   content: "触发事件",
        //   showCancel: false,
        //   complete() {
        //     wx.showToast({
        //       icon: "none",
        //       title: "触发了事件！"
        //     })
        //   }
        // })
      },
    });

  },



  onTapShowButton() {
    // 显示
    _this.gmodal.show("ghossModal.showModal", null, {
      title: "弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题",
      content: "弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内。",
      autoClose: true,
      confirm(res) { },
    });

  },

  onTapShowButton1() {
    // 显示
    _this.gmodal.show("ghossModal.showModal", null, {
      title: "弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题弹窗标题",
      content: "弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内。",
      autoClose: true,
      theme: "wx-android",
      confirm(res) { },
    });
  },

})
