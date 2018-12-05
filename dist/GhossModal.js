function getEventRouter(e){return t=>{let o=t.detail.eventType,n=o=>{if(o){let n=e.page[o];"function"==typeof n?n(t.detail.detail):throwRunntimeError(`未找到回调函数 "${o}()" 的定义。`)}};"confirm"===o&&n(t.detail.confirmCaller),"cancel"===o&&n(t.detail.cancelCaller),n(t.detail.completeCaller),!0===t.detail.detail.autoClose&&(delete e.page[t.detail.confirmCaller],delete e.page[t.detail.cancelCaller],delete e.page[t.detail.completeCaller])}}function toggle(e,t,o,n=!1){if(t)if(isPage(e.page)){if(o instanceof Object||(o={}),o.show=n,!1===o.show)o={setData:o.setData};else{let t=t=>{let n=`onGhossModal${t}Event${(new Date).getTime()}`,a=t.toLowerCase();"function"==typeof o[a]&&(e.page[n]=o[a],o[`${a}Caller`]=n)};t("Confirm"),t("Cancel"),t("Complete")}let a=o.setData;delete o.setData,a instanceof Object||(a={}),a[t]=o,e.page.setData(a,o.setDataComplete)}else throwRunntimeError('"page" 参数异常，请检查是否已实例化成功，并且不要更改此参数');else throwRunntimeError('"name" 不能为空')}function showModal(e,t,o,n,a){let l={};l=void 0!==o?"function"==typeof o?{content:t,showCancel:a,confirm:o,showHeader:!1}:{title:t,content:o,showCancel:a,confirm:n}:{content:t,showCancel:a,showHeader:!1};const r=(getApp().ghossModal||{}).config||{};l.autoClose=!0,l.maskClose=!1,l.theme=r.alertTheme,l.animation=r.alertAnimation,e.show("gmodal.showModal",l)}function throwInstantiatingError(e){throwError(e=`An error occurred while instantiating GhostModal: ${e}`)}function throwRunntimeError(e){throwError(e=`An error occurred while running GhostModal: ${e}`)}function throwError(e){console.group(`${new Date} GhossModal 错误`),console.error(e),console.groupEnd()}function isPage(e){return e&&"object"==typeof e&&"function"==typeof e.setData}class GhossModal{constructor(e){isPage(e)?(this.page=e,this.page.onGhossModalEvent=getEventRouter(this)):(this.page=null,throwInstantiatingError("page 参数必须传入页面！"))}alert(e,t,o){showModal(this,e,t,o,!1)}show(e,t){toggle(this,e,t,!0)}hide(e){toggle(this,e,null,!1)}}module.exports=GhossModal;