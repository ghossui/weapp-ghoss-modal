function testCallback(page, success) {
    if (page) {
        let tap = "testFun";
        page.setData({
            "button.show": true,
            "button.tap": tap,
        })
        page[tap] = function () {
            // wx.showModal({})
            if (typeof success === 'function') success();
        }
    }
}


/** custom modal，自定义模态框 */
const ghossModal = {
    init(page) {
        if (page) page["onGhossModalEvent"] = function (event) {
            // console.log(event);
            page[event.detail.uk](event);

        }
    },
    /**
     * 显示show
     * @param data 附带的data，调用setData给page
     * @param params 组件的参数
     */
    show(page, name, data, params, callback) { this.toggle(page, name, data, params, true, callback) },
    hide(page, name, data, callback) { this.toggle(page, name, data, null, false, callback) },
    toggle(page, name, data, params, show, callback) {
        if (show === false) params = getObjectValue(page.data, name);
        if (typeof params !== "object") params = {};
        params.show = show;
        params.uk = "a666";
        page[params.uk] = params.confirm;
        if (!(data instanceof Object)) data = {};
        data[name] = params;
        page.setData(data, callback)
    },
}

/**
 *  获取对象的值，并且处理 key 中带"."的情况
 * @param {object} obj 
 * @param {string} key 
 */
function getObjectValue(obj, key) {
    if (typeof obj !== 'object' || typeof key !== 'string') return null;
    var keys = key.split(".");
    if (keys.length > 1) {
        let temp = obj[keys[0]];
        for (let i = 1; i < keys.length; i++) {
            temp = temp[keys[i]];
        }
        return temp;
    } else {
        return obj[key];
    }
}


module.exports = ghossModal;