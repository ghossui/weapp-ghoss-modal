const app = getApp();
const GhossModal = require("../../lib/ghoss-modal/GhossModal.js");
var _this;
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
  },

  /** 立即弹出示例事件 */
  onSubmitShowModal(event) {
    const value = event.detail.value;
    console.log("\nvalue:", value)

    _this.gmodal.show("gmodal.showExample", {
      title: value.title,
      content: value.content,
      cancelText: value.cancelText,
      confirmText: value.confirmText,
      confirmColor: value.confirmColor,
      cancelColor: value.cancelColor,
      theme: value.theme,
      animation: value.animation,
      showHeader: value.showHeader,
      showFooter: value.showFooter,
      showCancel: value.showCancel,
      autoClose: value.autoClose,
      maskClose: value.maskClose,
      formId: value.formId,
      /** 确定按钮回调 */
      confirm(res) {
        wx.showToast({
          title: "confirm",
          icon: "none"
        });
        if (res.autoClose === false) {
          wx.showModal({
            content: "检测到你关闭了'点击确定按钮关闭弹窗'选项，现在可以手动关闭，点击确定关闭",
            success(res) {
              if (res.confirm)
                _this.gmodal.hide("gmodal.showExample"); // 手动关闭
            }
          })
        }
        if (res.formId) {
          _this.gmodal.alert(`成功获取到了formId： ${res.formId}`);
          // wx.showModal({ content:  })
        }
      },
      /** 取消按钮回调 */
      cancel(res) {
        wx.showToast({
          title: "cancel",
          icon: "none"
        })
      },
      /** 完成事件回调，无论点击了确定还是取消都会触发 */
      complete(res) {
        console.log("complete res：", res)
      }
    });


  },

  /** 更改皮肤选择事件 */
  onChangeTheme(event) {
    let idx = parseInt(event.detail.value);
    _this.setData({
      "theme.index": idx,
      "theme.value": _this.data.theme.range[idx]
    });
  },
  /** 更改样式选择事件 */
  onChangeAnimation(event) {
    let idx = parseInt(event.detail.value);
    _this.setData({
      "animation.index": idx,
      "animation.value": _this.data.animation.range[idx]
    });
  }

})