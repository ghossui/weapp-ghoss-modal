// 模态弹窗组件
Component({
  /** 组件的属性列表 */
  properties: {
    data: {
      type: Object, observer: function (options, oldOptions) {
        if (options.show === true) {
          // 获取全局配置
          const config = (getApp().gmodal || {}).config || {};

          /* 应用全局配置或默认值 */

          if (!options.theme) options.theme = (config.theme || "normal"); // 配置样式
          if (!options.themeColor) options.themeColor = (config.themeColor || "#6495ED"); // 配置样式
          if (!options.animation) options.animation = (config.animation || "none"); // 配置动画

          if (!options.title) options.title = "标题";
          if (!options.content) options.content = null; // 正文
          if (!options.confirmText) options.confirmText = "确定";// 确定按钮的文本
          if (!options.cancelText) options.cancelText = "取消";// 取消按钮的文本
          if (!options.background) options.background = "#FFFFFF";// 背景颜色
          if (!options.openType) options.openType = null;// 确定按钮的openType
          if (!options.appParameter) options.appParameter = ""; // 返回到app的参数，当openType为launchApp时才有效


          /* input modal */
          if (typeof options.showInput !== "boolean") options.showInput = false;// 是否显示输入框
          if (options.showInput) {
            if (!options.value) options.value = "";
            this.data.inputs["input-box"] = options.value;
            if (!options.placeholder) options.placeholder = "请输入内容"; // 占位内容
            if (!options.maxlength) options.maxlength = 140; // 最多输入长度
            if (!options.inputType) options.inputType = "text"; // 文本框的类型，参考官方input文档

            if (typeof options.lineBreaks !== "boolean") options.lineBreaks = false;  // 可以换行
            if (typeof options.password !== "boolean") options.password = false; // 是否是密码类型
            if (typeof options.focus !== "boolean") options.focus = true;// 是否自动获取焦点
            if (typeof options.allowEmpty !== "boolean") options.allowEmpty = true;// 允许空值确定
          }


          /* boolean 类型 */
          if (typeof options.autoClose !== "boolean") options.autoClose = (config.autoClose || true);// 是否自动关闭
          if (typeof options.formId !== "boolean") options.formId = false;// 点击确定是否返回formIdable
          if (typeof options.maskClose !== "boolean") options.maskClose = (config.maskClose || false);// 允许点击蒙版关闭
          if (typeof options.showHeader !== "boolean") options.showHeader = true;// 是否显示顶部
          if (typeof options.showFooter !== "boolean") options.showFooter = true;// 是否显示底部
          if (typeof options.showCancel !== "boolean") options.showCancel = true;// 是否显示取消按钮
          if (typeof options.show !== "boolean") options.show = false;// 是否显示，本条选项可以忽略，由custModal里的show和hide方法控制
          /* 逻辑值 */
          if (options.openType === "openSetting") {// 为了兼容openSetting()API接口修改
            if (options.formId) {
              options.formId = false;
              console.error("showCustModalException：当openType为openSetting时不能设置formId为true，已自动设置为false")
            }
            options.openType = null;
            options.openSetting = true;
          }
          /* style */
          options.confirmStyle = `color: ${options.confirmColor ? options.confirmColor : options.themeColor};`;
          options.cancelStyle = `color: ${options.cancelColor ? options.cancelColor : options.themeColor};`;
          options.inputStyle = `border-bottom-color:${options.themeColor};`;
          /* setData */
          this.setData({ o: options }, () => {
            this.show();
          });
        } else {
          this.hide();
        }
        // console.log("options:", options)
      }
    }
  },

  /** 组件的初始数据 */
  data: {

    /** 记录输入内容 */
    inputs: {},
    detail: {},

    toggleClass: "", // gmodal-hide
    /** 控制播放动画的class */
    animationClass: "",//none-hide
    /** 控制实际显示与隐藏 */
    hidden: false
  },

  /** 组件的方法列表 */
  methods: {
    show() {
      this.setData({
        animationClass: this.data.o.animation + "-show",
        toggleClass: "gmodal-show",
        hidden: true
      });
      this.isTrigger = false;
    },
    hide(success) {
      this.setData({
        animationClass: this.data.o.animation + "-hide",
        toggleClass: "gmodal-hide",
        "o.show": false
      });
      setTimeout(() => {
        this.setData({ hidden: false })
        if (typeof success === "function") success();
        this.data.inputs["input-box"] = "";
        this.myTriggerEvent("close", {});
      }, this.data.o.animation === "none" ? 0 : 350);

    },

    isTrigger: false,
    /** 绑定确定按钮[tap]事件 */
    bindConfirm(event) {
      if (this.isTrigger) { return };
      let detail = {};
      if (this.data.o.showInput) {
        let value = (this.data.inputs["input-box"] || "").trim();
        if (!value && !this.data.o.allowEmpty)
          return; // 不允许空值触发confirm事件
        detail.value = value;
      }
      if (event.type === "submit") detail.formId = event.detail.formId;// 如果是submit事件，则获取formId 
      if (this.data.o.autoClose) this.hide();
      if (this.data.o.openSetting) {// openSetting
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
      if (this.isTrigger) return;
      let maskClose = this.data.o.maskClose;
      if (event.currentTarget.dataset.mask && !maskClose) return;
      this.hide(), this.triggerCancel();
    },

    /** 绑定文本框的input事件 */
    bindInput(event) {
      this.data.inputs[event.currentTarget.id] = event.detail.value;

      this.myTriggerEvent('input', event.detail);
    },

    triggerConfirm(detail) { this.myTriggerEvent('confirm', detail) },
    triggerCancel(detail) { this.myTriggerEvent('cancel', detail) },
    /** 触发自定义事件 */

    myTriggerEvent(eventType, detail) {
      detail = (detail instanceof Object) ? detail : {};
      detail.autoClose = this.data.o.autoClose;

      this.triggerEvent('event-route', {
        detail: eventType === 'close' ? this.data.detail : detail,
        eventType,
        confirmCaller: this.data.o.confirmCaller,
        inputCaller: this.data.o.inputCaller,
        cancelCaller: this.data.o.cancelCaller,
        completeCaller: this.data.o.completeCaller,
      });
      this.data.detail = this.cloneObject(detail);    // 记录最后一次触发事件的detail
      if (this.data.o.autoClose === true && eventType !== 'input')
        this.isTrigger = true;

    },

    cloneObject(object) {
      let json = JSON.stringify(object);
      return JSON.parse(json)
    },

    noTouch() { },

    /** 当使用开放能力时，发生错误的回调 */
    onErrorConfirmButton(event) {
      console.error("自定义modal组件使用微信开放能力按钮的时候跑出了一个异常:\n", event)
    },

  }
})
