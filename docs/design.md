# Z.ai Design System

> Design token 体系、组件规范、动画系统的完整参考文档。
> 适用于任何基于此设计系统的新项目。

---

## 1. 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | React + TypeScript | 19 + 6.0 |
| 构建 | Vite | 8.x |
| 样式 | Tailwind CSS v4 | 4.2 |
| 组件 | shadcn/ui (base-nova) | 4.3 |
| 动画 | motion/react (Framer Motion) | 12.x |
| 图标 | lucide-react | 1.8 |
| 字体 | Geist Variable + Iowan Old Style BT + PingFang SC | - |

### Tailwind v4 配置方式

```css
/* index.css */
@import "tailwindcss";

@theme inline {
  --color-bg-bg: var(--bg-bg);
  --color-text-primary: var(--text-primary);
  /* ... 所有 semantic token 注册到 Tailwind */
}
```

无 `tailwind.config.js`，通过 `@tailwindcss/vite` 插件 + CSS 变量驱动。

---

## 2. 色彩系统

### 2.1 Primitive 色阶

#### Gray Solid (17 档)

| Token | 值 | 用途 |
|-------|------|------|
| `--gray-0` | `#FFFFFF` | 纯白 |
| `--gray-50` | `#F8F8F8` | 页面背景 (light) |
| `--gray-100` | `#F0F0F0` | 表面色 |
| `--gray-150` | `#E6E6E6` | 覆盖层 |
| `--gray-200` | `#D9D9D9` | 微妙背景 |
| `--gray-300` | `#C4C4C4` | - |
| `--gray-400` | `#ADADAD` | 占位符文字 |
| `--gray-500` | `#888888` | 三级文字/图标 |
| `--gray-600` | `#747474` | - |
| `--gray-650` | `#5C5C5C` | 二级文字/图标 |
| `--gray-700` | `#474747` | - |
| `--gray-750` | `#363636` | - |
| `--gray-800` | `#2B2B2B` | 容器背景 (dark) |
| `--gray-850` | `#202020` | 侧边栏背景 (dark) |
| `--gray-900` | `#161616` | 页面背景 (dark) |
| `--gray-950` | `#0D0D0D` | 一级文字 (light) |
| `--gray-1000` | `#000000` | 纯黑 |

#### Gray Alpha — 白底透明 (11 档)

`--gray-0-a{0,2,5,10,15,20,25,50,75,80,90}` → `rgba(255,255,255, 0~0.9)`

#### Gray Alpha — 黑底透明 (11 档)

`--gray-1000-a{0,2,5,10,15,20,25,50,75,80,90}` → `rgba(13,13,13, 0~0.9)`

#### 彩色色阶 (每色 10 档: 50~900)

| 色系 | 400 档 (主色) | 用途 |
|------|---------------|------|
| Blue | `#0B7FFF` | 链接、强调、升级按钮 |
| Red | `#E03131` | 错误、危险操作 |
| Orange | `#E07B00` | 警告 |
| Green | `#1E8A3E` | 成功 |
| Purple | `#9E77ED` | 标签、任务时间 |

### 2.2 Semantic Token — Light / Dark 对照

#### 背景 (Background)

| Token | Light | Dark |
|-------|-------|------|
| `--bg-bg` | `#FFFFFF` | `#2B2B2B` |
| `--bg-page` | `#F8F8F8` | `#161616` |
| `--bg-hover` | `rgba(13,13,13, 0.05)` | `rgba(255,255,255, 0.05)` |
| `--bg-surface` | `#F0F0F0` | `#202020` |
| `--bg-overlay` | `#E6E6E6` | `#2B2B2B` |
| `--bg-subtle` | `#D9D9D9` | `#363636` |
| `--bg-warning` | `#FFF4EB` | `#542500` |
| `--bg-error` | `#FFF0F0` | `#420000` |

#### 边框 (Border)

| Token | Light | Dark |
|-------|-------|------|
| `--border-default` | `rgba(13,13,13, 0.10)` | `rgba(255,255,255, 0.10)` |
| `--border-strong` | `rgba(13,13,13, 0.15)` | `rgba(255,255,255, 0.15)` |

> **原则**: 边框使用透明色而非实色，可适配任何底色。

#### 文字 (Text)

| Token | Light | Dark |
|-------|-------|------|
| `--text-primary` | `#0D0D0D` | `#F8F8F8` |
| `--text-secondary` | `#5C5C5C` | `#ADADAD` |
| `--text-tertiary` | `#888888` | `#747474` |
| `--text-inverted` | `#FFFFFF` | `#000000` |
| `--text-inverted-static` | `#FFFFFF` | `#FFFFFF` |
| `--text-placeholder` | `#ADADAD` | `#474747` |
| `--text-accent` | `#0B7FFF` | `#4099FF` |

#### 图标 (Icon)

| Token | Light | Dark |
|-------|-------|------|
| `--icon-primary` | `#0D0D0D` | `#F8F8F8` |
| `--icon-secondary` | `#5C5C5C` | `#ADADAD` |
| `--icon-tertiary` | `#888888` | `#747474` |
| `--icon-blue` | `#0B7FFF` | `#80BEFF` |
| `--icon-red` | `#E03131` | `#FF9999` |
| `--icon-orange` | `#E07B00` | `#FFB26B` |
| `--icon-green` | `#1E8A3E` | `#87D9A4` |
| `--icon-purple` | `#9E77ED` | `#A888F2` |

> **原则**: 图标不用纯黑纯白，使用 `icon-secondary` / `icon-tertiary`。

#### 交互 (Interactive)

| Token | Light | Dark |
|-------|-------|------|
| **Primary** | | |
| `--interactive-primary` | `#000000` | `#FFFFFF` |
| `--interactive-primary-page` | `rgba(13,13,13, 0.80)` | `rgba(255,255,255, 0.90)` |
| `--interactive-primary-press` | `rgba(13,13,13, 0.90)` | `rgba(255,255,255, 0.80)` |
| `--interactive-primary-disabled` | `#E6E6E6` | `#363636` |
| **Secondary** | | |
| `--interactive-secondary` | `transparent` | `transparent` |
| `--interactive-secondary-page` | `rgba(13,13,13, 0.02)` | `rgba(255,255,255, 0.10)` |
| `--interactive-secondary-press` | `rgba(13,13,13, 0.05)` | `rgba(255,255,255, 0.05)` |
| `--interactive-secondary-selected` | `rgba(13,13,13, 0.05)` | `rgba(255,255,255, 0.10)` |
| **Tertiary** | | |
| `--interactive-tertiary` | `#FFFFFF` | `#2B2B2B` |
| `--interactive-tertiary-page` | `#F8F8F8` | `#161616` |
| `--interactive-tertiary-press` | `#F0F0F0` | `#000000` |

#### 强调色 (Accent) — 每色 6 态

以 Blue 为例:

| Token | Light | Dark |
|-------|-------|------|
| `--accent-blue` | `#0B7FFF` | `#4099FF` |
| `--accent-blue-hover` | `#0066DD` | `#4099FF` |
| `--accent-blue-pressed` | `#004FBB` | `#99C7FF` |
| `--accent-blue-subtle` | `#EBF4FF` | `#001D3D` |
| `--accent-blue-border` | `#80BEFF` | `#003A80` |
| `--accent-blue-text` | `#002677` | `#99C7FF` |

> 同理适用于 Red / Orange / Green / Purple。

---

## 3. 排版系统

### 字体

| 用途 | 字体 | 备注 |
|------|------|------|
| UI 主字体 | Geist Variable | `@fontsource-variable/geist` |
| 中文回退 | PingFang SC | 系统字体 |
| 衬线标题 | Iowan Old Style BT | 自定义 @font-face, 5 个字重 |

### 字号规范

| 场景 | 字号 | 行高 | 字重 |
|------|------|------|------|
| Badge | 10px | - | 500 |
| 辅助说明 | 11px | 13px | 400 |
| 标签/描述 | 12px | 16px | 400 |
| 次要文字 | 13px | 16px | 400 |
| 正文/导航 | 14px | 20px | 400-500 |
| 输入框 | 15px | 22px | 400 |
| 小标题 | 16px | 24px | 500 |
| 区域标题 | 18px | 26px | 500 |
| 大标题 | 32px | 40px | 500 |
| 响应式标题 | 4vw / 1.8vw | 1.2 | 500 |

### 字间距

- 导航项: `tracking-[-0.18px]`

---

## 4. 空间系统

### 圆角 (Border Radius)

基于 `--radius: 0.625rem (10px)` 的倍数系统:

| Token | 计算 | 结果 | 用途 |
|-------|------|------|------|
| `--radius-sm` | `× 0.6` | 6px | 按钮、标签、导航项 |
| `--radius-md` | `× 0.8` | 8px | 卡片组、输入框 |
| `--radius-lg` | `× 1.0` | 10px | 卡片 |
| `--radius-xl` | `× 1.4` | 14px | 弹窗 |
| `--radius-2xl` | `× 1.8` | 18px | 大面板 |
| `--radius-3xl` | `× 2.2` | 22px | 输入区域 |
| `--radius-4xl` | `× 2.6` | 26px | 特殊容器 |

### 常用间距

| 尺寸 | 用途 |
|------|------|
| 4px | 卡片组内间距、微间距 |
| 6px | 元素紧凑间距 |
| 8px | 项目内边距、图标间距 |
| 10px | 导航项内边距 |
| 12px | 节间距 |
| 16px | 区域内边距 |
| 20px | 节间距 |

### 尺寸规范

| 元素 | 尺寸 |
|------|------|
| 侧边栏展开 | 260px |
| 侧边栏收起 | 56-60px |
| 图标容器 | 16px / 20px / 24px |
| 头像 | 24px 圆形 |
| 按钮高度 | 28px (xs) / 32px (sm) / 40px (default) |
| 聊天输入框 | 高度 148px, 最大 280px |
| 内容区最大宽度 | 768px |

---

## 5. 阴影系统

### 标签阴影 (Tag Shadow)

```css
/* Light */
0px 0px 0px 1px rgba(0,0,0,0.08),
0px 1px 2px 0px rgba(0,0,0,0.08),
inset 0px 0px 0px 1px rgba(255,255,255,1)

/* Dark */
0px 0px 0px 1px rgba(255,255,255,0.08),
0px 1px 2px 0px rgba(0,0,0,0.2),
inset 0px 0px 0px 1px rgba(255,255,255,0.04)
```

> **结构**: 外环边框 + 投影 + 内环高光，三层复合。

### 卡片组阴影 (Card Group)

```css
/* Light */
0 0 0 1px rgba(219,219,219,0.8),
0 2px 8px rgba(0,0,0,0.06)

/* Dark */
无阴影, 使用 bg-white/[0.06] 区分
```

---

## 6. 动画系统

### 缓动函数

| 名称 | 值 | 场景 |
|------|------|------|
| 标准 Material | `cubic-bezier(0.4, 0, 0.2, 1)` | 页面切换、元素进入 |
| 弹性回弹 | `cubic-bezier(0.25, 1, 0.5, 1)` | 侧边栏展开收起 |
| 快速减速 | `cubic-bezier(0.16, 1, 0.3, 1)` | 模态框出场 |
| 编辑器 | `cubic-bezier(0.4, 0, 0, 1)` | PPT 编辑器面板 |

### 时长规范

| 时长 | 用途 |
|------|------|
| 160ms | 微交互 (select) |
| 200ms | 文字淡入淡出、hover 状态 |
| 280ms | 侧边栏宽度变化 |
| 320ms | 区域折叠展开 |
| 350ms | 编辑器面板 |
| 400-500ms | 页面级切换 |
| 550ms | 完整入场动画 |

### CSS Keyframe 动画库

| 动画名 | 效果 | 用途 |
|--------|------|------|
| `fadeIn` | 透明度 0→1 | 通用淡入 |
| `slideUpFade` | 上移 24px + 淡入 | 保存模板栏 |
| `scaleIn` | 缩放 0.92→1 + 淡入 | 弹窗出场 |
| `shiny-text` | 渐变流光 | 工具调用标题 |
| `shimmer` | X 轴平移 | 加载骨架屏 |
| `toolBlurIn` | 模糊→清晰 + 上移 | 工具调用内容 |
| `blurReveal` | 背景模糊渐消 | PPT 幻灯片揭示 |
| `pptReveal` | clip-path 斜切揭示 | PPT 幻灯片最终展示 |
| `writeIn` | 宽度 0→100% | 文字书写效果 |
| `renderElement` | 模糊+上移→清晰 | 元素渲染进场 |
| `pulse` | 缩放 0.85→1.15 | 加载指示器 |
| `dotBounce` | Y 轴弹跳 | 加载三点 |
| `zBackgroundEntrance` | 缩放+平移入场 | Z logo 首次进场 |
| `zBackgroundBreathing` | 缩放呼吸 1→1.02 | Z logo 持续动效 |

### Motion/React 弹簧参数

```typescript
// Text3DFlip
{ type: "spring", damping: 30, stiffness: 300 }
// 默认 stagger: 0.05s
```

### Canvas 动画参数

```typescript
// PixelLoading
GAP: 5,           // 像素网格间距
SHIMMER_MS: 2000, // 流光周期
IDLE_MS: 300,     // 空闲等待
COLLAPSE_MS: 800, // 收拢动画
APPEAR_SPEED: 0.35 // 出现速度
```

### 无障碍

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. 主题系统

### 实现方式

- **选择器**: `.dark` class on `<html>`
- **媒体查询回退**: `@media (prefers-color-scheme: dark)`
- **持久化**: `localStorage('z-theme')`
- **默认**: dark mode

### 切换逻辑

```typescript
const [theme, setTheme] = useState<Theme>(() =>
  localStorage.getItem('z-theme') as Theme || 'dark'
);

useEffect(() => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('z-theme', theme);
}, [theme]);
```

### Dark Mode 转换规则

| 元素 | Light → Dark 规则 |
|------|-------------------|
| 背景 | 亮→暗 (`#F8F8F8` → `#161616`) |
| 文字 | 暗→亮 (`#0D0D0D` → `#F8F8F8`) |
| 边框 | 黑透明→白透明 (`rgba(13,13,13,0.1)` → `rgba(255,255,255,0.1)`) |
| 交互主按钮 | 黑底白字→白底黑字 |
| 强调色 | 向亮色偏移 (400档→200/300档) |
| 阴影 | 降低可见度或移除 |
| 图标 | 纯 CSS 变量切换，不用 `filter: invert()` |

---

## 8. 组件规范

### 按钮 (Button)

基于 CVA (Class Variance Authority):

| 变体 | Light | Dark |
|------|-------|------|
| default | 黑底白字 | 白底黑字 |
| outline | 透明+边框 | 透明+边框 |
| secondary | 灰底 | 灰底 |
| ghost | 透明+hover显色 | 透明+hover显色 |
| destructive | 红底白字 | 红底白字 |

尺寸: `xs(28px)` / `sm(32px)` / `default(40px)` / `lg(48px)` / `icon` 系列

### 侧边栏导航项

```
padding: 10px 水平, 8px 垂直
gap: 8px (图标与文字)
圆角: 6px
字号: 14px / 行高 20px
字间距: -0.18px
```

| 状态 | Light | Dark |
|------|-------|------|
| 默认 | `opacity-80` | `opacity-80` |
| hover | `opacity-100` + `bg: #0d0d0d/4%` | `opacity-100` + `bg: white/6%` |
| active | `bg: #0d0d0d/8%` | `bg: white/10%` |
| 选中 | `opacity-100` + `bg: #0d0d0d/4%` | `opacity-100` + `bg: white/8%` |

### 聊天输入框 (ChatInput)

- 高度: 148px (默认), 最大 280px
- 圆角: 22px (`--radius-3xl`)
- 内边距: 16px
- 字号: 15px
- 附件区域: FileAttachment 组件 (dark/light 适配)

### 弹窗/模态框 (Modal)

```css
/* 遮罩层 */
.overlay { background: rgba(0,0,0,0.4); z-index: 100; }

/* 内容 */
.modal { max-width: 95vw; max-height: 90vh; border-radius: 14px; }

/* 动画 */
.modal { animation: scaleIn 0.2s ease-out; }
```

---

## 9. 工具函数

### cn() — 类名合并

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### useMediaQuery — 响应式断点

```typescript
const isMobile = useMediaQuery('(max-width: 768px)');
```

---

## 10. shadcn/ui 兼容层

为保持与 shadcn 组件的兼容，以下 token 做了映射:

```css
--background: var(--bg-page);
--foreground: var(--text-primary);
--card: var(--bg-bg);
--primary: var(--interactive-primary);
--secondary: var(--bg-surface);
--muted: var(--bg-surface);
--destructive: var(--accent-red);
--border: var(--border-default);
--ring: var(--border-strong);
```

---

## 11. 文件结构参考

```
src/
├── index.css              # Design token 定义 + 动画 keyframes
├── App.tsx                # 根路由
├── components/
│   ├── ui/                # 基础 UI 组件 (button, switch, select...)
│   │   ├── animated-dots.tsx
│   │   ├── animated-shiny-text.tsx
│   │   ├── pixel-loading.tsx
│   │   ├── pixel-canvas.tsx
│   │   ├── text-3d-flip.tsx
│   │   ├── flickering-grid.tsx
│   │   └── dot-pattern.tsx
│   ├── sidebar/           # 侧边栏 + Settings
│   ├── chat/              # 聊天 + PPT 生成
│   │   └── messages/      # 消息类型组件
│   ├── home/              # 首页 + Showcase
│   ├── layout/            # 页面布局
│   └── auth/              # 认证
├── contexts/              # SidebarProvider, AuthProvider
├── hooks/                 # useSidebar, useAuth, useMediaQuery
├── types/                 # TypeScript 接口定义
└── lib/utils.ts           # cn() 工具函数
```
