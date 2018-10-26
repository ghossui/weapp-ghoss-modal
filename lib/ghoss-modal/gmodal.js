
/** GhossModal */
module.exports = class GhossModal {

    constructor(page) {
        if (isPage(page)) {
            this.page = page;
            // 初始化GhossModal事件路由器
            this.page["onGhossModalEvent"] = ((event) => {
                let eventType = event.detail.eventType;
                let execute = ((caller) => {
                    if (caller) { // 有值则代表传入了回调，否则视为未传
                        let callback = this.page[caller];
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
                // 执行完成后移除这些回调函数以不占用多余内存
                delete this.page[event.detail.confirmCaller];
                delete this.page[event.detail.cancelCaller];
                delete this.page[event.detail.completeCaller];
            });
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

    show(name, params) { this.toggle(name, params, true) }
    hide(name) { this.toggle(name, null, false) }

    /**
     * 切换显示GhossModal
     * @param {*} name GhossModal的名称
     * @param {*} params GhossModal的参数
     * @param {*} flag 控制显示或隐藏
     */
    toggle(name, params, flag) {
        if (isPage(this.page)) {
            // 隐藏的时候只保留setData一个参数
            if (flag === false) params = { setData: params.setData };
            if (!(params instanceof Object)) params = {};
            // 显示或隐藏
            params.show = flag;
            // 暂存回调函数
            let prefix = "onGhossModal";
            let suffix = `Event_${new Date().getTime()}`;
            if (typeof params.confirm === 'function') {
                params.confirmCaller = `${prefix}Confirm${suffix}`;
                this.page[params.confirmCaller] = params.confirm;
            }
            if (typeof params.cancel === 'function') {
                params.cancelCaller = `${prefix}Cancel${suffix}`;
                this.page[params.cancelCaller] = params.cancel;
            }
            if (typeof params.complete === 'function') {
                params.completeCaller = `${prefix}Complete${suffix}`;
                this.page[params.completeCaller] = params.complete;
            }
            // setData
            let data = params.setData;
            delete params.setData;
            if (!(data instanceof Object)) data = {};
            data[name] = params;
            this.page.setData(data, params["setDataComplete"])
        } else throwRunntimeError(`page 参数异常，请检查是否已实例化成功，并且不要更改此参数。`);
    }

    getPage() {
        console.log('page：', this.page)
    }

}

/** 封装showModal */
function showModal(gmodal, title, content, success, showCancel) {
    let params = {};
    if (typeof content != 'undefined') {
        if (typeof content == 'function') {
            params = { content: title, showCancel, confirm: content, showHeader: false };
        } else {
            params = { title, content, showCancel, confirm: success };
        }
    } else {
        params = { content: title, showCancel, showHeader: false };
    }
    const config = (getApp().ghossModal || {}).config || {};
    params.autoClose = true;
    params.maskClose = false;
    params.theme = config.alertTheme;
    gmodal.show("gmodal.showModal", params);
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