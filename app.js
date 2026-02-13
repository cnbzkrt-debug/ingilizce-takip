// ═══════════════════════════════════════════════
// PWA KURULUMU
// ═══════════════════════════════════════════════
let deferredPrompt;
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); deferredPrompt = e;
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

// ═══════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════
const storage = {
  get(k)    { try { const d=localStorage.getItem(k); return d?JSON.parse(d):null; } catch(e){return null;} },
  set(k,v)  { try { localStorage.setItem(k,JSON.stringify(v)); } catch(e){} },
};

// ═══════════════════════════════════════════════
// AKTİVİTELER (CSV'den tam veri)
// ═══════════════════════════════════════════════
const ACTIVITIES = [
  {
    id:1, color:'#FF6B6B',
    time:'Her Gün – Sabah Yolculuğu (Gidiş)', duration:'30–45 dk',
    title:'Yeni Dinleme & Shadowing',
    description:`- Yeni dinleme: 4 bölüm dinle (ortalama 6–10 dk'lık podcast).
- İlk dinleme: Sadece dinle, genel anlamı (gist) yakala, detaylara takılma.
- Transkript açıkken takip et, anlamadığın kelimeleri işaretle (kırmızı kalem veya telefon notu).
- Kelimeyi önce context clue ile tahmin et (cümle öncesi/sonrası ipucu).
- Tahmin edemiyorsan hızlıca bak (Cambridge Dictionary veya Google Translate, 1–2 saniye).
- Hafif shadowing dene: Fısıldayarak veya dudak hareketiyle cümleleri tekrarla (trafik varsa sessiz).`,
    resources:['BBC Learning English – 6 Minute English','Espresso English Podcast, Slow English Podcast','Spotify/YouTube (hız 0.75x–0.9x)'],
    tips:`- Yeni comprehensible input + anlam bütünlüğü geliştirme.\n- Kelime işaretleme: Günde max 5–8 yüksek değerli seç.\n- Anlama %70+ hedefle; düşükse seviyeyi düşür.\n- Shadowing başlangıçta hafif olsun, ilerledikçe aktifleşsin.`,
    links:[{name:'BBC 6 Min English',url:'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english'},{name:'Cambridge Dict',url:'https://dictionary.cambridge.org/'}]
  },
  {
    id:2, color:'#4ECDC4',
    time:'Her Gün – Akşam Dönüş Yolculuğu', duration:'30–45 dk',
    title:'Tekrar Dinleme & Aktif Shadowing',
    description:`- Tekrar dinleme: Sabahki 4 bölümü X2 dinle (her birini 2 kez).
- 1. tekrarda: Dinle + transkript açıkken takip et, işaretli kelimeleri not et.
- 2. tekrarda: Aktif shadowing yap (podcast hızını düşür, konuşmacıyı aynı anda veya 0.5–1 sn gecikmeyle yüksek sesle tekrarla – vurgu, tonlama, ritim, duraklamaları taklit et).
- Serbest shadowing: Podcast'i durdur, aynı cümleyi kendi kelimelerinle değiştirerek tekrarla.
- Eğer çok yorgunsan sadece dinle, shadowing atla.`,
    resources:['Sabah dinlenen bölümler','Friends, The Office audio (altyazısız)','Spotify/YouTube hız kontrolü'],
    tips:`- Pekiştirme + anlam oranı %85–95'e çıkarma.\n- Gramer pattern'leri subconscious oturtturma.\n- Shadowing ile telaffuz + akıcılık otomatikleşir.\n- Cümle kurma takılmaları azalır, kelime hatırlama hızlanır.`,
    links:[{name:'Netflix',url:'https://www.netflix.com'}]
  },
  {
    id:3, color:'#95E1D3',
    time:'Her Gün – Evde Akşam', duration:'30–45 dk',
    title:'Kelime Kartları, AI Konuşma & Mini Output',
    description:`1. Kelime / Phrase Seçme & Kart Ekleme (10–15 dk):
   - İşaretlediklerinden 5–8 yüksek değerli seç.
   - Tam cümle içinde öğren (tek kelime değil).
   - Kart ekle: Cloze veya Basic/production (Türkçe → İngilizce).
   - Hazır deck tekrarı yap (%60–70 hazır, %30–40 kendi kart).

2. AI Konuşma Pratiği (15–20 dk):
   - Prompt'la konuş, hataları nazikçe düzelttir.
   - Kelime hatırlayamazsan "help" de (3–4 seçenek versin).
   - Zaman kipleri ve basit cümle takılmalarına odaklan.

3. Mini Output (5 dk):
   - Yüksek sesle 1–2 dk kendini anlat (günlük rutin, İstanbul trafiği, hobiler).
   - Telefonla kaydet → dinle, takıldığın yerleri not et.`,
    resources:['Anki, Quizlet, Memrise','ChatGPT / Claude / Grok','News in Levels, British Council A1/A2 reading','TickTick veya Habitica (streak takibi)'],
    tips:`- Kelime haznesi genişletme + konuşma hızı + gramer doğal edinme.\n- Kendi kartlar kişisel bağlam için kritik (İstanbul trafiği, Rus kızla sohbet gibi).\n- NotebookLM entegrasyonu güçlü: Transkript yükle → flashcards/quiz üret.`,
    links:[{name:'Anki',url:'https://apps.ankiweb.net/'},{name:'ChatGPT',url:'https://chat.openai.com'},{name:'Claude',url:'https://claude.ai'},{name:'News in Levels',url:'https://www.newsinlevels.com'}]
  },
  {
    id:4, color:'#F38181',
    time:"Cumartesi (13:20'den Sonra Serbest)", duration:'1–2 saat (esnek)',
    title:'Hafta Sonu Keyif & Opsiyonel Pratik',
    description:`- 13:30–15:00: Dinlen, öğle yemeği, hafif yürüyüş veya ev işi (İngilizce zorunlu değil).
- 15:00–16:00 (opsiyonel keyif input): Hafta içi favori podcast bölümlerini rahatça tekrarla veya Netflix'te Friends/The Office izle (İngilizce altyazı).
- 16:00–17:00 (opsiyonel aktif pratik): AI konuşma (15 dk, yeni konu: "My weekend plans"), kelime kart tekrarı, mini output.
- Akşam: Tamamen serbest (aile, arkadaş, Rus kızla mesajlaşma, hobiler).`,
    resources:['Dizi: Friends, The Office, Brooklyn Nine-Nine (Netflix/YouTube)','Podcast tekrarı veya NotebookLM Audio Overview','HelloTalk/Tandem sesli mesaj (eğer istersen)'],
    tips:`- Hafif keyif + motivasyon koruma.\n- İngilizce'yi zorunlu yapma, dinlenme öncelikli.\n- Opsiyonel kısımlar enerjine göre seç.`,
    links:[{name:'Netflix',url:'https://www.netflix.com'},{name:'HelloTalk',url:'https://www.hellotalk.com'},{name:'Tandem',url:'https://www.tandem.net'}]
  },
  {
    id:5, color:'#AA96DA',
    time:'Pazar (Tam Tatil)', duration:'1–2 saat (esnek)',
    title:'Dinlenme, Okuma & Gramer (Opsiyonel)',
    description:`- Sabah (10:00–12:00): Geç kalk, kahvaltı, dinlen.
  Opsiyonel: 30–45 dk okuma (British Council A2 reading, News in Levels Level 1, graded reader).
- Öğleden sonra (13:00–16:00): Opsiyonel gramer çalışması (20–30 dk: Raymond Murphy Elementary 1 ünite oku + 5–10 alıştırma) + AI'ya taşı ("Bugün past simple çalıştım").
  Veya keyif input: 60–90 dk dizi/film/podcast (altyazılı izle).
- Akşam (18:00–20:00): Opsiyonel tandem (20–30 dk HelloTalk sesli mesaj), ilerleme videosu çek.`,
    resources:['Okuma: British Council A1/A2 reading, Lingua.com, Oxford Bookworms Starter','Gramer: Raymond Murphy English Grammar in Use Elementary','Tandem: HelloTalk/Tandem/Discord İngilizce server','İlerleme: Telefon kamera ile video çek'],
    tips:`- Dinlenme + opsiyonel ilerleme.\n- Gramer kitabı sadece "enerjim var" dersen yap; zorunlu değil.\n- İlerleme videosu motivasyon için kritik (her 3–4 haftada bir farkı gör).\n- NotebookLM burada da faydalı: Gramer PDF yükle → quiz/özet üret.`,
    links:[{name:'British Council',url:'https://learnenglish.britishcouncil.org'},{name:'HelloTalk',url:'https://www.hellotalk.com'}]
  },
  {
    id:6, color:'#FCBAD3',
    time:'Haftalık Ekstra / Genel', duration:'+1–2 saat',
    title:'Gerçek İnsan Pratiği & İlerleme Takibi',
    description:`- Gerçek insan pratiği: 2–3 kez HelloTalk/Tandem sesli mesaj veya kısa arama ("yavaş konuş" de).
- İlerleme kontrolü: 3–4 haftada 1 kez 3–5 dk İngilizce video çek, öncekiyle karşılaştır.
- Opsiyonel italki dersi: Haftada 1 × 30–45 dk (bütçe varsa, konuşma odaklı hoca).
- NotebookLM entegrasyonu: Her gün transkript yükle → Audio Overview dinle, flashcards/quiz üret.
- Motivasyon takibi: TickTick veya Habitica ile streak tut, haftalık "English time" habit ekle.`,
    resources:['Tandem: HelloTalk, Tandem, Discord (İngilizce "language exchange" server\'ları)','italki/Preply (konuşma odaklı)','Takip app: TickTick, Habitica'],
    tips:`- Gerçek etkileşim + ilerleme takibi + otomatik öğrenme desteği.\n- NotebookLM ile manuel kelime çıkarma süresini yarıya indir.\n- Streak bozulursa üzülme, ertesi gün devam et.\n- B1 işaretleri: 10 dk kesintisiz konuşma, podcast %80 anlama, film ana fikrini yakalama.`,
    links:[{name:'italki',url:'https://www.italki.com'},{name:'Preply',url:'https://preply.com'},{name:'Habitica',url:'https://habitica.com'},{name:'TickTick',url:'https://ticktick.com'}]
  }
];

// ═══════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════
let state = {
  currentPage:'dashboard',
  completedActivities:[], vocabulary:[], notes:{},
  goals:{daily:120,weekly:840,monthly:3600},
  streak:0, badges:[], xp:0, level:1,
  timerSeconds:0, timerActive:false, pomodoroMode:false, pomodoroPhase:'work', pomodoroCount:0,
  selectedActivity:null, fabMenuOpen:false,
  theme:'default', musicOn:false, currentTrack:0,
  quests:[], questsDate:'', reminderTime:'21:00',
  gameState:null
};

// Level sistemi
const XP_PER_LEVEL = 100;
const LEVEL_NAMES = ['Beginner','Beginner II','Elementary','Elementary II','Pre-Intermediate','Intermediate','Intermediate II','Upper-Intermediate','Advanced','Expert'];

// Günlük görevler havuzu
const QUEST_POOL = [
  {id:'q1', text:'Sabah aktivitesini tamamla', xp:30, activityId:1},
  {id:'q2', text:'Akşam shadowing yap', xp:30, activityId:2},
  {id:'q3', text:'5 yeni kelime ekle', xp:25, check:()=>state.vocabulary.filter(w=>isToday(w.addedDate)).length>=5},
  {id:'q4', text:'30 dk zamanlayıcı çalıştır', xp:20, check:()=>getTodayMinutes()>=30},
  {id:'q5', text:'1 pomodoro tamamla', xp:35, badge:'pomodoro'},
  {id:'q6', text:'Kelime defterini aç ve tekrar yap', xp:15, check:()=>state.vocabulary.some(w=>isToday(w.lastReview))},
  {id:'q7', text:'Evde akşam aktivitesini tamamla', xp:30, activityId:3},
  {id:'q8', text:'Hedefini kontrol et', xp:10, check:()=>true},
  {id:'q9', text:'2 farklı aktivite tamamla', xp:40, check:()=>getTodayActivities().length>=2},
  {id:'q10', text:'Toplam 45 dk çalış', xp:45, check:()=>getTodayMinutes()>=45}
];

// Müzik
const TRACKS = [
  {name:'Lo-fi Study Beats', emoji:'🎵'},
  {name:'Ambient Focus', emoji:'🌊'},
  {name:'Nature Sounds', emoji:'🌿'},
];

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════
function init() {
  loadState();
  applyTheme(state.theme);
  generateDailyQuests();
  updateLevelBar();
  showPage('dashboard');
  startTimerLoop();
  checkReminderSetup();
  updateStreakDisplay();
}

function loadState() {
  const keys = ['completedActivities','vocabulary','notes','goals','streak','badges','xp','level','theme','quests','questsDate','pomodoroCount','reminderTime'];
  keys.forEach(k => {
    const v = storage.get(k);
    if (v !== null) state[k] = v;
  });
}

function saveState() {
  ['completedActivities','vocabulary','notes','goals','streak','badges','xp','level','theme','quests','questsDate','pomodoroCount','reminderTime'].forEach(k => storage.set(k, state[k]));
}

// ═══════════════════════════════════════════════
// TIMER LOOP
// ═══════════════════════════════════════════════
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
        showNotif('🍅 Pomodoro tamamlandı! 5 dk mola zamanı ☕');
        renderTimer();
      } else if (state.pomodoroPhase === 'break' && state.timerSeconds >= 300) {
        state.pomodoroPhase = 'work'; state.timerSeconds = 0;
        showNotif('💪 Mola bitti! Yeni çalışma başlıyor...');
        renderTimer();
      }
    }
  }, 1000);
}

// ═══════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════
function showPage(name) {
  state.currentPage = name;
  document.querySelectorAll('.nav-btn').forEach(b => { b.classList.toggle('active', b.dataset.page === name); });
  ['dashboard','activities','vocabulary','timer','games','stats','badges'].forEach(p => {
    document.getElementById(p+'Page').classList.toggle('hidden', p !== name);
  });
  const renders = { dashboard:renderDashboard, activities:renderActivities, vocabulary:renderVocabulary, timer:renderTimer, games:renderGames, stats:renderStats, badges:renderBadges };
  if (renders[name]) renders[name]();
}

// ═══════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════
function renderDashboard() {
  const s = calcStats();
  document.getElementById('dashboardPage').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card purple">
        <div class="stat-icon">🔥</div>
        <div class="stat-val">${state.streak}</div>
        <div class="stat-lbl">Günlük Streak</div>
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

    <div class="card">
      <div class="card-title">📊 İlerleme</div>
      ${[
        {label:'Bugün', cur:s.todayMin, goal:state.goals.daily, cls:'fill-green'},
        {label:'Bu Hafta', cur:s.weekMin, goal:state.goals.weekly, cls:'fill-blue'},
        {label:'Bu Ay', cur:s.monthMin, goal:state.goals.monthly, cls:'fill-purple'}
      ].map(i=>`
        <div class="prog-row">
          <div class="prog-hdr"><span>${i.label}</span><span style="font-weight:700">${i.cur} / ${i.goal} dk</span></div>
          <div class="prog-bar"><div class="prog-fill ${i.cls}" style="width:${Math.min((i.cur/i.goal)*100,100)}%"></div></div>
        </div>
      `).join('')}
    </div>

    <div class="card">
      <div class="card-title">🎯 Günlük Görevler</div>
      ${renderQuestsHTML()}
    </div>

    <div class="card">
      <div class="card-title">🍅 Pomodoro Özeti</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
        <div style="background:rgba(239,68,68,.15);border-radius:.75rem;padding:.85rem;text-align:center;">
          <div style="font-size:1.8rem;font-weight:800;color:#ef4444">${state.pomodoroCount}</div>
          <div style="font-size:.78rem;color:var(--text-muted)">Toplam Pomodoro</div>
        </div>
        <div style="background:rgba(139,92,246,.15);border-radius:.75rem;padding:.85rem;text-align:center;">
          <div style="font-size:1.8rem;font-weight:800;color:var(--primary)">${Math.round(state.pomodoroCount*25/60*10)/10} saat</div>
          <div style="font-size:.78rem;color:var(--text-muted)">Fokus Süresi</div>
        </div>
      </div>
    </div>
  `;
  updateLevelBar();
  updateStreakDisplay();
}

function renderQuestsHTML() {
  if (!state.quests.length) return '<p style="color:var(--text-muted);font-size:.85rem;">Görevler yükleniyor...</p>';
  return state.quests.map((q,i) => `
    <div class="quest-item">
      <div class="quest-check ${q.done?'done':''}" onclick="toggleQuest(${i})">
        ${q.done?'✓':''}
      </div>
      <div class="quest-text" style="${q.done?'text-decoration:line-through;opacity:.5':''}">
        ${q.text}
      </div>
      <div class="quest-xp">+${q.xp} XP</div>
    </div>
  `).join('');
}

function toggleQuest(idx) {
  const q = state.quests[idx];
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
  const shuffled = [...QUEST_POOL].sort(()=>Math.random()-.5).slice(0,3);
  state.quests = shuffled.map(q => ({...q, done:false}));
  state.questsDate = today;
  saveState();
}

// ═══════════════════════════════════════════════
// ACTIVITIES
// ═══════════════════════════════════════════════
function renderActivities() {
  document.getElementById('activitiesPage').innerHTML = `
    <h2 class="section-title">📅 Günlük Aktiviteler</h2>
    ${ACTIVITIES.map(a => {
      const done = isActivityDoneToday(a.id);
      return `
        <div class="act-card" style="border-color:${a.color}">
          <div class="act-head">
            <div class="act-icon">${done?'✅':'⭕'}</div>
            <div>
              <div class="act-title">${a.title}</div>
              <div class="act-sub">${a.time} • ${a.duration}</div>
            </div>
          </div>
          <div class="act-desc">${a.description}</div>
          <div class="act-actions">
            <button class="btn grad" onclick="startActivity(${a.id})">⏱️ Başlat</button>
            <button class="btn gray" onclick="showActDetail(${a.id})">📖 Detaylar</button>
            <button class="btn gray" onclick="addNote(${a.id})">📝 Not${state.notes[a.id]?'✓':''}</button>
            ${done?'<span class="btn green">✓ Tamamlandı</span>':''}
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function showActDetail(id) {
  const a = ACTIVITIES.find(x=>x.id===id);
  showModal(a.title, `
    <div style="background:rgba(59,130,246,.1);padding:1rem;border-radius:.6rem;margin-bottom:.75rem;">
      <strong style="color:#93c5fd;">📚 Kaynaklar:</strong><br>
      <div style="margin-top:.5rem;font-size:.88rem;line-height:1.7;">
        ${a.resources.map(r=>`• ${r}`).join('<br>')}
      </div>
    </div>
    <div style="background:rgba(16,185,129,.1);padding:1rem;border-radius:.6rem;margin-bottom:.75rem;">
      <strong style="color:#6ee7b7;">💡 Amaç & İpuçları:</strong>
      <pre style="white-space:pre-wrap;font-family:inherit;font-size:.85rem;margin-top:.5rem;line-height:1.7;">${a.tips}</pre>
    </div>
    <div style="background:rgba(139,92,246,.1);padding:1rem;border-radius:.6rem;">
      <strong style="color:#c4b5fd;">🔗 Hızlı Linkler:</strong>
      <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.6rem;">
        ${a.links.map(l=>`<a href="${l.url}" target="_blank" style="background:rgba(139,92,246,.25);color:#c4b5fd;padding:.3rem .7rem;border-radius:.5rem;font-size:.82rem;text-decoration:none;">${l.name}</a>`).join('')}
      </div>
    </div>
  `, [{text:'Kapat',cls:'gray',fn:closeModal}]);
}

function startActivity(id) {
  state.selectedActivity = ACTIVITIES.find(a=>a.id===id);
  showPage('timer');
}

function isActivityDoneToday(id) {
  return state.completedActivities.some(c => c.activityId===id && isToday(c.date));
}

// ═══════════════════════════════════════════════
// VOCABULARY
// ═══════════════════════════════════════════════
function renderVocabulary() {
  const sorted = [...state.vocabulary].sort((a,b)=>new Date(a.nextReview)-new Date(b.nextReview));
  const reviewCount = sorted.filter(w=>new Date(w.nextReview)<=new Date()).length;

  document.getElementById('vocabularyPage').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
      <h2 class="section-title" style="margin:0;">📚 Kelime Defteri (${state.vocabulary.length})</h2>
      <button class="btn grad" onclick="showAddWord()">➕ Ekle</button>
    </div>
    ${reviewCount>0?`<div style="background:rgba(234,179,8,.15);border:1px solid rgba(234,179,8,.4);border-radius:.75rem;padding:.85rem;margin-bottom:1rem;font-size:.85rem;">⏰ <strong>${reviewCount} kelime</strong> tekrar zamanı geldi!</div>`:''}
    <div style="background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.3);border-radius:.75rem;padding:.85rem;margin-bottom:1rem;font-size:.82rem;">
      💡 <strong>Spaced Repetition:</strong> Kelimeleri düzenli tekrar edin. Tekrar ettikçe aralık uzar (1→2→4→8→16 gün).
    </div>
    ${sorted.length===0
      ? `<div class="card" style="text-align:center;padding:3rem 1rem;"><div style="font-size:3rem;margin-bottom:.75rem;">📚</div><p style="color:var(--text-muted);">Henüz kelime yok</p></div>`
      : sorted.map(w => {
          const needsReview = new Date(w.nextReview)<=new Date();
          const daysUntil = Math.ceil((new Date(w.nextReview)-new Date())/(1000*60*60*24));
          return `
            <div class="vocab-card ${needsReview?'review':''}">
              <div style="flex:1;min-width:0;">
                <div class="vocab-word">${w.word}
                  <button onclick="speakWord('${w.word}')" style="background:none;border:none;cursor:pointer;font-size:1rem;margin-left:.3rem;">🔊</button>
                </div>
                <div class="vocab-tr">${w.translation}</div>
                ${w.sentence?`<div class="vocab-sent">"${w.sentence}"</div>`:''}
                <div class="vocab-meta">
                  <span class="tag">Tekrar: ${w.reviewCount||0}x</span>
                  ${needsReview?'<span class="tag warn">⏰ Tekrar zamanı!</span>':`<span class="tag">${daysUntil}g sonra</span>`}
                </div>
              </div>
              <div class="vocab-btns">
                <button class="icon-btn ${needsReview?'warn':'gray'}" onclick="reviewWord(${w.id})" title="Tekrar et">🔄</button>
                <button class="icon-btn red" onclick="deleteWord(${w.id})" title="Sil">🗑️</button>
              </div>
            </div>
          `;
        }).join('')
    }
  `;
}

function speakWord(word) {
  if (!('speechSynthesis' in window)) { showNotif('❌ Tarayıcınız sesi desteklemiyor'); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.lang = 'en-US'; u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

function showAddWord() {
  showModal('📚 Yeni Kelime Ekle', `
    <div class="form-group"><label class="form-label">Kelime (İngilizce)</label><input class="form-input" id="wi" placeholder="örn: accomplish"></div>
    <div class="form-group"><label class="form-label">Türkçe Anlamı</label><input class="form-input" id="ti" placeholder="örn: başarmak"></div>
    <div class="form-group"><label class="form-label">Örnek Cümle (opsiyonel)</label><textarea class="form-textarea" id="si" rows="3" placeholder="I accomplished my goals."></textarea></div>
  `, [
    { text:'Kaydet', cls:'grad', fn() {
      const word=document.getElementById('wi').value.trim();
      const tr=document.getElementById('ti').value.trim();
      const sent=document.getElementById('si').value.trim();
      if (!word||!tr) { showNotif('⚠️ Kelime ve anlamı giriniz!'); return; }
      state.vocabulary.push({ id:Date.now(), word, translation:tr, sentence:sent, addedDate:new Date().toISOString(), reviewCount:0, lastReview:null, nextReview:new Date().toISOString() });
      addXP(10);
      saveState();
      if (state.vocabulary.length===50) checkBadge('vocab_50');
      if (state.vocabulary.length===100) checkBadge('vocab_100');
      if (state.vocabulary.length===500) checkBadge('vocab_500');
      closeModal(); renderVocabulary();
      showNotif('✅ Kelime eklendi! +10 XP');
    }},
    { text:'İptal', cls:'gray', fn:closeModal }
  ]);
  setTimeout(()=>document.getElementById('wi')?.focus(),100);
}

function reviewWord(id) {
  state.vocabulary = state.vocabulary.map(w => {
    if (w.id!==id) return w;
    const rc=(w.reviewCount||0)+1;
    const next=new Date(); next.setDate(next.getDate()+Math.pow(2,rc));
    return {...w, reviewCount:rc, lastReview:new Date().toISOString(), nextReview:next.toISOString()};
  });
  addXP(5); saveState(); renderVocabulary();
  showNotif('🔄 Tekrar kaydedildi! +5 XP');
}

function deleteWord(id) {
  if (!confirm('Bu kelimeyi silmek istiyor musunuz?')) return;
  state.vocabulary = state.vocabulary.filter(w=>w.id!==id);
  saveState(); renderVocabulary();
}

// ═══════════════════════════════════════════════
// TIMER
// ═══════════════════════════════════════════════
function renderTimer() {
  const a = state.selectedActivity;
  document.getElementById('timerPage').innerHTML = `
    <div class="card">
      <div class="card-title" style="text-align:center;">⏱️ Zamanlayıcı</div>
      ${a?`<div style="text-align:center;margin-bottom:1rem;"><span style="background:${a.color};color:#fff;padding:.3rem .9rem;border-radius:99px;font-size:.82rem;font-weight:600;">${a.title}</span></div>`:''}
      <div class="timer-wrap">
        <div class="timer-clock" id="timerDisplay">00:00</div>
        ${state.pomodoroMode?`<div><span class="pomodoro-phase ${state.pomodoroPhase==='work'?'phase-work':'phase-break'}">${state.pomodoroPhase==='work'?'🍅 Çalışma (25 dk)':'☕ Mola (5 dk)'}</span></div>`:''}
        <div class="timer-btns">
          <button class="tbtn ${state.timerActive?'pause':'play'}" onclick="toggleTimer()">${state.timerActive?'⏸':'▶️'}</button>
          <button class="tbtn reset" onclick="resetTimer()">🔄</button>
          ${a?`<button class="tbtn done" onclick="completeActivity()">✓</button>`:''}
        </div>
        <div style="text-align:center;">
          <button class="btn ${state.pomodoroMode?'grad':'gray'}" onclick="togglePomodoro()">🍅 Pomodoro ${state.pomodoroMode?'Aktif':'Pasif'}</button>
          <div style="font-size:.78rem;color:var(--text-muted);margin-top:.5rem;">Tamamlanan: ${state.pomodoroCount} 🍅</div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">⚡ Hızlı Başlat</div>
      <div class="presets">
        ${[5,10,15,25,30,45,60,90].map(m=>`<button class="preset-btn" onclick="startPreset(${m})">${m} dk</button>`).join('')}
      </div>
    </div>
  `;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const el = document.getElementById('timerDisplay');
  if (!el) return;
  const m=Math.floor(state.timerSeconds/60), s=state.timerSeconds%60;
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function toggleTimer() { state.timerActive=!state.timerActive; renderTimer(); }

function resetTimer() { state.timerSeconds=0; state.timerActive=false; renderTimer(); }

function togglePomodoro() {
  state.pomodoroMode=!state.pomodoroMode;
  state.pomodoroPhase='work'; state.timerSeconds=0; renderTimer();
}

function startPreset(m) { state.timerSeconds=0; state.timerActive=true; state.pomodoroMode=false; renderTimer(); }

function completeActivity() {
  if (!state.selectedActivity) return;
  const a = state.selectedActivity;
  state.completedActivities.push({ activityId:a.id, date:new Date().toISOString(), duration:state.timerSeconds, activityTitle:a.title });
  addXP(50);
  updateStreak();
  if (state.completedActivities.length===1) checkBadge('first_complete');
  if (a.time.includes('Sabah'))   checkBadge('early_bird');
  if (a.time.includes('Akşam'))   checkBadge('night_owl');
  if (a.time.includes('Cumartesi')||a.time.includes('Pazar')) checkBadge('weekend_warrior');
  state.timerSeconds=0; state.timerActive=false; state.selectedActivity=null;
  saveState(); updateStreakDisplay();
  launchConfetti();
  showNotif('🎉 Aktivite tamamlandı! +50 XP');
  setTimeout(()=>showPage('dashboard'), 800);
}

// ═══════════════════════════════════════════════
// GAMES
// ═══════════════════════════════════════════════
function renderGames() {
  document.getElementById('gamesPage').innerHTML = `
    <h2 class="section-title">🎮 Mini Oyunlar</h2>
    <div class="game-grid">
      <div class="game-card" onclick="startFlashcard()">
        <div class="game-icon">🎴</div>
        <div class="game-name">Flashcard Quiz</div>
        <div class="game-desc">4 seçenekli kelime testi</div>
      </div>
      <div class="game-card" onclick="startMemory()">
        <div class="game-icon">🧠</div>
        <div class="game-name">Memory Card</div>
        <div class="game-desc">Kelime eşleştirme oyunu</div>
      </div>
      <div class="game-card" onclick="startSpeedMatch()">
        <div class="game-icon">⚡</div>
        <div class="game-name">Hızlı Eşleştir</div>
        <div class="game-desc">30 saniyede kaç doğru?</div>
      </div>
      <div class="game-card" onclick="generateCertificate()">
        <div class="game-icon">📜</div>
        <div class="game-name">Sertifika Al</div>
        <div class="game-desc">İlerleme sertifikan hazır</div>
      </div>
    </div>
    <div id="gameArea" style="margin-top:1rem;"></div>
  `;
}

// ── FLASHCARD QUIZ ──
let fcIndex=0, fcScore=0, fcTotal=5, fcRevealed=false;

function startFlashcard() {
  if (state.vocabulary.length<4) { showNotif('⚠️ En az 4 kelime gerekli!'); return; }
  fcIndex=0; fcScore=0; fcTotal=Math.min(5,state.vocabulary.length); fcRevealed=false;
  renderFlashcard();
}

function renderFlashcard() {
  const area = document.getElementById('gameArea');
  if (fcIndex>=fcTotal) {
    addXP(fcScore*10);
    area.innerHTML = `
      <div class="card" style="text-align:center;">
        <div style="font-size:3rem;margin-bottom:.75rem;">🏆</div>
        <h3 style="font-size:1.4rem;margin-bottom:.5rem;">${fcScore}/${fcTotal} Doğru!</h3>
        <p style="color:var(--text-muted);margin-bottom:1rem;">+${fcScore*10} XP kazandınız</p>
        <button class="btn grad btn-block" onclick="startFlashcard()">Tekrar Oyna</button>
      </div>`;
    if (fcScore===fcTotal) { checkBadge('quiz_perfect'); launchConfetti(); }
    return;
  }
  const shuffled = [...state.vocabulary].sort(()=>Math.random()-.5);
  const correct = shuffled[fcIndex % state.vocabulary.length];
  const wrong = shuffled.filter(w=>w.id!==correct.id).sort(()=>Math.random()-.5).slice(0,3);
  const opts = [...wrong, correct].sort(()=>Math.random()-.5);

  area.innerHTML = `
    <div class="card">
      <div style="display:flex;justify-content:space-between;font-size:.85rem;color:var(--text-muted);margin-bottom:1rem;">
        <span>Soru ${fcIndex+1} / ${fcTotal}</span>
        <span style="color:var(--primary);font-weight:700;">✅ ${fcScore}</span>
      </div>
      <div class="flashcard" onclick="revealFC()">
        <div class="fc-word">${correct.word}</div>
        <div class="fc-hint">Türkçe anlamı nedir?</div>
        ${fcRevealed?`<div class="fc-answer">${correct.translation}</div>`:'<div class="fc-hint" style="margin-top:.75rem;">👆 Görmek için dokun</div>'}
      </div>
      <div class="options-grid" id="opts">
        ${opts.map(o=>`<button class="opt-btn" onclick="checkFC(this,'${o.translation}','${correct.translation}')">${o.translation}</button>`).join('')}
      </div>
    </div>
  `;
}

function revealFC() { fcRevealed=true; renderFlashcard(); }

function checkFC(btn, chosen, correct) {
  document.querySelectorAll('.opt-btn').forEach(b=>b.disabled=true);
  if (chosen===correct) { btn.classList.add('correct'); fcScore++; showNotif('✅ Doğru! +10 XP'); }
  else {
    btn.classList.add('wrong');
    document.querySelectorAll('.opt-btn').forEach(b=>{ if(b.textContent.trim()===correct) b.classList.add('correct'); });
    showNotif('❌ Yanlış!');
  }
  fcIndex++; fcRevealed=false;
  setTimeout(renderFlashcard, 1200);
}

// ── MEMORY GAME ──
let memCards=[], memFlipped=[], memMatched=[], memLock=false;

function startMemory() {
  if (state.vocabulary.length<4) { showNotif('⚠️ En az 4 kelime gerekli!'); return; }
  const picked = [...state.vocabulary].sort(()=>Math.random()-.5).slice(0,4);
  memCards = [...picked.map(w=>({id:w.id,text:w.word,pair:w.id})), ...picked.map(w=>({id:w.id+'t',text:w.translation,pair:w.id}))].sort(()=>Math.random()-.5);
  memFlipped=[]; memMatched=[]; memLock=false;
  renderMemory();
}

function renderMemory() {
  const area = document.getElementById('gameArea');
  if (memMatched.length===8) {
    addXP(30); launchConfetti();
    area.innerHTML=`<div class="card" style="text-align:center;"><div style="font-size:3rem;">🧠</div><h3>Tebrikler! +30 XP</h3><button class="btn grad btn-block" style="margin-top:1rem;" onclick="startMemory()">Tekrar</button></div>`;
    return;
  }
  area.innerHTML=`
    <div class="card">
      <div class="card-title">🧠 Eşleştir: ${memMatched.length/2}/4 ✅</div>
      <div class="memory-grid">
        ${memCards.map((c,i)=>{
          const isFlipped=memFlipped.includes(i)||memMatched.includes(i);
          const isMatched=memMatched.includes(i);
          return `<div class="mem-card ${isFlipped?'flipped':''} ${isMatched?'matched':''}" onclick="flipMem(${i})">${isFlipped?c.text:'?'}</div>`;
        }).join('')}
      </div>
    </div>`;
}

function flipMem(i) {
  if (memLock||memFlipped.includes(i)||memMatched.includes(i)) return;
  memFlipped.push(i);
  renderMemory();
  if (memFlipped.length===2) {
    memLock=true;
    setTimeout(()=>{
      const [a,b]=memFlipped;
      if (memCards[a].pair===memCards[b].pair) { memMatched.push(a,b); showNotif('✅ Eşleşti!'); }
      memFlipped=[]; memLock=false; renderMemory();
    }, 800);
  }
}

// ── SPEED MATCH ──
let speedScore=0, speedTimer=null, speedWord=null, speedTimeLeft=30;

function startSpeedMatch() {
  if (state.vocabulary.length<2) { showNotif('⚠️ En az 2 kelime gerekli!'); return; }
  speedScore=0; speedTimeLeft=30;
  renderSpeedMatch();
  speedTimer=setInterval(()=>{
    speedTimeLeft--;
    const el=document.getElementById('speedTime');
    if (el) el.textContent=speedTimeLeft;
    if (speedTimeLeft<=0) {
      clearInterval(speedTimer);
      addXP(speedScore*5);
      document.getElementById('gameArea').innerHTML=`<div class="card" style="text-align:center;"><div style="font-size:3rem;">⚡</div><h3>${speedScore} Doğru! +${speedScore*5} XP</h3><button class="btn grad btn-block" style="margin-top:1rem;" onclick="startSpeedMatch()">Tekrar</button></div>`;
    }
  },1000);
}

function renderSpeedMatch() {
  const words=[...state.vocabulary].sort(()=>Math.random()-.5);
  speedWord=words[0];
  const isCorrect=Math.random()>.5;
  const shown=isCorrect?speedWord.translation:words[1]?.translation||speedWord.translation;
  document.getElementById('gameArea').innerHTML=`
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:1rem;">
        <span style="font-weight:700;color:var(--primary)">✅ ${speedScore}</span>
        <span id="speedTime" style="font-size:1.2rem;font-weight:800;color:#ef4444">${speedTimeLeft}</span>
      </div>
      <div style="text-align:center;padding:1.5rem;background:linear-gradient(135deg,var(--primary),var(--secondary));border-radius:1rem;margin-bottom:1rem;">
        <div style="font-size:1.8rem;font-weight:800;">${speedWord.word}</div>
        <div style="font-size:1.1rem;opacity:.85;margin-top:.5rem;">${shown}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
        <button class="btn grad btn-block" style="font-size:1.2rem;" onclick="answerSpeed(${isCorrect})">✅ Doğru</button>
        <button class="btn red btn-block" style="font-size:1.2rem;" onclick="answerSpeed(${!isCorrect})">❌ Yanlış</button>
      </div>
    </div>`;
}

function answerSpeed(isCorrect) {
  if (isCorrect) { speedScore++; showNotif('✅ +5 XP'); }
  else showNotif('❌');
  if (speedTimeLeft>0) renderSpeedMatch();
}

// ── SERTİFİKA ──
function generateCertificate() {
  const area=document.getElementById('gameArea');
  area.innerHTML=`
    <div class="card">
      <div class="card-title">📜 İlerleme Sertifikası</div>
      <canvas id="certCanvas" width="600" height="400"></canvas>
      <button class="btn grad btn-block" style="margin-top:1rem;" onclick="downloadCert()">⬇️ İndir</button>
    </div>`;
  
  setTimeout(()=>{
    const canvas=document.getElementById('certCanvas');
    if (!canvas) return;
    const ctx=canvas.getContext('2d');
    
    // Arka plan
    const grad=ctx.createLinearGradient(0,0,600,400);
    grad.addColorStop(0,'#1a1a2e');
    grad.addColorStop(1,'#4a1a4a');
    ctx.fillStyle=grad; ctx.fillRect(0,0,600,400);
    
    // Çerçeve
    ctx.strokeStyle='#8b5cf6'; ctx.lineWidth=3;
    ctx.strokeRect(15,15,570,370);
    ctx.strokeStyle='rgba(139,92,246,0.4)'; ctx.lineWidth=1;
    ctx.strokeRect(20,20,560,360);
    
    // Başlık
    ctx.fillStyle='#ffffff'; ctx.font='bold 28px Arial'; ctx.textAlign='center';
    ctx.fillText('İNGİLİZCE ÖĞRENME SERTİFİKASI', 300, 80);
    
    // Çizgi
    ctx.strokeStyle='rgba(139,92,246,0.6)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(50,100); ctx.lineTo(550,100); ctx.stroke();
    
    // İçerik
    ctx.font='16px Arial'; ctx.fillStyle='#d1d5db'; ctx.textAlign='center';
    ctx.fillText(`Bu belge şu özellikleri belgeler:`, 300, 140);
    
    ctx.fillStyle='#c4b5fd'; ctx.font='bold 18px Arial';
    ctx.fillText(`🔥 ${state.streak} Günlük Streak`, 300, 175);
    ctx.fillText(`📚 ${state.vocabulary.length} Kelime Öğrenildi`, 300, 210);
    ctx.fillText(`⭐ Seviye ${state.level} (${getLevelName()})`, 300, 245);
    ctx.fillText(`✅ ${state.completedActivities.length} Aktivite Tamamlandı`, 300, 280);
    ctx.fillText(`🏆 ${state.badges.length} Rozet Kazanıldı`, 300, 315);
    
    // Tarih
    ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.font='13px Arial';
    ctx.fillText(new Date().toLocaleDateString('tr-TR',{year:'numeric',month:'long',day:'numeric'}), 300, 365);
  },100);
}

function downloadCert() {
  const canvas=document.getElementById('certCanvas');
  if (!canvas) return;
  const a=document.createElement('a');
  a.href=canvas.toDataURL('image/png');
  a.download=`ingilizce-sertifika-${new Date().toISOString().split('T')[0]}.png`;
  a.click();
  showNotif('📜 Sertifika indirildi!');
}

// ═══════════════════════════════════════════════
// STATS
// ═══════════════════════════════════════════════
function renderStats() {
  const recent=[...state.completedActivities].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,20);
  document.getElementById('statsPage').innerHTML=`
    <h2 class="section-title">📊 İstatistikler</h2>
    
    <div class="card">
      <div class="card-title">Son Aktiviteler</div>
      <div style="max-height:350px;overflow-y:auto;">
        ${recent.length===0
          ? '<p style="text-align:center;color:var(--text-muted);padding:2rem;">Henüz aktivite yok</p>'
          : recent.map(c=>`
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
        <input type="time" class="form-input" id="reminderTimeInput" value="${state.reminderTime}" style="width:140px;">
        <button class="btn grad" onclick="saveReminder()">💾 Kaydet</button>
        <span style="font-size:.8rem;color:var(--text-muted);">Uygulama açıkken bildirim gelir</span>
      </div>
    </div>
    
    <div class="card">
      <div class="card-title">💾 Veri Yönetimi</div>
      <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
        <button class="btn grad" onclick="exportData()">⬇️ JSON İndir</button>
        <label class="btn grad" style="cursor:pointer;">⬆️ JSON Yükle<input type="file" accept=".json" onchange="importData(event)" style="display:none;"></label>
        <button class="btn grad" onclick="generateReport()">📄 Rapor</button>
        <button class="btn grad" onclick="shareProgress()">📤 Paylaş</button>
      </div>
    </div>
  `;
}

function saveReminder() {
  state.reminderTime = document.getElementById('reminderTimeInput').value;
  saveState();
  checkReminderSetup();
  showNotif(`⏰ Hatırlatıcı ${state.reminderTime} olarak ayarlandı!`);
}

function checkReminderSetup() {
  // In-app reminder check - runs when page is open
  const [h,m] = state.reminderTime.split(':').map(Number);
  const now = new Date();
  if (now.getHours()===h && now.getMinutes()===m) {
    showNotif('⏰ İngilizce çalışma zamanı! 📚');
  }
}

// ═══════════════════════════════════════════════
// BADGES
// ═══════════════════════════════════════════════
const ALL_BADGES = [
  {id:'first_complete', icon:'🎯', name:'İlk Adım',       desc:'İlk aktiviteyi tamamladın!'},
  {id:'streak_7',       icon:'🔥', name:'1 Hafta',        desc:'7 gün streak!'},
  {id:'streak_30',      icon:'⭐', name:'1 Ay',           desc:'30 gün streak!'},
  {id:'streak_100',     icon:'💎', name:'100 Gün',        desc:'100 gün streak!'},
  {id:'vocab_50',       icon:'📚', name:'50 Kelime',      desc:'50 kelime öğrendin!'},
  {id:'vocab_100',      icon:'🎓', name:'100 Kelime',     desc:'100 kelime öğrendin!'},
  {id:'vocab_500',      icon:'🌟', name:'500 Kelime',     desc:'500 kelime öğrendin!'},
  {id:'pomodoro',       icon:'🍅', name:'Pomodoro Master',desc:'İlk pomodoro tamamlandı!'},
  {id:'early_bird',     icon:'🌅', name:'Sabahçı',        desc:'Sabah aktivitesi tamamlandı!'},
  {id:'night_owl',      icon:'🌙', name:'Gece Kuşu',      desc:'Akşam aktivitesi tamamlandı!'},
  {id:'weekend_warrior',icon:'🎮', name:'Hafta Sonu',     desc:'Hafta sonu çalıştın!'},
  {id:'quiz_perfect',   icon:'💯', name:'Mükemmel Quiz',  desc:'Tüm soruları doğru yaptın!'},
  {id:'level_5',        icon:'🚀', name:'Lv 5',           desc:'5. seviyeye ulaştın!'},
  {id:'level_10',       icon:'👑', name:'Lv 10',          desc:'10. seviyeye ulaştın!'},
];

function renderBadges() {
  document.getElementById('badgesPage').innerHTML = `
    <h2 class="section-title">🏆 Başarı Rozetleri (${state.badges.length}/${ALL_BADGES.length})</h2>
    <div class="badge-grid">
      ${ALL_BADGES.map(b=>{
        const earned=state.badges.includes(b.id);
        return `<div class="badge-card ${earned?'earned':'locked'}">
          <div class="badge-emoji">${b.icon}</div>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${b.desc}</div>
          ${earned?'<div style="margin-top:.4rem;font-size:1.2rem;">🏅</div>':''}
        </div>`;
      }).join('')}
    </div>
    <div class="card" style="margin-top:1rem;text-align:center;">
      <div style="font-weight:700;margin-bottom:.75rem;">${state.badges.length} / ${ALL_BADGES.length} Rozet</div>
      <div class="prog-bar" style="max-width:350px;margin:0 auto;">
        <div class="prog-fill" style="background:linear-gradient(90deg,#d97706,#f59e0b);width:${(state.badges.length/ALL_BADGES.length)*100}%"></div>
      </div>
    </div>
  `;
}

function checkBadge(id) {
  if (state.badges.includes(id)) return;
  state.badges.push(id);
  saveState();
  const b=ALL_BADGES.find(x=>x.id===id);
  if (b) { launchConfetti(); showNotif(`🏆 Rozet: ${b.icon} ${b.name}`); }
}

// ═══════════════════════════════════════════════
// LEVEL & XP
// ═══════════════════════════════════════════════
function addXP(amount) {
  state.xp += amount;
  const newLevel = Math.floor(state.xp / XP_PER_LEVEL) + 1;
  if (newLevel > state.level) {
    state.level = newLevel;
    showNotif(`🚀 Seviye atladın! Lv ${state.level} - ${getLevelName()}`);
    launchConfetti();
    if (state.level===5)  checkBadge('level_5');
    if (state.level===10) checkBadge('level_10');
  }
  saveState();
  updateLevelBar();
}

function getLevelName() {
  return LEVEL_NAMES[Math.min(state.level-1, LEVEL_NAMES.length-1)];
}

function updateLevelBar() {
  const lvl=document.getElementById('levelBadge');
  const bar=document.getElementById('xpBar');
  const txt=document.getElementById('xpText');
  if (!lvl) return;
  const xpInLevel = state.xp % XP_PER_LEVEL;
  lvl.textContent = `⭐ Lv ${state.level}`;
  bar.style.width = `${(xpInLevel/XP_PER_LEVEL)*100}%`;
  txt.textContent = `${xpInLevel} / ${XP_PER_LEVEL} XP`;
}

// ═══════════════════════════════════════════════
// STREAK
// ═══════════════════════════════════════════════
function updateStreak() {
  const today=new Date().toDateString();
  const yesterday=new Date(Date.now()-86400000).toDateString();
  const todayDone=state.completedActivities.filter(a=>new Date(a.date).toDateString()===today);
  const ystrdyDone=state.completedActivities.filter(a=>new Date(a.date).toDateString()===yesterday);
  if (todayDone.length>0) {
    if (ystrdyDone.length>0||state.streak===0) {
      state.streak++;
      if (state.streak===7)   checkBadge('streak_7');
      if (state.streak===30)  checkBadge('streak_30');
      if (state.streak===100) checkBadge('streak_100');
    }
  }
}

function updateStreakDisplay() {
  const el=document.getElementById('streakText');
  if (el) el.textContent=`${state.streak} gün streak 🔥`;
}

// ═══════════════════════════════════════════════
// THEMES
// ═══════════════════════════════════════════════
const THEMES = [
  {id:'default', name:'Mor (Varsayılan)', emoji:'💜'},
  {id:'theme-blue',   name:'Mavi', emoji:'💙'},
  {id:'theme-green',  name:'Yeşil', emoji:'💚'},
  {id:'theme-pink',   name:'Pembe', emoji:'🩷'},
  {id:'theme-orange', name:'Turuncu', emoji:'🧡'},
];

function showThemes() {
  showModal('🎨 Tema Seç', `
    <div style="display:flex;flex-direction:column;gap:.5rem;">
      ${THEMES.map(t=>`
        <button class="btn ${state.theme===t.id?'grad':'gray'}" style="justify-content:flex-start;gap:.75rem;" onclick="applyTheme('${t.id}');closeModal();">
          <span style="font-size:1.3rem;">${t.emoji}</span> ${t.name}
          ${state.theme===t.id?'<span style="margin-left:auto;">✓</span>':''}
        </button>`).join('')}
    </div>
  `, [{text:'Kapat',cls:'gray',fn:closeModal}]);
}

function applyTheme(themeId) {
  document.body.className = themeId==='default'?'':themeId;
  state.theme=themeId; saveState();
}

// ═══════════════════════════════════════════════
// MUSIC
// ═══════════════════════════════════════════════
function toggleMusic() {
  state.musicOn=!state.musicOn;
  const bar=document.getElementById('musicBar');
  const btn=document.getElementById('musicToggleBtn');
  if (state.musicOn) {
    bar.classList.remove('hidden');
    btn.textContent='🔇';
    updateMusicName();
    showNotif(`🎵 ${TRACKS[state.currentTrack].name}`);
  } else {
    bar.classList.add('hidden');
    btn.textContent='🎵';
  }
}

function prevTrack() { state.currentTrack=(state.currentTrack-1+TRACKS.length)%TRACKS.length; updateMusicName(); }
function nextTrack() { state.currentTrack=(state.currentTrack+1)%TRACKS.length; updateMusicName(); }
function updateMusicName() {
  const el=document.getElementById('musicName');
  if (el) el.textContent=`${TRACKS[state.currentTrack].emoji} ${TRACKS[state.currentTrack].name}`;
}

// ═══════════════════════════════════════════════
// FAB MENU
// ═══════════════════════════════════════════════
function toggleFABMenu() {
  state.fabMenuOpen=!state.fabMenuOpen;
  const menu=document.getElementById('fabMenu');
  const icon=document.getElementById('fabIcon');
  if (state.fabMenuOpen) {
    menu.classList.remove('hidden');
    icon.style.transform='rotate(45deg)';
    menu.innerHTML=[
      {e:'🎯',l:'Hedefler',   fn:'showGoals()'},
      {e:'📚',l:'Kelime Ekle',fn:'showAddWord()'},
      {e:'🎨',l:'Tema',       fn:'showThemes()'},
      {e:'📄',l:'Rapor',      fn:'generateReport()'},
      {e:'⬇️',l:'Dışa Aktar', fn:'exportData()'},
    ].map(i=>`<button class="fab-item" onclick="${i.fn};toggleFABMenu();">${i.e} <span>${i.l}</span></button>`).join('');
  } else {
    menu.classList.add('hidden');
    icon.style.transform='rotate(0deg)';
  }
}

// ═══════════════════════════════════════════════
// DATA MANAGEMENT
// ═══════════════════════════════════════════════
function exportData() {
  const d={completedActivities:state.completedActivities,vocabulary:state.vocabulary,notes:state.notes,goals:state.goals,streak:state.streak,badges:state.badges,xp:state.xp,level:state.level,pomodoroCount:state.pomodoroCount,exportDate:new Date().toISOString()};
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:'application/json'}));
  a.download=`ingilizce-yedek-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  showNotif('⬇️ Yedek indirildi!');
}

function importData(e) {
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try {
      const d=JSON.parse(ev.target.result);
      Object.assign(state,{completedActivities:d.completedActivities||[],vocabulary:d.vocabulary||[],notes:d.notes||{},goals:d.goals||state.goals,streak:d.streak||0,badges:d.badges||[],xp:d.xp||0,level:d.level||1,pomodoroCount:d.pomodoroCount||0});
      saveState(); updateLevelBar(); updateStreakDisplay();
      showNotif('✅ Veriler yüklendi!'); showPage('dashboard');
    } catch { showNotif('❌ Dosya okunamadı!'); }
  };
  reader.readAsText(file);
}

function generateReport() {
  const s=calcStats();
  const txt=`İNGİLİZCE ÖĞRENME RAPORU\nTarih: ${new Date().toLocaleDateString('tr-TR')}\n\n📊 İSTATİSTİKLER\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔥 Streak: ${state.streak} gün\n⭐ Seviye: ${state.level} (${getLevelName()})\n💎 XP: ${state.xp}\n📚 Kelime: ${state.vocabulary.length}\n✅ Aktivite: ${state.completedActivities.length}\n🏆 Rozet: ${state.badges.length}\n🍅 Pomodoro: ${state.pomodoroCount}\n\n⏱️ ÇALIŞMA SÜRELERİ\n━━━━━━━━━━━━━━━━━━━━━━━━━━\nBugün: ${s.todayMin} dk\nBu Hafta: ${s.weekMin} dk\nBu Ay: ${s.monthMin} dk\n\n🏆 ROZETLER\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n${state.badges.join(', ')}\n\nHarika gidiyorsun! Devam et! 💪`;
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));
  a.download=`rapor-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  showNotif('📄 Rapor indirildi!');
}

function shareProgress() {
  const txt=`🔥 ${state.streak} gün streak!\n⭐ Seviye ${state.level} (${getLevelName()})\n📚 ${state.vocabulary.length} kelime öğrendim\n✅ ${state.completedActivities.length} aktivite tamamladım\n\n#İngilizceÖğreniyorum #EnglishLearning`;
  if (navigator.share) navigator.share({text:txt});
  else { navigator.clipboard?.writeText(txt); showNotif('📋 Kopyalandı!'); }
}

// ═══════════════════════════════════════════════
// GOALS & NOTES
// ═══════════════════════════════════════════════
function showGoals() {
  showModal('🎯 Hedeflerim', `
    <div class="form-group"><label class="form-label">Günlük Hedef (dk)</label><input class="form-input" id="dg" type="number" value="${state.goals.daily}"></div>
    <div class="form-group"><label class="form-label">Haftalık Hedef (dk)</label><input class="form-input" id="wg" type="number" value="${state.goals.weekly}"></div>
    <div class="form-group"><label class="form-label">Aylık Hedef (dk)</label><input class="form-input" id="mg" type="number" value="${state.goals.monthly}"></div>
  `, [
    {text:'Kaydet', cls:'grad', fn() {
      state.goals={daily:+document.getElementById('dg').value||120, weekly:+document.getElementById('wg').value||840, monthly:+document.getElementById('mg').value||3600};
      saveState(); closeModal(); showNotif('✅ Hedefler kaydedildi!');
      if (state.currentPage==='dashboard') renderDashboard();
    }},
    {text:'İptal', cls:'gray', fn:closeModal}
  ]);
}

function addNote(id) {
  const a=ACTIVITIES.find(x=>x.id===id);
  showModal(`📝 Not: ${a.title}`, `
    <div class="form-group"><label class="form-label">Notunuz</label><textarea class="form-textarea" id="noteTA" rows="6">${state.notes[id]||''}</textarea></div>
  `, [
    {text:'Kaydet', cls:'grad', fn() {
      state.notes[id]=document.getElementById('noteTA').value;
      saveState(); closeModal(); showNotif('📝 Not kaydedildi!');
      if (state.currentPage==='activities') renderActivities();
    }},
    {text:'İptal', cls:'gray', fn:closeModal}
  ]);
}

// ═══════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════
function showModal(title, content, btns) {
  closeModal();
  const m=document.createElement('div');
  m.className='modal'; m.id='activeModal';
  m.innerHTML=`
    <div class="modal-box">
      <div class="modal-hdr">
        <div class="modal-title">${title}</div>
        <button class="close-btn" onclick="closeModal()">✕</button>
      </div>
      ${content}
      <div class="modal-actions">
        ${btns.map((b,i)=>`<button class="btn ${b.cls} btn-block" id="mbtn${i}">${b.text}</button>`).join('')}
      </div>
    </div>`;
  document.getElementById('modalContainer').appendChild(m);
  btns.forEach((b,i)=>document.getElementById('mbtn'+i).addEventListener('click',b.fn));
  m.addEventListener('click',e=>{ if(e.target===m) closeModal(); });
}

function closeModal() {
  document.getElementById('activeModal')?.remove();
}

// ═══════════════════════════════════════════════
// NOTIFICATIONS & EFFECTS
// ═══════════════════════════════════════════════
function showNotif(msg) {
  document.querySelectorAll('.notif').forEach(n=>n.remove());
  const n=document.createElement('div');
  n.className='notif'; n.textContent=msg;
  document.body.appendChild(n);
  setTimeout(()=>n.remove(), 2500);
}

function launchConfetti() {
  const colors=['#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444'];
  for (let i=0;i<40;i++) {
    const p=document.createElement('div');
    p.className='confetti-piece';
    p.style.cssText=`left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${1+Math.random()*2}s;animation-delay:${Math.random()*.5}s;transform:rotate(${Math.random()*360}deg);`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), 3000);
  }
}

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function calcStats() {
  const today=new Date();
  const todayStr=today.toDateString();
  const todayActs=state.completedActivities.filter(a=>new Date(a.date).toDateString()===todayStr);
  const weekActs=state.completedActivities.filter(a=>Math.floor((today-new Date(a.date))/(86400000))<7);
  const monthActs=state.completedActivities.filter(a=>{ const d=new Date(a.date); return d.getMonth()===today.getMonth()&&d.getFullYear()===today.getFullYear(); });
  return {
    todayMin:Math.round(todayActs.reduce((s,a)=>s+a.duration,0)/60),
    weekMin:Math.round(weekActs.reduce((s,a)=>s+a.duration,0)/60),
    monthMin:Math.round(monthActs.reduce((s,a)=>s+a.duration,0)/60),
  };
}

function getTodayMinutes() { return calcStats().todayMin; }
function getTodayActivities() { return state.completedActivities.filter(a=>new Date(a.date).toDateString()===new Date().toDateString()); }
function isToday(dateStr) { return dateStr && new Date(dateStr).toDateString()===new Date().toDateString(); }

// ═══════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════
window.addEventListener('load', init);
