# eco-ui组件库

## 背景

- 站点联盟在线广告创意各式各样，需要用到各种JS交互。
- 同时，一个小小的在线广告，不到20k代码量的pc广告依赖压缩后93.5k的jQuery(1.11.1)，10k或以下的移动端广告依赖压缩后9.1k的zeptojs(v1.1.4)，在库依赖上的开销占比太大。压缩这一块的开销很有必要。
- 目前在面对突然来的广告创意需求，我们只是临时的写一段JS交互，费时费力，同时由于测试不充分，很有可能藏了bug，极大的影响我们投放的广告的体验。
- 商户页里要用到的诸多交互，也需要用到积累沉淀出来的交互组件。同时商户页使用jquery/zepto库，这样，我们的这个ui组件库需要完美兼容jquery/zepto，才能保证组件具有通用性。

## 设计目标
### 需求
- 轮播
- 选项卡
- 延迟加载
- JS模版引擎
- 加载更多
- 分页
- 对话框
- 输入框提示
- select组合框
- 气泡提示
- 自动补全
- *自定义滚动条*
- *进度条*
- *日历*
- *拖拽*

其中斜体为远期需求

### 架构
	└── common
	│    ├──public    多端共用
	│    ├──pc    pc端用
	│    └──wap    无线端用
	├── ui
	│    ├──carousel
	│    │   ├──pc    pc端用
	│    │   └──wap   无线端用
	│    ├──tab
	│    │   ├──pc    pc端用
	│    │   └──wap   无线端用
	│    └──...

### Api与Demo
- JS源码里写详细注释，注释符合JSDoc注释规范（见【附录一】）。
- Demo列表页，Demo详情页，详情页里详述组件用法。

## 详细设计
### 通用层(common)

### 业务层(ui)


## 贡献者：
- **章鱼** [zhangzujin@baidu.com](mailto:zhangzujin@baidu.com "发邮件给章鱼")
- **deo** [denglingbo@baidu.com](mailto:denglingbo@baidu.com "发邮件给deo")
- **Jeane** [wangjuan12@baidu.com](mailto:wangjuan12@baidu.com "发邮件给lee.than")
- **Jayce** [chenchao15@baidu.com](mailto:chenchao15@baidu.com "发邮件给lee.than")