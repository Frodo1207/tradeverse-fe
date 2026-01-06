import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const detectInitialLanguage = () => {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'en' || saved === 'zh') return saved;
  } catch (e) { void e; }

  const nav = typeof navigator !== 'undefined' ? navigator : null;
  const candidates = (nav?.languages && nav.languages.length > 0 ? nav.languages : [nav?.language]).filter(Boolean);
  const lower = String(candidates[0] || '').toLowerCase();
  if (lower.startsWith('zh')) return 'zh';
  return 'en';
};

const resources = {
  en: {
    common: {
      nav: { home: 'Home', games: 'Games', swap: 'Swap' },
      lang: { en: 'English', zh: '简体中文' },
      wallet: {
        connect: 'Connect Wallet',
        connected: 'Wallet connected: {{addr}}',
        card: { usdtBalance: 'USDT Balance', totalValuation: 'Total Valuation' },
        actions: { deposit: 'Deposit', withdraw: 'Withdraw' },
        menu: {
          personalCenter: 'Personal Center',
          referralProgram: 'Referral Program',
          securityCenter: 'Security Center',
          disconnect: 'Disconnect',
        },
      },
      intro: { loadingAssets: 'LOADING ASSETS', connecting: 'CONNECTING TO METAVERSE', gameOn: 'GAME ON' },
      home: {
        hero: {
          tagline: 'The Future of Play',
          headingPrefix: 'Play To',
          phrases: { ownItAll: 'Own It All', earnLegacy: 'Earn Legacy', defyReality: 'Defy Reality', ruleTheVerse: 'Rule The Verse' },
          description: 'Join the Nexus.GG ecosystem. Collect legendary assets, compete in global tournaments, and unlock the Metaverse.',
          highlights: { zeroGasFees: 'Zero Gas Fees', crossChain: 'Cross-Chain' },
          cta: { startPlaying: 'Start Playing', exploreMarket: 'Explore Market' },
          scroll: 'Scroll',
        },
        modesSection: {
          titlePrefix: 'Explore',
          titleHighlight: 'Modes',
          description: 'Scroll down to discover the diverse gaming experiences available in the Nexus ecosystem.',
          playNow: 'Play Now',
        },
        modes: {
          singlePlayer: { title: 'Single Player', desc: 'Immersive solo campaigns with progression tracking.' },
          competitive: { title: 'Competitive', desc: 'High-stakes tournaments with massive prize pools.' },
          cardGames: { title: 'Card Games', desc: 'Collect rare NFT cards and build your ultimate deck.' },
          prediction: { title: 'Prediction', desc: 'Predict market movements and win big.' },
        },
        ecosystem: {
          titlePrefix: 'The',
          titleHighlight: 'Ecosystem',
          totalPlayers: 'TOTAL PLAYERS',
          zeroGas: { title: 'Zero Gas', desc: 'Seamless gameplay without transaction interruptions.' },
          globalServers: { title: 'Global Servers', desc: 'Low latency connection nodes across 12 regions.' },
          crossChainReady: { title: 'Cross-Chain Ready', desc: 'Trade assets freely between Ethereum, Solana, and Polygon.' },
        },
        faq: {
          title: 'FAQ',
          q1: { q: 'What is Nexus.GG?', a: 'Nexus.GG is a next-gen web3 gaming platform combining AAA gameplay with true asset ownership.' },
          q2: { q: 'Do I need a wallet to play?', a: 'No! You can start playing immediately with a social login. Connect a wallet later to trade assets.' },
          q3: { q: 'Are there gas fees?', a: 'We use a gas-less relayer network, so you never pay for transactions during gameplay.' },
          q4: { q: 'How do I earn rewards?', a: 'Compete in tournaments, complete daily quests, or trade rare items in the marketplace.' },
        },
        footer: {
          privacy: 'Privacy',
          terms: 'Terms',
          contact: 'Contact',
          copyright: '© 2025 NEXUS.GG STUDIOS. ALL RIGHTS RESERVED.',
        },
        liveEarnings: {
          title: 'Live Earnings',
          subtitle: 'Join thousands of players earning crypto rewards every minute',
          hoverToPause: 'Hover to pause',
          startEarningNow: 'Start Earning Now',
          earned: 'EARNED',
          bigWin: 'BIG',
        },
      },
      lobby: {
        hero: {
          imageAlt: 'Featured game',
          avatarAlt: 'Player',
          description: 'A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities.',
          reviews: '+12k Reviews',
        },
        badges: { popular: 'Popular', pc: 'PC' },
        actions: { playNow: 'PLAY NOW' },
        stats: {
          title: 'Your Statistics',
          totalProfit: 'Total Profit',
          rounds: 'Rounds',
          winRate: 'Win Rate',
          favoriteGames: 'Favorite Games',
        },
        allGames: { title: 'All Games' },
        filters: { all: 'All', popular: 'Popular', new: 'New' },
        tags: {
          game: 'Game',
          rpg: 'RPG',
          fps: 'FPS',
          competitive: 'Competitive',
          adventure: 'Adventure',
          mmo: 'MMO',
          sports: 'Sports',
          openWorld: 'Open World',
          sandbox: 'Sandbox',
        },
      },
      profile: {
        common: { unknown: '...' },
        header: {
          vipDefault: 'Rookie',
          memberSince: 'Member since {{date}}',
        },
        actions: { editProfile: 'Edit Profile', logout: 'Logout' },
        email: { label: 'Email', unbound: 'Not bound', bind: 'Bind Email' },
        wallet: {
          title: 'My Wallet',
          manage: 'Manage',
          totalValuation: 'Total Valuation',
          deposit: 'Deposit',
          withdraw: 'Withdraw',
        },
        assets: { title: 'Crypto Assets', usdtName: 'Tether' },
        tabs: { gameHistory: 'Game History', transactions: 'Transactions', security: 'Security' },
        history: {
          filters: { allGames: 'All Games' },
          multiplier: 'Multiplier',
          noReward: 'No reward',
          empty: 'No game history yet.',
          result: { win: 'WIN', loss: 'LOSS' },
        },
        transactions: {
          empty: 'No transactions yet.',
          status: { success: 'SUCCESS', pending: 'PENDING', failed: 'FAILED' },
        },
        security: {
          verifiedTitle: 'Account Verified',
          verifiedDesc: 'Your account is fully secured with 2FA.',
        },
        editModal: {
          title: 'Edit Profile',
          subtitle: 'Update your public profile information.',
          usernameLabel: 'Username',
          usernamePlaceholder: 'Enter username',
          avatarLabel: 'Avatar URL',
          avatarPlaceholder: 'https://example.com/avatar.png',
          save: 'Save Changes',
        },
        bindEmailModal: {
          title: 'Bind Email',
          subtitle: 'Add an email to your account.',
          emailLabel: 'Email',
          emailPlaceholder: 'name@example.com',
          sendCode: 'Send Code',
          resend: 'Resend',
          sending: 'Sending...',
          codeLabel: 'Verification Code',
          codePlaceholder: '123456',
          save: 'Bind Email',
          toast: {
            sendSuccess: 'Verification code sent!',
            sendFail: 'Failed to send verification code.',
            verifySuccess: 'Email bound successfully!',
            verifyFail: 'Failed to verify code.',
          },
        },
        txModal: {
          depositTitle: 'Deposit Funds',
          withdrawTitle: 'Withdraw Funds',
          depositDesc: 'Enter the amount you want to deposit to your wallet.',
          withdrawDesc: 'Enter the amount you want to withdraw from your wallet.',
          currency: 'Currency',
          amount: 'Amount ({{currency}})',
          amountPlaceholder: '0.00',
          confirmDeposit: 'Confirm Deposit',
          confirmWithdraw: 'Confirm Withdrawal',
        },
        toast: { updateSuccess: 'Profile updated successfully!', updateFail: 'Failed to update profile.' },
      },
    },
  },
  zh: {
    common: {
      nav: { home: '首页', games: '游戏', swap: '兑换' },
      lang: { en: 'English', zh: '简体中文' },
      wallet: {
        connect: '连接钱包',
        connected: '钱包已连接：{{addr}}',
        card: { usdtBalance: 'USDT 余额', totalValuation: '总估值' },
        actions: { deposit: '充值', withdraw: '提现' },
        menu: {
          personalCenter: '个人中心',
          referralProgram: '邀请计划',
          securityCenter: '安全中心',
          disconnect: '断开连接',
        },
      },
      intro: { loadingAssets: '正在同步资源...', connecting: '正在接入游戏宇宙...', gameOn: '蓄势待发' },
      home: {
        hero: {
          tagline: '定义未来游戏',
          headingPrefix: '即刻',
          phrases: { ownItAll: '主宰一切', earnLegacy: '铸就传奇', defyReality: '颠覆现实', ruleTheVerse: '统领宇宙' },
          description: '加入 Nexus.GG 生态系统。收集传奇资产，参与全球锦标赛，解锁游戏宇宙。',
          highlights: { zeroGasFees: '零 Gas 费', crossChain: '跨链互通' },
          cta: { startPlaying: '开始游戏', exploreMarket: '探索市场' },
          scroll: '下滑',
        },
        modesSection: {
          titlePrefix: '探索',
          titleHighlight: '玩法',
          description: '向下滚动，发现 Nexus 生态中多样的游戏体验。',
          playNow: '立即开玩',
        },
        modes: {
          singlePlayer: { title: '单人模式', desc: '沉浸式单人战役，进度可追踪。' },
          competitive: { title: '竞技模式', desc: '高强度锦标赛，超大规模奖池。' },
          cardGames: { title: '卡牌游戏', desc: '收集稀有 NFT 卡牌，打造终极卡组。' },
          prediction: { title: '预测玩法', desc: '预测行情走势，赢取大奖。' },
        },
        ecosystem: {
          titlePrefix: '',
          titleHighlight: '生态系统',
          totalPlayers: '玩家总数',
          zeroGas: { title: '零 Gas', desc: '丝滑游戏体验，交易不中断。' },
          globalServers: { title: '全球节点', desc: '覆盖 12 个地区的低延迟连接。' },
          crossChainReady: { title: '跨链就绪', desc: '在以太坊、Solana 与 Polygon 之间自由交易资产。' },
        },
        faq: {
          title: '常见问题',
          q1: { q: 'Nexus.GG 是什么？', a: 'Nexus.GG 是新一代 Web3 游戏平台，将 AAA 级玩法与真正的资产所有权结合。' },
          q2: { q: '玩游戏需要钱包吗？', a: '不需要！你可以使用社交账号直接开玩；之后再连接钱包用于交易资产。' },
          q3: { q: '会有 Gas 费吗？', a: '我们使用免 Gas 的中继网络，游戏过程中交易无需你支付手续费。' },
          q4: { q: '如何获得奖励？', a: '参与锦标赛、完成每日任务，或在市场交易稀有道具。' },
        },
        footer: {
          privacy: '隐私政策',
          terms: '条款',
          contact: '联系',
          copyright: '© 2025 NEXUS.GG STUDIOS. 保留所有权利。',
        },
        liveEarnings: {
          title: '实时收益',
          subtitle: '每分钟都有成千上万的玩家赚取加密奖励',
          hoverToPause: '鼠标悬停以暂停',
          startEarningNow: '立即开始赚取',
          earned: '已赚取',
          bigWin: '大额',
        },
      },
      lobby: {
        hero: {
          imageAlt: '主推游戏',
          avatarAlt: '玩家',
          description: '5v5 角色战术射击：精准枪法与独特特工技能正面对决。',
          reviews: '+1.2万 评价',
        },
        badges: { popular: '热门', pc: 'PC' },
        actions: { playNow: '立即开玩' },
        stats: {
          title: '个人数据',
          totalProfit: '总收益',
          rounds: '局数',
          winRate: '胜率',
          favoriteGames: '常玩游戏',
        },
        allGames: { title: '全部游戏' },
        filters: { all: '全部', popular: '热门', new: '最新' },
        tags: {
          game: '游戏',
          rpg: 'RPG',
          fps: 'FPS',
          competitive: '竞技',
          adventure: '冒险',
          mmo: 'MMO',
          sports: '体育',
          openWorld: '开放世界',
          sandbox: '沙盒',
        },
      },
      profile: {
        common: { unknown: '...' },
        header: {
          vipDefault: '新手',
          memberSince: '加入于 {{date}}',
        },
        actions: { editProfile: '编辑资料', logout: '退出登录' },
        email: { label: '邮箱', unbound: '未绑定', bind: '绑定邮箱' },
        wallet: {
          title: '我的钱包',
          manage: '管理',
          totalValuation: '总估值',
          deposit: '充值',
          withdraw: '提现',
        },
        assets: { title: '加密资产', usdtName: '泰达币' },
        tabs: { gameHistory: '对局记录', transactions: '资金流水', security: '安全' },
        history: {
          filters: { allGames: '全部游戏' },
          multiplier: '倍数',
          noReward: '暂无奖励',
          empty: '暂无对局记录。',
          result: { win: '胜利', loss: '失败' },
        },
        transactions: {
          empty: '暂无流水记录。',
          status: { success: '成功', pending: '处理中', failed: '失败' },
        },
        security: {
          verifiedTitle: '账号已验证',
          verifiedDesc: '你的账号已开启 2FA，安全防护已就绪。',
        },
        editModal: {
          title: '编辑资料',
          subtitle: '更新你的公开资料信息。',
          usernameLabel: '昵称',
          usernamePlaceholder: '请输入昵称',
          avatarLabel: '头像链接',
          avatarPlaceholder: 'https://example.com/avatar.png',
          save: '保存修改',
        },
        bindEmailModal: {
          title: '绑定邮箱',
          subtitle: '为你的账号添加邮箱。',
          emailLabel: '邮箱',
          emailPlaceholder: 'name@example.com',
          sendCode: '发送验证码',
          resend: '重新发送',
          sending: '发送中...',
          codeLabel: '验证码',
          codePlaceholder: '123456',
          save: '绑定邮箱',
          toast: {
            sendSuccess: '验证码已发送！',
            sendFail: '验证码发送失败。',
            verifySuccess: '邮箱绑定成功！',
            verifyFail: '验证码校验失败。',
          },
        },
        txModal: {
          depositTitle: '充值',
          withdrawTitle: '提现',
          depositDesc: '请输入要充值到钱包的金额。',
          withdrawDesc: '请输入要从钱包提现的金额。',
          currency: '币种',
          amount: '金额（{{currency}}）',
          amountPlaceholder: '0.00',
          confirmDeposit: '确认充值',
          confirmWithdraw: '确认提现',
        },
        toast: { updateSuccess: '资料更新成功！', updateFail: '资料更新失败。' },
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectInitialLanguage(),
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],
    interpolation: { escapeValue: false },
  });

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem('lang', lng);
  } catch (e) { void e; }
});

export default i18n;
