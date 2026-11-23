# Marinara Engine 入门

Marinara Engine 是一个用来和 AI 角色聊天、玩角色扮演的应用。它跑在你自己的电脑上。本指南介绍主页，以及开始第一次聊天的步骤。

## 开始第一次聊天

开始之前：你需要一个 AI 服务发的 API 密钥（一串秘密字符，作用类似密码），或者使用下文介绍的 **Built-in model**(内置模型)。

1. 安装 Marinara Engine，然后在浏览器里打开它。到 [Marinara Engine 安装](../INSTALLATION.md)里选择你的平台。
2. 添加一个连接：某个 AI 服务的一个 API 密钥，或者 **Built-in model**。见[连接 AI 服务商](../connections/connecting-to-a-provider.md)。
3. 挑选这个连接要用的模型。同一篇指南里有操作方法。
4. 创建或导入一个角色。打开 **Library → Characters**(资料库 → 角色)（点击右上角的 **Library**(资料库)），然后点击 **New character**(新建角色)，或者点击 **Import**(导入) 从文件导入一张角色卡。见[创建和编辑角色](../characters/creating-and-editing-characters.md)。
5. 点击主页上的 **Conversation**(对话模式)、**Roleplay**(角色扮演) 或 **Game**(游戏模式)。也可以打开聊天列表：点击右上角的 **Library**，在侧边栏顶部选择 **Chats**(聊天)，选中 **Convo**、**Roleplay** 或 **Game** 选项卡，再点击 **New**(新建)。
6. 设置页面会在新标签页中打开。选择角色和 **Content**(内容) 选项，再点击 **Start roleplay**(开始角色扮演)（Conversation 则点击 **Start chatting**(开始聊天)，Game 则点击 **Create world**(创建世界)）。

你会看到：新聊天打开，你可以写第一条消息了。

如果还没有连接，Marinara 会先打开添加连接的窗口。

Marinara 不自带在线 AI。多数人会连到在线服务。你也可以下载 **Built-in model**，这是一个在你电脑上运行、不需要 API 密钥的小模型。它适合做轻量的辅助工作，不适合当主力聊天模型。见[内置模型设置](../connections/local-model.md)。

第一次打开 Marinara 时，会开始一段简短的引导。见[首次使用的引导教程](tutorial.md)。哪一步卡住了？问问内置助手 Professor Mari：[Professor Mari，你的应用内助手](professor-mari.md)。

## 熟悉界面

Marinara 有两个固定区域，无论使用什么主题，它们的位置都不变：

- **顶栏。**左侧是 **Home**(主页)，以及每个已打开的聊天、角色或页面的标签页。右侧的搜索按钮（或 <kbd>Ctrl</kbd>+<kbd>K</kbd>，Mac 上是 <kbd>⌘</kbd>+<kbd>K</kbd>）可以查找或打开各种内容：聊天、角色、设置、指南，或向 Professor Mari 提问。旁边是打开聊天时显示的 **Chat settings**(聊天设置)、用于查看这些指南的 **Docs**(文档)，以及显示或隐藏侧边栏的 **Library**。
- 右侧的**侧边栏**，顶部有 **Chats | Library**(聊天 | 资料库) 切换按钮。**Chats** 在 **Convo**、**Roleplay** 和 **Game** 选项卡下列出聊天（见[管理聊天列表](../chats/managing-chats.md)）。**Library** 列出 **Characters**(角色)、**Personas**(用户角色)、**Lorebooks**(世界书)、**Presets**(预设)、**Regex scripts**(正则脚本)、**Connections**(连接)、**Agents**(智能体) 和 **Custom tools**(自定义工具)，后面是 **Settings**(设置) 和 **Extensions**(扩展)。选择一项，就会在中间打开对应页面。

在电脑上，还能并排显示两个页面。见[分屏视图](tabs-and-drafts.md#split-view-two-pages-at-once)。

在手机或平板上，**Home** 在左上角，**Library**（堆叠按钮）在右上角。Library 会让侧边栏滑入并覆盖页面，同样带有 **Chats | Library** 切换按钮；资料库视图底部有 **Settings**、**Docs** 和 **All Tabs**(所有标签页)。点击顶栏里的标题可以搜索，点击数字按钮可以查看已打开的标签页。见[标签页、分屏视图和未保存的改动](tabs-and-drafts.md)和[触屏手势](../chats/messages.md#touch-gestures)。

## 主页一览

没有打开任何聊天时，显示的就是主页。顶部有问候语、版本号，以及 **Conversation**、**Roleplay** 和 **Game**，分别以对应模式新建一个聊天。还没设置模型时，**Connect a model to start chatting**(连接模型以开始聊天) 会打开连接页面。**Professor**(教授) 会在自己的标签页里打开 Professor Mari，已安装的应用（比如 Story Writer）也会在这里添加按钮，**Widgets**(小组件) 则用来排列下方的卡片。

在经典布局中（在 **Settings → Appearance → Theme → New layout**(设置 → 外观 → 主题 → 新布局) 下关闭新布局），主页看起来像网页浏览器，有标签页、搜索栏，以及 **Discord**、**Support**(支持)、**Credits**(致谢)、**Documentation**(文档)、**Tutorial**(教程)、**FAQ**(常见问题)、**Achievements**(成就) 和 **Widgets** 书签。

## 选择聊天模式

新建聊天时选择一种模式。

- **Conversation**：普通的 AI 聊天，界面像即时通讯软件。见 [Conversation 模式：入门](../conversation/getting-started.md)。
- **Roleplay**：和一个或多个角色一起展开的故事。应用会追踪场景，比如地点和时间。见 [Roleplay 模式：入门](../roleplay/getting-started.md)。
- **Game**：单人游戏。AI 担任讲故事的游戏主持人（Game Master）。你会有一队同伴（队伍）、掷骰、地图和任务。见 [Game Mode：入门](../game/getting-started.md)。

## 主页小组件

小组件是可以显示、隐藏和移动的小卡片。

1. 点击主页上的 **Widgets**。**Home Widgets**(主页小组件) 窗口随即打开。它把小组件分别列在 **Built-in**(内置)、**Agents**(智能体) 和 **Personal**(个人) 下。
2. 点击小组件旁边的眼睛按钮即可显示或隐藏它。重新显示的小组件会放到主页上第一个空位。
3. 要移动小组件，拖动它右上角的手柄。在电脑上，指针移到小组件上时手柄才会出现。

你的布局保存在这个浏览器里。个人小组件还有编辑和删除按钮。在经典布局中，窗口底部的 **Browser chrome**(浏览器外框) 有一个开关：**Show URL bar**(显示地址栏) 用来在电脑上显示或隐藏主页的搜索栏。

你可以请 Professor Mari 为你做一个个人小组件。已安装的智能体也能添加小组件。

## 参考：内置小组件

| 小组件 | 作用 | 初始是否显示 |
| --- | --- | --- |
| **Professor Mari** | **Ask Professor Mari**(问问 Professor Mari) 会打开她的聊天。 | 是 |
| **Recent chats**(最近聊天) | 你最近的聊天。点击某个聊天即可重新打开。为空时显示 **Your chats will show here**(你的聊天会显示在这里)。 | 是 |
| **Things to try**(试试这些) | 接下来可以尝试的三个小任务，每个介绍一项功能。全部试过或关闭提示后，改为显示 **Documentation**、**Replay tutorial**(重看教程) 和 **Read FAQ**(查看常见问题)。见[试试这些](#things-to-try)。 | 是 |
| **What's New**(新功能) | **See what's new**(查看新功能) 和 **Read release notes**(查看发行说明)。 | 是 |
| **Community**(社区) | 链接到 **Discord**、**Support** 和 **Credits**。 | 是 |
| **Character Library**(角色库) | 每天从你的角色里挑选一批新的展示。 | 否 |
| **Discovery desk**(发现台) | 你还没安装的智能体。**Browse agents**(浏览智能体) 会打开目录。 | 否 |
| **Character of the Day**(今日角色) | 从你的角色库里选出的一个角色，带有 **Start a chat**(开始聊天) 和 **View character**(查看角色)。 | 否 |
| **Clock & calendar**(时钟与日历) | 今天的日期和时间。 | 否 |
| **Achievements** | 你最近获得的成就和最接近完成的成就。需要开启成就设置。 | 否 |

## 试试这些

**Things to try** 小组件会推荐接下来可以尝试的三项功能。任务前后衔接：先把图库图片变成贴纸，再把贴纸发到聊天里。

- 点击任务，打开应用中对应的位置。没有对应位置的任务会打开指南。
- 点击勾号标记完成，或点击叉号跳过。跳过的任务不会再出现。
- 大多数任务会在 Marinara 检测到完成时自动勾选，例如已有对应模式的聊天，或已经设置贴纸标签。其余任务手动勾选。
- **See all**(查看全部) 按路线列出所有任务，并提供 **Show me**(带我看看)。前置任务完成后，才会显示路线中的后续任务。**Only in this layout**(仅限此布局) 下的路线介绍新布局的功能。
- 完成一条路线，即可解锁对应的 **Explorer**(探索者) 成就。

小组件遵循 **Settings > General > Confirmations & Help**(设置 > 常规 > 确认与帮助) 中的 **Feature tips**(功能提示) 设置。关闭提示时，显示指南链接。进度保存在这个浏览器里。

### AI 入门与深入探索

**See all**(查看全部) 里还有两个选项卡：

- **AI basics**(AI 入门)：给刚接触 AI 的人准备的简短导览。介绍什么是模型、Marinara 使用的模型类型、Token 与上下文，还可以帮你设置一个模型（这一步可以跳过）。最后一站是认识 Professor Mari。欢迎教程结束后，会用一个小窗口邀请你体验，只出现一次。见 [AI 入门](ai-basics.md)。
- **Deep dives**(深入探索)：介绍不容易选对的设置，以及很少有人发现的功能，比如角色卡 Creator's Notes(作者备注) 里的 CSS。最常用的分组会排在前面。

每一项都会打开指南中相关的段落并高亮显示，下方的卡片会用通俗的话解释。点击 **Got it**(知道了) 即可勾选完成；在 AI 入门中，还会打开下一站。完成 Core(核心入门) 路线后，小组件的最后一行会推荐一项深入探索。完成 AI 入门或一组深入探索，会解锁一项 **Explorer**(探索者) 成就；完成全部深入探索，还会再解锁一项。邀请窗口也受 **Feature tips**(功能提示) 开关控制。

## 到哪里求助

- 在主页上问 Professor Mari。
- 打开 **Things to try** 小组件里的 **See all**，再打开 **Read FAQ**，查看速查答案。
- 点击顶栏里的 **Docs**，阅读应用内指南。
- 点击 **Community**(社区) 小组件里的 **Discord** 进入社区，或者点击 **Support** 支持这个项目。

如果哪里坏了，见 [Marinara Engine 故障排查](../TROUBLESHOOTING.md)。

## 相关指南

- [Marinara Engine 安装](../INSTALLATION.md)
- [连接 AI 服务商](../connections/connecting-to-a-provider.md)
- [创建和编辑角色](../characters/creating-and-editing-characters.md)
- [首次使用的引导教程](tutorial.md)
- [标签页、分屏视图和未保存的改动](tabs-and-drafts.md)
- [Professor Mari，你的应用内助手](professor-mari.md)
