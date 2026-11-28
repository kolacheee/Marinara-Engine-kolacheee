# 自定义 CSS 主题

主题会改变 Marinara 的整体外观：颜色、字体、图片和面板形状。Marinara 的主题图库里有现成的入门主题可供下载。也可以导入别人分享的主题，或自己制作。

不使用主题也想快速换个样子，见[外观设置](appearance-settings.md)或[现成的聊天窗口样式](#ready-made-chat-window-styles)。想自己制作主题，[主题创作指南](theme-author-guide.md)会一步步带你完成。

## 什么是自定义主题

主题由一段 CSS 以及附带的图片和字体组成；CSS 是网页用来设置颜色、字体和间距的代码。主题保存在 Marinara 服务器上，因此安装后，连接这台服务器的每台设备都能看到。同一时间只能启用一个主题，主题想存多少个都可以。

## 在哪里找到主题

打开 **Library → Settings → Appearance**(资料库 → 设置 → 外观)，点击区块导航栏里的 **CSS Themes**(CSS 主题)。经典布局中的路径是 **Settings → Addons → Theme Library**(设置 → 附加组件 → 主题库)。

这个区块包含：

- 顶部的 **Create Theme**(新建主题) 和 **Import File**(导入文件)。
- **Allow themes with HTML (I accept the risk)**(允许含 HTML 的主题（我接受风险）)，默认关闭。见[含 HTML 的主题](#themes-with-html)。
- **Installed Themes**(已安装主题)：先是 **Default Theme**(默认主题)，接着是自己的主题，最后是下载的入门主题。
- **Browse the theme gallery**(浏览主题图库)：可供下载的入门主题。

## 入门主题

入门主题不随应用一起安装，需要时再下载，不会提前占用空间。它们放在主题图库里，Marinara 只会下载你选中的主题。

1. 点击 **Installed Themes** 下方的 **Browse the theme gallery**。这一步需要 Marinara 能连接互联网。
2. 每个主题都会显示预览、简短说明、大小和标签。
3. 点击喜欢的主题旁边的 **Download**(下载)。下载后，它们会出现在 **Installed Themes** 的 **Starter themes**(入门主题) 下，可以直接启用。

| 主题 | 外观 |
| --- | --- |
| **Apogee Lounge** | 1970 年代太空客轮的观景休息室，窗外是气态巨行星，消息显示在模压面板上。 |
| **Crepuscular** | 一本夜海年鉴：戴兜帽的身影在悬崖上、在一轮守望的月亮下守夜（其实他们在吃松饼），消息沿着一栏带格线的账簿往下排列。 |
| **Dewglass** | 2000 年代的亮面玻璃风格：消息像凝胶水滴，背景是阳光下的潟湖或极光夜空。 |
| **Granite Watch** | 山体中的冷战指挥所：回复像电传打字机打印出的纸张，组件挂在写字夹板上。 |
| **Gutterlight** | 犯罪漫画风格的雨中哥特城市，配有墨线分格和说明文字框。 |
| **Lantern Meadow** | 安静、易读，没有动态效果。 |
| **Lantern Path** | 带柔和动态效果的阅读栏。 |
| **Maple's Bramble Cottage** | 温馨的小屋，配有适合长回复的阅读栏。 |
| **MARI to the Moon** | 一台交易终端：每条回复都是一张委托单，顶栏滚动着行情跑马灯，聊天列表就是自选股列表。 |
| **NEON//GRID** | 霓虹赛博朋克风格，适合长回复。 |
| **Petal OS** | 活泼的复古桌面，使用像素字体。 |
| **Quiet Iris** | 一个沉静的飞船智能：哑光石墨仪表、一只红琥珀色镜头，每个聊天都停靠在同一条发光的脊柱上。 |
| **Rosalind's Folio** | 带视觉小说元素的故事书布局。 |
| **Sanguine Keep** | 一座月光下的哥特城堡：夜晚是深红天鹅绒与鎏金，白天是浅色大理石，肖像嵌在尖拱窗中，消息显示在圣髑盒面板上。 |
| **Swiss Poster** | 安静、简洁的海报设计，没有动态效果。 |
| **Under Sail** | 航行在海上的帆船甲板：每条消息都是悬挂在木桁上的一面帆布船帆。 |
| **Velvet Casket** | 白天是粉彩哥特风，夜晚是传统哥特风，消息框呈棺材形。 |

每个入门主题都有深色和浅色版本。名称下的小标签，例如 **No motion**(无动态效果) 或 **High legibility**(易读)，可以帮助了解主题特点。

已下载的主题在图库中有新版本时，图库列表会显示 **Update**(更新)。点击即可获取新版本。

下载的入门主题是只读的，因此始终保持原作者的设计。每个主题都有四个按钮：

- **(i) Credits and licences**(鸣谢与许可证)：查看美术和字体的作者，以及允许怎样复用。
- **Clone + Edit**(复制并编辑)（复制图标）：创建自己的副本，例如“Petal OS（我的副本）”，并在编辑器中打开。
- **Export**(导出)（上传图标）：把主题保存为文件。
- **Remove**(移除)（垃圾桶图标）：从当前安装中移除主题。之后随时可以从图库重新下载。

不用应用也能获取主题文件：它们位于 GitHub 主题图库的 `themes` 文件夹中（[kolacheee-themes 分支](https://github.com/kolacheee/Marinara-Engine-kolacheee/tree/kolacheee-themes/themes)）。下载其中的 `.json` 文件，再使用 **Import File** 导入。

## 启用主题

1. 点击 **Installed Themes** 中的主题名称。主题会在当前浏览器标签页中启用。
2. 一条提示栏会询问 **Keep this theme?**(要保留此主题吗？)，并从 15 秒开始倒计时。把鼠标移到提示栏上会暂停倒计时。
3. 点击 **Keep theme**(保留主题) 即可保留，其他设备也会显示这个主题。点击 **Go back**(返回)，或等倒计时结束，就会恢复之前的外观。

点击 **Default Theme** 可以关闭自定义主题。**Settings → Appearance → Theme**(设置 → 外观 → 主题) 顶部的 **Reset Appearance**(重置外观) 也会关闭主题。

如果只想在一台设备上使用不同的主题，先在 **Settings → Appearance → Theme** 中把 **Look on this device**(本设备外观) 设为 **Only this device**(仅此设备)。

### 恢复正常外观

如果主题让 Marinara 难以使用，以下任一种方法都能在当前标签页中关闭它：

- 按三次 <kbd>Esc</kbd>。
- 在浏览器地址末尾加上 `?safe`。
- 按 <kbd>Ctrl</kbd>+<kbd>K</kbd>，输入“自定义主题”。

Marinara 还会保护顶栏、侧边栏、<kbd>Ctrl</kbd>+<kbd>K</kbd> 和消息输入框。主题可以改变它们的样式，但如果隐藏、移动或遮盖了其中任何一个，Marinara 就会在当前标签页中关闭主题，并说明原因。

## 导入主题

1. 点击 **Import File**。
2. 选择一个 `.json` 或 `.css` 主题文件。
3. 预览会显示主题的名称、作者、版本、图片、大小，以及鸣谢和许可证。还会列出安装前需要了解的事项，例如动态图片、主题添加的文字或无法生效的部分。
4. 选择要一并导入的内容。预览会提供主题建议的设置，例如配色方案、强调色和字体，其中大部分默认勾选。也可以把主题的背景添加到聊天背景图库。
5. 点击 **Install and try it**(安装并试用) 可立即切换到该主题，或点击 **Install**(安装) 将它添加到列表。

如果已经有同名主题，预览会让你选择更新它或 **Keep both**(两者都保留)。试用主题后选择返回时，Marinara 也会恢复该主题改动过的设置。

如果主题写入索要密码或密钥的文字，或冒充 Marinara，就无法安装。绝不要因为主题的要求而输入密钥或密码。

### 含 HTML 的主题

有些主题会为每条消息添加一个小 HTML 框，称为消息模板。Marinara 会移除其中的脚本、链接、图片和表单，但别人编写的 HTML 仍可能误导你。只有开启 **Allow themes with HTML (I accept the risk)** 时才能安装这些主题。关闭此开关后，已安装的主题也不会显示其中的 HTML。

## 创建主题

点击 **Create Theme**，或点击某个入门主题上的 **Clone + Edit**，从已有的好看设计开始。编辑器包含名称输入框、大 CSS 文本框、**Preview**(预览) 和 **Save**(保存)。新主题保存后会启用，并询问 **Keep this theme?**

[主题创作指南](theme-author-guide.md#your-first-theme-step-by-step)会一步步带你制作第一个主题。

### 和 Professor Mari 一起制作主题

不必自己写 CSS。直接用日常语言向 Professor Mari 提出要求，例如“给我做一个温馨的秋日主题，要能在手机上用”或“我的 Harbor 主题有什么问题？”。她有一本设计和审查主题的手册，会按手册来做：

1. **先和你确定想法。** 她会询问想要的氛围、浅色还是深色（或两者都要）、使用的设备，以及是否需要图片和天气，再用一句话概括一种外观，例如“海景背景上的磨砂玻璃胶囊”。
2. **制作后先保持关闭。** 她会告诉你在哪里试用：在 **CSS Themes** 中选中它，并在 15 秒内点击 **Keep theme**。如果让她直接启用，当前标签页同样会询问 **Keep this theme?**，没人回应就会恢复原样。
3. **请你查看效果。** Mari 看不到你的屏幕，因此会指出浅色和深色模式下具体要检查哪些位置，并请你提供显示不对的地方的截图。如果 Marinara 关闭了主题，把提示消息告诉她：消息会说明原因，她会据此修复。
4. **她可以制作主题图片。** 在 Connections(连接) 中设置好图像模型后，她就能制作背景、边框和图标。每张图片都会先展示给你，得到同意后才保存到主题中。她也能给主题中绘制的装饰边框（SVG 图片）重新配色。见[让 Professor Mari 制作美术素材](theme-author-guide.md#ask-professor-mari-to-make-the-art)。

审查主题时，她会逐个界面列出不协调的地方（混杂的圆角形状、阴影、难以看清的标签），等你指定要修哪些，再动手修改。

Mari 只会修改你自己的主题。入门主题是只读的，先点击 **Clone + Edit**，再让她修改副本。字体、鸣谢和缩略图需要你在 **Pictures and sharing details**(图片和分享详情（作者、版本、缩略图、字体）) 中添加。

## 编辑、导出和移除自己的主题

自己的主题每行有三个按钮：

- **Edit theme CSS**(编辑主题 CSS)（代码图标）打开编辑器。编辑不会改变当前启用的是哪个主题。
- **Export**（上传图标）下载一个 `.json` 文件，可以分享或在别处导入。
- **Remove**（垃圾桶图标）在确认后删除主题。这个操作无法撤销，如果以后可能还要用，先导出一份。

## 为单个聊天设置主题

聊天可以使用自己的主题：

1. 打开聊天，再打开 **Chat Settings**(聊天设置)。
2. 在 **Theme**(主题) 中选择主题。**Follow the app**(跟随应用) 使用应用主题，**Default look (no custom theme)**(默认外观（无自定义主题）) 则为这个聊天关闭主题。
3. 在只有一个角色的聊天中，勾选 **Use it for every chat with this character**(用于此角色的所有聊天)，即可把它设为该角色的主题。

设置和资料库始终使用应用主题。

## 谁可以修改主题

在运行 Marinara 的电脑上不需要密钥。从另一台设备（例如手机）创建、导入、复制、编辑或移除主题时，需要管理员密钥。在 **Settings → Advanced → Security**(设置 → 高级 → 安全) 中输入即可。选择已经安装的主题不需要密钥。见[管理员密钥](../REMOTE_ACCESS.md#the-admin-secret-and-privileged-actions)。

## 现成的聊天窗口样式

开始之前：这不需要写 CSS。

1. 打开 **Settings → Appearance → Chat Buttons & Windows**(设置 → 外观 → 聊天按钮与窗口)。
2. 在 **Chat widget style**(聊天组件样式) 下选择一个样式。

| 样式 | 外观 |
| --- | --- |
| **Default**(默认) | 原本的外观。 |
| **Dottore** | 冰蓝色的仪器边框、浅金属色边缘和切角。 |
| **Prof. Mari** | 镶金边的故事书式边框与宝石蓝，窗口标题带原石装饰。按钮与窗口使用相同背景。 |

每个样式都有自己的字体，适应浅色和深色模式，并同时改变按钮、窗口和可展开区域的样式。选择样式会重置 **Font**(字体)、**Shape**(形状) 和三种颜色。窗口位置保持不变。

以下几项可以单独更改：

- **Font** 和 **Shape** 会跟随样式（**Preset font**(预设字体)、**Preset shape**(预设形状)），直到你另选其他字体或形状。
- **Border & Buttons Color**(边框与按钮颜色) 改变边框和按钮图标。图标使用渐变的第一个颜色。
- **Background Color**(背景色) 填充按钮、窗口、可展开区域和可编辑字段的背景。
- **Text Color**(文字颜色) 改变组件文字。标题和标签可以显示渐变，可编辑字段则使用第一个颜色。

每种颜色都有一个用于纯色的颜色选择器，以及一个渐变选项。控件旁的 **Reset color**(重置颜色) 会让它重新跟随样式的浅色或深色配色。装饰徽记保持原有颜色。

### 把样式延伸到聊天中

颜色选择器下方的三个开关可以把样式延伸到更多地方。每个开关初始都是关闭的，且独立生效。关闭某个开关，就会恢复聊天对应部分原本的样式；选择其他样式不会改变开关状态。

| 开关 | 应用的内容 |
| --- | --- |
| **Apply preset font**(应用预设字体) | 组件字体，用于消息、输入框和聊天控件。 |
| **Apply preset shape**(应用预设形状) | 边框形状，用于 Roleplay(角色扮演) 消息（经典布局和视觉小说布局）、Game 对话框、输入框和控件。Conversation 消息保留自己的形状。 |
| **Apply preset colors**(应用预设颜色) | 这些区域的边框、背景和文字颜色，也包括 Conversation 消息。自定义颜色和渐变同样适用。引号内的对白仍保留每个角色或用户角色自己的 Dialogue Highlight Color。由 HTML 构成的消息，例如智能体生成的样式卡片，会保留它自己设置的文字颜色。 |

历史按钮（**Load More**(加载更多)、**Show older**(显示更早内容)）和其他聊天控件一样遵循这些开关。在 Game Mode(游戏模式) 中，这些开关还作用于补充发言、HUD 组件、地图面板、人物卡、日志、物品栏、战斗面板和弹窗。也可以让 Professor Mari 为这些区域创建自定义主题。

自定义主题仍可覆盖这些样式。[设置聊天窗口和抽屉的样式](#styling-chat-windows-and-drawers)中的窗口和抽屉变量优先于样式自带的颜色。用 `--mari-window-font-family` 设置窗口字体，`--mari-drawer-radius` 设置区域圆角，`--mari-window-ornament: none` 隐藏标题装饰。想去掉所有样式装饰，先选择 **Default**。

## 致主题作者

本指南余下部分供手写主题 CSS 的人参考。先读[主题创作指南](theme-author-guide.md)，其中列出了所有稳定的 Token、部件钩子和安全规则。

## 主题与 Card CSS

Marinara 有两种添加自定义 CSS 的方式，两者可以同时生效。

- 自定义主题作用于整个应用。它可以覆盖 Marinara 的核心变量，可以用 `!important`，也可以用 `position: fixed`。
- Card CSS 嵌在角色卡或用户角色卡里，按聊天单独开启。它的清理严格得多：不能覆盖核心变量，`!important` 会被剥掉，`position: fixed` 会被改成 `position: absolute`。它只作用于聊天消息，不作用于整个应用。详见[角色卡 CSS 主题指南](card-css-theming.md)。

## 大小和名称限制

主题名最长 200 个字符。CSS 最大 256 KiB，按 UTF-8 字节计算。超过这个大小的主题在保存或导入时会被拒绝。自定义主题的 CSS 在生效前还会先经过清理：从其他网站加载文件的样式不会生效。图片或字体请改为嵌成 `data:` URI。

## CSS 变量参考

主题编辑器里有一个可折叠的 **CSS Variable Reference**(CSS 变量参考)，点开就能看到最常用的可覆盖变量。主题正是通过在 `:root` 块里设置这些变量来改变应用外观的。参考里列出的变量如下：

| 变量 | 控制的内容 |
| --- | --- |
| `--background` | 页面背景 |
| `--foreground` | 正文文字 |
| `--primary` | 强调色和按钮 |
| `--primary-foreground` | 强调色上的文字 |
| `--secondary` | 卡片和输入框 |
| `--card` | 卡片背景 |
| `--border` | 边框 |
| `--muted-foreground` | 淡化的文字 |
| `--sidebar` | 侧边栏背景 |
| `--sidebar-border` | 侧边栏边框 |
| `--marinara-shell-edge-border` | 左右两侧的外框边缘 |
| `--destructive` | 报错和删除 |
| `--popover` | 下拉菜单背景 |
| `--accent` | 悬停高亮 |

Marinara 用到的任何 CSS 变量，主题都可以设置，不限于这些。有些效果有专属变量。比如 `--marinara-theme-accent-pulse: enabled` 会请求强调色脉冲动画。

## 设置聊天窗口和抽屉的样式

电脑上的 **Chat Settings**(聊天设置) 是可移动窗口，其中的可折叠区域叫 **drawers**(抽屉)。抽屉可以弹出为独立窗口，再最小化为可移动的小按钮，叫作 **bubble**(气泡)。

其他聊天工具也使用这些窗口和按钮，包括 Game controls、Session、Volume、Game Assets、连接的聊天和资源包控件。手机上，大多数窗口会显示为全宽面板；Echo Chamber 保持为可以移动和调整大小的小窗口。从 Chat Settings 移出的工具会汇总到可移动的三点 **Chat tools**(聊天工具) 菜单中，追踪器按钮仍单独显示。

下面的类名、数据属性和变量可以统一设置这些部分的外观。主题规则无需 `!important` 就能覆盖默认样式。

### 类名

| 部分 | 类名 |
| --- | --- |
| 窗口 | `.mari-window` |
| 标题栏 | `.mari-window__header` |
| 标题及其图标 | `.mari-window__title-row` |
| 标题 | `.mari-window__title` |
| 标题栏按钮（Reset View、收藏布局星标、Tracker Panel、固定、锁定、关闭、Put back） | `.mari-window__controls`(每个按钮是 `.mari-window__control`) |
| 窗口内容 | `.mari-window__body` |
| 调整大小的边缘和角落 | `.mari-window__resize-handle` |
| 鼠标或焦点位于窗口内时显示的角标 | `.mari-window__resize-grip` |
| 抽屉 | `.mari-drawer` |
| 抽屉标题栏和标题 | `.mari-drawer__header`, `.mari-drawer__title` |
| 抽屉图标、数量徽标和 **?** | `.mari-drawer__icon`, `.mari-drawer__count`, `.mari-drawer__help` |
| 收起的抽屉预览（追踪器的小组件） | `.mari-drawer__summary` |
| 抽屉箭头旁的按钮和弹出按钮 | `.mari-drawer__actions`, `.mari-drawer__popout` |
| 抽屉箭头和内容 | `.mari-drawer__arrow`, `.mari-drawer__body` |
| 抽屉向外拖动时跟随鼠标的预览 | `.mari-drawer-ghost` |
| 最小化窗口的按钮（气泡） | `.mari-window-bubble` |
| 气泡代替图标显示的实时摘要（World State 的横幅） | `.mari-window-bubble__banner` |
| 拖动气泡与另一个气泡对齐时出现的线 | `.mari-window-snap-guide` |
| 智能体运行时的小圆点（Chat Settings 按钮、Trackers 窗口） | `.mari-agents-running-dot` |

### 数据属性

- `data-window` 标识窗口及其气泡：`chat-settings`、`trackers`，控制窗口 `control:game`、`control:session`、`control:volume`、`control:assets`、`control:connected-chat`、`control:package:<package>` 和 `control:beholder:<package>`，以及弹出抽屉的 `drawer:<window>:<drawer>`，比如 `drawer:chat-settings:chat-name`。
- `data-drawer` 标识抽屉，比如 `chat-name`。有些名称以聊天模式开头，比如 `roleplay-agents` 或 `conversation-agents`。追踪器使用 `tracker-world`、`tracker-persona`、`tracker-characters`、`tracker-quests`、`tracker-inventory`、`tracker-custom` 和 `agent-activity`。
- `data-presentation` 在电脑窗口上是 `"window"`，在手机面板上是 `"sheet"`。
- 窗口固定或锁定时，`data-pinned` 和 `data-locked` 为 `"true"`。
- `data-window-control` 标识每个标题栏按钮：`"pin"`、`"lock"`、`"close"` 或 `"put-back"`。处于按下状态的固定或锁定按钮还带有 `aria-pressed="true"`。
- `data-chat-settings-control` 标识 Chat Settings 的额外标题栏按钮：`"reset-view"`、`"favorite-layout"` 和 `"tracker-panel"`。当前布局与收藏一致时，星标带有 `aria-pressed="true"`，图标会填满。
- 每个调整手柄的 `data-edge` 为 `"n"`、`"s"`、`"e"`、`"w"`、`"ne"`、`"nw"`、`"se"` 或 `"sw"`。
- 已展开抽屉在 `.mari-drawer__header` 内的开关按钮带有 `aria-expanded="true"`。
- `data-drawer-control="pop-out"` 标记抽屉的弹出按钮。
- `data-outside="true"` 标记已经拖到足够远、松手后就会弹出窗口的预览。
- 竖直对齐辅助线的 `data-axis` 为 `"x"`，水平辅助线为 `"y"`。
- 抽屉在独立窗口中显示时，窗口和内部抽屉的 `data-detached` 都为 `"true"`。弹出窗口用 `data-window="drawer:<window>:<drawer>"` 命名，比如 `data-window="drawer:chat-settings:chat-name"`，`data-drawer-host` 则标识它原来的窗口。
- 拖动抽屉标题时，抽屉的 `data-dragging` 为 `"true"`；把弹出抽屉悬停在可放回的窗口上时，那个窗口的 `data-drop-target` 为 `"true"`。
- 气泡带有其窗口的 `data-window` 和 `data-minimized="true"`，比如 `.mari-window-bubble[data-window="control:volume"]`。控制窗口名称为 `control:game`、`control:session`、`control:volume`、`control:assets`、`control:connected-chat`、`control:package:<package>` 和 `control:beholder:<package>`。拖动气泡时，它的 `data-dragging` 为 `"true"`。显示实时摘要而不是图标的气泡（比如最小化的 World State 追踪器）带有 `data-banner="true"`，并会随摘要内容变宽。
- 锁定的气泡带有 `data-locked="true"`，Chat Settings 按钮也一样。它仍能打开窗口，但在窗口解锁前不能移动。用 `.mari-window-bubble[data-locked="true"]` 可以为这类按钮设置不同外观。
- 手机上的窗口及其稍大的气泡都带有 `data-presentation="sheet"`。Tracker Panel 的气泡是 `.mari-window-bubble[data-tracker-panel-toggle="bubble"]`。
- Chat Settings 按钮也是气泡：`.mari-window-bubble[data-chat-settings-button]`，Chat Settings 打开时带有 `data-open="true"`。
- 弹出区域缩成气泡后带有 `data-drawer-host`(原来的窗口)，其窗口上的 **Put back** 按钮是 `[data-window-control="put-back"]`。

### 变量

没有设置的变量会沿用聊天控件的共享颜色，因此主题只需定义想改变的变量。

| 变量 | 控制内容 |
| --- | --- |
| `--mari-window-bg` | 窗口背景 |
| `--mari-window-text` | 窗口文字 |
| `--mari-window-border`, `--mari-window-border-width` | 窗口边框 |
| `--mari-window-radius` | 窗口圆角 |
| `--mari-window-shadow` | 窗口阴影 |
| `--mari-window-backdrop-filter` | 窗口背后的模糊 |
| `--mari-window-header-bg`, `--mari-window-header-text`, `--mari-window-header-border` | 标题栏颜色 |
| `--mari-window-header-padding` | 标题栏间距 |
| `--mari-window-control-color`, `--mari-window-control-color-hover`, `--mari-window-control-bg-hover` | 标题栏按钮，包括收藏星标 |
| `--mari-window-control-color-active`, `--mari-window-control-bg-active` | 按下的标题栏按钮，包括固定、锁定和填满的收藏星标 |
| `--mari-window-control-radius`, `--mari-window-control-gap` | 按钮圆角和间距 |
| `--mari-window-focus-ring` | 键盘焦点边框，以及抽屉准备放回的窗口边框 |
| `--mari-window-resize-handle-size` | 调整大小边缘的宽度 |
| `--mari-window-bubble-size`, `--mari-window-bubble-radius`, `--mari-window-bubble-shadow` | 气泡大小、圆角和阴影 |
| `--mari-window-bubble-bg`, `--mari-window-bubble-bg-hover`, `--mari-window-bubble-border` | 气泡背景和边框 |
| `--mari-window-bubble-text`, `--mari-window-bubble-text-hover` | 气泡图标颜色 |
| `--mari-window-snap-guide` | 对齐辅助线颜色 |
| `--mari-drawer-bg`, `--mari-drawer-border` | 抽屉背景和分隔线 |
| `--mari-drawer-header-bg`, `--mari-drawer-header-bg-hover` | 抽屉标题栏颜色 |
| `--mari-drawer-header-padding`, `--mari-drawer-body-padding-inline`, `--mari-drawer-body-padding-bottom` | 抽屉间距 |
| `--mari-drawer-title-color`, `--mari-drawer-icon-color`, `--mari-drawer-arrow-color` | 抽屉标题栏文字和图标 |
| `--mari-drawer-count-bg`, `--mari-drawer-count-text` | 抽屉数量徽标 |

把变量设在 `:root` 上会改变所有窗口，设在选择器上则只改变对应窗口：

```css
:root {
  --mari-window-radius: 0.5rem;
  --mari-window-bubble-bg: #3b0764;
}

[data-window="chat-settings"] .mari-drawer[data-drawer="chat-name"] {
  --mari-drawer-border: transparent;
}
```

## 为消息、输入框和聊天控件设置样式

三个 **Apply preset** 开关也能让自定义主题把组件设计应用到聊天的其他区域。主题可以用以下变量覆盖各部分的样式。如果不想自己写 CSS，可以让 Professor Mari 创建一套风格一致的聊天主题。

| 部分 | 类名 |
| --- | --- |
| Roleplay 和 Game 的消息框、Game 补充发言、HUD 组件、地图面板、人物卡以及聊天输入框 | `.mari-chat-style-surface` |
| Game 日志、物品栏、战斗面板、选项和弹窗；这些面板还带有 `data-game-section`，值为面板名称，例如 `logs`、`inventory` 或 `combat-actions` | `.mari-game-section.mari-chat-style-surface` |
| 窗口中的 Game 内容，例如 Journal(日志)，会跟随窗口的颜色 | `.mari-game-section` |
| Conversation 消息（仅字体和颜色） | `.mari-chat-style-conversation` |
| 无边框的 Conversation 消息文字 | `.mari-chat-style-text` |
| 聊天控件，包括 Calls 和 Conversation 群聊控件 | `.mari-chat-style-control` |
| 历史按钮：**Load More**、**Show older**、**Show newer**(显示更新内容)、**Latest**(最新)，以及 Game 日志的 **Older**(更早)、**All**(全部) 和 **Show more older logs**(显示更多早期记录)。它们同时也带有 `.mari-chat-style-control` | `.mari-chat-history-pager` |
| 由 HTML 构成的消息，例如智能体生成的样式卡片。开启 **Apply preset colors** 时，会保留它内部设置的文字颜色 | `.mari-html-content` |

| 变量 | 控制内容 |
| --- | --- |
| `--mari-chat-font-family` | 对应聊天区域的字体 |
| `--mari-chat-bg` | 框体背景，可使用纯色或渐变 |
| `--mari-chat-text` | 清晰易读的纯色文字颜色 |
| `--mari-chat-border` | 框体轮廓，可使用纯色或渐变 |
| `--mari-chat-border-color` | 纯色边框的备用值 |
| `--mari-chat-radius` | 框体圆角，不包括 Conversation 消息 |
| `--mari-chat-control-bg`, `--mari-chat-control-bg-hover` | 聊天按钮背景 |
| `--mari-chat-control-color`, `--mari-chat-control-radius` | 聊天按钮图标颜色与圆角 |
| `--mari-chat-input-bg` | 可编辑字段内部的背景 |

例如，开启 **Apply preset font** 和 **Apply preset colors** 后：

```css
:root {
  --mari-chat-font-family: Georgia, serif;
  --mari-chat-bg: #251e29;
  --mari-chat-text: #f4e8dc;
  --mari-chat-border: linear-gradient(100deg, #d6aa66, #dda0b2);
}
```

未设置的变量沿用组件设置和预设。要让这些变量通过内置样式生效，必须开启对应的开关。即使开启 **Apply preset shape**，Conversation 消息仍保留自己的形状。自定义主题也能直接选取这些类；做装饰性裁剪时，不要裁掉焦点轮廓、菜单或消息内容。

手机上，三点菜单会展开成圆形按钮。开关按钮为 `[data-chat-tools-menu-button]`，展开的按钮列为 `[data-chat-tools-menu]`，每个列表项的 `data-chat-tools-menu-item` 都设为对应窗口的 ID。工具按钮使用 `.mari-window-bubble.mari-chat-tools-button`，`data-chat-tools-menu-tool` 也设为同一个 ID。按钮列没有窗口边框；按钮保持圆形，并沿用组件颜色和按钮大小，不受聊天其他区域的三个开关影响。

<a id="styling-character-sheets"></a>
## 设置人物卡样式

规则集人物卡在 Roleplay 和 Game 中外观相同。主题可用这些类和数据属性设置样式。

| 部分 | 类 | 数据属性 |
| --- | --- | --- |
| 整张人物卡 | `.mari-ruleset-sheet` | `data-ruleset`（规则集 ID，如 `local/my-rules`）、`data-rank-display`（`value`、`label`、`dots`、`roman` 或 `number`），编辑时有 `data-editing="true"` |
| 标题和 **编辑人物卡** 按钮 | `.mari-ruleset-sheet__header` | |
| 标签页 | `.mari-ruleset-sheet__tabs` | 每个标签有 `data-tab-id` 和 `aria-selected` |
| 分组标题 | `.mari-ruleset-sheet__heading` | |
| 人物卡顶部字段 | `.mari-ruleset-sheet__field`（在 `.mari-ruleset-sheet__fields` 中） | `data-field`，计算值用 `data-derived` |
| 属性 | `.mari-ruleset-sheet__ability`（在 `.mari-ruleset-sheet__abilities` 中）；分数和检定值为 `__ability-score` 和 `__ability-value` | `data-ability`；属性分组有 `data-section` |
| 资源池，如生命值 | `.mari-ruleset-sheet__pool`（在 `.mari-ruleset-sheet__pools` 中） | `data-pool`；资源池分组有 `data-pool-group` |
| 计量轨 | `.mari-ruleset-sheet__track`（在 `.mari-ruleset-sheet__tracks` 中） | `data-track`；伤势轨另有 `data-wound="true"` |
| 状态 | `.mari-ruleset-sheet__conditions` | |
| 已训练技能或豁免 | `.mari-ruleset-sheet__rank`（在 `.mari-ruleset-sheet__trained` 中，按组位于 `.mari-ruleset-sheet__rank-group`）；等级或 `data-rank-display="value"` 时的检定值为 `__rank-value`，手机上旁边的检定值为 `__rank-check`，练习为 `__practice` | `data-skill` 或 `data-save`、`data-tier`（等级 ID）、`data-rank`（`0` 未训练，`1` 下一等级，以此类推） |
| 编辑中的技能或豁免 | `.mari-ruleset-sheet-editor__rank` | `data-skill` 或 `data-save`、`data-tier`、`data-rank` |
| 列表，如装备 | `.mari-ruleset-sheet__list`；每行为 `.mari-ruleset-sheet__list-row` | `data-list`；勾选行有 `data-marked="true"` |

例如，下面把某规则集的等级 2 显示为两颗星。每个要改变的等级都加一对类似规则。仅用于以圆点、名称、罗马数字或数字显示等级的规则集；检定值显示模式下，`__rank-value` 存的是检定值，这样会将它隐藏。

```css
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value {
  font-size: 0;
}
.mari-ruleset-sheet[data-ruleset="local/my-rules"] .mari-ruleset-sheet__rank[data-rank="2"] .mari-ruleset-sheet__rank-value::after {
  content: "★★";
  font-size: 0.6875rem;
}
```

## 相关指南

- [主题创作指南](theme-author-guide.md)
- [主题中的天气](theme-weather.md)
- [角色卡 CSS 主题指南](card-css-theming.md)
- [外观设置](appearance-settings.md)
- [服务器配置参考](../CONFIGURATION.md)
- [远程访问](../REMOTE_ACCESS.md)
