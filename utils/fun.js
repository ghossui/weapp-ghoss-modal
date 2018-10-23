
/** GhossModal */
module.exports = class GhossModal {

    constructor(page) {
        if (isPage(page)) {
            this.page = page;
            // 初始化GhossModal事件路由器
            page["onGhossModalEvent"] = ((event) => {
                let ghossModalEvent = page[event.detail.uk];
                if (typeof ghossModalEvent === 'function') {
                    ghossModalEvent(event);
                    delete page[event.detail.uk];// 执行完成后移除该方法
                } else throwRunntimeError(`未找到方法 "${event.detail.uk}()" 的定义。`);
            });
        } else {
            this.page = null;
            throwInstantiatingError("page 参数必须传入页面！");
        }
    }

    /**
     * 显示show
     * @param data 附带的data，调用setData给page
     * @param params 组件的参数
     */
    show(name, data, params, callback) { this.toggle(name, data, params, true, callback) }

    hide(name, data, callback) { this.toggle(name, data, null, false, callback) }

    toggle(name, data, params, show, callback) {
        if (isPage(this.page)) {
            if (show === false) params = getObjectValue(this.page.data, name);
            if (typeof params !== "object") params = {};
            params.show = show;
            params.uk = `onGhossModalEvent_${new Date().getTime()}`   // "a666";// 生成文件名
            this.page[params.uk] = params.confirm;
            if (!(data instanceof Object)) data = {};
            data[name] = params;
            this.page.setData(data, callback)
        } else throwRunntimeError(`page 参数异常，请检查是否已实例化成功，并且不要更改此参数。`);
    }

    getPage() {
        console.log('page：', this.page)
    }

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