export const trip = {
  title: '熊本四天三夜自由行',
  subtitle: '美食・休閒・溫泉・六萬日幣',
  dates: '2026/7/17 (五) → 7/20 (一)',
  travelers: 2,
  budget: 60000,
  budgetCurrency: 'JPY',

  weather: {
    temp: '31°C / 24°C',
    condition: '盛夏・潮濕・午後雷陣雨',
    tip: '帶傘・輕薄衣物・防曬',
  },

  days: [
    {
      day: 1,
      date: '7/17 (五)',
      title: '抵達・熊本市區漫步',
      subtitle: '城下町初印象，馬刺し定番',
      activities: [
        { time: '午前', icon: '🛫', title: '抵達熊本機場', desc: '機場巴士至熊本駅（50分・¥1,000/人）', budget: 2000, type: 'transport' },
        { time: '13:00', icon: '🏨', title: 'Check-in 飯店', desc: '熊本駅周辺ビジネスホテル（¥6,000/室・3晚）', budget: 6000, type: 'hotel' },
        { time: '13:30', icon: '🍜', title: '桂花ラーメン', desc: '熊本ラーメン元祖！マー油香る豚骨醤油', budget: 1500, type: 'food' },
        { time: '15:00', icon: '🏯', title: '熊本城', desc: '日本三名城。天守閣展望台 ¥800/人', budget: 1600, type: 'ticket' },
        { time: '17:00', icon: '🏘️', title: '城彩苑 桜の馬場', desc: '江戶時代の城下町再現・いきなり団子試吃', budget: 500, type: 'food' },
        { time: '18:30', icon: '🌃', title: '上下通アーケード', desc: '熊本最大の商店街，逛街', budget: 0, type: 'free' },
        { time: '19:00', icon: '🥩', title: '菅乃屋（馬刺し）', desc: '馬刺し五種盛合せ ¥2,500〜¥4,000', budget: 3500, type: 'food' },
        { time: '21:00', icon: '♨️', title: '湯らっくす', desc: '天然温泉+サウナ ¥800/人', budget: 1600, type: 'onsen' },
      ],
      dayBudget: 16700,
      lat: 32.8031, lng: 130.7079,
    },
    {
      day: 2,
      date: '7/18 (六)',
      title: '文化・庭園・美食',
      subtitle: '水前寺靜謐，市區深度巡禮',
      activities: [
        { time: '09:00', icon: '🌅', title: '水前寺成趣園', desc: '桃山式回遊庭園 ¥400/人', budget: 800, type: 'ticket' },
        { time: '10:30', icon: '☕', title: '出水神社前喫茶', desc: '庭園景観を眺めながら休憩', budget: 500, type: 'food' },
        { time: '11:30', icon: '🐻', title: 'くまモンスクエア', desc: '部長辦公室！免費入場', budget: 0, type: 'free' },
        { time: '12:30', icon: '🥟', title: '紅蘭亭（太平燕）', desc: '熊本ソウルフード タイピーエン ¥900〜1,200', budget: 2000, type: 'food' },
        { time: '14:00', icon: '🏛️', title: '熊本県立美術館', desc: '分館巡禮 ¥300/人', budget: 600, type: 'ticket' },
        { time: '16:00', icon: '🎡', title: '肥後よかモン市場', desc: '熊本駅內土產街・お土産採購', budget: 1000, type: 'shopping' },
        { time: '18:00', icon: '🍺', title: '郷彩根っこ', desc: 'からし蓮根・だご汁等郷土料理居酒屋', budget: 4000, type: 'food' },
        { time: '20:30', icon: '♨️', title: 'あがんなっせ（温泉カフェ）', desc: 'アジアン庭園露天風呂 ¥1,000/人', budget: 2000, type: 'onsen' },
      ],
      dayBudget: 10900,
      lat: 32.7911, lng: 130.7306,
    },
    {
      day: 3,
      date: '7/19 (日)',
      title: '自由日・市内悠閒',
      subtitle: '熊本市電一日券で自由散策',
      activities: [
        { time: '09:00', icon: '🚃', title: '市電一日券啟動', desc: 'モバイル1日券 ¥500/人，一日無限搭乘', budget: 1000, type: 'transport' },
        { time: '10:00', icon: '🐻', title: '熊本市動植物園', desc: '¥600/人，親子休閒好去處', budget: 1200, type: 'ticket' },
        { time: '12:00', icon: '🍜', title: 'こむらさき', desc: '1954年創業・熊本ラーメンの原点 ¥850', budget: 1700, type: 'food' },
        { time: '14:00', icon: '🛍️', title: '蔦屋書店 / PARCO', desc: '熊本駅直結，コインロッカーあり', budget: 2000, type: 'shopping' },
        { time: '17:00', icon: '🍡', title: 'いきなり団子巡禮', desc: 'さつまいも+餡の蒸し団子 ¥100〜', budget: 1000, type: 'food' },
        { time: '19:00', icon: '🥩', title: 'あか牛料理', desc: '赤身の旨み・焼肉で〆', budget: 4000, type: 'food' },
        { time: '21:30', icon: '♨️', title: '飯店大浴場', desc: 'ゆったり溫泉で疲れを癒す', budget: 1600, type: 'onsen' },
      ],
      dayBudget: 12500,
      lat: 32.8021, lng: 130.7140,
    },
    {
      day: 4,
      date: '7/20 (一)',
      title: '最終半日・返程',
      subtitle: '最後の熊本グルメを味わう',
      activities: [
        { time: '08:00', icon: '🌅', title: '早餐 + 整理行李', desc: '飯店朝食 or 駅前喫茶店', budget: 0, type: 'free' },
        { time: '10:00', icon: '🛍️', title: '熊本駅土産最後採買', desc: 'いきなり団子、からし蓮根、銘菓', budget: 2000, type: 'shopping' },
        { time: '11:30', icon: '🍜', title: '最後の一杯 桂花ラーメン', desc: '帰る前にもう一度熊本の味', budget: 1500, type: 'food' },
        { time: '13:00', icon: '🚌', title: '機場巴士', desc: '熊本駅→熊本空港 ¥1,000/人', budget: 2000, type: 'transport' },
        { time: '15:00', icon: '🛫', title: '搭機返家', desc: 'お疲れ様でした！', budget: 0, type: 'free' },
      ],
      dayBudget: 5500,
      lat: 32.8031, lng: 130.7079,
    },
  ],

  // Budget summary
  budgetSummary: [
    { label: '住宿', icon: '🏨', amount: 18000, note: '3晚 × ¥6,000/室' },
    { label: '餐飲', icon: '🍜', amount: 16000, note: '4天 × ¥4,000/日/2人' },
    { label: '交通', icon: '🚃', amount: 6000, note: '機場巴士+市電+單程' },
    { label: '門票', icon: '🎫', amount: 3000, note: '熊本城+水前寺+美術館' },
    { label: '溫泉', icon: '♨️', amount: 3600, note: '湯らっくす+あがんなっせ' },
    { label: '雜費', icon: '🛍️', amount: 5400, note: '土產+小吃+預備' },
  ],

  // Location markers for map
  locations: [
    { name: '熊本空港', lat: 32.8375, lng: 130.8552, icon: 'airport' },
    { name: '熊本駅', lat: 32.7893, lng: 130.7013, icon: 'train' },
    { name: '熊本城', lat: 32.8062, lng: 130.7062, icon: 'castle' },
    { name: '水前寺成趣園', lat: 32.7911, lng: 130.7343, icon: 'garden' },
    { name: 'くまモンスクエア', lat: 32.8021, lng: 130.7071, icon: 'bear' },
    { name: '上下通商店街', lat: 32.8040, lng: 130.7080, icon: 'shopping' },
    { name: '城彩苑', lat: 32.8065, lng: 130.7045, icon: 'historic' },
    { name: '湯らっくす', lat: 32.7785, lng: 130.6975, icon: 'onsen' },
    { name: 'あがんなっせ', lat: 32.8350, lng: 130.7200, icon: 'onsen' },
    { name: '熊本県立美術館', lat: 32.8095, lng: 130.7035, icon: 'museum' },
    { name: '動植物園', lat: 32.7910, lng: 130.7160, icon: 'zoo' },
    { name: '肥後よかモン市場', lat: 32.7893, lng: 130.7013, icon: 'market' },
  ],

  // Daily routes (lat/lng pairs connecting day's activities)
  dailyRoutes: {
    1: [[32.8375,130.8552],[32.7893,130.7013],[32.8021,130.7071],[32.8062,130.7062],[32.8065,130.7045],[32.8040,130.7080],[32.8021,130.7071],[32.7785,130.6975]],
    2: [[32.7911,130.7343],[32.7911,130.7343],[32.8021,130.7071],[32.8040,130.7080],[32.8095,130.7035],[32.7893,130.7013],[32.8040,130.7080],[32.8350,130.7200]],
    3: [[32.8021,130.7071],[32.7910,130.7160],[32.8021,130.7071],[32.7893,130.7013],[32.8040,130.7080],[32.8021,130.7071],[32.7893,130.7013]],
    4: [[32.7893,130.7013],[32.7893,130.7013],[32.8021,130.7071],[32.7893,130.7013],[32.8375,130.8552]],
  },
};

export const foods = [
  { name: '馬刺し', desc: '生馬肉刺身，熊本代名詞', price: '¥2,000-4,000', shop: '菅乃屋 / 馬桜', lat: 32.8035, lng: 130.7090 },
  { name: '熊本ラーメン', desc: '豚骨+マー油+にんにくチップ', price: '¥800-1,200', shop: '桂花ラーメン / こむらさき', lat: 32.8025, lng: 130.7085 },
  { name: '太平燕', desc: '春雨海鮮スープ，市民的ソウルフード', price: '¥900-1,500', shop: '紅蘭亭', lat: 32.8040, lng: 130.7080 },
  { name: 'あか牛', desc: '褐毛和種，赤身の旨み', price: '¥1,500-3,000', shop: 'いまきん食堂', lat: 32.8045, lng: 130.7070 },
  { name: 'からし蓮根', desc: '蓮根に辛子味噌を詰めて揚げた郷土料理', price: '¥500-1,000', shop: '郷彩根っこ', lat: 32.8030, lng: 130.7095 },
  { name: 'いきなり団子', desc: 'さつまいも+餡の蒸し菓子', price: '¥100-200', shop: '城彩苑・各土産店', lat: 32.8065, lng: 130.7045 },
];

export const transport = [
  { mode: '空港→熊本駅', icon: '🚌', route: '機場巴士', time: '50分', cost: '¥1,000', note: '直達，最方便' },
  { mode: '市電', icon: '🚃', route: '熊本市交通局', time: '各線', cost: '¥200 均一', note: '1日券¥500(モバイル)' },
  { mode: '市バス', icon: '🚌', route: '熊本市営バス', time: '各線', cost: '¥180-300', note: 'Suica可' },
  { mode: 'JR 熊本→阿蘇', icon: '🚃', route: '豊肥本線', time: '1.5hr', cost: '¥1,200', note: '日帰り可能' },
];
