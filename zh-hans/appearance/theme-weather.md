# 主题中的天气

故事里有天气时，Marinara 会在聊天上方绘制天气效果：雨、雪、雾、落叶、花瓣、星星、太阳或月亮。主题可以为这些效果设计自己的外观。可以给雨换个颜色，让雪变成像素方块，用自己画的图片替换树叶，或在下雨时让背景变灰。

这篇指南会一步步说明做法。首先需要有自己的主题。如果还没有，[主题作者指南](theme-author-guide.md)会教你花几分钟做一个。那里的[天气](theme-author-guide.md#weather)一节是本页的简明参考版。

## 天气如何运作

天气来自故事。在 Roleplay(角色扮演) 或 Game Mode(游戏模式) 聊天里，**世界状态**智能体会追踪天气和时段，例如“heavy rain”和“night”。Marinara 会读取这些词，决定绘制什么：“rain”对应雨丝，“snow”对应雪花，“night”对应星星和月亮，以此类推。

绘制始终由应用完成。主题本身不绘制任何东西，而是设置几个 `--mari-weather-` 变量（带名字的设置，类似 `--primary`），应用读取它们后，就会按主题的设定绘制天气。这样能保证主题安全：主题里的任何内容都不能运行代码，用户自己的设置（例如减少动态效果）始终优先。

### 在室内时，天气留在室外

故事发生在室内时，例如旅店、卧室或 World Maps(世界地图) 里的房间，应用不会让雨落满整个屏幕。它只保留天气的色调和闪电亮光，房间里仍然是干燥的。应用根据世界状态的位置（“Tideglass Inn, Brinewatch”）或 World Maps 的地点类型判断是否在“室内”。无法判断时，天气照常绘制。开启 **Weather Versions of Backgrounds**(背景的天气版本) 后（见[背景的天气版本](../media/scene-backgrounds.md#weather-versions-of-backgrounds)），背景图片本身会显示窗上的雨，动态天气也会恢复，但只绘制在窗玻璃上。主题的天气外观也会应用到那里。

### 不使用主题时的天气

这是不使用主题时的雨夜：暗蓝色的色调上落着淡淡的细雨丝。下方的图片展示了同一个聊天使用三种入门主题的效果。

## 边制作边查看天气

不用等故事里下雨，可以自己设置天气。

1. 打开**资料库 → 设置 → 外观**，确认**动态天气效果（雨、雪、雾等）**已开启（位于**效果**下），且**减少环境动画和特效**已关闭。
2. 打开一个 Roleplay 聊天，再打开**聊天设置 → 智能体**，开启**世界状态**。
3. 打开**世界状态**追踪器。电脑上，它位于 Tracker Panel。手机上，点按**世界状态**按钮。
4. 点击**天气**的值，输入天气词，例如 `heavy rain`。点击**时间**，输入 `night`。
5. 天气会立刻出现。聊天现在会在顶栏中拥有自己的标签页。

制作主题时，设置页面会占据窗口中央，后面的天气会暂停。保存主题后，点击顶栏中的聊天标签页查看效果。要试其他天气，修改第 4 步中的词即可。下方**哪些词对应哪些天气**一节的表格列出了所有词。

> **提示：**锁定天气值（追踪器中的锁定模式），防止 AI 在测试时修改它。见 [Roleplay HUD 与追踪器](../roleplay/hud-and-trackers.md)。

## 一步步制作第一个天气外观

先给雨换个颜色，并拉长雨丝，就像 NEON//GRID 入门主题那样。

1. 打开**资料库 → 设置 → 外观 → CSS 主题**，点击自己主题上的**编辑主题 CSS**（代码图标）。
2. 在 CSS 靠近开头的位置找到 `:root {` 这一行。如果主题里没有，就另起一行添加 `:root {`，下一行添加 `}`。
3. 在这个块内、`}` 之前加入以下几行：

```css
--mari-weather-rain-color: #3ff0ff;
--mari-weather-rain-length: 2.2;
--mari-weather-strength: 1.4;
```

4. 点击**保存**。如果 Marinara 询问**要保留此主题吗？**，点击**保留主题**。
5. 点击顶栏中测试聊天的标签页。雨现在变成了青色，雨丝长度约为原来的两倍，也更加明显。

每一行的作用：

- `--mari-weather-rain-color` 是雨滴的颜色。任意颜色都可以：例如十六进制颜色代码 `#3ff0ff`、颜色名称 `skyblue`，或 `rgb(63 240 255)`。
- `--mari-weather-rain-length` 让雨丝变长或变短。`1` 是正常长度，`2.2` 是略多于两倍的长度。
- `--mari-weather-strength` 让所有粒子更明显（大于 `1`）或更淡（小于 `1`）。

### 最终效果

这是同一个雨夜在 NEON//GRID 中的样子，它使用了这三行设置和少量其他设置。

### 为白天和夜晚选择颜色

在深色背景上好看的颜色，到了浅色背景上可能就看不见了。把白天的颜色放进 `[data-theme="light"]` 块，夜晚的颜色放进 `[data-theme="dark"]` 块，做法和设置其他颜色一样：

```css
:root[data-theme="light"] {
  --mari-weather-rain-color: #1aa7c4;
  --mari-weather-snow-color: #22b8d6;
}
:root[data-theme="dark"] {
  --mari-weather-rain-color: #3ff0ff;
  --mari-weather-snow-color: #7af7ff;
}
```

## 哪些词对应哪些天气

每种天气都有一个简短的名字。在变量中使用这个名字，例如 `snow` 用在 `--mari-weather-snow-color` 里。

| 故事中的词 | 应用绘制的效果 | 变量中的名字 |
| --- | --- | --- |
| rain、downpour(雨、倾盆大雨) | 雨丝 | `rain` |
| storm、thunder、lightning(风暴、雷、闪电) | 暴雨与闪电亮光 | `rain`(亮光：`lightning-color`，闪电形状：`lightning-bolt`) |
| snow、sleet、blizzard、frost、cold(雪、雨夹雪、暴风雪、霜、寒冷) | 雪花 | `snow` |
| hail(冰雹) | 冰雹 | `hail` |
| fog、mist、haze(雾、薄雾、霾) | 屏幕低处、地面薄雾上方的柔和雾团 | `fog` |
| sand、dust storm(沙、沙尘暴) | 飞沙 | `sand` |
| ash、smoke、volcanic(灰烬、烟、火山) | 飘落的灰烬 | `ash` |
| fire、embers、inferno(火、余烬、烈火) | 升腾的余烬 | `ember` |
| wind、breeze、gusts(风、微风、阵风) | 落叶 | `leaf` |
| cherry blossom、petals(樱花、花瓣) | 飘落的花瓣 | `petal` |
| aurora、northern lights(极光、北极光) | 带状极光 | `aurora` |
| clear、sunny、cloudy 或其他词（晴朗、晴天、多云等） | 少量漂浮的微粒 | `dust` |
| night(时段：夜晚) | 星星和萤火虫 | `star`、`firefly` |
| dusk、evening(时段：黄昏、傍晚) | 萤火虫 | `firefly` |
| morning、day、dusk(早晨、白天、黄昏，天空晴朗时) | 太阳 | `sun` |
| night(夜晚，天空晴朗时) | 月亮 | `moon` |

有雾或下雪的夜晚不显示星星，下雨时不显示萤火虫。太阳和月亮只在天空晴朗时出现。

## 改变颜色、大小和形状

表格中的每种效果都支持相同的三项设置。把效果名字放在变量的中间。

| 变量 | 作用 | 取值 |
| --- | --- | --- |
| `--mari-weather-snow-color` | 颜色 | 单一颜色：`#fff0f7`、`white`、`rgb(...)`、`hsl(...)` |
| `--mari-weather-snow-size` | 每个粒子的大小 | `0.5`(一半) 到 `3`(三倍) |
| `--mari-weather-snow-shape` | 圆点或小方块 | `round` 或 `square` |

把 `snow` 换成表格中的其他名字即可，例如 `--mari-weather-ember-color` 或 `--mari-weather-leaf-shape`。

示例：为电脑风格的主题制作“数据雪”，用青色小方块替代雪花。

```css
:root {
  --mari-weather-snow-color: #7af7ff;
  --mari-weather-snow-shape: square;
  --mari-weather-snow-size: 1.2;
}
```

形状设置不适用于雨、雾或极光，它们会保留自己的形态。对于雾，`--mari-weather-fog-color` 会同时给漂移的雾团和地面薄雾着色，`--mari-weather-tint-strength` 则控制雾的浓淡。

## 使用自己的图片

每种效果都可以用自己制作的图片代替圆点和雨丝飘落：枫叶、樱花花瓣、纸星星、小小的像素雪花。

1. 画一些或找一些背景透明的小图片，例如 PNG。图片保持小尺寸就行：一片叶子的宽度约 24 到 64 像素已经足够。更大的图片会缩小到最长边 160 像素。
2. 在主题编辑器中，打开**图片和分享详情（作者、版本、缩略图、字体）**，点击**添加图片**。每种效果最多添加四张图片。
3. 在 CSS 中，把它们列在对应效果的 `-image` 变量里，每张图片之间用空格分隔：

```css
:root {
  --mari-weather-leaf-image: url("theme:leaf-1.png") url("theme:leaf-2.png") url("theme:leaf-3.png");
  --mari-weather-leaf-size: 0.8;
}
```

4. 保存，打开测试聊天，把天气设为 `windy`。现在叶子会飘落，每片叶子都会从这些图片中选一张。

图片使用提示：

- 点击**图片和分享详情（作者、版本、缩略图、字体）**下的图片名称，就能在 CSS 光标处插入它的 `url("theme:...")`，不用手动输入名字。
- 图片会保留添加时的完整文件名，包括扩展名，例如 `leaf-1.png`。使用的名字必须与列表显示的完全一致。
- 图片按自身的颜色绘制，因此 `-color` 变量对这种效果不起作用。
- 用 `-size` 统一放大或缩小图片。平滑风格还会让大小略有变化，避免每张看起来都一样。
- 在平滑风格中，树叶、花瓣和灰烬飘落时会轻轻旋转。其他效果保持直立。
- 图片必须包含在主题内。指向其他网站图片的链接会被忽略。

Lantern Path 入门主题就是这样使用四张手绘树叶图片的。

## 像素风格

像素风格会把整个天气层放到由大方块像素组成的网格上，让它与像素画主题相配。雨滴、雪花和星星都会变成边缘清晰的小方块。

```css
:root {
  --mari-weather-style: pixel;
  --mari-weather-pixel-size: 3px;
  --mari-weather-petal-image: url("theme:wx-petal-1.png") url("theme:wx-petal-2.png");
  --mari-weather-petal-size: 3;
}
```

- `--mari-weather-style: pixel` 开启像素风格。`smooth`(或不设置)则是普通外观。
- `--mari-weather-pixel-size` 决定每个方块的大小，范围是 `2px` 到 `6px`。可以先试 `3px`。
- 在像素风格中，图片按自身尺寸乘以 `-size` 绘制。绘画像素画时，每个画面像素使用 1 个图片像素，再把 `-size` 设成与像素大小相同的数值，让图片的像素与天气的像素对齐。Petal OS 用 `3` 的大小绘制 11 像素的花瓣。
- 在像素风格中，图片飘落时不会旋转，而且会以不透明的方式绘制（淡入淡出分三个明确的档位），让像素画保持清晰。

### 示例：Petal OS

这是花瓣飘落的夜晚使用 Petal OS 入门主题的样子。花瓣来自主题自带的 11 像素图画，星星也位于同一个 3 px 网格上。

## 太阳和月亮

和其他效果一样，太阳和月亮也支持颜色、大小和一张图片：

```css
:root {
  --mari-weather-sun-color: #ffe9a8;
  --mari-weather-moon-color: #ffe2f0;
  --mari-weather-moon-size: 1.5;
}
```

如果背景里已经画了月亮，就关闭应用的月亮，免得出现两个：

```css
:root[data-theme="dark"] {
  --mari-weather-moon: none;
}
```

`--mari-weather-sun: none` 对太阳起同样的作用。

## 调淡或增强效果

这些设置会同时改变整个天气层：

| 变量 | 作用 | 取值 |
| --- | --- | --- |
| `--mari-weather-amount` | 飘落的粒子数量 | `0.25`(四分之一) 到 `1`(正常)。主题可以减少天气粒子，但不能增加。 |
| `--mari-weather-speed` | 飘落速度 | `0.5`(一半速度) 到 `1.5` |
| `--mari-weather-strength` | 粒子的明显程度 | `0.5`(淡) 到 `1.5`(浓) |
| `--mari-weather-tint-strength` | 覆盖聊天的色调（下雨时偏蓝，夜晚变暗） | `0`(无) 到 `1`(正常) |
| `--mari-weather-lightning-color` | 闪电亮光的颜色 | 单一颜色。亮光始终柔和、缓慢，对闪光敏感的人也能安全使用。 |
| `--mari-weather-lightning-bolt` | 每次闪光时，用闪电颜色绘制一道分叉闪电 | `on`，或 `0.5` 到 `3` 的宽度值。`none`(默认值) 只保留亮光。 |

想做一个安静的阅读主题，可以试试 `--mari-weather-amount: 0.5;` 和 `--mari-weather-tint-strength: 0.3;`。

### 分叉闪电

默认情况下，风暴只会让屏幕闪光。添加 `--mari-weather-lightning-bolt`，就能在每次闪光时绘制一道真正的分叉闪电：

```css
:root {
  --mari-weather-lightning-color: #e8f2ff;
  --mari-weather-lightning-bolt: 1.2;
}
```

闪电会沿屏幕左侧或右侧劈下，不会穿过中间的聊天文字。它会分成几条叉枝，并发出设定颜色的光。它只在应用自身的亮光出现时显示，并随亮光一起消退，因此主题不能增加闪光次数或加快闪光。在像素风格中，闪电会按像素网格绘制成方块。大多数入门主题都使用了分叉闪电：Apogee Lounge、Dewglass、Gutterlight、Under Sail 和 Velvet Casket。Granite Watch 的场景在室内，所以关闭了分叉闪电。

## 让背景随天气变化

主题自身的图画也可以随天气变化。聊天显示天气时，Marinara 会向页面添加两个词，供 CSS 检查：

- `data-mari-weather` 的值是 `clear`、`cloudy`、`rain`、`storm`、`snow`、`hail`、`fog`、`sand`、`ash`、`embers`、`wind`、`blossom` 或 `aurora` 之一。
- `data-mari-sky` 的值是 `dawn`、`day`、`dusk` 或 `night` 之一。

它们的值始终是上面的词之一，不会使用故事原文。聊天没有天气，或用户关闭天气效果时，它们就会消失。

### 示例：雨中的 Lantern Path

下雨时，Lantern Path 会把阳光明媚的森林换成灰蒙蒙的阴天森林。左边是晴朗的早晨，右边是同一个聊天在雨中的样子。

### 替换背景

要实现同样的效果，添加一个仅在下雨或风暴时生效的块，为它指定第二张背景图片：

```css
:root {
  --mari-app-backdrop: url("theme:forest-sunny.webp");
}
:root[data-mari-weather="rain"],
:root[data-mari-weather="storm"] {
  --mari-app-backdrop: url("theme:forest-overcast.webp");
}
```

读法：`:root[data-mari-weather="rain"]` 表示“仅在下雨时”。逗号表示“或”。

- 如果主题设置的是 `--mari-app-backdrop-layers` 而不是 `--mari-app-backdrop`，也要在天气块中修改 `--mari-app-backdrop-layers`，因为它会优先于单张图片设置。
- 要同时匹配白天和夜晚，再加上配色方案：`:root[data-theme="dark"][data-mari-weather="rain"]` 表示“深色模式下的雨夜”。
- `data-mari-sky` 的用法相同，例如用 `:root[data-mari-sky="dusk"]` 显示图画的日落版本。

### 避免叠加两套天气

如果主题有自己的落叶或雨等环境叠加层（`--mari-ambient`），它可能会和故事的天气叠在一起。只要有实际天气粒子飘落，就关闭它：

```css
:root[data-mari-weather]:not([data-mari-weather="clear"], [data-mari-weather="cloudy"]) {
  --mari-ambient: none;
}
```

这段的意思是：“有天气，且不是晴朗或多云时，隐藏环境叠加层”。

自己制作的落叶或雨叠加层也可以只留在室外。天气显示时，`data-mari-shelter` 的值为 `indoors` 或 `outdoors`（应用无法判断时则不存在）：

```css
:root[data-mari-shelter="indoors"] {
  --mari-ambient: none;
}
```

## 哪些仍由用户决定

主题改变的是天气的外观，不会决定用户是否看到天气：

- 主题不能开启或关闭天气。这由设置中的**动态天气效果（雨、雪、雾等）**决定。
- 开启**减少环境动画和特效**或设备的减少动态效果设置后，应用完全不绘制天气。背景仍会跟随 `data-mari-weather` 变化，因为替换图片不会产生运动。
- **降低绘制特效**会去掉色调和辉光，并减少绘制的粒子。
- **主题图画强度**会像调淡背景一样调淡天气，**高对比度**则会让天气保持淡化。
- 面板、编辑器或 Mari 遮住聊天时，天气会暂停，以节省电量。

## 没有效果时怎么办

- **什么都没变。**检查变量是否在 `{ }` 块内，是否以 `;` 结尾。检查拼写：应为 `--mari-weather-rain-color`，其中 `color` 使用美式拼写。
- **某个值被忽略了。**超出变量范围的数值会被调整到最近的边界值，应用无法识别的值会被丢弃。颜色必须是单一颜色：渐变和 `url()` 会被忽略。
- **自己的图片没有显示。**图片必须位于主题的图片列表里，`url("theme:...")` 中的名字必须与它完全一致，包括正确的扩展名（`.webp` 或 `.png`）。
- **完全没有天气。**检查聊天是否开启了**世界状态**，天气值是否包含表格中的词，**动态天气效果（雨、雪、雾等）**是否开启，以及**减少环境动画和特效**是否关闭。
- **天气在 Roleplay 中显示，但在 Conversation(对话模式) 中不显示。**这是正常的。天气只在 Roleplay 和 Game Mode 聊天中显示。

## 参考入门主题

主题图库中的每个入门主题都展示了天气效果。下载一个，点击**复制并编辑**，再滚动到 CSS 中标有 `Weather` 的部分，就能看到做法。

- **NEON//GRID**：细长的青色雨丝、方块状的“数据雪”，用洋红色火花替代树叶和花瓣。实际天气粒子落下时，它画好的雨叠加层会让位。
- **Petal OS**：3 px 网格上的像素风格，自带像素花瓣，夜晚是淡粉色的雨，白天是深浆果色的雨，坏天气时城市会变灰。
- **Lantern Path**：自带手绘树叶、暖色萤火虫，不显示应用的太阳（背景自己画了光照），背景会随天气变成阴天或雪景。
- **Dewglass**：用自带的肥皂泡替代微粒，用代码绘制水晶雪花，搭配水蓝色的雨、青色分叉闪电，以及会变成阴天、结冰或雾气弥漫的潟湖背景。
- **Velvet Casket**：白天和夜晚各有不同的风暴：白天是粉色分叉闪电和淡紫色的雨，夜晚墓地上空是紫白色分叉闪电和银色的雨，风中还有主题自带的蝙蝠和玫瑰花瓣。
- **Gutterlight**：冰冷的漫画风格雨景、风中撕碎的报纸、钠灯黄色的烟雾，以及闪电劈下时石像鬼上水流倾泻的风暴背景。
- **Under Sail**：海上的狂风骤雨，蓝白色闪电沿索具劈下，伴着海雾，栏杆和绳梯上积着雪，风中飘着海鸥羽毛。
- **Apogee Lounge**：透过休息室窗户看到的太空天气。风暴变成星云中的离子风暴，伴有紫色等离子闪电；雨变成微陨石划过的轨迹，雪变成冰原，雾变成星云薄霭。遮罩会把所有效果限制在玻璃范围内。
- **Granite Watch**：室内主题，天气效果会淡到主题允许的最低程度。雨像是管道滴水，雪像是石膏粉尘；分叉闪电已关闭，应用的亮光被调成灯光闪烁的色调。想知道如何为室内场景调淡天气，可以参考它。

## 相关指南

- [主题作者指南](theme-author-guide.md)
- [自定义 CSS 主题](custom-css-themes.md)
- [Roleplay HUD 与追踪器](../roleplay/hud-and-trackers.md)
- [外观设置](appearance-settings.md)
