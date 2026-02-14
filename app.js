// ═══════════════════════════════════════════════════════
//  İNGİLİZCE TAKİP PWA  –  app.js  (C Tam Paket)
// ═══════════════════════════════════════════════════════

// ── PWA Kurulumu ──────────────────────────────────────
let deferredPrompt;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBanner').classList.remove('hidden');
});
window.addEventListener('appinstalled', () => {
  document.getElementById('installBanner').classList.add('hidden');
});
function installApp() {
  if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; }
}
function closeInstallBanner() {
  document.getElementById('installBanner').classList.add('hidden');
}

// ── LocalStorage ──────────────────────────────────────
const storage = {
  get(k)   { try { const d = localStorage.getItem(k); return d ? JSON.parse(d) : null; } catch(e) { return null; } },
  set(k,v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} }
};

// ═══════════════════════════════════════════════════════
//  AKTİVİTELER  —  CSV'den eksiksiz, kısaltılmadan
// ═══════════════════════════════════════════════════════
const ACTIVITIES = [
  {
    id: 1,
    color: '#FF6B6B',
    icon: '🎧',
    time: 'Her Gün – Sabah Yolculuğu (Gidiş)',
    duration: '30–45 dk',
    title: 'Yeni Dinleme & Shadowing',
    steps: [
      'Yeni dinleme: 4 bölüm dinle (ortalama 6–10 dk\'lık podcast).',
      'İlk dinleme: Sadece dinle, genel anlamı (gist) yakala, detaylara takılma.',
      'Transkript açıkken takip et, anlamadığın kelimeleri işaretle (kırmızı kalem veya telefon notu).',
      'Kelimeyi önce context clue ile tahmin et (cümle öncesi/sonrası ipucu).',
      'Tahmin edemiyorsan hızlıca bak (Cambridge Dictionary veya Google Translate, 1–2 saniye).',
      'Hafif shadowing dene: Fısıldayarak veya dudak hareketiyle cümleleri tekrarla (trafik varsa sessiz).'
    ],
    resources: [
      'BBC Learning English – 6 Minute English (transcript + ses, güncel bölümler: konuşma korkusu, anlaşmazlık, günlük hayat temalı olanlar)',
      'Alternatif yavaş kaynaklar: Espresso English Podcast, Slow English Podcast, Miss Honey: Slow English Podcast',
      'Spotify/YouTube audio (hız ayarı 0.75x–0.9x mümkünse kullan)',
      'Transkript için: BBC resmi sitesi veya podcast uygulamasının metin bölümü'
    ],
    tips: [
      'Yeni comprehensible input + anlam bütünlüğü geliştirme.',
      'Kelime işaretleme: Günde max 5–8 yüksek değerli seç (sık tekrarlanan, cümle anlamını değiştiren, konuşmada faydalı olanlar).',
      'Anlama %70+ hedefle; düşükse seviyeyi düşür (daha yavaş podcast geç).',
      'Shadowing başlangıçta hafif olsun, ilerledikçe aktifleşsin.'
    ],
    links: [
      { name: 'BBC 6 Minute English', url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english' },
      { name: 'Cambridge Dictionary',  url: 'https://dictionary.cambridge.org/' },
      { name: 'Google Translate',      url: 'https://translate.google.com' }
    ]
  },
  {
    id: 2,
    color: '#4ECDC4',
    icon: '🔄',
    time: 'Her Gün – Akşam Dönüş Yolculuğu',
    duration: '30–45 dk',
    title: 'Tekrar Dinleme & Aktif Shadowing',
    steps: [
      'Tekrar dinleme: Sabahki 4 bölümü ×2 dinle (her birini 2 kez).',
      '1. tekrarda: Dinle + transkript açıkken takip et, işaretli kelimeleri not et.',
      '2. tekrarda: Aktif shadowing yap — podcast hızını düşür, konuşmacıyı aynı anda veya 0.5–1 sn gecikmeyle yüksek sesle tekrarla (vurgu, tonlama, ritim, duraklamaları taklit et).',
      'Serbest shadowing: Podcast\'i durdur, aynı cümleyi kendi kelimelerinle değiştirerek tekrarla (örn: "I went to the store yesterday" → "I went to the market yesterday").',
      'Eğer çok yorgunsan sadece dinle, shadowing atla.'
    ],
    resources: [
      'Sabah dinlenen aynı bölümler (tekrar için)',
      'Dizi sesi (altyazısız): Friends, The Office, Brooklyn Nine-Nine',
      'Spotify/YouTube hız kontrolü (0.8x–1.0x)',
      'NotebookLM Audio Overview (podcast transkriptinden üretilmiş özet)'
    ],
    tips: [
      'Pekiştirme + anlam oranı %85–95\'e çıkarma.',
      'Gramer kalıplarını bilinçaltına oturtturma.',
      'Shadowing ile telaffuz + akıcılık otomatikleşir.',
      'Cümle kurma takılmaları azalır, kelime hatırlama hızlanır.'
    ],
    links: [
      { name: 'Netflix',    url: 'https://www.netflix.com' },
      { name: 'YouTube',    url: 'https://www.youtube.com' },
      { name: 'NotebookLM', url: 'https://notebooklm.google.com' }
    ]
  },
  {
    id: 3,
    color: '#95E1D3',
    icon: '💬',
    time: 'Her Gün – Evde Akşam',
    duration: '30–45 dk',
    title: 'Kelime Kartları, AI Konuşma & Mini Output',
    steps: [
      '── BÖLÜM 1: Kelime / Phrase Seçme & Kart Ekleme (10–15 dk) ──',
      'İşaretlediklerinden 5–8 yüksek değerli kelime seç.',
      'Tam cümle içinde öğren (tek kelime değil, bağlam ile).',
      'Kart ekle: Cloze (boşluk doldurma) veya Basic/production (TR→EN) formatında.',
      'Hazır deck tekrarı: %60–70 hazır kart, %30–40 kendi kartın.',
      '── BÖLÜM 2: AI Konuşma Pratiği (15–20 dk) ──',
      'Prompt ile konuş, hataları nazikçe düzelttir.',
      'Kelime hatırlayamazsan "help" de (3–4 seçenek versin).',
      'Zaman kipleri ve basit cümle takılmalarına odaklan.',
      '── BÖLÜM 3: Mini Output (5 dk) ──',
      'Yüksek sesle 1–2 dk kendini anlat (günlük rutin, hobiler, İstanbul trafiği).',
      'Telefonla kaydet → dinle, takıldığın yerleri not et.'
    ],
    resources: [
      'Kelime kartları: Anki (önerilen), Quizlet, Memrise',
      'AI konuşma: ChatGPT, Claude (claude.ai), Grok',
      'Okuma/input: News in Levels (Level 1–2), British Council A1/A2 reading',
      'Alışkanlık takibi: TickTick veya Habitica (streak tut)',
      'NotebookLM: Transkript yükle → flashcards/quiz üret'
    ],
    tips: [
      'Kelime haznesi genişletme + konuşma hızı + gramer doğal edinme.',
      'Kendi kartlar kişisel bağlam için kritik (İstanbul trafiği, gerçek diyaloglar gibi).',
      'AI prompt örneği: "Sen benim İngilizce öğretmenimsin. Benimle günlük konuşma yap, hatalarımı nazikçe düzelt."',
      'NotebookLM ile manuel kelime çıkarma süresini yarıya indir.'
    ],
    links: [
      { name: 'Anki',           url: 'https://apps.ankiweb.net/' },
      { name: 'ChatGPT',        url: 'https://chat.openai.com' },
      { name: 'Claude',         url: 'https://claude.ai' },
      { name: 'News in Levels', url: 'https://www.newsinlevels.com' },
      { name: 'NotebookLM',     url: 'https://notebooklm.google.com' }
    ]
  },
  {
    id: 4,
    color: '#F38181',
    icon: '🌤️',
    time: 'Cumartesi (13:20\'den Sonra Serbest)',
    duration: '1–2 saat (esnek)',
    title: 'Hafta Sonu Keyif & Opsiyonel Pratik',
    steps: [
      '13:30–15:00 → Dinlen, öğle yemeği, hafif yürüyüş veya ev işi (İngilizce zorunlu değil).',
      '15:00–16:00 (OPSİYONEL keyif input) → Hafta içi favori podcast bölümlerini rahatça tekrarla.',
      '15:00–16:00 (OPSİYONEL dizi) → Netflix\'te Friends / The Office izle (İngilizce altyazı veya altyazısız).',
      '16:00–17:00 (OPSİYONEL aktif pratik) → AI konuşma 15 dk ("My weekend plans" konusu).',
      '16:00–17:00 (OPSİYONEL) → Kelime kart tekrarı + mini output.',
      'Akşam → Tamamen serbest (aile, arkadaş, hobiler).'
    ],
    resources: [
      'Dizi: Friends, The Office, Brooklyn Nine-Nine (Netflix / YouTube)',
      'Podcast tekrarı veya NotebookLM Audio Overview',
      'HelloTalk / Tandem sesli mesaj (isteğe bağlı)',
      'Anki kart tekrarı (sadece "due" olanlar, 10–15 dk)'
    ],
    tips: [
      'Hafif keyif + motivasyon koruma günü.',
      'İngilizce\'yi zorunlu yapma, dinlenme öncelikli.',
      'Opsiyonel kısımlar enerjine göre seç — hepsini yapman gerekmiyor.',
      'Dizi izlerken altyazıyı TR değil EN yap (mümkünse altyazısız).'
    ],
    links: [
      { name: 'Netflix',    url: 'https://www.netflix.com' },
      { name: 'HelloTalk',  url: 'https://www.hellotalk.com' },
      { name: 'Tandem',     url: 'https://www.tandem.net' },
      { name: 'NotebookLM', url: 'https://notebooklm.google.com' }
    ]
  },
  {
    id: 5,
    color: '#AA96DA',
    icon: '🌿',
    time: 'Pazar (Tam Tatil)',
    duration: '1–2 saat (esnek)',
    title: 'Dinlenme, Okuma & Gramer (Opsiyonel)',
    steps: [
      '10:00–12:00 → Geç kalk, kahvaltı, dinlen.',
      '10:00–12:00 (OPSİYONEL okuma, 30–45 dk) → British Council A2 reading, News in Levels Level 1, veya graded reader.',
      '13:00–16:00 (OPSİYONEL gramer, 20–30 dk) → Raymond Murphy Elementary: 1 ünite oku + 5–10 alıştırma.',
      '13:00–16:00 (OPSİYONEL dizi/input, 60–90 dk) → Keyif içeriği izle (altyazılı).',
      'Gramer çalıştıktan sonra AI\'ya taşı: "Bugün past simple çalıştım, benimle past simple kullanarak konuş."',
      '18:00–20:00 (OPSİYONEL) → HelloTalk sesli mesaj 20–30 dk.',
      'OPSİYONEL → İlerleme videosu çek (3–4 haftada bir, 3–5 dk İngilizce konuş).'
    ],
    resources: [
      'Okuma: British Council A1/A2 reading, Lingua.com, Oxford Bookworms Starter/Level 1',
      'Gramer kitabı: Raymond Murphy – English Grammar in Use Elementary (Cambridge)',
      'Tandem uygulamaları: HelloTalk, Tandem, Discord İngilizce language-exchange serverleri',
      'İlerleme takibi: Telefon kamerası ile kısa video'
    ],
    tips: [
      'Dinlenme + opsiyonel ilerleme günü.',
      'Gramer kitabı sadece "enerjim var" dersen yap; zorunlu değil.',
      'İlerleme videosu motivasyon için kritik (her 3–4 haftada bir öncekiyle karşılaştır).',
      'NotebookLM faydalı: Gramer PDF yükle → quiz / özet üret.',
      'Pazar akşamı hafta boyunca ne yaptığını not et (1–2 cümle).'
    ],
    links: [
      { name: 'British Council', url: 'https://learnenglish.britishcouncil.org' },
      { name: 'HelloTalk',       url: 'https://www.hellotalk.com' },
      { name: 'Tandem',          url: 'https://www.tandem.net' },
      { name: 'NotebookLM',      url: 'https://notebooklm.google.com' }
    ]
  },
  {
    id: 6,
    color: '#FCBAD3',
    icon: '🌍',
    time: 'Haftalık Ekstra / Genel',
    duration: '+1–2 saat (haftaya yayılır)',
    title: 'Gerçek İnsan Pratiği & İlerleme Takibi',
    steps: [
      'Gerçek insan pratiği: Haftada 2–3 kez HelloTalk/Tandem sesli mesaj veya kısa sesli arama ("yavaş konuş" de).',
      'İlerleme kontrolü: 3–4 haftada bir 3–5 dk İngilizce video çek, öncekiyle karşılaştır.',
      'OPSİYONEL italki/Preply dersi: Haftada 1 × 30–45 dk (bütçe varsa, konuşma odaklı hoca seç).',
      'NotebookLM entegrasyonu: Her gün transkript yükle → Audio Overview dinle → flashcard / quiz üret.',
      'Motivasyon takibi: TickTick veya Habitica ile "English time" habit ekle, streak kır.'
    ],
    resources: [
      'Gerçek pratik: HelloTalk, Tandem, Discord (İngilizce language-exchange serverleri)',
      'Ücretli ders: italki, Preply (konuşma odaklı community tutor)',
      'Alışkanlık & streak: TickTick, Habitica, Streaks (iOS)',
      'Ücretsiz: r/LanguageExchange (Reddit), Speaky, Conversation Exchange'
    ],
    tips: [
      'Gerçek etkileşim + ilerleme takibi + otomatik öğrenme desteği.',
      'NotebookLM ile manuel kelime çıkarma süresini yarıya indir.',
      'Streak bozulursa üzülme — ertesi gün devam et, "sıfır gün" mantığını uygula.',
      'B1 kontrol noktaları: 10 dk kesintisiz konuşma, podcast %80 anlama, film/dizi ana fikrini yakalama.'
    ],
    links: [
      { name: 'italki',     url: 'https://www.italki.com' },
      { name: 'Preply',     url: 'https://preply.com' },
      { name: 'HelloTalk',  url: 'https://www.hellotalk.com' },
      { name: 'Habitica',   url: 'https://habitica.com' },
      { name: 'TickTick',   url: 'https://ticktick.com' }
    ]
  }
];

// ═══════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════
let state = {
  currentPage: 'dashboard',
  completedActivities: [], vocabulary: [], notes: {},
  goals: { daily: 120, weekly: 840, monthly: 3600 },
  streak: 0, badges: [], xp: 0, level: 1,
  timerSeconds: 0, timerActive: false,
  pomodoroMode: false, pomodoroPhase: 'work', pomodoroCount: 0,
  selectedActivity: null, fabMenuOpen: false,
  theme: 'default', musicOn: false, currentTrack: 0,
  quests: [], questsDate: '', reminderTime: '21:00',
  expandedActivity: null
};

const XP_PER_LEVEL = 100;
const LEVEL_NAMES   = ['Beginner','Beginner II','Elementary','Elementary II','Pre-Intermediate','Intermediate','Intermediate II','Upper-Intermediate','Advanced','Expert'];

const QUEST_POOL = [
  { id:'q1',  text:'Sabah aktivitesini tamamla',   xp:30 },
  { id:'q2',  text:'Akşam shadowing yap',           xp:30 },
  { id:'q3',  text:'5 yeni kelime ekle',            xp:25 },
  { id:'q4',  text:'30 dk zamanlayıcı çalıştır',    xp:20 },
  { id:'q5',  text:'1 pomodoro tamamla',            xp:35 },
  { id:'q6',  text:'Kelime tekrarı yap',            xp:15 },
  { id:'q7',  text:'Evde akşam aktivitesini yap',   xp:30 },
  { id:'q8',  text:'Günlük hedefini kontrol et',    xp:10 },
  { id:'q9',  text:'2 farklı aktivite tamamla',     xp:40 },
  { id:'q10', text:'Toplam 45 dk çalış',            xp:45 }
];

const TRACKS = [
  { name: 'Lo-fi Study Beats',  emoji: '🎵' },
  { name: 'Ambient Focus',      emoji: '🌊' },
  { name: 'Nature Sounds',      emoji: '🌿' }
];

const ALL_BADGES = [
  { id:'first_complete',  icon:'🎯', name:'İlk Adım',          desc:'İlk aktiviteyi tamamladın!' },
  { id:'streak_7',        icon:'🔥', name:'1 Hafta',           desc:'7 gün streak!' },
  { id:'streak_30',       icon:'⭐', name:'1 Ay',              desc:'30 gün streak!' },
  { id:'streak_100',      icon:'💎', name:'100 Gün',           desc:'100 gün streak!' },
  { id:'vocab_50',        icon:'📚', name:'50 Kelime',         desc:'50 kelime öğrendin!' },
  { id:'vocab_100',       icon:'🎓', name:'100 Kelime',        desc:'100 kelime öğrendin!' },
  { id:'vocab_500',       icon:'🌟', name:'500 Kelime',        desc:'500 kelime öğrendin!' },
  { id:'pomodoro',        icon:'🍅', name:'Pomodoro Master',   desc:'İlk pomodoro tamamlandı!' },
  { id:'early_bird',      icon:'🌅', name:'Sabahçı',           desc:'Sabah aktivitesi tamamlandı!' },
  { id:'night_owl',       icon:'🌙', name:'Gece Kuşu',         desc:'Akşam aktivitesi tamamlandı!' },
  { id:'weekend_warrior', icon:'🎮', name:'Hafta Sonu',        desc:'Hafta sonu çalıştın!' },
  { id:'quiz_perfect',    icon:'💯', name:'Mükemmel Quiz',     desc:'Tüm soruları doğru yaptın!' },
  { id:'level_5',         icon:'🚀', name:'Lv 5',             desc:'5. seviyeye ulaştın!' },
  { id:'level_10',        icon:'👑', name:'Lv 10',            desc:'10. seviyeye ulaştın!' }
];

// ═══════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════
function init() {
  loadState();
  applyTheme(state.theme);
  generateDailyQuests();
  updateLevelBar();
  showPage('dashboard');
  startTimerLoop();
  updateStreakDisplay();
}

function loadState() {
  ['completedActivities','vocabulary','notes','goals','streak','badges',
   'xp','level','theme','quests','questsDate','pomodoroCount','reminderTime'
  ].forEach(k => { const v = storage.get(k); if (v !== null) state[k] = v; });
}

function saveState() {
  ['completedActivities','vocabulary','notes','goals','streak','badges',
   'xp','level','theme','quests','questsDate','pomodoroCount','reminderTime'
  ].forEach(k => storage.set(k, state[k]));
}

// ═══════════════════════════════════════════════════════
//  TIMER LOOP
// ═══════════════════════════════════════════════════════
function startTimerLoop() {
  setInterval(() => {
    if (!state.timerActive) return;
    state.timerSeconds++;
    updateTimerDisplay();
    if (state.pomodoroMode) {
      if (state.pomodoroPhase === 'work' && state.timerSeconds >= 1500) {
        state.pomodoroPhase = 'break'; state.timerSeconds = 0;
        state.pomodoroCount++; saveState();
        checkBadge('pomodoro');
        showNotif('🍅 Pomodoro tamamlandı! 5 dk mola ☕');
        renderTimer();
      } else if (state.pomodoroPhase === 'break' && state.timerSeconds >= 300) {
        state.pomodoroPhase = 'work'; state.timerSeconds = 0;
        showNotif('💪 Mola bitti! Yeni çalışma başlıyor...');
        renderTimer();
      }
    }
  }, 1000);
}

// ═══════════════════════════════════════════════════════
//  NAVİGASYON
// ═══════════════════════════════════════════════════════
function showPage(name) {
  state.currentPage = name;
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === name);
  });
  ['dashboard','activities','vocabulary','timer','games','stats','badges'].forEach(p => {
    document.getElementById(p + 'Page').classList.toggle('hidden', p !== name);
  });
  const map = {
    dashboard:  renderDashboard,
    activities: renderActivities,
    vocabulary: renderVocabulary,
    timer:      renderTimer,
    games:      renderGames,
    stats:      renderStats,
    badges:     renderBadges
  };
  if (map[name]) map[name]();
}

// ═══════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════
function renderDashboard() {
  const s = calcStats();
  document.getElementById('dashboardPage').innerHTML = `

    <!-- İstatistik Kartları -->
    <div class="stats-grid">
      <div class="stat-card purple">
        <div class="stat-icon">🔥</div>
        <div class="stat-val">${state.streak}</div>
        <div class="stat-lbl">Streak</div>
      </div>
      <div class="stat-card pink">
        <div class="stat-icon">📚</div>
        <div class="stat-val">${state.vocabulary.length}</div>
        <div class="stat-lbl">Kelime</div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon">🏆</div>
        <div class="stat-val">${state.badges.length}</div>
        <div class="stat-lbl">Rozet</div>
      </div>
    </div>

    <!-- İlerleme -->
    <div class="card">
      <div class="card-title">📊 İlerleme</div>
      ${[
        { label:'Bugün',    cur:s.todayMin, goal:state.goals.daily,   cls:'fill-green'  },
        { label:'Bu Hafta', cur:s.weekMin,  goal:state.goals.weekly,  cls:'fill-blue'   },
        { label:'Bu Ay',    cur:s.monthMin, goal:state.goals.monthly, cls:'fill-purple' }
      ].map(row => `
        <div class="prog-row">
          <div class="prog-hdr">
            <span>${row.label}</span>
            <span style="font-weight:700">${row.cur} / ${row.goal} dk (${Math.min(100,Math.round(row.cur/row.goal*100))}%)</span>
          </div>
          <div class="prog-bar"><div class="prog-fill ${row.cls}" style="width:${Math.min(100,(row.cur/row.goal)*100)}%"></div></div>
        </div>
      `).join('')}
    </div>

    <!-- Günlük Görevler -->
    <div class="card">
      <div class="card-title">🎯 Günlük Görevler</div>
      ${state.quests.map((q,i) => `
        <div class="quest-item">
          <div class="quest-check ${q.done ? 'done' : ''}" onclick="completeQuest(${i})">${q.done ? '✓' : ''}</div>
          <div class="quest-text" style="${q.done ? 'text-decoration:line-through;opacity:.5' : ''}">${q.text}</div>
          <div class="quest-xp">+${q.xp} XP</div>
        </div>
      `).join('')}
    </div>

    <!-- Pomodoro Özeti -->
    <div class="card">
      <div class="card-title">🍅 Pomodoro Özeti</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
        <div style="background:rgba(239,68,68,.15);border-radius:.75rem;padding:.85rem;text-align:center;">
          <div style="font-size:1.8rem;font-weight:800;color:#ef4444">${state.pomodoroCount}</div>
          <div style="font-size:.78rem;color:var(--text-muted)">Tamamlanan Pomodoro</div>
        </div>
        <div style="background:rgba(139,92,246,.15);border-radius:.75rem;padding:.85rem;text-align:center;">
          <div style="font-size:1.8rem;font-weight:800;color:var(--primary)">${Math.round(state.pomodoroCount * 25 / 60 * 10) / 10} saat</div>
          <div style="font-size:.78rem;color:var(--text-muted)">Toplam Fokus</div>
        </div>
      </div>
    </div>
  `;
  updateLevelBar();
  updateStreakDisplay();
}

function completeQuest(i) {
  const q = state.quests[i];
  if (q.done) return;
  q.done = true;
  addXP(q.xp);
  saveState();
  showNotif(`✅ Görev tamamlandı! +${q.xp} XP 🎉`);
  renderDashboard();
}

function generateDailyQuests() {
  const today = new Date().toDateString();
  if (state.questsDate === today && state.quests.length) return;
  const shuffled = [...QUEST_POOL].sort(() => Math.random() - .5).slice(0, 3);
  state.quests = shuffled.map(q => ({ ...q, done: false }));
  state.questsDate = today;
  saveState();
}

// ═══════════════════════════════════════════════════════
//  AKTİVİTELER
// ═══════════════════════════════════════════════════════
function renderActivities() {
  document.getElementById('activitiesPage').innerHTML = `
    <h2 class="section-title">📅 Günlük Aktiviteler</h2>
    ${ACTIVITIES.map(a => {
      const done    = isActivityDoneToday(a.id);
      const isOpen  = state.expandedActivity === a.id;
      const note    = state.notes[a.id] || '';
      return `
        <div class="act-card" style="border-color:${a.color}">

          <!-- Başlık Satırı -->
          <div class="act-head" onclick="toggleActivity(${a.id})" style="cursor:pointer;">
            <div class="act-icon">${done ? '✅' : a.icon}</div>
            <div style="flex:1;">
              <div class="act-title">${a.title}</div>
              <div class="act-sub">${a.time} • ${a.duration}</div>
            </div>
            <div style="font-size:1.2rem;color:var(--text-muted);transition:transform .3s;${isOpen ? 'transform:rotate(180deg)' : ''}">▼</div>
          </div>

          <!-- Genişletilebilir İçerik -->
          ${isOpen ? `
            <!-- Adımlar -->
            <div style="margin-bottom:.9rem;">
              <div style="font-size:.8rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem;">📋 ADIMLAR</div>
              <div style="background:rgba(0,0,0,.25);border-radius:.6rem;padding:.85rem;">
                ${a.steps.map((step, idx) => {
                  const isSectionHeader = step.startsWith('──');
                  return isSectionHeader
                    ? `<div style="font-weight:700;color:var(--primary);margin:${idx > 0 ? '.9rem' : '0'} 0 .4rem;font-size:.85rem;">${step}</div>`
                    : `<div style="display:flex;gap:.5rem;margin-bottom:.45rem;font-size:.85rem;line-height:1.55;color:#d1d5db;">
                         <span style="color:${a.color};flex-shrink:0;font-weight:700;">•</span>
                         <span>${step}</span>
                       </div>`;
                }).join('')}
              </div>
            </div>

            <!-- Kaynaklar -->
            <div style="margin-bottom:.9rem;">
              <div style="font-size:.8rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem;">📚 KAYNAKLAR</div>
              <div style="background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);border-radius:.6rem;padding:.85rem;">
                ${a.resources.map(r => `
                  <div style="display:flex;gap:.5rem;margin-bottom:.4rem;font-size:.84rem;line-height:1.5;color:#93c5fd;">
                    <span style="flex-shrink:0;">📌</span><span>${r}</span>
                  </div>`).join('')}
              </div>
            </div>

            <!-- İpuçları -->
            <div style="margin-bottom:.9rem;">
              <div style="font-size:.8rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem;">💡 İPUÇLARI & AMAÇ</div>
              <div style="background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);border-radius:.6rem;padding:.85rem;">
                ${a.tips.map(t => `
                  <div style="display:flex;gap:.5rem;margin-bottom:.4rem;font-size:.84rem;line-height:1.5;color:#6ee7b7;">
                    <span style="flex-shrink:0;">✦</span><span>${t}</span>
                  </div>`).join('')}
              </div>
            </div>

            <!-- Hızlı Linkler -->
            <div style="margin-bottom:.9rem;">
              <div style="font-size:.8rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:.5rem;">🔗 HIZLI LİNKLER</div>
              <div style="display:flex;flex-wrap:wrap;gap:.45rem;">
                ${a.links.map(l => `
                  <a href="${l.url}" target="_blank"
                     style="background:rgba(139,92,246,.2);color:#c4b5fd;padding:.35rem .75rem;border-radius:.5rem;font-size:.8rem;text-decoration:none;border:1px solid rgba(139,92,246,.3);">
                    🔗 ${l.name}
                  </a>`).join('')}
              </div>
            </div>

            <!-- Not Alanı -->
            ${note ? `
              <div style="margin-bottom:.9rem;background:rgba(234,179,8,.1);border:1px solid rgba(234,179,8,.25);border-radius:.6rem;padding:.85rem;">
                <div style="font-size:.75rem;font-weight:700;color:#eab308;margin-bottom:.35rem;">📝 NOTUM</div>
                <div style="font-size:.85rem;color:#fde68a;white-space:pre-wrap;">${note}</div>
              </div>` : ''}
          ` : ''}

          <!-- Aksiyon Butonları (her zaman görünür) -->
          <div class="act-actions" style="margin-top:${isOpen ? '.5rem' : '0'}">
            <button class="btn grad"   onclick="startActivity(${a.id})">⏱️ Başlat</button>
            <button class="btn gray"   onclick="toggleActivity(${a.id})">${isOpen ? '▲ Kapat' : '📖 Detaylar'}</button>
            <button class="btn gray"   onclick="addNote(${a.id})">📝 Not${note ? ' ✓' : ''}</button>
            ${done ? '<span class="btn green">✓ Tamamlandı</span>' : ''}
          </div>

        </div>
      `;
    }).join('')}
  `;
}

function toggleActivity(id) {
  state.expandedActivity = state.expandedActivity === id ? null : id;
  renderActivities();
}

function startActivity(id) {
  state.selectedActivity = ACTIVITIES.find(a => a.id === id);
  showPage('timer');
}

function isActivityDoneToday(id) {
  return state.completedActivities.some(c => c.activityId === id && isToday(c.date));
}

// ═══════════════════════════════════════════════════════
//  KELİME DEFTERİ
// ═══════════════════════════════════════════════════════
function renderVocabulary() {
  const sorted      = [...state.vocabulary].sort((a,b) => new Date(a.nextReview) - new Date(b.nextReview));
  const reviewCount = sorted.filter(w => new Date(w.nextReview) <= new Date()).length;

  document.getElementById('vocabularyPage').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
      <h2 class="section-title" style="margin:0;">📚 Kelime Defteri (${state.vocabulary.length})</h2>
      <button class="btn grad" onclick="showAddWord()">➕ Ekle</button>
    </div>

    ${reviewCount > 0 ? `
      <div style="background:rgba(234,179,8,.15);border:1px solid rgba(234,179,8,.35);border-radius:.75rem;padding:.85rem;margin-bottom:1rem;font-size:.85rem;">
        ⏰ <strong>${reviewCount} kelime</strong> tekrar zamanı geldi!
      </div>` : ''}

    <div style="background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.25);border-radius:.75rem;padding:.85rem;margin-bottom:1rem;font-size:.82rem;">
      💡 <strong>Spaced Repetition:</strong> Kelimeleri tekrar ettikçe aralık uzar: 1 → 2 → 4 → 8 → 16 gün.
    </div>

    ${sorted.length === 0
      ? `<div class="card" style="text-align:center;padding:3rem 1rem;">
           <div style="font-size:3rem;margin-bottom:.75rem;">📚</div>
           <p style="color:var(--text-muted);">Henüz kelime eklenmedi.<br>İlk kelimeni eklemek için ➕ butonuna bas!</p>
         </div>`
      : sorted.map(w => {
          const needsReview = new Date(w.nextReview) <= new Date();
          const daysUntil   = Math.ceil((new Date(w.nextReview) - new Date()) / (1000*60*60*24));
          return `
            <div class="vocab-card ${needsReview ? 'review' : ''}">
              <div style="flex:1;min-width:0;">
                <div class="vocab-word">
                  ${w.word}
                  <button onclick="speakWord('${w.word.replace(/'/g,"\\\'")}')"
                          style="background:none;border:none;cursor:pointer;font-size:.95rem;vertical-align:middle;margin-left:.2rem;">🔊</button>
                </div>
                <div class="vocab-tr">${w.translation}</div>
                ${w.sentence ? `<div class="vocab-sent">"${w.sentence}"</div>` : ''}
                <div class="vocab-meta">
                  <span class="tag">Tekrar: ${w.reviewCount || 0}×</span>
                  ${needsReview
                    ? '<span class="tag warn">⏰ Tekrar zamanı!</span>'
                    : `<span class="tag">${daysUntil > 0 ? daysUntil + 'g sonra' : 'Bugün'}</span>`}
                </div>
              </div>
              <div class="vocab-btns">
                <button class="icon-btn ${needsReview ? 'warn' : 'gray'}" onclick="reviewWord(${w.id})" title="Tekrar et">🔄</button>
                <button class="icon-btn red"                               onclick="deleteWord(${w.id})" title="Sil">🗑️</button>
              </div>
            </div>`;
        }).join('')
    }
  `;
}

function speakWord(word) {
  if (!('speechSynthesis' in window)) { showNotif('❌ Tarayıcınız sesi desteklemiyor'); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.lang = 'en-US'; u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function showAddWord() {
  showModal('📚 Yeni Kelime Ekle', `
    <div class="form-group">
      <label class="form-label">Kelime (İngilizce)</label>
      <input class="form-input" id="wI" placeholder="örn: accomplish" autocomplete="off">
    </div>
    <div class="form-group">
      <label class="form-label">Türkçe Anlamı</label>
      <input class="form-input" id="tI" placeholder="örn: başarmak" autocomplete="off">
    </div>
    <div class="form-group">
      <label class="form-label">Örnek Cümle (opsiyonel)</label>
      <textarea class="form-textarea" id="sI" rows="3" placeholder="I accomplished my goals today."></textarea>
    </div>
  `, [
    { text: 'Kaydet', cls: 'grad', fn() {
        const word = document.getElementById('wI').value.trim();
        const tr   = document.getElementById('tI').value.trim();
        const sent = document.getElementById('sI').value.trim();
        if (!word || !tr) { showNotif('⚠️ Kelime ve anlamını gir!'); return; }
        state.vocabulary.push({
          id: Date.now(), word, translation: tr, sentence: sent,
          addedDate: new Date().toISOString(), reviewCount: 0,
          lastReview: null, nextReview: new Date().toISOString()
        });
        addXP(10); saveState();
        if (state.vocabulary.length === 50)  checkBadge('vocab_50');
        if (state.vocabulary.length === 100) checkBadge('vocab_100');
        if (state.vocabulary.length === 500) checkBadge('vocab_500');
        closeModal(); renderVocabulary();
        showNotif('✅ Kelime eklendi! +10 XP');
    }},
    { text: 'İptal', cls: 'gray', fn: closeModal }
  ]);
  setTimeout(() => document.getElementById('wI')?.focus(), 120);
}

function reviewWord(id) {
  state.vocabulary = state.vocabulary.map(w => {
    if (w.id !== id) return w;
    const rc   = (w.reviewCount || 0) + 1;
    const next = new Date();
    next.setDate(next.getDate() + Math.pow(2, rc));
    return { ...w, reviewCount: rc, lastReview: new Date().toISOString(), nextReview: next.toISOString() };
  });
  addXP(5); saveState(); renderVocabulary();
  showNotif('🔄 Tekrar kaydedildi! +5 XP');
}

function deleteWord(id) {
  if (!confirm('Bu kelimeyi silmek istiyor musunuz?')) return;
  state.vocabulary = state.vocabulary.filter(w => w.id !== id);
  saveState(); renderVocabulary();
}

// ═══════════════════════════════════════════════════════
//  ZAMANLAYICI
// ═══════════════════════════════════════════════════════
function renderTimer() {
  const a = state.selectedActivity;
  document.getElementById('timerPage').innerHTML = `
    <div class="card">
      <div class="card-title" style="text-align:center;">⏱️ Zamanlayıcı</div>

      ${a ? `<div style="text-align:center;margin-bottom:1rem;">
               <span style="background:${a.color};color:#fff;padding:.3rem 1rem;border-radius:99px;font-size:.85rem;font-weight:600;">${a.title}</span>
             </div>` : ''}

      <div class="timer-wrap">
        <div class="timer-clock" id="timerDisplay">00:00</div>

        ${state.pomodoroMode ? `
          <div style="text-align:center;margin:.5rem 0;">
            <span class="pomodoro-phase ${state.pomodoroPhase === 'work' ? 'phase-work' : 'phase-break'}">
              ${state.pomodoroPhase === 'work' ? '🍅 Çalışma (25 dk)' : '☕ Mola (5 dk)'}
            </span>
          </div>` : ''}

        <div class="timer-btns">
          <button class="tbtn ${state.timerActive ? 'pause' : 'play'}" onclick="toggleTimer()">
            ${state.timerActive ? '⏸' : '▶️'}
          </button>
          <button class="tbtn reset" onclick="resetTimer()">🔄</button>
          ${a ? `<button class="tbtn done" onclick="completeActivity()" title="Tamamla">✓</button>` : ''}
        </div>

        <div style="text-align:center;margin-top:.5rem;">
          <button class="btn ${state.pomodoroMode ? 'grad' : 'gray'}" onclick="togglePomodoro()">
            🍅 Pomodoro ${state.pomodoroMode ? 'Aktif' : 'Pasif'}
          </button>
          <div style="font-size:.75rem;color:var(--text-muted);margin-top:.4rem;">
            Tamamlanan: ${state.pomodoroCount} 🍅
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">⚡ Hızlı Başlat</div>
      <div class="presets">
        ${[5,10,15,25,30,45,60,90].map(m =>
          `<button class="preset-btn" onclick="startPreset(${m})">${m} dk</button>`
        ).join('')}
      </div>
    </div>
  `;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const el = document.getElementById('timerDisplay');
  if (!el) return;
  const m = Math.floor(state.timerSeconds / 60);
  const s = state.timerSeconds % 60;
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function toggleTimer()   { state.timerActive = !state.timerActive; renderTimer(); }
function resetTimer()    { state.timerSeconds = 0; state.timerActive = false; renderTimer(); }
function togglePomodoro(){ state.pomodoroMode = !state.pomodoroMode; state.pomodoroPhase = 'work'; state.timerSeconds = 0; renderTimer(); }
function startPreset(m)  { state.timerSeconds = 0; state.timerActive = true; state.pomodoroMode = false; renderTimer(); }

function completeActivity() {
  if (!state.selectedActivity) return;
  const a = state.selectedActivity;
  state.completedActivities.push({
    activityId: a.id, date: new Date().toISOString(),
    duration: state.timerSeconds, activityTitle: a.title
  });
  addXP(50);
  updateStreak();
  checkBadge('first_complete');
  if (a.time.toLowerCase().includes('sabah'))     checkBadge('early_bird');
  if (a.time.toLowerCase().includes('akşam'))     checkBadge('night_owl');
  if (a.time.toLowerCase().includes('cumartesi') ||
      a.time.toLowerCase().includes('pazar'))     checkBadge('weekend_warrior');
  state.timerSeconds = 0; state.timerActive = false; state.selectedActivity = null;
  saveState(); updateStreakDisplay();
  launchConfetti();
  showNotif('🎉 Aktivite tamamlandı! +50 XP');
  setTimeout(() => showPage('dashboard'), 900);
}

// ═══════════════════════════════════════════════════════
//  OYUNLAR
// ═══════════════════════════════════════════════════════
function renderGames() {
  document.getElementById('gamesPage').innerHTML = `
    <h2 class="section-title">🎮 Mini Oyunlar</h2>
    <div class="game-grid">
      <div class="game-card" onclick="startFlashcard()">
        <div class="game-icon">🎴</div>
        <div class="game-name">Flashcard Quiz</div>
        <div class="game-desc">4 şıklı kelime testi</div>
      </div>
      <div class="game-card" onclick="startMemory()">
        <div class="game-icon">🧠</div>
        <div class="game-name">Memory Card</div>
        <div class="game-desc">Kelime eşleştir</div>
      </div>
      <div class="game-card" onclick="startSpeedMatch()">
        <div class="game-icon">⚡</div>
        <div class="game-name">Hızlı Eşleştir</div>
        <div class="game-desc">30 sn'de kaç doğru?</div>
      </div>
      <div class="game-card" onclick="generateCertificate()">
        <div class="game-icon">📜</div>
        <div class="game-name">Sertifika Al</div>
        <div class="game-desc">İlerleme sertifikası</div>
      </div>
    </div>
    <div id="gameArea" style="margin-top:1rem;"></div>
  `;
}

// ── Flashcard ─────────────────────────────────────────
let fcIdx=0, fcScore=0, fcTotal=5;

function startFlashcard() {
  if (state.vocabulary.length < 4) { showNotif('⚠️ En az 4 kelime gerekli!'); return; }
  fcIdx=0; fcScore=0; fcTotal=Math.min(5, state.vocabulary.length);
  renderFC();
}

function renderFC() {
  const area = document.getElementById('gameArea');
  if (fcIdx >= fcTotal) {
    addXP(fcScore * 10);
    if (fcScore === fcTotal) { checkBadge('quiz_perfect'); launchConfetti(); }
    area.innerHTML = `
      <div class="card" style="text-align:center;">
        <div style="font-size:3rem;margin-bottom:.75rem;">${fcScore===fcTotal?'🏆':'👍'}</div>
        <h3 style="font-size:1.4rem;margin-bottom:.5rem;">${fcScore} / ${fcTotal} Doğru!</h3>
        <p style="color:var(--text-muted);margin-bottom:1rem;">+${fcScore*10} XP kazandınız</p>
        <button class="btn grad btn-block" onclick="startFlashcard()">🔄 Tekrar Oyna</button>
      </div>`;
    return;
  }
  const shuffled = [...state.vocabulary].sort(() => Math.random() - .5);
  const correct  = shuffled[fcIdx % state.vocabulary.length];
  const opts     = [correct, ...shuffled.filter(w => w.id !== correct.id).slice(0,3)].sort(() => Math.random() - .5);

  area.innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;font-size:.85rem;color:var(--text-muted);margin-bottom:1rem;">
        <span>Soru ${fcIdx+1} / ${fcTotal}</span>
        <span style="color:var(--primary);font-weight:700;">✅ ${fcScore} doğru</span>
      </div>
      <div class="flashcard">
        <div class="fc-word">${correct.word}</div>
        <div class="fc-hint">🔊 <button onclick="speakWord('${correct.word.replace(/'/g,"\\\'")}')" style="background:none;border:none;color:white;cursor:pointer;font-size:1rem;">Seslendir</button></div>
        <div class="fc-hint" style="margin-top:.5rem;">Türkçe anlamı hangisi?</div>
      </div>
      <div class="options-grid">
        ${opts.map(o => `
          <button class="opt-btn" onclick="checkFC(this,'${o.translation.replace(/'/g,"\\\'").replace(/"/g,"&quot;")}','${correct.translation.replace(/'/g,"\\\'").replace(/"/g,"&quot;")}')">
            ${o.translation}
          </button>`).join('')}
      </div>
    </div>`;
}

function checkFC(btn, chosen, correct) {
  document.querySelectorAll('.opt-btn').forEach(b => b.disabled = true);
  if (chosen === correct) {
    btn.classList.add('correct');
    fcScore++;
    showNotif('✅ Doğru! +10 XP');
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.opt-btn').forEach(b => { if (b.textContent.trim() === correct) b.classList.add('correct'); });
    showNotif('❌ Yanlış!');
  }
  fcIdx++;
  setTimeout(renderFC, 1100);
}

// ── Memory Card ───────────────────────────────────────
let memCards=[], memFlipped=[], memMatched=[], memLock=false;

function startMemory() {
  if (state.vocabulary.length < 4) { showNotif('⚠️ En az 4 kelime gerekli!'); return; }
  const picked = [...state.vocabulary].sort(() => Math.random() - .5).slice(0,4);
  memCards  = [
    ...picked.map(w => ({ id:w.id,    text:w.word,        pair:w.id })),
    ...picked.map(w => ({ id:w.id+'t',text:w.translation, pair:w.id }))
  ].sort(() => Math.random() - .5);
  memFlipped=[]; memMatched=[]; memLock=false;
  renderMemory();
}

function renderMemory() {
  const area = document.getElementById('gameArea');
  if (memMatched.length === 8) {
    addXP(30); launchConfetti();
    area.innerHTML = `<div class="card" style="text-align:center;"><div style="font-size:3rem;">🧠</div><h3>Tebrikler! +30 XP</h3><button class="btn grad btn-block" style="margin-top:1rem;" onclick="startMemory()">Tekrar</button></div>`;
    return;
  }
  area.innerHTML = `
    <div class="card">
      <div class="card-title">🧠 Eşleştir — ${memMatched.length/2} / 4 ✅</div>
      <div class="memory-grid">
        ${memCards.map((c,i) => {
          const flipped = memFlipped.includes(i) || memMatched.includes(i);
          const matched = memMatched.includes(i);
          return `<div class="mem-card ${flipped?'flipped':''} ${matched?'matched':''}" onclick="flipMem(${i})">
                    ${flipped ? c.text : '?'}
                  </div>`;
        }).join('')}
      </div>
    </div>`;
}

function flipMem(i) {
  if (memLock || memFlipped.includes(i) || memMatched.includes(i)) return;
  memFlipped.push(i);
  renderMemory();
  if (memFlipped.length === 2) {
    memLock = true;
    setTimeout(() => {
      const [a,b] = memFlipped;
      if (memCards[a].pair === memCards[b].pair) { memMatched.push(a,b); showNotif('✅ Eşleşti!'); }
      memFlipped=[]; memLock=false; renderMemory();
    }, 750);
  }
}

// ── Speed Match ───────────────────────────────────────
let spdScore=0, spdInterval=null, spdTimeLeft=30, spdCorrect=null, spdIsCorrect=false;

function startSpeedMatch() {
  if (state.vocabulary.length < 2) { showNotif('⚠️ En az 2 kelime gerekli!'); return; }
  spdScore=0; spdTimeLeft=30;
  clearInterval(spdInterval);
  spdInterval = setInterval(() => {
    spdTimeLeft--;
    const el = document.getElementById('spdTime');
    if (el) el.textContent = spdTimeLeft;
    if (spdTimeLeft <= 0) {
      clearInterval(spdInterval);
      addXP(spdScore*5);
      document.getElementById('gameArea').innerHTML = `
        <div class="card" style="text-align:center;">
          <div style="font-size:3rem;">⚡</div>
          <h3>${spdScore} Doğru — +${spdScore*5} XP</h3>
          <button class="btn grad btn-block" style="margin-top:1rem;" onclick="startSpeedMatch()">Tekrar</button>
        </div>`;
    }
  }, 1000);
  renderSpeedMatch();
}

function renderSpeedMatch() {
  const words    = [...state.vocabulary].sort(() => Math.random() - .5);
  spdCorrect     = words[0];
  spdIsCorrect   = Math.random() > .5;
  const shownTr  = spdIsCorrect ? spdCorrect.translation : (words[1]?.translation || spdCorrect.translation+'?');

  document.getElementById('gameArea').innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:.75rem;">
        <span style="font-weight:700;color:var(--primary)">✅ ${spdScore}</span>
        <span id="spdTime" style="font-size:1.3rem;font-weight:800;color:#ef4444">${spdTimeLeft}</span>
      </div>
      <div style="text-align:center;padding:1.5rem;background:linear-gradient(135deg,var(--primary),var(--secondary));border-radius:1rem;margin-bottom:1rem;">
        <div style="font-size:1.9rem;font-weight:800;">${spdCorrect.word}</div>
        <div style="font-size:1.1rem;opacity:.85;margin-top:.5rem;">${shownTr}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
        <button class="btn grad  btn-block" style="font-size:1.1rem;" onclick="answerSpd(true)">✅ Doğru</button>
        <button class="btn red   btn-block" style="font-size:1.1rem;" onclick="answerSpd(false)">❌ Yanlış</button>
      </div>
    </div>`;
}

function answerSpd(userSaysCorrect) {
  if (userSaysCorrect === spdIsCorrect) { spdScore++; showNotif('✅'); }
  else showNotif('❌');
  if (spdTimeLeft > 0) renderSpeedMatch();
}

// ── Sertifika ─────────────────────────────────────────
function generateCertificate() {
  document.getElementById('gameArea').innerHTML = `
    <div class="card">
      <div class="card-title">📜 İlerleme Sertifikası</div>
      <canvas id="certCanvas" width="600" height="400" style="max-width:100%;border-radius:.75rem;display:block;margin:0 auto;"></canvas>
      <button class="btn grad btn-block" style="margin-top:1rem;" onclick="downloadCert()">⬇️ PNG Olarak İndir</button>
    </div>`;

  setTimeout(() => {
    const canvas = document.getElementById('certCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Arka plan
    const grd = ctx.createLinearGradient(0,0,600,400);
    grd.addColorStop(0,'#1a1a2e'); grd.addColorStop(1,'#4a1a4a');
    ctx.fillStyle = grd; ctx.fillRect(0,0,600,400);

    // Çerçeve
    ctx.strokeStyle='#8b5cf6'; ctx.lineWidth=3; ctx.strokeRect(12,12,576,376);
    ctx.strokeStyle='rgba(139,92,246,.35)'; ctx.lineWidth=1; ctx.strokeRect(18,18,564,364);

    // Başlık
    ctx.fillStyle='#ffffff'; ctx.font='bold 24px Arial'; ctx.textAlign='center';
    ctx.fillText('İNGİLİZCE ÖĞRENME SERTİFİKASI', 300, 70);

    ctx.strokeStyle='rgba(139,92,246,.5)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(50,90); ctx.lineTo(550,90); ctx.stroke();

    // İstatistikler
    const rows = [
      `🔥  ${state.streak} Günlük Streak`,
      `⭐  Seviye ${state.level} — ${getLevelName()}`,
      `📚  ${state.vocabulary.length} Kelime Öğrenildi`,
      `✅  ${state.completedActivities.length} Aktivite Tamamlandı`,
      `🏆  ${state.badges.length} Rozet Kazanıldı`,
      `🍅  ${state.pomodoroCount} Pomodoro Tamamlandı`
    ];
    ctx.font='16px Arial'; ctx.fillStyle='#c4b5fd';
    rows.forEach((row, i) => ctx.fillText(row, 300, 130 + i * 36));

    // Tarih
    ctx.fillStyle='rgba(255,255,255,.45)'; ctx.font='13px Arial';
    ctx.fillText(new Date().toLocaleDateString('tr-TR',{year:'numeric',month:'long',day:'numeric'}), 300, 375);
  }, 80);
}

function downloadCert() {
  const c = document.getElementById('certCanvas'); if(!c) return;
  const a = document.createElement('a');
  a.href = c.toDataURL('image/png');
  a.download = `ingilizce-sertifika-${new Date().toISOString().split('T')[0]}.png`;
  a.click(); showNotif('📜 Sertifika indirildi!');
}

// ═══════════════════════════════════════════════════════
//  İSTATİSTİKLER
// ═══════════════════════════════════════════════════════
function renderStats() {
  const recent = [...state.completedActivities]
    .sort((a,b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20);

  document.getElementById('statsPage').innerHTML = `
    <h2 class="section-title">📊 İstatistikler</h2>

    <div class="card">
      <div class="card-title">Son 20 Aktivite</div>
      <div style="max-height:360px;overflow-y:auto;">
        ${recent.length === 0
          ? '<p style="text-align:center;color:var(--text-muted);padding:2rem 0;">Henüz aktivite tamamlanmadı</p>'
          : recent.map(c => `
              <div class="history-item">
                <span class="history-icon">✅</span>
                <div class="history-info">
                  <div class="history-name">${c.activityTitle}</div>
                  <div class="history-date">${new Date(c.date).toLocaleDateString('tr-TR',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}</div>
                </div>
                <div class="history-dur">${Math.round(c.duration/60)} dk</div>
              </div>`).join('')
        }
      </div>
    </div>

    <div class="card">
      <div class="card-title">🔔 Hatırlatıcı Saati</div>
      <div style="display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;">
        <input type="time" class="form-input" id="rtInput" value="${state.reminderTime}" style="width:140px;">
        <button class="btn grad" onclick="saveReminder()">💾 Kaydet</button>
        <span style="font-size:.8rem;color:var(--text-muted);">Uygulama açıkken bildirim</span>
      </div>
    </div>

    <div class="card">
      <div class="card-title">💾 Veri Yönetimi</div>
      <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
        <button class="btn grad" onclick="exportData()">⬇️ Yedek İndir</button>
        <label class="btn grad" style="cursor:pointer;">
          ⬆️ Yedek Yükle
          <input type="file" accept=".json" onchange="importData(event)" style="display:none;">
        </label>
        <button class="btn grad" onclick="generateReport()">📄 Rapor</button>
        <button class="btn grad" onclick="shareProgress()">📤 Paylaş</button>
      </div>
    </div>
  `;
}

function saveReminder() {
  state.reminderTime = document.getElementById('rtInput').value;
  saveState();
  showNotif(`⏰ Hatırlatıcı ${state.reminderTime} olarak ayarlandı!`);
}

// ═══════════════════════════════════════════════════════
//  ROZETLER
// ═══════════════════════════════════════════════════════
function renderBadges() {
  document.getElementById('badgesPage').innerHTML = `
    <h2 class="section-title">🏆 Rozetler (${state.badges.length} / ${ALL_BADGES.length})</h2>
    <div class="badge-grid">
      ${ALL_BADGES.map(b => {
        const earned = state.badges.includes(b.id);
        return `
          <div class="badge-card ${earned ? 'earned' : 'locked'}">
            <div class="badge-emoji">${b.icon}</div>
            <div class="badge-name">${b.name}</div>
            <div class="badge-desc">${b.desc}</div>
            ${earned ? '<div style="margin-top:.4rem;font-size:1.1rem;">🏅</div>' : ''}
          </div>`;
      }).join('')}
    </div>
    <div class="card" style="margin-top:1rem;text-align:center;">
      <div style="font-weight:700;margin-bottom:.6rem;">${state.badges.length} / ${ALL_BADGES.length} Rozet Kazanıldı</div>
      <div class="prog-bar" style="max-width:320px;margin:0 auto;">
        <div class="prog-fill" style="background:linear-gradient(90deg,#d97706,#f59e0b);width:${(state.badges.length/ALL_BADGES.length)*100}%"></div>
      </div>
    </div>
  `;
}

function checkBadge(id) {
  if (state.badges.includes(id)) return;
  state.badges.push(id);
  saveState();
  const b = ALL_BADGES.find(x => x.id === id);
  if (b) { launchConfetti(); showNotif(`🏆 Rozet: ${b.icon} ${b.name}`); }
}

// ═══════════════════════════════════════════════════════
//  LEVEL & XP
// ═══════════════════════════════════════════════════════
function addXP(amount) {
  state.xp += amount;
  const newLevel = Math.floor(state.xp / XP_PER_LEVEL) + 1;
  if (newLevel > state.level) {
    state.level = newLevel;
    launchConfetti();
    showNotif(`🚀 Seviye atladın! Lv ${state.level} — ${getLevelName()}`);
    if (state.level === 5)  checkBadge('level_5');
    if (state.level === 10) checkBadge('level_10');
  }
  saveState();
  updateLevelBar();
}

function getLevelName() {
  return LEVEL_NAMES[Math.min(state.level - 1, LEVEL_NAMES.length - 1)];
}

function updateLevelBar() {
  const lvl = document.getElementById('levelBadge');
  const bar = document.getElementById('xpBar');
  const txt = document.getElementById('xpText');
  if (!lvl) return;
  const xpInLevel = state.xp % XP_PER_LEVEL;
  lvl.textContent = `⭐ Lv ${state.level}`;
  bar.style.width  = `${(xpInLevel / XP_PER_LEVEL) * 100}%`;
  txt.textContent  = `${xpInLevel} / ${XP_PER_LEVEL} XP`;
}

// ═══════════════════════════════════════════════════════
//  STREAK
// ═══════════════════════════════════════════════════════
function updateStreak() {
  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const todayDone = state.completedActivities.filter(a => new Date(a.date).toDateString() === today);
  const ystDone   = state.completedActivities.filter(a => new Date(a.date).toDateString() === yesterday);
  if (todayDone.length > 0 && (ystDone.length > 0 || state.streak === 0)) {
    state.streak++;
    if (state.streak === 7)   checkBadge('streak_7');
    if (state.streak === 30)  checkBadge('streak_30');
    if (state.streak === 100) checkBadge('streak_100');
  }
}

function updateStreakDisplay() {
  const el = document.getElementById('streakText');
  if (el) el.textContent = `${state.streak} gün streak 🔥`;
}

// ═══════════════════════════════════════════════════════
//  TEMALAR
// ═══════════════════════════════════════════════════════
const THEMES = [
  { id:'default',      name:'Mor (Varsayılan)', emoji:'💜' },
  { id:'theme-blue',   name:'Mavi',             emoji:'💙' },
  { id:'theme-green',  name:'Yeşil',            emoji:'💚' },
  { id:'theme-pink',   name:'Pembe',            emoji:'🩷' },
  { id:'theme-orange', name:'Turuncu',          emoji:'🧡' }
];

function showThemes() {
  showModal('🎨 Tema Seç', `
    <div style="display:flex;flex-direction:column;gap:.5rem;">
      ${THEMES.map(t => `
        <button class="btn ${state.theme === t.id ? 'grad' : 'gray'}" style="justify-content:flex-start;gap:.75rem;" onclick="applyTheme('${t.id}');closeModal();">
          <span style="font-size:1.3rem;">${t.emoji}</span> ${t.name}
          ${state.theme === t.id ? '<span style="margin-left:auto;">✓</span>' : ''}
        </button>`).join('')}
    </div>
  `, [{ text:'Kapat', cls:'gray', fn:closeModal }]);
}

function applyTheme(id) {
  document.body.className = id === 'default' ? '' : id;
  state.theme = id; saveState();
}

// ═══════════════════════════════════════════════════════
//  MÜZİK
// ═══════════════════════════════════════════════════════
function toggleMusic() {
  state.musicOn = !state.musicOn;
  document.getElementById('musicBar').classList.toggle('hidden', !state.musicOn);
  document.getElementById('musicToggleBtn').textContent = state.musicOn ? '🔇' : '🎵';
  if (state.musicOn) { updateMusicName(); showNotif(`🎵 ${TRACKS[state.currentTrack].name}`); }
}
function prevTrack() { state.currentTrack = (state.currentTrack - 1 + TRACKS.length) % TRACKS.length; updateMusicName(); }
function nextTrack() { state.currentTrack = (state.currentTrack + 1) % TRACKS.length; updateMusicName(); }
function updateMusicName() {
  const el = document.getElementById('musicName');
  if (el) el.textContent = `${TRACKS[state.currentTrack].emoji} ${TRACKS[state.currentTrack].name}`;
}

// ═══════════════════════════════════════════════════════
//  FAB MENU
// ═══════════════════════════════════════════════════════
function toggleFABMenu() {
  state.fabMenuOpen = !state.fabMenuOpen;
  const menu = document.getElementById('fabMenu');
  const icon = document.getElementById('fabIcon');
  if (state.fabMenuOpen) {
    menu.classList.remove('hidden');
    icon.style.transform = 'rotate(45deg)';
    menu.innerHTML = [
      { e:'🎯', l:'Hedefler',   fn:'showGoals()'   },
      { e:'📚', l:'Kelime Ekle',fn:'showAddWord()'  },
      { e:'🎨', l:'Tema',       fn:'showThemes()'  },
      { e:'📄', l:'Rapor',      fn:'generateReport()'},
      { e:'⬇️', l:'Yedek İndir',fn:'exportData()'  }
    ].map(i => `<button class="fab-item" onclick="${i.fn};toggleFABMenu();">${i.e} <span>${i.l}</span></button>`).join('');
  } else {
    menu.classList.add('hidden');
    icon.style.transform = 'rotate(0deg)';
  }
}

// ═══════════════════════════════════════════════════════
//  VERİ YÖNETİMİ
// ═══════════════════════════════════════════════════════
function exportData() {
  const d = { completedActivities:state.completedActivities, vocabulary:state.vocabulary, notes:state.notes, goals:state.goals, streak:state.streak, badges:state.badges, xp:state.xp, level:state.level, pomodoroCount:state.pomodoroCount, exportDate:new Date().toISOString() };
  const a = document.createElement('a');
  a.href     = URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:'application/json'}));
  a.download = `ingilizce-yedek-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  showNotif('⬇️ Yedek indirildi!');
}

function importData(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const d = JSON.parse(ev.target.result);
      Object.assign(state, {
        completedActivities: d.completedActivities || [],
        vocabulary:          d.vocabulary          || [],
        notes:               d.notes               || {},
        goals:               d.goals               || state.goals,
        streak:              d.streak              || 0,
        badges:              d.badges              || [],
        xp:                  d.xp                  || 0,
        level:               d.level               || 1,
        pomodoroCount:       d.pomodoroCount        || 0
      });
      saveState(); updateLevelBar(); updateStreakDisplay();
      showNotif('✅ Yedek yüklendi!'); showPage('dashboard');
    } catch { showNotif('❌ Dosya okunamadı!'); }
  };
  reader.readAsText(file);
}

function generateReport() {
  const s   = calcStats();
  const txt = [
    'İNGİLİZCE ÖĞRENME RAPORU',
    `Tarih: ${new Date().toLocaleDateString('tr-TR')}`,
    '',
    '📊 İSTATİSTİKLER',
    '─────────────────────────',
    `🔥 Streak: ${state.streak} gün`,
    `⭐ Seviye: ${state.level} (${getLevelName()})`,
    `💎 XP: ${state.xp}`,
    `📚 Kelime: ${state.vocabulary.length}`,
    `✅ Aktivite: ${state.completedActivities.length}`,
    `🏆 Rozet: ${state.badges.length}`,
    `🍅 Pomodoro: ${state.pomodoroCount}`,
    '',
    '⏱️ ÇALIŞMA SÜRELERİ',
    '─────────────────────────',
    `Bugün:    ${s.todayMin} dk`,
    `Bu Hafta: ${s.weekMin} dk`,
    `Bu Ay:    ${s.monthMin} dk`,
    '',
    '🏆 KAZANILAN ROZETLER',
    '─────────────────────────',
    ...state.badges.map(id => { const b=ALL_BADGES.find(x=>x.id===id); return b ? `${b.icon} ${b.name}` : id; }),
    '',
    'Harika gidiyorsun! Devam et! 💪'
  ].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));
  a.download = `rapor-${new Date().toISOString().split('T')[0]}.txt`;
  a.click(); showNotif('📄 Rapor indirildi!');
}

function shareProgress() {
  const txt = `🔥 ${state.streak} gün streak!\n⭐ Seviye ${state.level} (${getLevelName()})\n📚 ${state.vocabulary.length} kelime öğrendim\n✅ ${state.completedActivities.length} aktivite tamamladım\n\n#İngilizceÖğreniyorum #EnglishLearning`;
  if (navigator.share) navigator.share({ text: txt });
  else { navigator.clipboard?.writeText(txt).then(() => showNotif('📋 Kopyalandı!')); }
}

// ═══════════════════════════════════════════════════════
//  HEDEFLER & NOTLAR
// ═══════════════════════════════════════════════════════
function showGoals() {
  showModal('🎯 Günlük / Haftalık / Aylık Hedefler', `
    <div class="form-group"><label class="form-label">Günlük Hedef (dakika)</label><input class="form-input" id="gD" type="number" value="${state.goals.daily}"></div>
    <div class="form-group"><label class="form-label">Haftalık Hedef (dakika)</label><input class="form-input" id="gW" type="number" value="${state.goals.weekly}"></div>
    <div class="form-group"><label class="form-label">Aylık Hedef (dakika)</label><input class="form-input" id="gM" type="number" value="${state.goals.monthly}"></div>
  `, [
    { text:'Kaydet', cls:'grad', fn() {
        state.goals = { daily:+document.getElementById('gD').value||120, weekly:+document.getElementById('gW').value||840, monthly:+document.getElementById('gM').value||3600 };
        saveState(); closeModal(); showNotif('✅ Hedefler kaydedildi!');
        if (state.currentPage === 'dashboard') renderDashboard();
    }},
    { text:'İptal', cls:'gray', fn: closeModal }
  ]);
}

function addNote(id) {
  const a = ACTIVITIES.find(x => x.id === id);
  showModal(`📝 Not: ${a.title}`, `
    <div class="form-group">
      <label class="form-label">Notunuz (sesli mesaj özeti, kelimeler, fikirler…)</label>
      <textarea class="form-textarea" id="noteTA" rows="6" placeholder="Örn: Today I struggled with past perfect. Tomorrow I'll focus on this.">${state.notes[id] || ''}</textarea>
    </div>
  `, [
    { text:'Kaydet', cls:'grad', fn() {
        state.notes[id] = document.getElementById('noteTA').value;
        saveState(); closeModal(); showNotif('📝 Not kaydedildi!');
        if (state.currentPage === 'activities') renderActivities();
    }},
    { text:'İptal', cls:'gray', fn: closeModal }
  ]);
}

// ═══════════════════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════════════════
function showModal(title, content, btns) {
  closeModal();
  const m = document.createElement('div');
  m.className = 'modal'; m.id = 'activeModal';
  m.innerHTML = `
    <div class="modal-box">
      <div class="modal-hdr">
        <div class="modal-title">${title}</div>
        <button class="close-btn" onclick="closeModal()">✕</button>
      </div>
      ${content}
      <div class="modal-actions">
        ${btns.map((b,i) => `<button class="btn ${b.cls} btn-block" id="mb${i}">${b.text}</button>`).join('')}
      </div>
    </div>`;
  document.getElementById('modalContainer').appendChild(m);
  btns.forEach((b,i) => document.getElementById('mb'+i).addEventListener('click', b.fn));
  m.addEventListener('click', e => { if (e.target === m) closeModal(); });
}

function closeModal() {
  document.getElementById('activeModal')?.remove();
}

// ═══════════════════════════════════════════════════════
//  BİLDİRİM & ANİMASYONLAR
// ═══════════════════════════════════════════════════════
function showNotif(msg) {
  document.querySelectorAll('.notif').forEach(n => n.remove());
  const n = document.createElement('div');
  n.className = 'notif'; n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2600);
}

function launchConfetti() {
  const colors = ['#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#ffffff'];
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${1.2+Math.random()*1.8}s;animation-delay:${Math.random()*.4}s;transform:rotate(${Math.random()*360}deg);`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3000);
  }
}

// ═══════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════
function calcStats() {
  const now   = new Date();
  const today = now.toDateString();
  const todayActs  = state.completedActivities.filter(a => new Date(a.date).toDateString() === today);
  const weekActs   = state.completedActivities.filter(a => Math.floor((now - new Date(a.date)) / 86400000) < 7);
  const monthActs  = state.completedActivities.filter(a => { const d=new Date(a.date); return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear(); });
  return {
    todayMin:  Math.round(todayActs .reduce((s,a)=>s+a.duration,0)/60),
    weekMin:   Math.round(weekActs  .reduce((s,a)=>s+a.duration,0)/60),
    monthMin:  Math.round(monthActs .reduce((s,a)=>s+a.duration,0)/60)
  };
}

function isToday(dateStr) {
  return !!dateStr && new Date(dateStr).toDateString() === new Date().toDateString();
}

// ═══════════════════════════════════════════════════════
//  BAŞLAT
// ═══════════════════════════════════════════════════════
window.addEventListener('load', init);
