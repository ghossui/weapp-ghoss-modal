const GhossModal = require("../../lib/ghoss-modal/GhossModal.js");
// import { GhossModal } from "../../lib/ghoss-modal/gmodal.util.js";
var _this;
Page({

  /** 页面的初始数据 */
  data: {

  },

  /** 生命周期函数--监听页面加载 */
  onLoad(options) {
    _this = this;
    // 初始化gmodal
    _this.gmodal = new GhossModal(_this);
  },

  onTaps(event) {
    const id = event.target.id;
    const type = event.target.dataset.type;
    switch (id) {
      case "openSetting":
      case "contact":
        _this.gmodal.show("gmodal.showExample", {
          title: `${type}`,
          content: `即将${type}，你确定吗？`,
          openType: id,
        })
        break;

      default:
        break;
    }
  },

  /** 用户点击右上角分享  */
  onShareAppMessage() { }
})