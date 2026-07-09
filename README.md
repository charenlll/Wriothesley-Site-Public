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

## 图片优化

页面图片均使用 WebP 格式以加快加载速度。原始 PNG 转换为 WebP 后，总大小从 **12.6MB 降至 1.5MB（88% 压缩率）**。

如果新增或替换了图片，运行以下命令转换格式：

```bash
python3 scripts/convert-to-webp.py
```

该脚本会扫描 `assets/` 下所有 PNG，在同目录生成 `.webp` 文件，原始 PNG 保持不变。

## 真实截图

把应用截图按下面文件名放入 `assets/screens/`，运行 `pnpm convert`（或手动复制）将 PNG 转换为 WebP，页面会自动显示真实界面：

- `panel-chat.png` → `panel-chat.webp`
- `panel-plan.png` → `panel-plan.webp`
- `panel-notes.png` → `panel-notes.webp`
- `panel-wardrobe.png` → `panel-wardrobe.webp`
- `panel-settings.png` → `panel-settings.webp`
