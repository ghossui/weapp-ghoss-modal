/**
 * GhossModal Util js 
 * 
 * @author sjlei
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
     * 封装 confirm
     * @param {string} title 
     * @param {string} content 
     * @param {object} options 
     */
    confirm(title, content, options) {
        return showModal(this, title, content, options).then(detail => {
            detail.confirm = detail.callType === CallType.confirm;
            detail.cancel = detail.callType === CallType.cancel;
            return Promise.resolve(detail);
        }, reason => {
            return Promise.reject(reason);
        });
    }

    /**
     * 封装prompt，用于弹出文本输入框
     * @param {String} title 
     * @param {Object} options 
     */
    prompt(title, options = {}) {
        options["showInput"] = true;
        return showModal(this, title, null, options);
    }

    /**
     * 封装alert
     * @param {string} title alert的标题（内容）
     * @param {string} content alert的内容（回调）
     * @param {function} success 成功后的回调函数（留空）
     * 
     * @return 返回 Promise 对象
     */
    alert(title, content = {}, options) {
        if (typeof content === 'object') {
            options = content;
            content = null;
        }
        options["showCancel"] = false;
        return showModal(this, title, content, options);
    }

    /**
     * 显示模态弹窗
     * 
     * @param {String} name 模态弹窗的类名
     * @param {Object} options 模态弹窗的选项
     */
    show(name, options) {
        return toggle(this, name, options, true);
    }

    /**
     * 隐藏模态弹窗
     * 
     * @param {String} name 模态弹窗的类名
     */
    hide(name) {
        return toggle(this, name, null, false);
    }

}

/** 获取事件路由器 */
function getEventRouter(_this) {
    return ((event) => {
        let { eventType, uk } = event.detail;
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
        let { confirmCaller, cancelCaller, inputCaller, completeCaller } = event.detail;
        if (eventType === 'hide') _this.page.setData({ [`${uk}.show`]: false });
        else if (eventType === 'confirm') execute(confirmCaller);
        else if (eventType === 'cancel') execute(cancelCaller);
        else if (eventType === 'input') execute(inputCaller);
        // 执行完成后移除这些回调函数以不占用多余内存，前提是不自动关闭
        else if (eventType === 'close') {
            event.detail.detail.callType = CallType.complete;
            execute(completeCaller);
            delete _this.page[confirmCaller];
            delete _this.page[cancelCaller];
            delete _this.page[inputCaller];
            delete _this.page[completeCaller];
        }
    });
}

/**
 * 切换显示GhossModal
 * 
 * @param {GhossModal} _this GhossModal的实例
 * @param {String} name GhossModal的名称
 * @param {Object} options GhossModal的选项
 * @param {Boolean} show 是否显示，true显示，false隐藏
 */
function toggle(_this, name, options, show = false) {
    return new Promise((resolve, reject) => {
        try {
            if (!name) {
                throwRunntimeError(`"name" 不能为空`);
            } else if (!isPage(_this.page)) {
                throwRunntimeError(`"page" 参数异常，请检查是否已实例化成功，并且不要更改此参数`);
            } else {
                if (!(options instanceof Object)) options = {};
                options.uk = name;
                options.show = show;
                // 隐藏的时候只保留setData一个参数
                if (options.show === false) {
                    options = { setData: options.setData }
                } else {
                    // 暂存回调函数到Page
                    let saveCallback = ((type) => {
                        let eventName = `onGhossModal${type}Event${new Date().getTime()}`;
                        let lower = type.toLowerCase();
                        let isFunction = typeof options[lower] === 'function';

                        if (lower === 'confirm' || lower === 'cancel') {
                            _this.page[eventName] = (detail) => {
                                detail.callType = CallType[lower];
                                if (isFunction) options[lower](detail);
                                resolve(detail);
                            };
                            options[`${lower}Caller`] = eventName;
                        } else if (isFunction) {
                            _this.page[eventName] = options[lower];
                            if (isFunction) options[`${lower}Caller`] = eventName;
                        }
                    });
                    saveCallback("Confirm");
                    saveCallback("Cancel");
                    saveCallback("Input");
                    saveCallback("Complete");
                }
                // setData
                let data = options.setData;
                delete options.setData;
                if (!(data instanceof Object)) data = {};
                data[name] = options;
                _this.page.setData(data, options["setDataComplete"])
            }
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * 封装showModal
 * 
 * @param {GhossModal} gmodal GhossModal对象，必填
 * @param {String} title 显示的标题，必填
 * @param {String} content 显示的内容，可空
 * @param {Object} options 其他参数，可空
 * 
 * @return return Promise
 */
function showModal(gmodal, title, content = {}, options) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof content === 'object') {
                if (typeof options === 'object') content = options;
                options = content;
            } else if (typeof options !== 'object') {
                options = {};
            }
            if (typeof content === 'undefined' || typeof content === 'object') {
                // showModal(gmodal, '内容'); 适用于弹出提示，无标题
                if (options.showInput === true) {
                    options["title"] = title;
                } else {
                    options["content"] = title;
                    options["showHeader"] = false;
                }
            } else {
                // showModal(gmodal, '标题', '内容'); 适用于弹出提示，有标题
                options["title"] = title;
                options["content"] = content;
            }
            // 默认选项
            options["autoClose"] = true;
            options["maskClose"] = false;
            // 获取弹出框配置选项
            const popup = (((getApp().gmodal || {}).config || {}).popup || {});
            options["theme"] = options.theme || popup.theme;
            options["animation"] = options.animation || popup.animation;
            // 定义回调函数
            options["confirm"] = (detail) => {
                detail.callType = CallType.confirm;
                resolve(detail);
            };
            options["cancel"] = (detail) => {
                detail.callType = CallType.cancel;
                resolve(detail);
            };

            gmodal.show("gmodal.showModal", options);
        } catch (error) {
            reject(error)
        }
    });
}

/** CallType */
const CallType = {
    close: -1,
    complete: 0,
    confirm: 1,
    cancel: 2,
    input: 3,
}

/** 判断传入的参数是否是页面 */
function isPage(page) {
    return (page && typeof page == 'object' && typeof page.setData === 'function');
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


module.exports = {
    GhossModal, CallType
};