// 模态弹窗组件
Component({
  /** 组件的属性列表 */
  properties: {
    data: {
      type: Object, observer(params, oldParams) {
        // 获取全局配置
        const config = (getApp().ghossModal || {}).config || {};
        // params.theme = config.theme || "normal"; // 配置皮肤名称

        /* 应用全局配置或默认值 */

        if (!params.theme) params.theme = (config.theme || "normal");

        if (!params.uk) params.uk = "uk";// 标识 Uniquely key

        if (!params.title) params.title = "标题";
        if (!params.content) params.content = null; // 正文
        if (!params.openType) params.openType = null;// 确定按钮的openType
        if (!params.confirmText) params.confirmText = "确定";// 确定按钮的文本
        if (!params.cancelText) params.cancelText = "取消";// 取消按钮的文本
        if (!params.background) params.background = "#FFFFFF";// 背景颜色
        if (!params.appParameter) params.appParameter = ""; // 返回到app的参数，当openType为launchApp时才有效
        /* boolean 类型 */
        if (typeof params.autoClose !== "boolean") params.autoClose = (config.autoClose || true);// 是否自动关闭
        if (typeof params.formId !== "boolean") params.formId = false;// 点击确定是否返回formIdable
        if (typeof params.maskClose !== "boolean") params.maskClose = (config.autoClose || false);// 允许点击蒙版关闭
        if (typeof params.showHeader !== "boolean") params.showHeader = true;// 是否显示顶部
        if (typeof params.showFooter !== "boolean") params.showFooter = true;// 是否显示底部
        if (typeof params.showCancel !== "boolean") params.showCancel = true;// 是否显示取消按钮
        if (typeof params.show !== "boolean") params.show = false;// 是否显示，本条选项可以忽略，由custModal里的show和hide方法控制
        /* 逻辑值 */
        if (params.openType === "openSetting") {// 为了兼容openSetting()API接口修改
          if (params.formId) {
            params.formId = false;
            console.error("showCustModalException：当openType为openSetting时不能设置formId为true，已自动设置为false")
          }
          params.openType = null;
          params.openSetting = true;
        }
        this.setData({ p: params });
        /* 控制显示或隐藏 */
        params.show === true ? this.show() : this.hide();
        // console.log(params)
      }
    }
  },

  /** 组件的初始数据 */
  data: {
    showClass: "gmodal-show",
    hideClass: "gmodal-hide",
    /** 控制播放动画的class */
    animationClass: "gmodal-hide",
    /** 控制实际显示与隐藏 */
    hidden: false
  },

  /** 组件的方法列表 */
  methods: {
    show() {
      this.setData({ animationClass: this.data.showClass, hidden: true });
    },
    hide(success) {
      this.setData({ animationClass: this.data.hideClass, "p.show": false });
      setTimeout(() => {
        this.setData({ hidden: false })
        if (typeof success == "function") success()
      }, 350);
    },

    /** 绑定确定按钮[tap]事件 */
    bindConfirm(event) {
      let detail = {};
      if (event.type === "submit") detail.formId = event.detail.formId;// 如果是submit事件，则获取formId 
      if (this.data.p.autoClose) this.hide();
      if (this.data.p.openSetting) {// openSetting
        wx.openSetting({
          complete: (res) => {
            detail.openSetting = (res.errMsg === "openSetting:ok");
            detail.openSettingResult = res;
            this.triggerConfirm(detail);
          }
        });
      } else this.triggerConfirm(detail);
    },
    /** 绑定关闭按钮tap事件 */
    bindCancel(event) {
      let uk = this.data.p.uk;
      let maskClose = this.data.p.maskClose;
      if (event.currentTarget.dataset.mask && (uk && !maskClose)) return;
      this.hide(), this.triggerCancel();
    },

    triggerConfirm(detail) { this.myTriggerEvent('confirm', detail) },
    triggerCancel(detail) { this.myTriggerEvent('cancel', detail) },
    /** 触发自定义事件 */
    myTriggerEvent(eventType, detail) {
      detail = (detail instanceof Object) ? detail : {};
      detail.uk = this.data.p.uk;
      this.triggerEvent('complete', {
        detail, eventType,
        confirmCaller: this.data.p.confirmCaller,
        cancelCaller: this.data.p.cancelCaller,
        completeCaller: this.data.p.completeCaller,
      });
    },

    noTouch() { },

    /** 当使用开放能力时，发生错误的回调 */
    onErrorConfirmButton(event) {
      console.error("自定义modal组件使用微信开放能力按钮的时候跑出了一个异常:\n", event)
    },

  }
})
