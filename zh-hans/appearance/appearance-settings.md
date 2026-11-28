# 外观设置

**Appearance**(外观) 选项卡决定 Marinara 的外观：颜色、文字大小、间距、背景，以及聊天按钮和窗口。旁边的 **Conversation**(对话)、**Roleplay**(角色扮演) 和 **Game**(游戏) 选项卡分别设置各聊天模式的样式。

想找别的内容？

- 现成的外观或自己的主题：[自定义 CSS 主题](custom-css-themes.md)。
- 换一种字体：[自定义字体与 Google Fonts](fonts.md)。
- 聊天背景图：[背景库](chat-backgrounds.md)。
- 角色在聊天里的专属外观：[角色卡 CSS 主题指南](card-css-theming.md)。

## 打开外观设置

1. 打开 **Library → Settings**(资料库 → 设置)。
2. 点击 **Appearance** 选项卡。
3. 点击选项卡下方一行里的板块名称跳转，也可以滚动浏览。

| 选项卡 | 板块 |
| --- | --- |
| **Appearance** | **Theme**(主题)、**Fonts & Text Size**(字体与文字大小)、**Accessibility**(无障碍)、**Text Colors**(文字颜色)、**Layout**(布局)、**Effects**(效果)、**Backgrounds**(背景)、**Chat Buttons & Windows**(聊天按钮与窗口)、**CSS Themes**(CSS 主题) |
| **Conversation** | **Conversation Layout**(对话布局)、**Conversation Background**(对话背景) |
| **Roleplay** | **Tracker Panel**(追踪器面板)、**Roleplay Messages**(角色扮演消息)、**Avatars**(头像)、**Visual Novel**(视觉小说) |
| **Game** | **Game Text**(游戏文本)、**Game Art**(游戏美术)、**Game Assets**(游戏素材) |

想从头再来，就点击 **Theme** 顶部的 **Reset Appearance**(重置外观)。它会把外观恢复成 Marinara 的默认设置，清除当前聊天的背景，并关闭自定义主题。

在经典布局里，这些板块位于 **Appearance** 选项卡下，通过四个按钮切换：**App**(应用)、**Conversation**、**Roleplay** 和 **Game**。

## 主题

| 设置 | 作用 |
| --- | --- |
| **Visual Style**(视觉风格) | **Default (Marinara)**(默认（Marinara）) 是带辉光效果的复古 Y2K 风格。**SillyTavern** 是干净极简的风格。它只改变外观，和从 SillyTavern 导入没有任何关系。**Stage** 使用新布局的梅紫色、黄铜色和深红色。 |
| **New layout (UI overhaul preview)**(新布局（界面改版预览）) | 默认开启。关闭后回到经典布局。这些指南优先介绍新布局。 |
| **Look on this device**(本设备外观) | **Same as my other devices**(与其他设备相同)（默认）会在所有设备间共享视觉风格、颜色、字体和自定义主题。**Only this device**(仅此设备) 让这台设备使用独立的外观，例如手机用浅色，电脑用深色。 |
| **Color Scheme**(配色方案) | 可选 **Dark**(深色)（默认）、**Light**(浅色)、**Follow system**(跟随系统) 或 **Follow time of day**(跟随时段)，最后一项会根据这台设备的时钟，在指定时间切换。 |
| **Custom Mouse Pointer**(自定义鼠标指针) | 默认开启，使用 Marinara 的强调色光标。关闭它就改用系统光标，也可以把光标交给自定义主题设置。 |
| **Accent Color**(强调色) | 用于按钮、激活状态的图标、聚焦边框、高亮和描边。默认是 **Marinara Gradient**(Marinara 渐变)，一种粉、橙、青三色混合的渐变。 |
| **Accent Pulse**(强调色脉动) | 让强调色柔和地明暗交替，或在渐变的几种颜色之间循环。桌面端默认开启，手机上默认关闭。 |
| **RGB Mode**(RGB 模式) | 让强调色在彩虹色里循环。已保存的 **Accent Color** 保持不变。默认关闭。 |

**Accent Color** 可以填纯色，也可以填渐变，也就是两种或多种颜色之间的平滑过渡。点击 **Reset to default**(重置为默认值) 就会回到默认值。应用背景跟随 Dark 或 Light 模式，自定义主题也可以设置自己的背景。**Accent Pulse** 和 **RGB Mode** 同一时间只能开一个。

## 字体与文字大小

- **Font**(字体) 用来选择应用字体。见[自定义字体与 Google Fonts](fonts.md)。
- **Display Size**(显示大小) 决定这台设备上整个应用的基准字号，改动会立即生效。

| 选项 | 大小 |
| --- | --- |
| **Tiny**(极小) | 12 px |
| **Small**(小) | 14 px |
| **Medium**(中等) | 16 px |
| **Default** | 17 px |
| **Large**(大) | 19 px |
| **Huge**(特大) | 22 px |
| **Extra large**(超大) | 26 px |
| **Extra extra large**(超超大) | 30 px |
| **Maximum**(最大) | 34 px |

- **Chat Font Size**(聊天字号) 是一个滑块，控制聊天消息正文的大小，范围从 12 px 到 72 px，默认 16 px。

## 无障碍

| 设置 | 作用 |
| --- | --- |
| **Line spacing**(行间距) | 消息和较长文本的行间距：**Default**(默认)、**Relaxed (1.6)**(舒展（1.6）)、**Loose (1.8)**(宽松（1.8）) 或 **Double (2.0)**(双倍（2.0）)。菜单和按钮的大小不变。 |
| **Letter spacing**(字间距) | 应用各处的字间距：**Default**、**A little wider**(稍宽)、**Wider**(较宽) 或 **Widest**(最宽)。 |
| **High contrast**(高对比度) | 增强文字、边框和焦点颜色。选择 **Follow system** 后，设备要求更高对比度时会自动开启。 |
| **Strong focus rings**(醒目焦点环) | 为键盘当前聚焦的项目加上粗描边。按 <kbd>Tab</kbd> 还会显示 **Skip to content**(跳到内容) 链接。 |
| **Reduce motion**(减少动态效果) | 停止动画、过渡、**Accent Pulse** 和主题特效。设备要求减少动态效果时会自动开启。 |
| **Theme art strength**(主题图画强度) | 控制自定义主题的背景图片和叠加效果（雨、落叶、扫描线）显示得有多明显。主题图画影响文字阅读时，可以调低。 |
| **Colour-blind-safe colours**(色盲友好配色) | 状态圆点、仪表和删除按钮用蓝色与橙色代替绿色与红色。 |

## 文字颜色

- **Chat Text Color**(聊天文字颜色) 是消息正文的主色。默认值在 Dark 下是 `#d4d4d4`，在 Light 下是 `#1a1025`。
- **Default Dialogue Color**(默认对话颜色) 决定引号内对白的颜色，前提是角色或用户角色没有自己的 Dialogue Highlight Color(对话高亮颜色)。卡片上的颜色优先。开启 **Chat Buttons & Windows** 里的 **Apply preset colors**(应用预设颜色) 时，对白使用该样式的文字颜色。
- **Chat Chrome Text Color**(聊天界面文字颜色) 决定聊天周围各控件的文字：追踪器小组件、文件夹标签、设置项说明，以及通过聊天按钮打开的窗口。它的默认值与 **Chat Text Color** 相同。
- **Text Outline / Stroke**(文字描边) 会加一圈描边，背景再花也能看清文字。可以设置颜色和 **Width**(宽度)，范围 0 到 5 px。默认 0.5 px，设为 0 就是关闭描边。

## 布局

- **Desktop sidebar width**(桌面端侧边栏宽度) 设置电脑上两侧侧边栏的宽度。**Reset width**(重置宽度) 会恢复原来的宽度。手机保持原有布局。
- **Show Android status bar**(显示 Android 状态栏) 在 Android 应用里显示手机状态栏。

## 效果

- **Dynamic weather effects (rain, snow, fog, etc.)**(动态天气效果（雨、雪、雾等）) 默认开启。它会根据故事里的天气和时段显示天气效果，需要为这个聊天开启 **World State**(世界状态) 智能体。见[智能体：聊天里的 AI 帮手](../agents/agents-overview.md)。
- **Reduce Ambient Animations & Effects**(减少环境动画和特效) 会停止装饰性动画、粒子、轮换预览和文字逐渐显现的效果。

- **以文本显示掷骰**（默认关闭）把每次掷骰显示为一行简短文字，包含骰子、各次结果和总数，替代骰子动画。掷骰仍会进行，模型和游戏也照常收到结果。适用于所有聊天模式，包括技能检定中的骰子。
- **Reduced paint effects**(降低绘制特效) 会简化开销大的半透明面板和阴影，让性能较弱的设备也能保持流畅。

## 背景

这个板块里有 **Chat Background**(聊天背景) 选择器和 **Background Blur**(背景模糊)。选择器显示当前聊天的背景（或 **Default background**(默认背景)）以及最近选过的背景。点击图片或 **Browse library**(浏览背景库) 就能换一张。这里还有：

- **Conversation background image opacity**(对话背景图片不透明度)：决定 Conversation 模式下聊天背景显示得有多明显。
- **Chat background behind side panels**(侧面板后的聊天背景)：把当前聊天的背景柔化后延伸到侧边栏和顶栏后面。
- **Chat List Backgrounds**(聊天列表背景)：在聊天列表里，把每个聊天的背景作为一条淡化的横幅显示在该行后面。可选 **Active & Hovered**(当前和悬停的行)、**Every Row**(每一行) 或 **Off**(关闭)。

见[背景库](chat-backgrounds.md)。

## 聊天按钮与窗口

**Chat widget style**(聊天小组件样式) 设置可移动聊天按钮、窗口和区域的外观。可选 **Default**、**Dottore**(冰蓝、浅色金属和切角) 或 **Prof. Mari**(金边故事书边框)。选择一种样式后，会重置下方的控件。

| 控件 | 作用 |
| --- | --- |
| **Font** | **Preset font**(预设字体)、**App font**(应用字体)、**Sans serif**(无衬线字体)、**Storybook serif**(故事书衬线字体) 或 **Technical monospace**(技术等宽字体)。 |
| **Shape**(形状) | **Preset shape**(预设形状)、**Rounded**(圆角)、**Square**(方形)、**Cut corners**(切角) 或 **Arched**(拱形)。 |
| **Button size (px)**(按钮大小（px）) | 调整可移动聊天按钮及其图标的大小。输入 32 到 96 之间的值，或者留空使用默认值。 |
| **Border & Buttons Color**(边框和按钮颜色)、**Background Color**(背景颜色)、**Text Color**(文字颜色) | 三种主要颜色。重置某项颜色，就会跟随预设和深色或浅色模式。 |
| **Apply preset font**(应用预设字体)、**Apply preset shape**(应用预设形状)、**Apply preset colors** | 也把这种样式带到消息、输入框和聊天控件里。默认关闭。 |

Professor Mari 可以帮你制作自定义聊天样式，在聊天里告诉她就行。

## CSS 主题

这里有现成的主题，也可以制作或导入主题。见[自定义 CSS 主题](custom-css-themes.md)。

## Conversation 选项卡

- **Chat Layout**(聊天布局)（在 **Conversation Layout** 里）改变 Conversation 消息的样子，并带实时预览。**Linear**(线性)（默认）显示聊天记录式的逐行排列。**Bubbles**(气泡) 显示即时通讯式的气泡。
- **Avatar Shape**(头像形状) 可选 **Circular**(圆形) 或 **Square**(方形)。头像大小不变。
- **Profile pictures on phones**(手机上的头像) 设置手机上所有聊天模式中消息旁的头像。**Mini**(迷你)（默认）在每个名字旁放一个小头像，角色的放在名字前，你的放在名字后，让消息保持完整宽度。**Full**(完整) 保留头像栏，**Off** 则不显示头像。平板和电脑始终显示完整头像。
- **Conversation Theme**(Conversation 主题)（在 **Conversation Background** 里）为每个 Conversation 聊天设置背后的双色渐变。**Dark** 和 **Light** 两个选项卡各自保留自己的渐变。这是所有 Conversation 聊天的默认设置，不是针对单个聊天的设置。

备选回复菜单的开关在 **Settings → Chatting → Editing & Swipes**(设置 → 聊天中 → 编辑与备选回复) 里。

## Roleplay 选项卡

**Tracker Panel** 设置 Roleplay 聊天旁的属性、服装和地点面板的样式。见 [Roleplay 的 HUD 与追踪器](../roleplay/hud-and-trackers.md)。

**Roleplay Messages**

| 设置 | 作用 | 默认值 |
| --- | --- | --- |
| **Chat position**(聊天位置) | 宽屏时消息和输入框的位置：**Left**(左侧)、**Center**(居中) 或 **Right**(右侧)。手机上聊天始终占满整个宽度。 | **Center** |
| **Custom chat width**(自定义聊天宽度) | 自定义消息栏的宽度。 | 关闭 |
| **Roleplay Messages Background Opacity**(角色扮演消息背景不透明度) | 调低它，背景就会透过消息气泡显出来。它会覆盖卡片和预设里颜色的透明度。 | 90% |
| **Stretch Messages**(拉伸消息) | 让每条消息占满整行，使短消息与长消息对齐。 | 关闭 |
| **Hide line under names**(隐藏名字下方的线) | 去掉名字下方的细线。 | 关闭 |

**Avatars**

| 设置 | 作用 | 默认值 |
| --- | --- | --- |
| 头像样式 | **None**(无)、**Small Circles**(小圆形)、**Small Rectangles**(小矩形)、**Glued Side Panel**(贴合侧面板) 或 **Faded Side Panel**(渐隐侧面板)，最后一种是逐渐淡入消息的宽幅肖像。 | **Small Circles** |
| **Scrollable Avatars**(可滚动头像) | 滚动阅读长消息时，让头像一直留在视野内。 | 关闭 |
| **Narrator's Cycling Avatars**(旁白头像轮换)、**Narrator's Avatar Borders**(旁白头像边框) | 设置旁白头像的外观。 | |
| **Message avatar scale**(消息头像缩放) | 75% 到 250%。 | 100% |
| **Default sprite scale**(默认立绘缩放) | 50% 到 175%。聊天自己设置的立绘尺寸依然优先。 | 100% |

**Visual Novel**

**Visual Novel display**(视觉小说显示) 每次显示一个写完的段落，配上对白半身像和你的立绘。它会设置新建 Roleplay 聊天以及尚未自行选择显示方式的聊天的显示方式。**Auto-play VN paragraphs**(自动播放视觉小说段落) 及其 **Paragraph delay**(段落间隔)、**Dialogue portrait scale**(对话肖像缩放) 和 **Full-body sprite scale**(全身立绘缩放) 决定播放方式。

**Show Thinking In Messages**(在消息中显示思考过程) 和 **Don't Collapse Thinking**(不折叠思考过程) 在 **Settings → Chatting → Thinking**(设置 → 聊天中 → 思考) 里。

## Game 选项卡

**Game Text**

- **Instantly reveal game text**(立即显示游戏文本) 会跳过打字效果。
- **Mouse-wheel + click navigation**(滚轮与点击导航) 让你用鼠标浏览故事。
- **Game narration speed**(游戏旁白速度) 和 **Game auto-play segment delay**(游戏自动播放片段间隔) 设置文字播放和推进的速度。
- **Game Dialogue Display**(游戏对话显示)：**Classic Dialogue Box**(经典对话框)（默认）一次显示一个段落，更早的内容在 **Logs**(日志) 里。**History Above Dialogue Box**(对话框上方的历史记录) 会把之前的段落显示在对白框上方。
- **Game text effects**(游戏文本特效) 默认开启，会给富有戏剧性的词语、全大写字母、插入语和文字特效标签加上动画。关闭它就显示纯文本。

**Game Art** 有两个滑块：**Dialogue portrait scale**(75% 到 175%，默认 100%) 和 **Full-body sprite scale**(75% 到 275%，默认 135%)。

**Game Assets** 的说明见[游戏素材](../game/game-assets.md)。

## 只保存在本设备的设置

大多数外观设置会同步到你的其他设备，**Display Size** 和 **Chat Font Size** 不会。它们保存在你使用的浏览器里。想让某台设备使用完全不同的外观，可以使用 **Theme** 里的 **Look on this device**。哪些设置会同步，见[设置总览](../settings/settings-overview.md)。

## 相关指南

- [自定义 CSS 主题](custom-css-themes.md)
- [自定义字体与 Google Fonts](fonts.md)
- [背景库](chat-backgrounds.md)
- [角色卡 CSS 主题指南](card-css-theming.md)
- [设置总览](../settings/settings-overview.md)
