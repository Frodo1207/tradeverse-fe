# 项目结构说明 (Project Structure)

本项目基于 **Vite + React** 构建，采用了模块化的组件设计。以下是主要目录和文件的详细说明：

## 目录结构 (Directory Structure)

```
src/
├── components/              # 组件目录
│   ├── effects/             # 视觉特效组件
│   │   ├── NebulaFogBackground.jsx  # 3D 星云背景 (Three.js)
│   │   └── IntroSequence.jsx        # 开场加载动画
│   └── ui/                  # 通用 UI 组件
│       ├── RewardCard.jsx           # 奖励卡片组件 (用于 BattlePass)
│       └── SinglePlayerGameCard.jsx # 游戏展示卡片组件
├── views/                   # 页面视图目录
│   ├── BattlePassView.jsx   # 游戏详情与通行证页面
│   └── HomeView.jsx         # 首页落地页
├── App.jsx                  # 主应用入口 (路由与全局布局)
├── index.css                # 全局样式 (Tailwind 指令与自定义动画)
└── main.jsx                 # 项目挂载点
```

## 关键文件说明

### 1. `src/App.jsx`
- **作用**: 整个应用的入口容器。
- **功能**:
  - 管理全局状态（如当前视图 `currentView`、导航栏滚动状态）。
  - 包含全局组件：`NebulaFogBackground` (背景) 和 `IntroSequence` (开场)。
  - 处理视图切换逻辑 (Home <-> BattlePass)。

### 2. `src/views/HomeView.jsx`
- **作用**: 网站的首页。
- **功能**:
  - 展示 Hero Section (大标题与 Slogan)。
  - 提供游戏分类入口 (Single Player, Competitive, etc.)。

### 3. `src/views/BattlePassView.jsx`
- **作用**: 详细的游戏面板页面。
- **功能**:
  - 展示动态头部 (Header) 与玩家等级进度。
  - 展示奖励轨道 (Reward Track)。
  - 展示游戏列表网格。
  - 支持不同游戏分类的切换。

### 4. `src/components/effects/NebulaFogBackground.jsx`
- **技术**: 使用 `Three.js` 和自定义 Shader (着色器)。
- **效果**: 创建一个动态的、可交互的宇宙星云背景，随页面状态改变强度。

### 5. `tailwind.config.js` & `postcss.config.js`
- **作用**: 样式配置。
- **功能**:
  - 定义了自定义颜色 (`#ED4E33` 等)。
  - 定义了自定义动画 (`glitch`, `float`, `pulse-fast`)。
  - 确保 Tailwind CSS 正确编译。

## 开发指南

- **启动项目**: `npm run dev`
- **构建项目**: `npm run build`
