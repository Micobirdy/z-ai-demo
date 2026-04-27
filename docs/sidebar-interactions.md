# 左侧导航栏（Sidebar）交互规范

## 1. 全局状态

| 状态 | 变量 | 说明 |
|------|------|------|
| 展开/收起 | `isCollapsed` | `false`=展开(260px), `true`=收起(56px) |
| 当前导航 | `activeNav` | `'chat'` / `'agent'` / `'new-task'` / `'expert'` / `'folder'` |
| Settings 开关 | `isSettingsOpen` | 控制主内容区显示 HomePage 或 Settings |
| Settings 子页 | `activeSettingsSection` | `'general'` / `'account'` / `'dashboard'` / `'connectors'` / `'data'` / `'about'` |
| 主题 | `theme` | `'light'` / `'dark'` |

---

## 2. 展开/收起

### 2.1 展开 → 收起
- **触发**: 点击右上角 `PanelLeftClose` 按钮
- **动画**: 宽度 260px → 56px, 320ms, `cubic-bezier(0.25, 1, 0.5, 1)`
- **文字**: `opacity` 从 1 → 0 (200ms)，被 `overflow-hidden` 裁剪
- **收起按钮**: `opacity + scale` 淡出 (opacity-0 scale-75)，`pointer-events-none`
- **Recents 区域**: `max-height` 从 300px → 0 + `opacity` 0，320ms
- **Upgrade 文字**: `max-width` 80px → 0 + `opacity` 0，200ms

### 2.2 收起 → 展开
- **触发**: hover Logo 区域后显示 `PanelLeftOpen` 按钮，点击展开
- **动画**: 宽度 56px → 260px，同上缓动
- **文字**: `opacity` 从 0 → 1 (200ms)
- **收起按钮**: `opacity-100 scale-100` 淡入

### 2.3 收起状态下的 Logo 交互
- **默认**: 显示 Z logo (24×24px 容器, 16×16px 图标)
- **hover Logo**: Logo `opacity-0`，原位显示 `PanelLeftOpen` 按钮
- **点击**: 展开侧边栏

---

## 3. 导航项交互

### 3.1 Card Group（Chat / Agent）

**容器样式**:
- Light: `bg-white` + `shadow-[0_0_0_1px_rgba(219,219,219,0.8), 0_2px_8px_rgba(0,0,0,0.06)]`
- Dark: `bg-white/[0.06]`
- 圆角 `rounded-[8px]`, padding `4px`, gap `2px`

**每个按钮**:
| 状态 | 样式 |
|------|------|
| 默认 | `opacity-80` |
| hover | `opacity-100` + 背景色 (light: `#0d0d0d/4%`, dark: `white/6%`) |
| active/press | light: `#0d0d0d/8%`, dark: `white/10%` |
| 选中 | `opacity-100` + 背景色 (light: `#0d0d0d/4%`, dark: `white/8%`) |

**图标**: 20×20 容器, 16×16 img, dark mode `filter: invert(1)`
**文字**: 14px, leading-20px, tracking -0.18px

### 3.2 List Group（New Task / Expert / Folder）

**每个按钮**:
| 状态 | 样式 |
|------|------|
| 默认 | `opacity-80` |
| hover | `opacity-100` + 背景色 |
| active/press | 同 Card Group |
| 选中 | `opacity-100` + 背景色 |

**Badge (Expert "New")**:
- Light: `bg-[#0d0d0d] text-white`
- Dark: `bg-white text-[#111]`
- 10px 字号, `font-medium`, `rounded-[4px]`, px-6px py-1px

### 3.3 点击行为
- 点击任意导航项 → `setActiveNav(item.id)` + `closeSettings()`
- 关闭 Settings 面板，主内容区切回 HomePage

---

## 4. Recents 区域

### 4.1 项目头（"Zai Web ▾"）
- 文字颜色: light `#0d0d0d/50%`, dark `white/50%`
- ChevronDown 图标: light `#0d0d0d/30%`, dark `white/30%`
- 14px, leading-20px
- 点击: 展开/收起项目列表（当前未实现折叠逻辑，仅 UI）

### 4.2 历史条目
- 文字 14px, `truncate` 单行溢出省略
- hover 背景色, active 按下色
- 点击: 跳转到对应对话（当前仅 UI）

### 4.3 展开/收起动画
- 收起时整个 Recents 区域: `opacity-0 max-h-0`, 320ms
- 展开时: `opacity-100 max-h-[300px]`, 320ms

---

## 5. Upgrade 按钮

| 状态 | 展开态 | 收起态 |
|------|--------|--------|
| 容器 | `pl-6 pr-12 rounded-full` | `px-8 rounded-full` |
| 图标 | 16px `text-[#0068e0]` | 同左 |
| 文字 | 显示 "Upgrade", 13px | 隐藏 (`opacity-0 max-w-0`) |
| Light bg | `bg-[#daeeff]` | 同左 |
| Dark bg | `bg-[#0068e0]/20` | 同左 |
| hover | light: `bg-[#c3dcf9]`, dark: `bg-[#0068e0]/30` | 同左 |

---

## 6. Footer 用户区域

### 6.1 头像
- 24×24px 圆形, `bg-[#ccc]` 占位
- 始终可见（展开和收起）

### 6.2 用户信息（展开态）
- 姓名: 14px, `truncate`
- 副标题 (plan): 12px, light `#0d0d0d/50%`, dark `white/40%`
- 收起时 `opacity-0` (200ms 过渡)

### 6.3 Settings 齿轮按钮
| 状态 | 样式 |
|------|------|
| 默认 | light: `#0d0d0d/40%`, dark: `white/40%` |
| hover | light: `#0d0d0d/70%` + bg `#0d0d0d/4%`, dark: `white/70%` + bg `white/6%` |
| Settings 已打开 | light: `#0d0d0d/80%` + bg `#0d0d0d/6%`, dark: `white/80%` + bg `white/10%` |
| 点击 | `openSettings()` 打开 Settings 页面 |

### 6.4 Footer 分隔线
- Light: `border-[#dbdbdb]`
- Dark: `border-white/[0.06]`

---

## 7. 主题切换对照表

| 元素 | Light | Dark |
|------|-------|------|
| 侧边栏背景 | `#f8f8f8` | `#161616` |
| 右边框 | `#dbdbdb` | `white/6%` |
| 前景色 (fg) | `#0d0d0d` | `white` |
| 弱前景 (fgMuted) | `#0d0d0d/50%` | `white/50%` |
| hover 背景 | `#0d0d0d/4%` | `white/6%` |
| active 背景 | `#0d0d0d/4%` | `white/8%` |
| press 背景 | `#0d0d0d/8%` | `white/10%` |
| 图标反色 | `none` | `invert(1)` |
| Card group bg | `white` + shadow | `white/6%` |

---

## 8. 键盘交互

| 按键 | 行为 |
|------|------|
| `Escape` | 关闭 Settings 面板 (`isSettingsOpen → false`) |
| `Tab` | 按钮间焦点切换（原生 button 行为） |
| `Enter` / `Space` | 激活聚焦的按钮 |

---

## 9. 动画参数汇总

| 属性 | 时长 | 缓动 | 场景 |
|------|------|------|------|
| 宽度过渡 | 320ms | `cubic-bezier(0.25, 1, 0.5, 1)` | 展开/收起 |
| 文字 opacity | 200ms | 默认 ease | 文字淡入淡出 |
| Recents 折叠 | 320ms | `cubic-bezier(0.25, 1, 0.5, 1)` | max-height + opacity |
| Card bg 过渡 | 320ms | 默认 | 背景色变化 |
| 收起按钮 | 200ms | 默认 | opacity + scale |
| 通用 hover | CSS transition | 默认 | 背景色、颜色 |

---

## 10. 尚未实现的交互

| 功能 | 说明 |
|------|------|
| Recents 折叠/展开 | "Zai Web ▾" 点击应折叠历史列表，当前仅 UI |
| 导航项实际路由 | 点击 Chat/Agent 等仅切换高亮，无页面内容切换 |
| 右键菜单 | 历史条目可能需要右键菜单（重命名/删除） |
| 拖拽排序 | 历史条目或文件夹拖拽排序 |
| 搜索 | 侧边栏内搜索历史对话 |
| 移动端适配 | `isMobile` 状态已有但未使用 |
| 通知 badge | Expert "New" 以外的其他通知标记 |
