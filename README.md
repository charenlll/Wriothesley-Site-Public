# Wriothesley-Site-Public

Wriothesley 桌面助手的公开展示页，用于介绍功能并承载下载入口。

## 下载

百度网盘：

https://pan.baidu.com/s/1FELWJmEQ4jOv8RFaThRJ6A

macOS 首次打开如果提示无法验证开发者，可将 App 放入“应用程序”后在终端执行：

```bash
sudo xattr -r -d com.apple.quarantine /Applications/Wriothesley.app
```

如果仍提示无法验证，可以右键应用图标选择“打开”。

## 本地预览

直接打开 `index.html` 即可预览。下载按钮链接在 `script.js` 的 `downloadConfig` 中配置。

## 真实截图

把应用截图按下面文件名放入 `assets/screens/`，页面会自动显示真实界面：

- `panel-chat.png`
- `panel-plan.png`
- `panel-notes.png`
- `panel-wardrobe.png`
- `panel-settings.png`
