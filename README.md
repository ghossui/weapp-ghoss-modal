# weapp-ghoss-modal

- 封装了一个微信小程序的模态弹窗自定义组件
- 可自定义弹窗内容
- 可支持button的open-type属性
- 现已可以使用，但尚未完善
- 完善版正在努力开发中，敬请期待！
- 技术文档正在编写，敬请期待！

# 已完成

- [x] 弹出模态对话框
- [x] 使用回调方式获取用户点击的按钮
- [x] 可以更换模态对话框的样式
- [x] 内置默认样式
- [x] 内置微信Android版样式
- [x] 内置微信IOS版样式
- [x] 可隐藏模态框标题
- [x] 可隐藏模态框按钮
- [x] 增加confirm回调
- [x] 增加cancel回调
- [x] 增加complete回调
- [x] 可点击确定按钮获取formId
- [x] 可动态控制按钮字体颜色
- [x] 可动态控制动画效果
- [x] 内置放大缩小动画（zoom-in-out）
- [x] 内置淡入弹出动画（fading-in-out）
- [x] 内置fading-zoom-in-out动画
- [x] 可将content字段的`\n`解析成换行符
- [x] 可弹出input输入框
- [x] 封装gmodal.alert(); 
- [x] 封装gmodal.prompt(); 
- [x] 封装gmodal.confirm();
- [x] 修复wx-ios下的input文本会居中的问题
- [x] 修复应用了主题颜色导致取消按钮变色问题
- [?] 解决当内容长度过多时，无法滚动的问题
- [x] 解决当内容长度过多时，按钮位置会错位的问题
- [x] 增加当不允许输入空值的时候闪烁placeholder
 [x] 支持`Promise`
  - [x] alert()
  - [x] prompt()
  - [x] confirm()
  - [x] show()
  - [x] hide()

# 待完成
- [ ] button属性支持
    - [ ] 支持`open-type="getUserInfo"`获取用户信息，基础库版本1.3.0
    - [ ] 支持`bindgetuserinfo`回调
    - [ ] 支持`lang`属性
    - [ ] 支持`open-type="getPhoneNumber"`获取手机号码，基础库版本1.2.0
    - [ ] 支持`bindgetphonenumber`回调
    - [ ] 支持`open-type="launchApp"`打开app，基础库版本1.9.5
    - [ ] 支持`app-parameter`属性
    - [ ] 支持`open-type="openSetting"`，打开设置，基础库版本2.0.7，采用兼容写法
    - [ ] 支持`bindopensetting`回调
    - [ ] 支持`open-type="contact"`，打开设置，基础库版本1.1.0，仅支持打开客服会话
    - [ ] 支持`bindcontact`回调
    - [ ] 支持`open-type="share"`，打开设置，基础库版本1.2.0
    - [ ] 支持`open-type="feedback"`，打开设置，基础库版本2.1.0
    - [ ] 支持`loading`属性

- [ ] 修复组件内部关闭后，在小程序开发工具的AppData中修改了任意数据会导致重新弹出的问题