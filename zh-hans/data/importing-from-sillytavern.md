# 从 SillyTavern 导入

把你的 SillyTavern(社区常称“酒馆”) 数据导入 Marinara Engine。可以一次导入一个文件，也可以扫描整个 SillyTavern 文件夹，一次全部导入。

## 可以导入的内容

| SillyTavern 数据 | 在 Marinara 中 |
| --- | --- |
| 角色 | 角色 |
| 聊天和群聊 | 聊天 |
| 预设 | 预设（提示词的分区和预设的采样设置） |
| World Info | 世界书（AI 在出现特定词语时会读取的笔记） |
| 背景 | 聊天背景 |
| 用户角色 | 用户角色（代表你自己的资料） |

## 单文件快速导入

1. 打开 **Settings → Data → SillyTavern Import**(设置 → 数据 → SillyTavern 导入)。
2. 点击与你的文件类型对应的按钮。
3. 选择文件。

| 按钮 | 文件 |
| --- | --- |
| **Import Character (JSON/PNG)**(导入角色卡) | 一个 `.json` 或 `.png` 角色卡。 |
| **Import Chat (JSONL)**(导入聊天) | 一个 `.jsonl` 聊天记录（每行一条 JSON 记录，SillyTavern 保存聊天用的就是这种格式）。 |
| **Import Preset (JSON)**(导入预设) | 一个 `.json` 预设。 |
| **Import Lorebook (JSON)**(导入世界书) | 一个 `.json` World Info 文件。 |

按钮上方的 **Tag imported**(标记为已导入) 和 **Tag source**(标记来源) 默认都开启，会给导入的内容添加 **Imported**(已导入) 和 **ST** 标签。取消勾选其中一项，就不会添加对应标签。导入的内容保留原有名称和描述。除此之外，这几个按钮没有可选项。导入角色时会保留源文件的全部标签，并把所有正则脚本限定在该角色上。正则脚本是一条文本查找替换规则。想自行选择这些选项，请使用 **Library → Characters**(资料库 → 角色) 页面上的 **Import**(导入)。参见[导入和导出角色卡](../characters/import-export.md)。

如果角色卡里内嵌了世界书，浏览器会询问是否把它导入为独立的世界书。点击 **OK** 会把它保存为一本可以重复使用的世界书。点击 **Cancel** 则只导入角色。

**Import Chat (JSONL)** 会创建一个 Roleplay(角色扮演) 聊天并打开它，除非文件中记录的是其他模式。

### 把聊天导入到你选择的模式

要选择模式，请使用聊天列表顶部的导入按钮。它的提示文字是 **Import SillyTavern or Marinara chat JSONL**。它会导入到你当前打开的模式选项卡中（Conversation(对话模式)、Roleplay 或 Game）。参见[导出与导入聊天](../chats/export-import.md)。

## 从 SillyTavern 文件夹导入

**开始之前：** 向导会读取服务器电脑上的文件。如果 SillyTavern 装在另一台电脑上，请先把它的文件夹（也就是 SillyTavern 的安装文件夹）复制到运行 Marinara 的电脑上。在运行 Marinara 的电脑上，向导可以直接使用。从其他设备使用时，请先设置管理员密钥，然后把它填入 **Settings → Advanced → Security**(设置 → 高级 → 安全)。参见[备份与恢复 Marinara](backup-and-restore.md)，以及[服务器配置参考](../CONFIGURATION.md)中的“授权 API(ADMIN_SECRET)”一节。

1. 打开 **Settings → Data → SillyTavern Import**。
2. 点击 **Import from SillyTavern Folder**(从 SillyTavern 文件夹导入)。
3. 选择你的 SillyTavern 文件夹。选主文件夹，通常是包含 `data/` 或 `public/` 文件夹的那一个。可以用以下任一方式：
   - 点击 **Browse**(浏览)，然后选择该文件夹。
   - 如果没有文件夹选择器（例如远程服务器），会打开应用内置的文件夹浏览器。它只列出运行服务器的用户主文件夹内的文件夹。点击 **Select This Folder**(选择此文件夹)。
   - 在 **SillyTavern Folder Path**(SillyTavern 文件夹路径) 中输入路径，例如 `/home/you/SillyTavern`。输入的路径位于运行服务器的用户的主目录里时就能使用。如果服务器设置了 `IMPORT_ALLOWED_ROOTS`，则必须位于其中一个指定文件夹内。
4. 点击 **Scan Folder**(扫描文件夹)。Marinara 会显示每个类别找到了多少条目。
5. 在 **Choose exactly what to import**(精确选择要导入的内容) 页面中，勾选你想要的条目。每个类别都有 **All**(全选) 和 **None**(全不选) 按钮，以及用于查看单个条目的 **Show**(显示) 或 **Hide**(隐藏) 切换。
6. 点击 **Import Selected**(导入所选)。进度条会显示当前条目，以及每个类别的计数。
7. 看到 **Import complete!** 后，查看每个类别的数量，然后点击 **Done**(完成)。数量下方的简短列表会说明：多少聊天保留了作者备注和用户角色、哪些 SillyTavern 用户名在这里没有对应的用户角色，以及哪些预设设置被省略。

大多数条目一开始都是选中的。Marinara 会取消勾选 SillyTavern 自带的预设，例如 `deterministic`、`neutral` 和 `universal-*` 预设，并显示一条横幅说明。除非你想要一份副本，否则请保持不勾选。

如果扫描到了角色，还会出现两个选项：

**Imported character tags**(导入的角色标签)（默认 **All tags**）：

- **All tags** 保留源文件中的标签。
- **No tags** 全部跳过。
- **Existing only** 只保留你已有的标签。

**Imported regex scripts**(导入的正则脚本)（默认 **Character only**）：

- **Character only** 让脚本只作用于各自的角色。
- **Global** 会把脚本加到 **Library → Regex scripts**(资料库 → 正则脚本)（经典布局里是 **Presets → Regexes**），可以在那里管理跨聊天运行的脚本。见[正则脚本](../extending/regex-scripts.md#manage-your-scripts)。

如果没有成功：

- 出现 “Could not find SillyTavern data directory.” 表示 Marinara 无法读取该文件夹。请选择 SillyTavern 的主文件夹。
- “Marinara can only read folders inside your home folder”表示该文件夹不在运行服务器的用户的主目录内。把 SillyTavern 文件夹移进去，或让服务器管理者通过 `IMPORT_ALLOWED_ROOTS` 设置允许读取它所在的位置。如果设置了这个变量，即使用文件夹选择器选取，也必须位于其中一个指定文件夹内。见[服务器配置参考](../CONFIGURATION.md)。
- 如果 **Browse** 收到手动输入的主目录之外的路径，文件夹浏览器会改为打开主目录。
- 如果某一条目失败，Marinara 会跳过它并继续处理，然后在最后一步的警告中列出它，例如 `Character "Foo": error message`。

## 导入如何处理你的数据

- 属于同一个角色的聊天文件，会作为同一个聊天的分支导入。分支是一份可以单独续写的聊天副本。
- 群聊会导入为 Roleplay 聊天。
- 导入的项目保留源文件的最后修改日期，不会改成导入日期。每条聊天消息也会保留 SillyTavern 保存它时的日期。
- 聊天的 **Author's Note**(作者备注) 会连同深度一起导入。如果 SillyTavern 为它设置了其他频率、位置或角色，Marinara 仍会在每条回复中按该深度添加它，导入结果会说明这一点。在 SillyTavern 中关闭的备注仍然关闭。
- 聊天会关联到 SillyTavern 使用的用户角色：优先使用锁定的用户角色，否则使用与聊天用户名同名的用户角色。在同一次导入中导入用户角色，或提前创建同名用户角色。没有匹配项时，聊天不会关联用户角色，导入结果会列出缺失的用户角色名称。
- 预设会带上采样设置：温度、Top P、Top K、Min P、频率惩罚、存在惩罚和推理强度。这些是使用该预设的聊天的初始值；连接或聊天自身设置的值仍然优先。最大回复长度和上下文大小仍由连接设置。这里没有 Top A 和重复惩罚的对应设置，因此会省略它们。
- 角色、用户角色、世界书、预设和聊天会获得 **Imported** 和 **ST** 标签，除非你取消勾选 **Import Selected** 上方的 **Tag imported** 或 **Tag source**。它们的名称和描述保持原样。

## 不会导入的内容

向导只读取第一张表里的类别。SillyTavern 的其他数据不会导入，比如全局应用设置、快捷回复、指令模板、上下文模板和连接方案。在这次修复之前导入的聊天，消息日期被设成了导入时间。要修正某个聊天，先删除它，再重新导入它的文件（通过文件夹导入时，取消勾选 **Skip what's already here**）。

## 相关指南

- [导入和导出角色卡](../characters/import-export.md)
- [导入与导出世界书](../lorebooks/import-export.md)
- [导出与导入聊天](../chats/export-import.md)
- [正则脚本](../extending/regex-scripts.md)
