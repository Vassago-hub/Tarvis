# 赛道一提交说明 - TCL 官网智能服务助手

作品名：TCL 官网智能服务助手

本提交面向“赛道一：智能体（Agent）构建”。项目基于 Page Agent monorepo，实现一个可运行的网站服务智能体，能够识别用户意图、注入 TCL 服务知识、调用网页工具，并在高风险动作前执行确认或阻断。

## 提交物

- 技术文档 PDF：`TCL官网智能服务助手_技术文档.pdf`
- 技术文档 Word：`TCL官网智能服务助手_技术文档.docx`
- 技术文档 Word 更新版：`TCL官网智能服务助手_技术文档_更新版.docx`
- 技术文档源文件：`TECHNICAL_DOCUMENT.md`
- Tarvis 宠物精灵设计文档：`TARVIS_PET_DESIGN.md`
- Tarvis 宠物精灵 Word 文档：`Tarvis宠物精灵设计文档.docx`
- 可运行 Demo 源码：`examples/tcl-official-site/`
- 示例输入输出：`sample-input-output.md`
- 快速启动脚本：`start.bat`
- 打包脚本：`scripts/build-track-one-submission.ps1`

## 快速运行

Windows 推荐使用项目根目录下的快速启动脚本：

```powershell
.\start.bat
```

`start.bat` 会检查 Node.js 和 npm；如果电脑没有预装 Node/npm，会尝试自动下载 Node.js 22.22.1 便携版到 `.node\`，然后安装依赖、启动网站开发服务器，并自动打开项目首页。

如果评审电脑无法访问 `https://nodejs.org`，脚本会停止并给出处理方式：手动安装 Node.js 22.22.1 以上版本，或把包含 `node.exe` 和 `npm.cmd` 的便携 Node.js 文件夹复制为项目根目录 `.node\` 后重新运行。

启动成功后会自动打开项目首页：

```text
http://localhost:5173/page-agent/
```

离线逻辑验证命令：

```powershell
npx vitest run --config examples\tcl-official-site\vitest.config.ts
```

示例问题：

```text
我要报修电视
空调显示 E1 怎么办
我要联系人工客服
找一下商务合作页面
```

## 打包

```powershell
.\scripts\build-track-one-submission.ps1 -CaptainName "队长姓名"
```

输出文件：

```text
submissions\赛道一_TCL官网智能服务助手_队长姓名.zip
```


