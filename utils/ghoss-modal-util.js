
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
            params.show = flag;// 显示或隐藏
            params.uk = `onGhossModalEvent_${new Date().getTime()}`   // "a666";// 生成文件名
            this.page[params.uk] = params.confirm;
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