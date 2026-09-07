# 微信读书鼠标滚轮翻页

适用于微信读书网页版阅读页的用户脚本：

- 滚轮向下：下一页
- 滚轮向上：上一页
- 带滚动阈值和 450 ms 防抖，兼容鼠标滚轮与触控板
- 输入文字或打开目录、搜索、设置等浮层时，不接管滚轮

## 安装

1. 浏览器安装 Tampermonkey、Violentmonkey 或 ScriptCat。
2. 打开 [Greasy Fork 脚本页面](https://greasyfork.org/zh-CN/scripts/594703-%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6-%E9%BC%A0%E6%A0%87%E6%BB%9A%E8%BD%AE%E7%BF%BB%E9%A1%B5)，点击“安装此脚本”。
3. 刷新 `https://weread.qq.com/web/reader/*` 阅读页。

也可以新建用户脚本，将 [`weread-wheel-page.user.js`](./weread-wheel-page.user.js) 的全部内容粘贴进去并保存。

若滚轮过于灵敏，可调大脚本顶部的 `WHEEL_THRESHOLD`；若翻页间隔太长，可调小 `COOLDOWN_MS`。
