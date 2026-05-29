# Z.ai Design Skills

> 从 z-ai-demo 项目沉淀的设计原则、交互模式、动画技巧。
> 可直接复用到任何新项目。

---

## 1. 色彩架构: 三层 Token 体系

### 原则

```
Primitive (原始色阶)
  → Semantic (语义 Token)
    → Component (组件级引用)
```

- **Primitive**: 固定的色阶值 (`--gray-800: #2B2B2B`)，永不直接用在组件里
- **Semantic**: 表达用途 (`--bg-bg`, `--text-primary`)，组件只引用这一层
- **Component**: shadcn 兼容层 (`--card`, `--primary`)，映射到 Semantic

### 为什么这样做

- 换主题只改 Semantic → Primitive 的映射，组件无需任何修改
- 新增主题 (如 high-contrast) 只需要一套新的 Semantic 映射
- 设计师在 Figma 用同名 Token，前后端零翻译成本

### 实操要点

```css
/* 不要 */
.card { background: #2B2B2B; }
.card { background: var(--gray-800); }

/* 要 */
.card { background: var(--bg-bg); }
```

---

## 2. Dark Mode: 透明色边框

### 原则

边框使用半透明色，而非固定实色。

```css
/* Light */
--border-default: rgba(13,13,13, 0.10);

/* Dark */
--border-default: rgba(255,255,255, 0.10);
```

### 为什么这样做

- 边框自动融入任何底色，不需要为每个背景配一个边框色
- 在渐变背景、毛玻璃效果中依然自然
- 减少 Token 数量

### 扩展应用

同理适用于 hover 背景、选中态:

```css
/* Light hover */
background: rgba(13,13,13, 0.05);

/* Dark hover */
background: rgba(255,255,255, 0.05);
```

---

## 3. 交互反转: Light ↔ Dark 按钮

### 原则

主按钮在 Light 模式是黑底白字，Dark 模式是白底黑字。

```css
/* Light */
--interactive-primary: #000000;    /* 按钮背景 */
--text-inverted: #FFFFFF;          /* 按钮文字 */

/* Dark */
--interactive-primary: #FFFFFF;
--text-inverted: #000000;
```

### 为什么这样做

- 主按钮始终保持最高对比度
- 与页面背景形成视觉层级差异
- 符合用户对 CTA 按钮的心理预期

---

## 4. 图标: 避免纯黑纯白

### 原则

图标使用 `--icon-secondary` 或 `--icon-tertiary`，而非 `--icon-primary`。

| 级别 | Light | Dark | 场景 |
|------|-------|------|------|
| primary | `#0D0D0D` | `#F8F8F8` | 仅用于与文字等权的图标 |
| secondary | `#5C5C5C` | `#ADADAD` | 导航图标、操作图标 |
| tertiary | `#888888` | `#747474` | 辅助信息图标 |

### 为什么这样做

- 纯黑/纯白图标视觉权重过高，会抢正文注意力
- secondary/tertiary 提供了恰当的视觉层次
- 彩色图标在 Dark 模式要向亮色偏移 (400档→200档)

---

## 5. 阴影: 三层复合结构

### 原则

高质量阴影 = 外环边框 + 投影 + 内环高光。

```css
/* Light */
box-shadow:
  0px 0px 0px 1px rgba(0,0,0,0.08),      /* 外环边框 */
  0px 1px 2px 0px rgba(0,0,0,0.08),       /* 投影 */
  inset 0px 0px 0px 1px rgba(255,255,255,1); /* 内环高光 */

/* Dark */
box-shadow:
  0px 0px 0px 1px rgba(255,255,255,0.08),
  0px 1px 2px 0px rgba(0,0,0,0.2),
  inset 0px 0px 0px 1px rgba(255,255,255,0.04);
```

### 为什么这样做

- 单层阴影太平，三层能模拟真实光照
- 内环高光让元素有"浮起"的质感
- Dark 模式减弱外环、加强投影、降低内环透明度

---

## 6. 动画: 分级时长

### 原则

根据元素尺寸和重要性分配动画时长:

| 级别 | 时长 | 场景 | 示例 |
|------|------|------|------|
| 微 | 150-200ms | 颜色变化、透明度 | hover、focus |
| 小 | 250-320ms | 元素展开收起 | 折叠面板、侧边栏 |
| 中 | 350-500ms | 页面级切换 | 路由动画、模态框 |
| 大 | 550ms+ | 编排动画 | 入场序列 |

### 缓动函数选择

```
颜色/透明度 → ease (默认)
位移/尺寸   → cubic-bezier(0.4, 0, 0.2, 1)  Material 标准
弹性回弹   → cubic-bezier(0.25, 1, 0.5, 1)  侧边栏
快进快出   → cubic-bezier(0.16, 1, 0.3, 1)  弹窗
```

### prefers-reduced-motion

所有动画必须在减弱动效模式下禁用:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 7. Canvas 动画: 性能模式

### 原则

复杂粒子/像素动画使用 Canvas + requestAnimationFrame，不用 CSS/DOM。

### 实操 Checklist

1. **DPR 适配**: `canvas.width = width * devicePixelRatio`
2. **帧率控制**: 用 `deltaTime` 而非固定帧率
3. **状态机**: 用 enum (idle → appear → shimmer → collapse) 管理阶段
4. **只播一次**: loading 动画不循环，通过 ref 标记已播放
5. **清理**: `useEffect` return 中 `cancelAnimationFrame`

```typescript
// 典型结构
const animRef = useRef<number>();
useEffect(() => {
  const animate = (timestamp: number) => {
    // ... render logic
    animRef.current = requestAnimationFrame(animate);
  };
  animRef.current = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animRef.current!);
}, []);
```

---

## 8. 布局: 侧边栏 + 主内容区

### 原则

```
flex h-screen
├── Sidebar (fixed width, transition)
└── MainContent (flex-1, overflow-auto)
    └── AnimatePresence mode="wait"
```

### 侧边栏交互要点

1. **展开/收起**: 宽度动画 + 文字 opacity 分离 (宽度 280ms, 文字 200ms)
2. **收起态 hover**: debounce 50ms 展开, 150ms 收起
3. **auto-collapse**: 进入聊天页时自动收起
4. **使用 ref 防抖**: `collapseRef` 防止重复触发

### 页面切换动画

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={currentPage}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
  >
    {renderPage()}
  </motion.div>
</AnimatePresence>
```

---

## 9. 圆角: 基于基数的倍数系统

### 原则

定义一个 `--radius` 基数，所有圆角用倍数计算:

```css
--radius: 0.625rem;  /* 10px */
--radius-sm: calc(var(--radius) * 0.6);  /* 6px */
--radius-md: calc(var(--radius) * 0.8);  /* 8px */
--radius-lg: var(--radius);              /* 10px */
--radius-xl: calc(var(--radius) * 1.4);  /* 14px */
```

### 为什么这样做

- 调整 `--radius` 一个值，全局圆角同步变化
- 保持视觉一致性 — 所有圆角成比例
- 方便做品牌定制 (更圆/更方)

---

## 10. 渐进揭示: PPT 卡片四阶段

### 原则

长内容生成用多阶段动画降低等待焦虑:

```
Phase 1: 像素点阵 Loading (暗示"正在处理")
Phase 2: 大纲文字 (5s, 给用户即时反馈)
Phase 3: 内容写入 + blur reveal (6s, 模拟创作过程)
Phase 4: 最终成品展示
```

### 为什么这样做

- 用户看到"进展"比看到 spinner 更有耐心
- 每个阶段的视觉变化保持注意力
- 最终 blur → clear 的揭示有"惊喜"效果

---

## 11. 工具调用: 链式可视化

### 原则

多步 AI 操作用链式 UI 展示:

```
⚡ 流光标题 (AnimatedShinyText, 运行中)
│  竖线连接 (done 时显示)
╰  曲线 SVG + 圆点
⚡ 流光标题
│
╰
✓ 完成标记
```

### 为什么这样做

- 用户能看到 AI 的"工作流程"
- 链式结构暗示顺序关系
- 运行中的流光动画提供活跃反馈

---

## 12. 文字动画: 变速生成

### 原则

AI 文字生成模拟人类写作节奏:

- 标点后停顿长 (句号 > 逗号)
- 普通文字快速连续
- 换行有节奏感

### 更好的选择

一次性渲染全部文字 + 平滑滚动，比逐字打字机效果更流畅且性能更好。

```typescript
// 推荐: 一次渲染 + 容器动画
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
  {fullText}
</motion.div>
```

---

## 13. 新项目快速启动 Checklist

### 基础设施

- [ ] Vite + React + TypeScript
- [ ] Tailwind CSS v4 (`@tailwindcss/vite`)
- [ ] 复制 `index.css` 中的 Primitive + Semantic token 定义
- [ ] 复制 `@theme inline` 的 Tailwind 变量注册
- [ ] 复制 `@layer base` 中的 keyframe 动画
- [ ] 安装 `motion`, `clsx`, `tailwind-merge`, `class-variance-authority`
- [ ] 安装 `lucide-react` 图标库
- [ ] 复制 `cn()` 工具函数

### 设计系统

- [ ] 配置 Geist 字体 (`@fontsource-variable/geist`)
- [ ] 配置中文回退字体 (PingFang SC / Noto Sans CJK)
- [ ] 设置 Dark mode toggle (`.dark` class + localStorage)
- [ ] 配置 `prefers-reduced-motion` 响应

### 组件

- [ ] 复制 Button 组件 (CVA 变体)
- [ ] 设置 shadcn/ui (`components.json`)
- [ ] 配置路径别名 (`@/` → `src/`)

### 质量

- [ ] 每次修改必须 build 验证
- [ ] Dark mode 所有元素手动检查
- [ ] 不加未要求的功能
- [ ] 不用纯黑纯白图标
