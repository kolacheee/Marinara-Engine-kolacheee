# 主题创作指南

这篇指南面向制作或分享自制主题的人。第一部分带你一步步做出第一个主题，不需要编程经验。后面的部分供查阅：主题能改哪些颜色、图片和部件，以及每个主题都要遵守的安全规则。要选择、试用、导入或移除主题，见[自定义 CSS 主题](custom-css-themes.md)。

**Token 契约版本 1**（`:root` 上的 `--mari-tokens-version: 1`）。本指南里的名称会在不同版本之间保持可用。如果必须改名，就会提高版本号，并在末尾的[变更](#changes) 里列出。其余内容（其他 `--ov-*`、`--mari-*` 和 `--marinara-*` 变量、Tailwind 类、元素结构）都属于内部实现，可能在任何更新中改变。

## 一步步制作第一个主题

主题是一小组用 CSS 写的设置；网页用这种语言设置颜色和字体。不懂 CSS 也能开始。每行的形式是 `--name: value;`：一个 **Token**（以 `--` 开头的具名设置）、一个冒号、设置值和一个分号。

1. 打开 **Library → Settings → Appearance**(资料库 → 设置 → 外观)，点击分区栏里的 **CSS Themes**(CSS 主题)。
2. 要修改入门主题，先从 **Browse the theme gallery**(浏览主题图库) 下载喜欢的主题，在 **Starter themes**(入门主题) 下找到它，点击 **Clone + Edit**(复制并编辑)（复制图标）。Marinara 会创建属于你的副本，例如“Petal OS(我的副本)”，并在编辑器里打开。入门主题保持只读，原版一直都在。要从头开始，点击 **Create Theme**(新建主题)。模板里夹在 `/*` 和 `*/` 之间的行处于关闭状态。删掉某行两侧的这些标记，就能启用它。
3. 在名称框里输入名称。
4. 改一个颜色。找到 `--primary: #3fae7a;` 这样的行，替换其中的颜色。`#3fae7a` 是十六进制颜色代码，网上的任意取色器都能给出这种代码。也可以用 `teal` 这样的颜色名。
5. 保持 **Preview**(预览) 开启。输入时应用会跟着变化，每次修改都能立即看到。
6. 看看编辑器下方。**未发现 CSS 问题。** 表示 CSS 没有问题。否则，每个问题都会标出行号，例如缺少 `;` 或 `}`。
7. 点击 **Save**(保存)。新主题会启用，Marinara 会询问 **Keep this theme?**(要保留此主题吗？)。在 15 秒内点击 **Keep theme**(保留主题)，否则会恢复之前的外观。

大多数人最先修改的 Token：

| Token | 控制的外观 |
| --- | --- |
| `--background` | 所有内容后面的页面 |
| `--foreground` | 主要文字 |
| `--primary` | 按钮、链接和高亮 |
| `--card` | 卡片和面板 |
| `--sidebar` | 聊天和资料库侧边栏 |
| `--border` | 各处的边框线 |
| `--mari-font-ui` | 应用字体，例如 `"Georgia", serif` |

一个简单的主题：

```css
:root {
  --mari-tokens-version: 1;
  --primary: #3fae7a;
  --mari-selected-tint: var(--primary);
  --mari-font-ui: "Inter", system-ui, sans-serif;
}

[data-theme="dark"] {
  --background: #0f1712;
  --card: color-mix(in srgb, #0f1712 80%, transparent);
  --sidebar: #0b120e;
}
```

`:root { … }` 存放适用于所有配色方案的设置。`[data-theme="dark"] { … }` 只用于 Dark(深色)，`[data-theme="light"] { … }` 只用于 Light(浅色)。制作时要查看完整 Token 列表，可以打开编辑器下方的 **CSS Variable Reference**(CSS 变量参考)，或阅读下面的[颜色 Token](#colour-tokens)。

### 添加图片和字体

打开编辑器下方的 **Pictures and sharing details (author, version, thumbnail, fonts)**(图片和分享详情（作者、版本、缩略图、字体）)，点击 **Add pictures**(添加图片)。点击图片名称，就能将它插入 CSS 的光标位置。图片可以放在哪里，见[图片](#pictures) 和[背景图](#backdrops)。

图片和字体必须包含在主题里。主题无法从其他网站加载任何内容，因此 CSS 里的图片外链或 Google Font 链接都不会生效。

### 让 Professor Mari 制作图片

如果已经在 **Connections**(连接) 里设置了图像模型（Codex、NovelAI、ComfyUI、OpenAI 图像模型等），Professor Mari 就能为主题制作图片并放进去。直接用日常语言告诉她，例如“给我的 Harbor 主题做一张夜空背景图”或“给首页卡片加个黄铜边框”。

1. Mari 只修改你自己的主题。要修改入门主题，先点击 **Clone + Edit**，再让她处理副本。
2. 她会自己编写图片提示词，并原样发送给图像模型。你的图像风格方案和提示词前缀（通常用于角色图片）不会加入，免得要背景图却生成了肖像。
3. Mari 会先亲自查看每张图片（小图放大，透明部分用灰色衬底），再描述它；做任何改动前，你也会先看到图片。可以让她做几个版本供挑选（每次最多 4 个），或要求修改，例如“裁成上半部分”“把白色背景变透明”“缩小一点”。每次修改都会生成新版本，之前的版本会保留。
4. 你同意后，Mari 会把图片存进主题（和 **Add pictures** 一样存为 WebP），并写入主题的 CSS。它会出现在 **Pictures and sharing details**(图片和分享详情) 下，和手动添加的图片一样。

横栏、栅栏和发送按钮等绘制的装饰是 SVG 图片。Mari 可以直接给它们换色，不需要图像模型，也不会损失清晰度。

每张图片的耗时取决于图像模型，通常是半分钟到一分半钟。如果图像连接使用自定义 ComfyUI 工作流，工作流里内置的文字仍会发送。

### 分享主题

1. 在 **Pictures and sharing details** 里填写 **Author**(作者)、**Version**(版本)（例如 `1.0`）、**Description**(描述) 和 **Thumbnail**(缩略图)，并选择 **Made for**(适用于)（深色、浅色或两者）。要随主题推荐自己的颜色和字体，点击 **Settings**(设置) 下的 **Use my current Appearance**(使用我当前的外观设置)，然后保存。
2. 点击主题所在行的 **Export**(导出)（上传图标）。Marinara 会保存一个 `.json` 文件，里面包含 CSS、图片和字体。
3. 如果用了别人制作的图片或字体，用文本编辑器打开文件，添加鸣谢和许可证。见[主题文件](#theme-files)。
4. 把文件发给对方。对方用 **Import File**(导入文件) 导入，安装前能看到你的名字、鸣谢，以及主题会修改哪些内容的列表。

### 出现问题时

无论主题怎么改，Marinara 都会确保顶栏、侧边栏、<kbd>Ctrl</kbd>+<kbd>K</kbd> 和消息框可以使用。如果主题隐藏、移动或遮住其中一项，Save 会告诉你哪里出了问题。仍然可以选择 **Save anyway**(仍要保存)，但只要主题在某个标签页里破坏了其中一项，Marinara 就会在该标签页关闭主题。随时都可以连按三次 <kbd>Esc</kbd>、在地址末尾加上 `?safe`，或按 <kbd>Ctrl</kbd>+<kbd>K</kbd> 并输入“自定义主题”，恢复正常外观。

入门主题是很好的学习示例。复制一个，阅读它的 CSS，看看它如何使用下面的 Token 和部件钩子。

## 主题如何取得优先权

应用自身的 CSS 放在层叠层里，在 `index.html` 开头声明：

```
mari-protected, mari-theme-important, theme, base, components, utilities, mari-app, mari-pickers
```

- 主题**不属于任何层**，因此主题里的普通选择器优先于应用里所有没有 `!important` 的规则，无论应用规则的选择器优先级有多高。
- `mari-pickers` 存放 Appearance(外观) 的选择器设置（背景、强调色、字体、聊天颜色）。它高于应用默认值，低于主题，所以主题的颜色优先于选择器；主题覆盖某个选择器时，Appearance 会告知用户。
- 主题里的 `!important` 仍然有效。这些规则会复制到 `mari-theme-important`，优先于应用自身的 `!important` 规则。
- `mari-protected` 确保顶栏、聊天侧边栏、资料库侧边栏和 Ctrl+K 保持原位。主题可以改它们的样式（颜色、字体、边框、圆角、阴影），但不能隐藏、移动、缩小或遮住它们。如果尝试这样做，主题会在该标签页关闭，并告知用户原因。
- 过渡开始前最多等待一秒（`transition-delay`，或 `transition` 里的第二个时间值）。如果主题延迟更久才改变外观，就会被拒绝，避免检查完屏幕很久以后才出现内容。动画可以使用任意延迟。

恢复外观的办法始终可用：URL 里的 `?safe`、**连按三次 Escape**，或 Ctrl+K > “自定义主题” 都能关闭主题。新主题会询问“要保留此主题吗？”，15 秒后恢复原样。

## 颜色 Token

### 核心（每种视觉风格都定义这些值）

`--background`、`--foreground`、`--card`、`--card-foreground`、`--popover`、`--popover-foreground`、
`--primary`、`--primary-foreground`、`--secondary`、`--secondary-foreground`、`--muted`、
`--muted-foreground`、`--accent`、`--accent-foreground`、`--destructive`、`--destructive-foreground`、
`--border`、`--input`、`--ring`、`--radius`、`--sidebar`、`--sidebar-foreground`、`--sidebar-border`、
`--sidebar-accent`、`--sidebar-accent-foreground`。

值必须是完整的 CSS 颜色（`#1b1530`、`rgb(…)`、`oklch(…)`）。像 `270 25% 8%` 这样裸写的 HSL 三元组（shadcn 的惯例）在这里**无效**。

用 `[data-theme="light"]` 和 `[data-theme="dark"]` 分别限定浅色和深色的作用范围。

### 新布局

| Token | 用途 |
| --- | --- |
| `--ov-line` | 细线和面板边框 |
| `--ov-text`, `--ov-muted`, `--ov-dim` | 文字、次要文字、淡色文字 |
| `--ov-accent` | 强调色位置（默认为 `--primary`） |
| `--ov-hover`, `--ov-active-bg` | 悬停和按下时的背景 |
| `--ov-mode-conversation`, `--ov-mode-roleplay`, `--ov-mode-game` | 聊天侧边栏和编辑器里的聊天模式颜色 |
| `--ov-serif` | 标题字体（跟随 `--mari-font-heading`） |
| `--mari-selected-tint` | 选中的行、胶囊标签和开关。默认是中性色（`--foreground`）；设为 `var(--primary)` 可让选中状态带上强调色。 |
| `--mari-selected-bg`, `--mari-selected-ring` | 从色调派生（10% 和 18%） |

### 主题 Token(v1)

每个 Token 默认都采用应用自身的外观。浅色模式有一组适合阅读的独立值。

| Token | 用途 |
| --- | --- |
| `--mari-font-ui` | 整个应用的字体 |
| `--mari-font-heading` | 页面和分区标题 |
| `--mari-font-chat` | Roleplay(角色扮演) 和 Conversation(对话模式) 聊天里的消息文字 |
| `--mari-mode-conversation`, `--mari-mode-roleplay`, `--mari-mode-game` | 首页标签、最近聊天、新建聊天启动器、首页组件标题上方的小标签 |
| `--mari-home-pink`, `--mari-home-violet` | 首页组件的其他强调色 |
| `--mari-status-online`, `--mari-status-idle`, `--mari-status-dnd`, `--mari-status-offline` | 在线状态圆点和标签 |
| `--mari-gauge-ok`, `--mari-gauge-warn`, `--mari-gauge-danger` | 游戏仪表和 HP 条。正常状态下仍优先使用组件自己的颜色；危险状态始终使用该 Token。 |
| `--mari-game-combat`, `--mari-game-combat-text` | 游戏的 Combat(战斗) 按钮 |
| `--mari-stage-empty-bg` | 场景图加载前的游戏舞台（任意 `background` 值，包括渐变） |
| `--mari-scrim` | Ctrl+K 后面的暗色遮罩 |
| `--mari-user-avatar-placeholder` | 没有图片时的用户头像（渐变） |
| `--mari-art-saturation-1`, `--mari-art-lightness-1`, `--mari-art-saturation-2`, `--mari-art-lightness-2` | 没有图片的卡片上的渐变。每张卡片保留自己的色相；设置这些值（百分比）可让渐变柔和一些。 |
| `--mari-app-backdrop` | 整个应用后面的图片或渐变，只绘制一次（见下文） |
| `--mari-accent-fx-animation` | Accent Pulse(强调色脉动) 或 RGB Mode(RGB 模式) 开启时对应的动画，否则为 `none` |

### v1.1 新增的主题 Token

主题设置这些 Token 之前，它们没有值，因此会一直使用用户自己的设置。

| Token | 用途 |
| --- | --- |
| `--mari-text-outline` | 消息文字的描边，例如用 `0` 关闭，或设为 `1px #3b2a1a`。否则使用用户的 Text Outline(文本轮廓/描边) 设置。 |
| `--mari-dialogue-color` | 角色或用户角色没有自己的对白颜色时使用的颜色（仍优先使用它们自己的颜色） |
| `--mari-chat-font-size` | 消息文字大小。Accessibility(无障碍) 的最小值仍然适用。 |
| `--mari-composer-placeholder` | 消息框占位文字，以带引号的字符串表示：`"> waiting for user input..."`。可设在 `:root` 上，也可设在某个输入框上，例如 `[data-composer="game"]`。索要密钥或密码的文字会被忽略。 |
| `--mari-page-veil` | 叠加在设置、资料库、编辑器和文档上的颜色，让长篇文字在背景图上仍清晰可读。默认为 `transparent`。 |
| `--mari-page-floor` | 在背景图上方，每个完整页面下面垫着的近乎不透明的底层。默认是 `color-mix(in srgb, var(--background) 94%, transparent)`；设为 `transparent` 即去掉 |
| `--mari-top-bar-bg` | 顶栏的完整 `background` 值：图片、渐变或多个图层。`--mari-top-bar-rendering: pixelated` 让像素画保持清晰。标签页和图标始终显示在最上层。 |
| `--mari-top-bar-plate`, `--mari-top-bar-plate-radius` | 顶栏有图片时，每个标签页、打开的聊天标签、图标按钮和标志下方都有衬底，确保清晰可读。这些值设置衬底颜色和圆角半径（默认 `0.5rem`）；将半径设为 `0` 可得到方形像素按钮。 |
| `--mari-tab-row-strip-bg`, `--mari-tab-row-strip-height`, `--mari-tab-row-strip-room` | 顶栏在标签页下绘制的条带（如滚动字幕或栅栏），会在分组行显示时移到该行（`:root[data-ov-tabrow]`；该行是 `[data-tab-row]`）。在 `[data-tab-row]` 上设置 `background`、高度和标签下占用的空间（默认为高度；`0px` 表示放在背后）。`[data-mari-part="tab-row-strip"]` 支持动画。须自行在 `:root[data-ov-tabrow]` 下移除顶栏原有条带。 |
| `--mari-msg-head-rule` | Roleplay 消息名字下方的线（`border-bottom` 值，例如 `none` 或 `2px dashed currentColor`） |
| `--mari-home-widget-border`, `--mari-home-widget-border-width`, `--mari-home-widget-radius`, `--mari-home-widget-bg` | 每个首页组件的边框和表面，包括 Professor Mari |
| `--mari-home-widget-font`, `--mari-home-widget-title-font`, `--mari-home-widget-title-size`, `--mari-home-widget-title-color`, `--mari-home-widget-eyebrow-size`, `--mari-home-widget-text-size`, `--mari-home-widget-muted` | 首页组件的字体样式。文字需要更多空间时，组件会增高，不会裁掉文字。 |
| `--mari-home-widget-eyebrow-color`, `--mari-home-widget-action-size`, `--mari-professor-sprite-scale` | 组件标题上方的小标签、Professor Mari 的 Ask(询问) 按钮文字，以及 Mari 图片的大小（1 = 默认） |
| `--mari-home-wash` | 首页叠加在背景图上的色调（默认：卡片颜色的 65%）；`transparent` 会完整显示图片。 |
| `--mari-home-art` | `none` 隐藏首页卡片上的默认图片；这些图片按需加载，隐藏时不会下载。它们是单张卡片里的小图（What's new、Around the table），不是首页背景：首页后面的图片是应用背景图。 |
| `--mari-ambient` （以及 `-opacity`, `-blend`, `-animation`） | 环境叠加层：见“环境叠加层” |
| `--mari-icon-send`, `--mari-icon-stop`, `--mari-icon-attach`, `--mari-icon-emoji` | 用图片替换消息框图标（`background-image` 值） |
| `--mari-cursor`, `--mari-cursor-pointer` | 图片鼠标指针（完整的 `cursor` 值）。主题启用时优先于 Custom Mouse Pointer(自定义鼠标指针)。 |

### v1.4 新增的主题 Token

和 v1.1 的 Token 一样，第一组在主题设置之前不生效。

| Token | 用途 |
| --- | --- |
| `--mari-message-time` | 所有聊天模式里的消息时间颜色（`[data-mari-part="time"]`） |
| `--mari-chat-wash` | Roleplay 聊天背景上的叠加色，使用完整的 `background` 值。默认是深色遮罩，浅色模式下是淡紫白色。`none` 可移除它。 |
| `--mari-lore-constant`, `--mari-lore-selective`, `--mari-lore-normal` | 世界书条目的状态圆点 |
| `--mari-toast-font-size` | 浮动提示的文字大小（浮动提示已使用 `--mari-font-ui`） |
| `--mari-home-shortcut-size`, `--mari-home-shortcut-desc-size` | 首页 Learn(了解引擎) 和 Community(社区) 快捷入口的文字。只设置 `--mari-home-widget-text-size` 时会跟随该值，描述文字为它的 0.85 倍。 |
| `--mari-min-ui-text` | 应用最小文字的下限（9-12 px 的标签、计数、胶囊标签）。也可以设置 Tailwind 的 `--text-xs`、`--text-sm` 和 `--text-base`。 |
| `--mari-user-avatar-image` | 用户角色没有图片时使用的用户头像。未设此 Token 时，占位图现在会优先显示用户角色自己的图片（如果有）。 |
| `--mari-focus-frame`, `--mari-window-title`, `--mari-ambient-placement`, `--mari-ambient-mask` | 插槽，见下文 |

以下 Token 替换原本固定在应用里的值，未设置时回退到默认外观：

| Token | 用途 |
| --- | --- |
| `--mari-chrome-accent` | 当前标签页的下划线、编辑器外框、选择框和连接页面 |
| `--mari-chrome-muted` | 面板、侧边栏和首页里的灰色次要文字（默认：界面文字颜色的 58%） |
| `--mari-resource-accent`, `--mari-resource-<type>` | 资料库各类型的颜色：`characters`、`personas`、`lorebooks`、`presets`、`connections`、`agents`、`settings`、`backgrounds`、`browser` |
| `--mari-ctrlk-conversation`, `--mari-ctrlk-roleplay`, `--mari-ctrlk-game` | Ctrl+K 里各模式的行颜色 |
| `--mari-game-combat-bg`, `--mari-game-combat-bg-hover`, `--mari-game-combat-border` | 游戏的 Combat 按钮（两个背景值都是完整的 `background`，支持渐变；也要加一个纯色图层） |
| `--mari-accent-text` | 小字或图标使用的强调色（当前标签页、分区标签、链接）。默认是在浅色模式下略微加深、深色模式下略微提亮的强调色，以便阅读。 |
| `--mari-top-bar-plate-active` | 顶栏有图片时，当前控件背后的衬底（默认：衬底混入 20% 强调色） |
| `--mari-chat-header-bg` | Conversation 页眉后面的渐隐背景（默认：从 88% 的页面颜色淡出；有应用背景图时为 `none`） |
| `--mari-home-hero-padding`, `--mari-home-widget-glow` | 首页欢迎语的内边距，以及首页组件页眉后面的辉光 |

应用还会在 `<html>` 上提供 `--mari-top-bar-height`(顶栏实际高度；主题增高顶栏时也会变化)，方便主题在顶栏下方为自己的图层留出空间。

### v1.5 新增的主题 Token

这些 Token 用于长回复，以及以前需要内部类才能设置的部分。除注明默认值的项目外，都在主题设置后才生效。

| Token | 用途 |
| --- | --- |
| `--mari-chat-column` | Roleplay 里消息和消息框共用的列宽（默认 58rem）。用户自己的 Chat settings → Chat width(聊天设置 → 聊天区域宽度) 仍优先。 |
| `--mari-message-measure` | 消息文字的最大行宽，例如 `68ch`(Roleplay 和 Conversation) |
| `--mari-chat-line-height` | 所有聊天模式里的消息文字行高（默认 1.5）。Accessibility → Line spacing(无障碍 → 行间距) 仍优先。 |
| `--mari-dialogue-weight` | 带引号对白（`[data-mari-part="dialogue"]`）的字重，例如设为 `400`，避免长对白变成整块粗体。 |
| `--mari-dialogue-color` | 现在，当主题的 `--mari-chat-*` 颜色启用聊天配色时也会生效，主题为斜体和链接设置的颜色同样如此。 |
| `--mari-paragraph-gap` | 替代段落间空行的间距，例如 `0.85em` |
| `--mari-pinned-speaker`, `--mari-pinned-speaker-bg` | `on`：滚动阅读较长的 Roleplay 回复时，名字行固定在聊天顶部（桌面和平板）。背景默认使用气泡背景。 |
| `--mari-pinned-speaker-top`, `--mari-pinned-speaker-bleed` | 固定名字行的位置（默认：可见聊天区域的顶边），以及向文字两侧延伸的距离（默认 1rem） |
| `--mari-phone-avatar` | `hidden`：手机上的 Roleplay 不显示头像列，让回复占满宽度。 |
| `--mari-mini-avatar-size`, `--mari-mini-avatar-ring` | 手机上名字旁的小头像（**Profile pictures on phones: Mini**(手机上的头像：迷你)，默认）：大小，以及用 `box-shadow` 设置的外圈。对应 `[data-mari-part="mini-avatar"]`，带有 `data-role`(`user`、`assistant`)。 |
| `--mari-phone-convo-avatar` | `full`：即使用户选了 **Mini**(迷你)，手机上的 Conversation 聊天也保留完整头像列。 |
| `--mari-vn-fade` | VN 文本框底部的渐隐效果，用于段落下方还有内容时（默认 1.75rem，`0` 关闭） |
| `--mari-message-actions`, `--mari-swipe-counter` | 消息下方工具和“2 / 5”备选回复计数的颜色 |
| `--mari-card-art-placeholder` | 没有图片的资料库卡片所用的完整 `background`，替代随机色相渐变 |
| `--mari-chat-row-art-opacity` | 聊天侧边栏里，当前聊天所在行后面的图片（默认 0.14；`0` 隐藏） |
| `--mari-chrome-accent`, `--mari-chrome-accent-gradient` | 现在也适用于从 `<html>` 读取强调色的界面部分（Convo / Roleplay / Game 标签页、界面边框） |
| `--mari-focus-frame-outset` | 焦点边框向表面外延伸的距离（长度值，最多 2rem；见“插槽”） |
| `--mari-scrim` | 对话框后面的暗色遮罩 |
| `--mari-confirm-scrim` | 简短确认对话框后面的浅色半透明遮罩（保持淡一些，让明亮主题不刺眼） |

主题有环境叠加层时，应用还会在 `<html>` 上提供 `--mari-center-x`：聊天面板的水平中心位置，让遮罩无论侧边栏是否打开，都能保持阅读列不受遮挡。`--mari-gutter-mask` 就使用这个值。

## 图片

主题把图片放在主题文件的 `images` 里，CSS 通过名称引用：

```css
:root {
  --mari-app-backdrop: url("theme:night.webp");
}
[data-mari-part="home-widget"] {
  border-image: url("theme:frame.webp") 24 fill / 24px stretch;
}
```

- 图片计入 6 MiB 的包大小限制，不计入 256 KiB 的 CSS 限制，因此可以放完整尺寸的图片。
- 在编辑器里打开 **Pictures and sharing details**，点击 **Add pictures**。PNG 和 JPEG 会在添加时保存为 WebP(小图无损转换，让像素画和九宫格边框保持清晰；最长边不超过 2560 px)。点击图片名称，就能在光标处插入 `url("theme:name")`。
- 导入主题时也一样：以 `data:` URL 内嵌的图片会从 CSS 移入 `images`，静态 PNG 和 JPEG 会转为 WebP，预览会列出每张图片及其大小（并提供“改为保留原始文件（更大）”复选框）。
- `theme:` 名称也能按名称找到主题的 `backgrounds`，所以随主题提供给聊天背景图库的图片，也能用于 CSS，无论用户是否将其添加到图库。
- 应用主题时，每张图片都会变成一个简短的同源 `blob:` URL：不会下载任何内容，同一张图片在多处使用也只解码一次。
- GIF、APNG、动态 WebP 和带 `<animate>` 的 SVG 都算动态图片。导入预览会说明这一点，开启 Reduce motion(减少动态效果) 后，它们会显示为第一帧。

## 背景图

在 `:root` 上设置 `--mari-app-backdrop`，就能在应用后面绘制图片：

```css
:root {
  --mari-app-backdrop: url("theme:city.webp");
  --mari-app-backdrop-position: bottom center;
  --mari-app-backdrop-rendering: pixelated;
}
```

它只绘制一次，位于整个应用下方独立的固定图层（`[data-mari-part="app-backdrop"]`，因此首页装饰和浅色方案都不会遮住它），也会出现在聊天后面：Roleplay、Conversation 和游戏界面变为透明，默认聊天背景让位。用户为聊天选择的背景仍然显示在它上方。面板保留 `--card` 和 `--sidebar`，想让图片透出来，就把它们设为半透明，并用 `--mari-page-veil` 为整页叠加颜色。要让页面拥有自己的面板，设置 `[data-mari-part="page"]` 的样式（见“钩子”）：它包含所有资料库页面、编辑器、设置和文档，因此世界书和角色页面会得到相同的面板。 在背景图上方，每个完整页面还会垫一层近乎不透明的 `--background` 底层（`--mari-page-floor`，默认 94%），让长列表和编辑器保持易读。可以把 `--mari-page-floor` 设成别的颜色，或设成 `transparent` 让更多插图透出来。用 `!important` 设置 `[data-mari-part="page"]` 样式的主题，会用自己的面板替代这层底层。

| Token | 默认值 |
| --- | --- |
| `--mari-app-backdrop` | 一张图片或一个渐变 |
| `--mari-app-backdrop-size` | `cover`(平铺时可试试 `auto` 或 `64px`) |
| `--mari-app-backdrop-position` | `center` |
| `--mari-app-backdrop-repeat` | `no-repeat` |
| `--mari-app-backdrop-attachment` | `fixed` |
| `--mari-app-backdrop-rendering` | `auto`(像素画用 `pixelated`) |
| `--mari-app-backdrop-layers` | 包含多个图层的完整 `background` 值，例如 `url(city.webp) bottom / 100% auto no-repeat, radial-gradient(#fff3 1px, transparent 1px) 0 0 / 12px 12px, #fbe3ef`。它优先于单图 Token。 |

自定义图片是主题里最灵活的部分：背景图、顶栏条带、首页组件边框和消息边框（`border-image`，或任意部件钩子上的 `background`）、平铺图案和附带的像素字体都放在主题文件里，导入预览会列出它们。用户的 Appearance > Accessibility > Theme art strength(外观 → 无障碍 → 主题图画强度) 会淡化背景图和环境叠加层，High contrast(高对比度) 则把它们限制在 25% 或以下；主题无法覆盖这两项设置。

## 环境叠加层

`--mari-ambient` 接受完整的 `background` 值，用于聊天和页面上方、但在顶栏和两侧边栏**下方**的图层：雨、落叶、扫描线、暗角等。

```css
:root {
  --mari-ambient: url("theme:leaves.webp") 0 0 / 512px repeat;
  --mari-ambient-opacity: 0.6;
  --mari-ambient-animation: leaves-fall 30s linear infinite;
}
@keyframes leaves-fall {
  to {
    background-position: 0 1024px;
  }
}
```

`--mari-ambient-blend` 设置 `mix-blend-mode`，`[data-mari-part="ambient"]::before` 和 `::after` 还可以再提供两个图层。该图层不接收点击，开启 Reduce motion 时会停止移动（图片变为静态帧），并且必须大部分透明：如果主题的环境层会遮住聊天，主题就会关闭。用它来替代全屏 `body::after`，后者会被防护机制视为遮盖应用。

看不见这个图层时，它会保持静止：应用在后台时（焦点位于其他标签页或应用），以及手机和平板上资料库页面、编辑器、设置等完整页面遮住聊天时。主题其他地方的无限循环动画也会在后台暂停。它们会从暂停处继续，所以不要依靠它们安排重要内容的时机。

聊天自己的背景是一个 `<img data-mari-part="backdrop">`。默认背景（未选择背景时）还带有 `data-default-background="true"`，因此主题可以只替换它：

```css
img[data-mari-part="backdrop"][data-default-background] {
  opacity: 0 !important;
}
```

## 天气

故事有天气时（Settings > Appearance > Effects > Dynamic weather effects(设置 → 外观 → 效果 → 动态天气效果)，并开启 World State(世界状态) 智能体），应用会在聊天上方绘制雨、雪、雾、花瓣、星星、太阳或月亮。主题可以用 `--mari-weather-*` Token 改变它们的样式，也可以让自己的图片随天气变化。

第一次接触？[主题里的天气](theme-weather.md) 有图文分步说明。

```css
:root {
  --mari-weather-style: pixel; /* every drop and flake lands on a pixel grid */
  --mari-weather-pixel-size: 3px;
  --mari-weather-rain-color: #ffaacd;
  --mari-weather-petal-image: url("theme:petal-a.png") url("theme:petal-b.png");
  --mari-weather-petal-size: 3;
  --mari-weather-tint-strength: 0.4;
}
:root[data-theme="dark"] {
  --mari-weather-moon: none; /* the night backdrop already has a moon */
}
```

所有绘制仍由应用完成。应用会在主题加载、配色方案切换和编辑主题时读取这些 Token，检查每个值，忽略不认识的内容。因此，白天和夜晚（或单个聊天）的天气设置和其他 Token 一样使用。

| Token | 值 |
| --- | --- |
| `--mari-weather-style` | `smooth`(默认) 或 `pixel`：图层以低分辨率绘制，再清晰放大，粒子变为方格。 |
| `--mari-weather-pixel-size` | 2 到 6(每格像素数)，默认 3 |
| `--mari-weather-<kind>-color` | 普通颜色（`#hex`、颜色名、`rgb()`、`hsl()`），不支持渐变或图片 |
| `--mari-weather-<kind>-image` | 最多 4 张主题自带图片，`url("theme:a.png") url("theme:b.png")`；每个粒子选一张。平滑风格下，树叶、花瓣和灰烬会边旋转边飘落。 |
| `--mari-weather-<kind>-size` | 0.5 到 3 倍。像素风格下，按图片原始尺寸乘以此值绘制，保留像素画的像素（图片像素 = 大小 x 1 px）。 |
| `--mari-weather-<kind>-shape` | `round` 或 `square`(平滑风格；方形可用于“数据雪”或火花) |
| `--mari-weather-amount` | 0.25 到 1：主题只能减少天气粒子，不能增加。 |
| `--mari-weather-speed` | 0.5 到 1.5 倍 |
| `--mari-weather-strength` | 粒子显示强度的 0.5 到 1.5 倍（例如暗色城市里的细雨） |
| `--mari-weather-tint-strength` | 默认天空色调的 0 到 1 倍（雨天偏蓝、夜晚偏暗） |
| `--mari-weather-rain-length` | 雨丝长度的 0.5 到 3 倍 |
| `--mari-weather-sun`, `-moon` | 背景图已经画了太阳或月亮时设为 `none` |
| `--mari-weather-lightning-color` | 闪电的颜色。强度和时机仍使用应用温和、避免诱发癫痫的值。 |
| `--mari-weather-lightning-bolt` | `on`、`none` 或 0.5-3(宽度)：每次闪光时，在左侧或右侧绘制一道分叉闪电，并随闪光淡出。 |

类型：`rain`、`snow`、`hail`、`fog`、`dust`、`leaf`(刮风)、`petal`(花开)、`ember`、`ash`、`sand`、`firefly`、`star`、`aurora`，以及 `sun` 和 `moon`(颜色、大小和一张图片)。

### 随天气变化的图片

聊天显示天气时，`<html>` 会带上固定列表中的两个词（绝不会使用故事自己的文字）：

| 属性 | 值 |
| --- | --- |
| `data-mari-weather` | `clear`、`cloudy`、`rain`、`storm`、`snow`、`hail`、`fog`、`sand`、`ash`、`embers`、`wind`、`blossom`、`aurora` |
| `data-mari-sky` | `dawn`、`day`、`dusk`、`night` |
| `data-mari-shelter` | `indoors` 或 `outdoors`(应用无法判断时不设置) |

室内不绘制粒子、雾团、太阳、月亮或星星，只保留色调和闪电闪光，因此主题的天气 Token 只在室外显现。无论是否开启 Reduce Ambient Animations(减少环境动画和特效)，都会设置这些属性（切换背景图不涉及移动）；聊天没有天气或用户关闭天气时，则会移除。可以用它们让晴天背景在下雨时变灰，或让自己的环境层让位，避免叠加两套天气：

```css
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:street-overcast.webp");
}
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

### 仍由用户决定的设置

- 主题不能开启或关闭天气，由用户的开关决定。
- Reduce Ambient Animations(或设备的减少动态效果设置) 会完全停止绘制天气。
- Reduced paint effects(降低绘制特效) 会移除色调、辉光和日落叠加色，只绘制 60% 的粒子。
- Theme art strength 会像淡化背景图一样淡化主题的天气，High contrast 则将其限制在 25% 或以下。
- 在所有设备上，面板、编辑器或 Mari 遮住聊天时，天气都会停止绘制。

Petal OS(像素天气和自带花瓣)、NEON//GRID(青色雨丝) 和 Lantern Path(手绘树叶、恶劣天气下变灰的背景图) 都是完整示例：对其中一个点击 **Clone + Edit**，阅读它的 CSS。

## 强调色效果

Accent Pulse 和 RGB Mode 用 CSS 滤镜让新布局里几处强调色位置动起来（“+ New”、主要按钮、助手头像块）。不会逐帧重写任何内容。主题可以：

- 用 `:root { --marinara-theme-accent-pulse: enabled; }` 为用户开启 Accent Pulse；
- 用 `animation: var(--mari-accent-fx-animation);` 加入自己的元素。

两者都会在 `prefers-reduced-motion` 和应用的“减少环境动画和特效”设置下停止。

## 钩子

### `<html>` 上的属性

| 属性 | 值 |
| --- | --- |
| `data-theme` | `dark`、`light` |
| `data-visual-theme` | `default`(Marinara)、`sillytavern`(Dottore)、`stage` |
| `data-overhaul` | `on`(新布局，桌面)、`mobile`(新布局，手机和平板)；旧布局中不存在 |
| `data-custom-theme` | 当前主题的 id |
| `data-seasonal-theme` | 启用时的季节外观 |
| `data-mari-accent-fx` | 强调色效果运行时为 `pulse` 或 `rgb` |
| `data-chat-id` | 当前打开的聊天 id |
| `data-chat-open-mode` | 当前打开的聊天模式：`roleplay`、`conversation`、`game` |
| `data-chat-tags` | 当前打开的聊天标签，转为小写并用 `-` 替换空格：可用 `:root[data-chat-tags~="horror"]` 为故事设置样式。 |
| `data-mari-chat-art-behind` | 聊天背景显示在侧面板后方时存在（`--mari-chat-art` 是图片） |
| `data-marinara-reduced-effects` | 减少环境动画时存在 |
| `data-mari-a11y-line-height` | 用户增大行间距时存在（`--mari-a11y-line-height`） |
| `data-mari-a11y-letter-spacing` | 用户增大字间距时存在（`--mari-a11y-letter-spacing`） |
| `data-mari-a11y-focus` | 开启醒目焦点环时存在 |
| `data-mari-contrast` | 开启高对比度时为 `more`(用户选择，或设备要求) |
| `data-mari-cvd-safe` | 开启色盲友好配色时存在 |
| `data-mari-weather` | 故事天气显示时的天气：`rain`、`snow`、`fog`…（见[天气](#weather)） |
| `data-mari-sky` | 故事天气显示时为 `dawn`、`day`、`dusk` 或 `night` |
| `data-mari-shelter` | 故事天气显示且应用能从地点判断时，为 `indoors` 或 `outdoors` |

### 区域

`[data-component="…"]` 标识较大的区域：`AppShell`、`TopBar`、`ChatSidebar`、`ChatSidebarSlot`、
`RightPanelDesktop`、`RightPanelDesktopSlot`、`CenterContent`、`GlobalOmnibar`、`OverhaulLibraryNav`、
`OverhaulSettingsPage`、`OverhaulLibraryPage`、`OverhaulCardGallery`、`OverhaulEditorHead`、
`OverhaulEditorRail`。

### 部件

| 选择器 | 对应内容 |
| --- | --- |
| `[data-mari-part="message"]` | 所有聊天模式里的一行消息：占聊天区域全宽，内部包含头像、名字行和气泡。应给气泡（下面的 `bubble`）设置背景，不要给整行设置，否则每个气泡外面都会再套一层框。还带有 `data-message-id`、`data-message-role`(`user`、`assistant`、`system` 等) 和下文的消息数据。 |
| `[data-mari-part="bubble"]` | Roleplay 和 Conversation 里的消息气泡本身（`.mari-rp-bubble` / `.texting-bubble`）。背景、边框、圆角和阴影都设在这里。 |
| `[data-mari-part="message"][data-latest]` | 角色的最新回复 |
| `[data-mari-part="message"][data-streaming]` | 仍在生成的回复 |
| `[data-mari-part="avatar"]`, `[data-mari-part="header"]`, `[data-mari-part="actions"]` | 消息内部：头像、名字行和消息工具 |
| `[data-mari-part="reasoning"]`, `[data-mari-part="reasoning-text"]` | 推理开关（或框）及其文字，桌面和手机使用同一个钩子 |
| `[data-mari-part="composer"]` | 消息框。`data-composer` 为 `roleplay`、`conversation` 或 `game`。 |
| `[data-mari-part="home-art"]` | 首页卡片上的默认图片 |
| `[data-mari-part="message"][data-vn]` | 视觉小说对白框：带有相同数据（角色、身份、序号）的消息，内部还有 `avatar` 和 `header` 部件 |
| `[data-mari-part="vn-sprite"]` | VN 对白框后面延伸到场景底部的空图层。它带有当前说话者的 `data-vn-speaker`(说话者名字的 slug 或其身份)、`data-vn-speaker-role`、`data-character` 和 `data-character-id`，让主题能把说话者的图片放在这里。`[data-roleplay-vn-media]` 也有这些属性。 |
| `[data-mari-part="message"][data-game-narration]` | 游戏旁白框。`data-message-role` 为 `narrator`，角色说话时则为 `assistant` 并带有 `data-character` 和 `data-character-name`；`data-segment-type` 和 `data-expression` 描述当前这句话。 |
| `[data-mari-part="app-backdrop"]`, `[data-mari-part="ambient"]` | 背景图和环境图层。它们在页面中的位置固定；用 Token 设置样式。 |
| `[data-mari-part="home-widget"]` | 首页组件卡片，包括 Professor Mari。外框带有 `data-home-widget-id`(`recent`、`professor`、`whats-new`、`character-library` 等)。内部有：`home-widget-eyebrow`、`home-widget-title`、`home-widget-text`。 |
| `[data-mari-part="top-bar"]` | 所有设备上的顶栏。分屏视图的另一侧有自己的窄顶栏，使用相同钩子（`[data-component="TopBar"]`、`.ov-tab`、`.ov-tab__label`、`.ov-icon-btn`），并带有 `[data-split-bar]`，所以顶栏图片和字体也适用于它。 |
| `[data-mari-part="page-title"]` | 主页面的大标题：所有资料库分区（角色、世界书、连接、智能体等）、设置、扩展和文档。用这个钩子统一设置页面标题，让各页保持一致。 |
| `[data-mari-part="backdrop"]` | 聊天背景图（见“背景图”） |
| `[data-mari-part="stage-empty"]` | 没有场景图的游戏舞台 |
| `[data-mari-part="time"]` | 所有聊天模式里的消息时间 |
| `[data-mari-part="chat-header"]` | Conversation 页眉（`data-chat-mode="conversation"`） |
| `[data-mari-part="game-hud"]`, `[data-mari-part="game-tools"]` | 游戏的地图与队伍悬浮面板，以及旁白工具栏 |
| `[data-mari-part="avatar-placeholder"]` | 空头像圆圈；`data-role` 为 `user` 或 `assistant` |
| `[data-mari-part="header"][data-placement]` | Roleplay 消息上的属性：`outside`(名字在气泡上方) 或 `inside` |
| `[data-mari-part="home-widget-glow"]` | 首页组件页眉后面的辉光 |
| `[data-mari-part="dialogue"]` | 消息里带引号的对白 |
| `[data-mari-part="paragraph-gap"]` | 两个段落之间的空行（设置 `--mari-paragraph-gap` 后会变成块元素） |
| `[data-mari-part="vn-text"]`, `vn-counter`, `vn-nav` | VN 文本框（下方仍可滚动时带有 `data-more-below`）、“3 / 9”计数和 Previous / Next(上一条 / 下一条) 按钮（`data-direction`） |
| `[data-mari-part="card-art"]` | 资料库卡片的图片；无图时带有 `data-placeholder` |
| `[data-mari-part="page"]` | 所有完整页面共用的表面：每个资料库页面（角色、世界书、预设、正则脚本、连接、智能体、自定义工具）、所有编辑器、设置和文档。在这里绘制面板或底板，不要只改某个页面自己的类，这样每个页面都能有相同的易读表面。聊天和首页不在其中。 |
| `[data-mari-part="chat-row-art"]` | 当前聊天侧边栏行后面的图片 |
| `[data-mari-part="avatar-placeholder"]` | 现在适用于所有空头像位置：Conversation 消息行、聊天行（姓名首字母）、用户角色切换器、消息框和游戏 |
| `.ov-lrow__dot[data-status]` | 世界书条目圆点：`constant`、`selective` 或 `normal` |
| `[data-chat-row]` | 聊天侧边栏的一行；当前打开的聊天带有 `data-selected="true"` |
| `[data-chat-mode]` | 按模式区分的聊天表面 |
| `.mari-messages-scroll` | 可滚动的消息列表 |
| `.mari-rp-bubble`, `.mari-rp-bubble--user`, `.mari-message-assistant` | Roleplay 和 Conversation 气泡 |
| `.mari-window`, `.mari-drawer` | 弹出窗口和抽屉 |

### 插槽

只有当前主题需要时才会出现这些部件，默认页面不会多出额外部件。

- **焦点边框。**`--mari-focus-frame` 接受完整的 `border-image` 值，例如 `url("theme:frame.png") 24 fill / 24px / 6px stretch`，并在读者当前关注的内容上绘制边框：最新回复、Ctrl+K、打开的对话框和首页的最近聊天。在其他元素（消息模板里）上添加 `data-mari-focus-surface`，也能加上边框。自 v1.5 起，边框只能通过 `--mari-focus-frame-outset` 向表面外延伸（最多 2rem）；值中包含 `fill` 时完全不外扩，避免盖住聊天；写在 `--mari-focus-frame` 内部的外扩值会被忽略。边框是 `border-image`：CSS 后面针对同一元素的 `border` 简写会重置它，因此那里应分别设置 `border-color`、`border-width` 和 `border-style`。
- **窗口标题。**设置 `--mari-window-title`(任意值，例如 `on`) 会在每条消息、首页组件和消息框顶部添加标题行：`[data-mari-part="window-title"]`，带有 `data-window`(`message`、`home-widget`、`composer`，自 v1.5 起还包括 `narration`、`omnibar`、`window` 和 `dialog`)，内部有 `window-title-text`(说话者、组件标题或“Message”) 和空的 `window-buttons`，可用来放 `_ [] X` 装饰。
- **聊天行预览。**设置 `--mari-chat-row-preview`(任意值，例如 `on`) 会在聊天列表中每个聊天名称下方显示最新一句：`[data-mari-part="chat-row-preview"]`，带有 `data-role`(`user`、`assistant`、`narrator` 等)，以 `[data-mari-part="chat-row-preview-who"]` 开头（自己的消息显示“You:”，群聊里显示说话者名字）。它会让位给该行的实时状态（“typing…”、“Unsent draft”），所以一行不会同时显示两者。未设置此 Token 时，不会获取或绘制预览文字。
- **卡片后方的环境层。**`--mari-ambient-placement: behind-cards` 把环境层移到消息、首页组件和面板下方（仍在背景图上方），而非聊天上方。`--mari-ambient-mask`(完整的 `mask` 值) 控制显示区域，`--mari-ambient-mask: var(--mari-gutter-mask)` 让窗口中间保持无遮挡，让雨落在两侧留白处，不盖住文字。`--mari-gutter-clear` 设置无遮挡区域的半宽（26rem）。

### 消息数据

每条消息都带有作者、序号和生成耗时，既以属性形式供选择器和 `attr()` 使用，也以 CSS 变量形式供 `content:` 和 `counter()` 使用：

| 属性 | 变量 | 值 |
| --- | --- | --- |
| `data-character-id` |  | 角色 id(自己的消息没有) |
| `data-character-name` | `--mari-msg-char` | 显示名称（`--mari-msg-char` 是带引号的字符串） |
| `data-character` |  | 转为小写并用 `-` 替换空格的名字，供选择器使用：`[data-character="captain-faye"]` |
| `data-message-index` | `--mari-msg-index` | “显示消息编号”显示的消息编号 |
| `data-gen-ms` | `--mari-msg-gen` | 生成耗时，单位 ms(`--mari-msg-gen` 是 `"3.2s"` 这样的字符串) |

```css
[data-mari-part="message"] [data-mari-part="header"]::after {
  counter-reset: msg var(--mari-msg-index);
  content: "#" counter(msg) " · " var(--mari-msg-gen, "");
}
```

### 消息模板（HTML）

CSS 不够用时，例如要显示包含说话者名字和消息编号的状态框，主题文件可以为每种消息身份携带一个小型 HTML 模板。每条消息都会填充模板，并在消息末尾的 `[data-mari-part="message-extra"]` 框里显示，由 CSS 设置样式和位置：

```json
"templates": {
  "assistant": "<div class=\"status\"><b>{{char}}</b> · entry #{{index}} · {{gen}}</div>",
  "user": "<div class=\"status\">> {{char}} @ {{time}}</div>"
}
```

键：`message`(所有身份)、`assistant`、`user`、`narrator`(身份专属模板优先于 `message`)。字段：`{{char}}`、`{{role}}`、`{{index}}`、`{{gen}}`、`{{time}}`、`{{date}}`；未知字段留空。每个模板最多 4,000 个字符。Marinara 保留文字和布局标签（`div`、`span`、`p`、`b`、`i`、`ul`、`table`、`details`、`progress` 等）及其 `class`、`title`、`role` 和 `data-*` 属性，移除脚本、样式、行内 `style`、链接、图片、表单和事件属性。模板文字索要密钥或密码时，整个模板会被丢弃。

HTML 需要用户主动开启：只有 **Settings →
Appearance → CSS Themes → Allow themes with HTML**(设置 → 外观 → CSS 主题 → 允许含 HTML 的主题（我接受风险）) 开启时才能安装带模板的主题（默认关闭）。导入预览会提醒这一点；关闭开关后，已安装主题也不会显示其中的 HTML。

## 为每个聊天设置外观

Chat settings > Theme(聊天设置 → 主题) 可以为单个聊天设置主题（“默认外观”会关闭该聊天的自定义主题）。如果聊天恰好只有一个角色，这个选择可以成为该角色其他一对一聊天的默认主题；群聊和游戏队伍不会借用某个成员的默认主题。Theme 分区会说明当前外观来自聊天、角色还是应用。设置、资料库、编辑器和文档始终使用应用主题，只有聊天本身正在显示时，`<html>` 上才会有 `data-chat-id` 和 `data-chat-tags`。

标签是在同一个主题里为特定故事设置样式的可移植方式：`:root[data-chat-tags~="noir"] { --primary: #c9a227; }`。可以在 Chat settings > Chat Name(聊天设置 → 聊天名称) 下（“+ Add tag”）、聊天行的标签按钮，或触屏长按菜单里的“Tags”添加标签。属性中的标签会转为小写，并用 `-` 替换空格，因此“Noir Mystery”匹配 `noir-mystery`。

设置任意 `--mari-chat-*` 变量（例如 `--mari-chat-bg`、`--mari-chat-text`、`--mari-chat-radius`、`--mari-chat-font-family`）就会自动启用对应的聊天表面样式；用户不需要打开“Apply preset …”开关，就能看到主题的聊天颜色。

## 白天与夜晚

Settings > Appearance > Color Scheme(设置 → 外观 → 配色方案) 可以跟随系统或时段（默认 07:00 起用浅色、19:00 起用深色，两者均可调整）。无论哪种方式，都只是切换 `<html>` 上的 `data-theme`，因此为两种情况分别设置样式，就能让主题拥有白天和夜晚的外观：

```css
:root[data-theme="light"] {
  --mari-app-backdrop: url("theme:day.webp");
}
:root[data-theme="dark"] {
  --mari-app-backdrop: url("theme:night.webp");
}
```

每台设备根据自己的时钟决定配色方案（不参与同步），所以不同地点的手机和电脑都能显示对应的外观。主题文件也可以建议使用自动切换：`"settings": { "colorScheme": "time", "dayStart": "07:00", "nightStart": "19:00" }`(或 `"system"`)。导入预览会像其他设置一样提供这项选择。

## 主题文件

导出会将一个主题写入一个 JSON 文件：

```json
{
  "kind": "marinara.theme",
  "formatVersion": 2,
  "name": "Forest Glass",
  "author": "You",
  "version": "1.2",
  "description": "Deep greens with frosted panels.",
  "colorScheme": "dark",
  "thumbnail": "data:image/webp;base64,…",
  "settings": { "colorScheme": "dark", "visualStyle": "stage", "accent": "#3fae7a", "fontFamily": "Georgia" },
  "fonts": [{ "family": "My Display", "src": "data:font/woff2;base64,…" }],
  "images": [{ "name": "frame.webp", "src": "data:image/webp;base64,…" }],
  "backgrounds": [{ "name": "forest.webp", "src": "data:image/webp;base64,…" }],
  "css": ":root { --primary: #3fae7a; }"
}
```

鸣谢（v1.5）写在同一个文件里，并显示在主题列表的 (i) 按钮中和导入预览里：

```json
{
  "license": "CC BY 4.0",
  "labels": ["High legibility", "No motion"],
  "credits": [{ "what": "Backdrops", "by": "Jane Doe", "license": "CC BY 4.0", "url": "https://example.com" }],
  "fonts": [{ "family": "My Display", "src": "…", "license": "OFL-1.1", "credit": "Fraunces by Undercase Type" }]
}
```

`labels` 最多包含四个短标签（每个 40 个字符），显示在主题名称下方。使用 `OFL-1.1` 许可证的字体或鸣谢条目会链接到应用附带的 SIL Open Font License 正文。宽度超过 1920 px(或最长边超过 2560 px) 的图片会在导入主题时缩小。

只有 `kind`、`name` 和 `css` 必填。`templates` 见“消息模板”。`settings` 的键包括：`colorScheme`(`dark`、`light`、`time` 或 `system`)、`dayStart`、`nightStart`、`visualStyle`、`accent`、`accentLight`、`background`、`backgroundLight`、`fontFamily`、`accentPulse`、`fontSize`(Display Size(显示大小)，单位 px：12、14、16、17、19、22、26、30 或 34) 和 `reduceMotion`(true 或 false)。导入时会先显示预览，默认勾选建议的设置，但 Visual Style(视觉风格)、Accent Pulse、Display Size 和 Reduce motion 需要用户自己勾选；用户还可以决定是否将背景添加到图库。小于 4 KiB 的图片保持内嵌，以一个“small icons”标签显示。字体随主题加载（以 `@font-face` 规则形式），也随主题移除。导入与已安装主题同名的主题时，会提供更新选项；更新不会把同一背景重复添加到图库。CSS 文本上限为 256 KiB；图片、缩略图、字体和背景共用 6 MiB。如果某张图片超出限制，只会略过该图片并标出大小，其余主题内容仍可安装。普通 `.css` 文件、`{ "name", "css" }` 和旧的 `marinara.theme-folder` 导出文件仍可导入。

## 让主题保持流畅

手机和平板，尤其是用 Safari 的 iPad，每次点击都容易感受到低效 CSS 带来的迟缓。大多数主题没有问题；下面这些写法在测试中会拖慢主题：

- **在父元素上用 `:has()`，再给其子元素设置样式**，例如 `.panel:has(> .row) > *` 或 `body:has(.open) .chat *`。这样每输入一个字母、每流式输出一个词，浏览器都要重新检查整个页面。把 `:has()` 放在要设置样式的元素上（`.row:has(> img)`），或改用 `data-mari-part` 钩子。
- **同时对大量元素使用 `backdrop-filter`**，例如每条消息或每个聊天行。一两个磨砂面板没问题，一百行每行都模糊就不行。改用半透明颜色。
- **对布局做动画**（`width`、`height`、`top`、`margin`）或对大面积 `box-shadow` 做动画。改为对 `opacity` 和 `transform`，或环境层的 `background-position` 做动画。

**Settings → Advanced → Troubleshooting → Show tap timings**(设置 → 高级 → 故障排查 → 显示点击耗时) 会显示该设备上启用和关闭主题时每次点击的耗时。比较两者，就能找出拖慢操作的规则。

## 无障碍

Settings > Appearance > Accessibility(设置 → 外观 → 无障碍) 会应用用户的行间距、字间距、焦点环、高对比度、色盲友好配色，以及消息文字最小 12 px 的限制。这些值以字面量形式写入每个元素的 `mari-protected` 层（lib/accessibility-css.ts），所以主题无法覆盖，即使重新定义变量也不行。某项选项关闭时，主题可以设置：

| Token | 用途 |
| --- | --- |
| `--mari-focus-ring-color` | 应用的普通焦点环（默认为 `--primary`） |
| `--mari-cvd-good`, `--mari-cvd-warn`, `--mari-cvd-bad` | 想使用自选蓝色/橙色组合时的状态和仪表颜色 |

涉及图片时，还有三项选择优先于主题：

- **Theme art strength**(主题图画强度)（0-100%）会淡化背景图和环境叠加层。
- **High contrast**(高对比度) 还会让各表面使用配色方案自身的不透明颜色（`--background`、`--card`、`--popover`、`--sidebar`、`--secondary`、`--muted`、`--mari-rp-bubble-bg`、页面遮罩、首页叠加色、首页组件和顶栏衬底），并将主题图片强度限制在 25% 或以下，避免文字落在浅彩色图片上。主题在自己的选择器上直接写死的颜色不会改变，因此应优先使用 Token。
- **Reduce motion**(减少动态效果) 会将动态图片显示为第一帧，并停止环境叠加层的动画。强制颜色模式（Windows High Contrast）会隐藏图片和 `border-image` 边框。

使用上面的状态和仪表 Token，而不是写死绿色和红色，色盲友好开关就也能作用于主题。无论主题怎么改，跳转链接（`.mari-skip-link`）始终可用。主题尝试修改这些内容时，导入预览会告知用户。

## 安全

- 顶栏（包括全屏自动隐藏状态）、聊天侧边栏及其聊天行、资料库侧边栏、Ctrl+K 和消息框可以改样式，但不能隐藏、移动、遮盖、淡化、用滤镜消除或使其无法点击。防护机制会在主题加载后、2.5 秒和 10 秒时、打开聊天时、打开面板时、配色方案改变时、窗口尺寸变化时，以及主题自己的动画开始或结束时，对比启用和关闭主题的测量结果；如果主题破坏了其中一项，就会在该标签页关闭主题。
- 图片也计入检查（防护机制 v3）。不论是否设置 `pointer-events: none`，也不论尺寸大小，绘制在标签页、图标、聊天行或消息框上方的内容都会在控件中心被检测到。隐藏控件的图层（颜色、渐变，或该处像素大部分不透明的图片）都算遮挡。越过控件的 `border-image` 外扩区域，以及控件上的图片 `mask` 也一样。顶栏内的所有 `::before` 和 `::after` 都叠在标签和图标下方，遮罩、`list-style-image` 和 `border-image-outset` 不生效。背景图和环境叠加层不会计入：它们的结构位置就在栏下方。
- 防护机制 v4(第 4 轮)。对比度检查按绘制顺序读取文字后面的图层（`border-image` 填充、从上到下的各背景层、最后是颜色），根据实际覆盖文字的部分（大小、位置和重复方式）加权，并只对文字下方的图片取样。细线或角落里的小装饰不再计入，浅色页面上的深色遮罩会按深色处理。顶栏和消息框检查更严格：如果文字原本的最差位置达到 3:1，对应位置就必须维持这个对比度。在顶栏、聊天行和消息框里，控件自己的 `::before` 或 `::after` 上的图片如果遮住控件，也算遮挡。伪元素上使用 `position: fixed` 的图片会在编辑器里收到警告；应改用 `position: absolute`、`--mari-ambient` 或 `--mari-app-backdrop`。如果在伪元素上检测到顶栏图片，标签页和图标会像使用 `--mari-top-bar-bg` 时一样获得衬底。
- 图片上的对比度：文字后面有图片时，防护机制会读取图片颜色，不会跳过检查。
- 聊天文字（v1.5）：防护机制会对聊天屏幕上最后几行文字取样，如果主题盖住其中一半，就关闭主题（例如伪元素遮盖、卡片后方不透明的环境层，或外扩到文字上的焦点边框）。主题布局移出屏幕的行不计入，主题固定在回复上方的名字行也不计入。
- 主题通过 `content:` 添加的文字会显示在导入预览里。
- 主题文字规则（2026 年 11 月安全审计）。应用主题前，会检查主题能显示的每个字符串，无论它来自哪里（文件、编辑器、Mari、备份、单个聊天的选择）：`content:` 和 `quotes` 字符串、自定义属性（所以 `content: var(--x)` 也计入）、`@counter-style` 符号、消息框占位文字、消息模板（文字和 `title`），以及 SVG 图片内的文字。索要密钥、密码、登录或账户信息，冒充应用（“hacked”、“RCE”、“security alert”、“verified by Marinara”、“call support”），包含电话号码或网址，或单个声明中超过 80 个字母和数字的文字都会被拒绝：主题无法安装，已安装的也不会应用。检查前会先统一处理形似字母、重音符号、零宽字符、空格和 1337 拼写。选择器、`font-family` 和网格区域名称里的字符串不计入。主题名称、作者、描述和鸣谢也不得索要隐私信息或自称官方（这些字段可以包含网址）。
- URL：除了文本清理器（url() 允许列表、禁止 `@import`、字体只能使用 data:），样式表还会在应用前由浏览器解析。如果出现主题自带图片、内嵌 data: 图片和字体、`#fragments`、`about:invalid` 之外的地址，就会拒绝主题。`src()` 遵循 url() 规则，末尾未闭合的 `image-set(` 会被丢弃。
- 主题文件建议的颜色（`settings.accent`、`background` 及对应浅色值）必须是普通颜色或渐变：不能有 `url()`、`image-set()` 或任何能跳出当前值的内容。
- SVG 图片使用前会按允许列表重建：不允许 `<script>`、`<foreignObject>`、`<a>`、事件属性、外部链接、`<?xml-stylesheet?>` 或 DOCTYPE 实体，CSS 也会像主题一样清理。解码后任一边超过 8192 px 或总计超过 4,000 万像素的位图会被拒绝。
- 天气 Token 按允许列表读取：已知 Token 名称、限制在规定范围内的数字、固定列表里的词和普通颜色（不允许 `url()`、渐变或颜色函数以外的函数）。天气图片必须是主题自己的图片（经过 SVG 重建和尺寸限制后，由应用为它们生成的同源地址）；其他地址一律忽略。主题写入的内容不会作为代码执行，闪电闪光保留应用的强度和时机。
- 消息模板不能使用创建对话框、菜单或公告的角色属性，也不能使用应用自己的 `data-` 属性或 `mari-`/`ov-` 类名。
- 试用主题（“要保留此主题吗？”）只发生在当前标签页：保留之后才会同步到其他设备。没有回应就会恢复原样；鼠标悬停或焦点移到提示栏上会暂停倒计时。连按三次 Escape 会在该标签页关闭自定义主题；用于关闭 Ctrl+K、菜单或应用对话框的 Escape 不计入。

## 变更

- **手机迷你头像与更安静的动画**（2026 年 11 月 12 至 14 日，契约仍为版本 1）：`--mari-mini-avatar-size`、`--mari-mini-avatar-ring` 和 `--mari-phone-convo-avatar` 控制手机上名字旁的小头像；`--mari-chat-row-preview` 在聊天列表中加入各聊天最新一句；过渡最多等待一秒；环境层和无限循环动画在不可见时保持静止；见[让主题保持流畅](#keeping-a-theme-fast)。

- **易读的强调色文字与分屏顶栏钩子**（2026 年 11 月 11 日，契约仍为版本 1）：小字使用的强调色会在浅色模式下略微加深、深色模式下略微提亮，方便阅读标签，按钮则保留完整强调色；可用 `--mari-accent-text` 自行设置文字颜色。`[data-mari-part="top-bar"]` 对应所有设备上的顶栏，分屏视图另一侧的独立顶栏也有相同的 `[data-component="TopBar"]` 钩子（另带 `[data-split-bar]`），因此主题的顶栏图片、字体和标签页颜色也能作用于它。`--mari-game-combat-bg` 和 `-bg-hover` 使用完整的 `background` 值，支持渐变。

- **页面表面钩子**（2026 年 11 月 10 日，契约仍为版本 1）：`[data-mari-part="page"]` 是所有资料库页面、编辑器、设置和文档共用的表面，主题可以为它们提供相同面板。

- **主题图库和闪电**（2026 年 11 月 9 日，契约仍为版本 1）：入门主题从主题图库按需下载；`--mari-weather-lightning-bolt`(`on`、`none` 或 0.5 到 3 的宽度值) 会在每次雷暴闪光时沿屏幕一侧绘制分叉闪电。

- **主题天气**（2026 年 11 月，契约仍为版本 1）：`--mari-weather-*` Token(像素风格、颜色、图片、大小、速度、数量、强度、色调、关闭太阳和月亮)、`<html>` 上的 `data-mari-weather` 和 `data-mari-sky`，以及面板遮盖时暂停天气。Petal OS、NEON//GRID 和 Lantern Path 使用了这些功能。

- **第 6 轮与安全审计**（2026 年 11 月，无新增 Token，契约仍为版本 1）：入门主题只读，**Clone + Edit** 可创建可编辑副本（自 11 月 9 日起从主题图库按需下载，不再随安装附带）；鸣谢、许可证和标签显示在导入预览和 (i) 按钮中；试用主题仅作用于当前标签页，直到点击 **Keep theme**；[安全](#safety) 一节说明了主题文字规则、URL 检查、SVG 重建和建议颜色检查。

- **v1.5**（主题第 5 轮，长回复）：`--mari-chat-column`、`--mari-message-measure`、`--mari-chat-line-height`、`--mari-dialogue-weight`、`--mari-paragraph-gap`、固定说话者名字、`--mari-phone-avatar`、VN 文本框部件和渐隐效果、`--mari-message-actions`、`--mari-swipe-counter`、`--mari-card-art-placeholder`、`--mari-chat-row-art-opacity`、`--mari-focus-frame-outset`、`--mari-scrim` 和 `--mari-center-x`；dialogue、paragraph-gap、card-art 和 chat-row-art 部件，以及各处的头像占位图；旁白、Ctrl+K、窗口和对话框的窗口标题；界面强调色扩展到根作用域的界面元素；防护机制检查聊天文字；主题鸣谢、许可证和标签，附带 OFL 正文；导入时缩小大图。

- **v1.4**（主题第 4 轮）：防护机制 v4(分层背景、绘制区域、严格检查顶栏和消息框、伪元素遮盖)；主题文件中的 `fontSize` 和 `reduceMotion`，以及导入预览默认勾选建议设置；用于消息时间、Roleplay 叠加色、界面强调色和次要文字、资料库和 Ctrl+K 颜色、Combat、浮动提示、世界书圆点、首页快捷入口、文字大小下限和用户头像的 Token；`--mari-top-bar-height` 和 `--mari-top-bar-plate-active`；time、chat-header、game-hud、game-tools、avatar-placeholder 和 home-widget-glow 部件；焦点边框、窗口标题、卡片后方环境层和两侧留白遮罩插槽。

- **v1.3**（主题第 3 轮，图片）：主题文件中的 `images` 和 `url("theme:name")`；CSS 限制只计算 CSS 文本；导入时转为 WebP；背景图独立图层；背景图上方保留 `--mari-page-veil`；保留带 `var()` 的 `!important` 简写；环境叠加层；图片图标和鼠标指针；`--mari-home-wash`、`--mari-home-art` 和更多首页组件 Token；VN 对白、VN 立绘插槽和游戏旁白钩子；主题文件可建议 Follow time of day(跟随时段)；防护机制 v3。

- **v1.2**：消息模板插槽（主题文件中的 `templates`、`[data-mari-part="message-extra"]`），用户通过“允许含 HTML 的主题（我接受风险）”主动开启。

- **v1.1**：所有聊天模式中的消息钩子，带角色、序号和生成耗时；avatar、header、actions 和 reasoning 部件；`--mari-composer-placeholder`；背景图 v2(大小、位置、重复、像素化、图层)，也显示在聊天后方；`--mari-page-veil`；`--mari-top-bar-bg`；`--mari-text-outline`、`--mari-dialogue-color`、`--mari-chat-font-size`、`--mari-msg-head-rule`；首页组件 Token，Professor Mari 作为 `home-widget`。`--mari-stage-empty-bg` 现在是 `background`(支持渐变)。
- **v1.0.1**：防护机制 v2、受保护的无障碍值、添加文字检查。安装要么全部成功，要么全部不安装；附带背景会安装；Go back(返回) 也会恢复主题应用的设置；主题字体显示在 Font(字体) 列表里；保留 `url(#id)` 引用；从字体文件读取附带字体的名称。
- **v1**（首次发布的契约）：上文的主题 Token、部件钩子、背景图和强调色效果。
