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
  },

  onTapShowButton() {
    // 显示
    _this.gmodal.show("ghossModal.showModal", null, {
      title: "你好",
      content: "Hello World！",
      autoClose: true,
      confirm(res) {
        console.log("res:", res)

        wx.showModal({
          content: "触发事件",
          showCancel: false,
          complete() {
            wx.showToast({
              icon: "none",
              title: "触发了事件！"
            })
          }
        })

      },
    });

  },

})
