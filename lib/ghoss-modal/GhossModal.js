/**
 * GhossModal Util js 
 * 
 * @author sjlei
 * @version v0.1.1
 * 
 */
class GhossModal {

    /** GhossModal 构造器 */
    constructor(page) {
        if (isPage(page)) {
            this.page = page;
            this.page["onGhossModalEvent"] = getEventRouter(this);
        } else {
            this.page = null;
            throwInstantiatingError("page 参数必须传入页面！");
        }
    }

    /**
     * 封装alert
     * @param {string} title alert的标题（内容）
     * @param {string} content alert的内容（回调）
     * @param {function} success 成功后的回调函数（留空）
     */
    alert(title, content, success) {
        showModal(this, title, content, success, false);
    }

    /**
     * 显示模态弹窗
     * 
     * @param {String} name 模态弹窗的类名
     * @param {Object} options 模态弹窗的选项
     */
    show(name, options) {
        toggle(this, name, options, true);
    }

    /**
     * 隐藏模态弹窗
     * 
     * @param {String} name 模态弹窗的类名
     */
    hide(name) {
        toggle(this, name, null, false);
    }

}

/** 获取事件路由器 */
function getEventRouter(_this) {
    return ((event) => {
        let eventType = event.detail.eventType;
        let execute = ((caller) => {
            if (caller) { // 有值则代表传入了回调，否则视为未传
                let callback = _this.page[caller];
                if (typeof callback === 'function') {
                    callback(event.detail.detail);
                } else {
                    throwRunntimeError(`未找到回调函数 "${caller}()" 的定义。`);
                }
            }
        });
        if (eventType === 'confirm') execute(event.detail.confirmCaller);
        if (eventType === 'cancel') execute(event.detail.cancelCaller);
        execute(event.detail.completeCaller);
        // 执行完成后移除这些回调函数以不占用多余内存，前提是不自动关闭
        if (event.detail.detail.autoClose === true) {
            delete _this.page[event.detail.confirmCaller];
            delete _this.page[event.detail.cancelCaller];
            delete _this.page[event.detail.completeCaller];
        }
    });
}

/**
 * 切换显示GhossModal
 * @param {*} name GhossModal的名称
 * @param {*} options GhossModal的选项
 * @param {*} show 是否显示，true显示，false隐藏
 */
function toggle(_this, name, options, show = false) {
    if (!name) {
        throwRunntimeError(`"name" 不能为空`);
    } else if (!isPage(_this.page)) {
        throwRunntimeError(`"page" 参数异常，请检查是否已实例化成功，并且不要更改此参数`);
    } else {
        if (!(options instanceof Object)) options = {};
        options.show = show;
        // 隐藏的时候只保留setData一个参数
        if (options.show === false) {
            options = { setData: options.setData }
        } else {
            // 暂存回调函数到Page
            let tempStorage = ((type) => {
                let name = `onGhossModal${type}Event${new Date().getTime()}`;
                let lower = type.toLowerCase();
                if (typeof options[lower] === 'function') {
                    _this.page[name] = options[lower], options[`${lower}Caller`] = name;
                }
            });
            tempStorage("Confirm"), tempStorage("Cancel"), tempStorage("Complete");
        }
        // setData
        let data = options.setData;
        delete options.setData;
        if (!(data instanceof Object)) data = {};
        data[name] = options;
        _this.page.setData(data, options["setDataComplete"])
    }
}


/** 封装showModal */
function showModal(gmodal, title, content, success, showCancel) {
    let options = {};
    if (typeof content != 'undefined') {
        if (typeof content == 'function') {
            options = { content: title, showCancel, confirm: content, showHeader: false };
        } else {
            options = { title, content, showCancel, confirm: success };
        }
    } else {
        options = { content: title, showCancel, showHeader: false };
    }
    const config = (getApp().ghossModal || {}).config || {};
    options.autoClose = true;
    options.maskClose = false;
    options.theme = config.alertTheme;
    options.animation = config.alertAnimation;
    gmodal.show("gmodal.showModal", options);
}


/** 抛出构建错误 */
function throwInstantiatingError(msg) {
    msg = `An error occurred while instantiating GhostModal: ${msg}`;
    throwError(msg);
}

/** 抛出运行时错误 */
function throwRunntimeError(msg) {
    msg = `An error occurred while running GhostModal: ${msg}`;
    throwError(msg);
}

/** 抛出错误 */
function throwError(msg) {
    // 这里不能使用 throw 关键字来抛出异常，会导致小程序出现异常报错。
    console.group(`${new Date()} GhossModal 错误`);
    console.error(msg);
    console.groupEnd();
}

/** 判断传入的参数是否是页面 */
function isPage(page) {
    return page && typeof page == 'object' && typeof page.setData == 'function';
}

module.exports = GhossModal;