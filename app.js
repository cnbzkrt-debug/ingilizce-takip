// PWA Yönetimi
let deferredPrompt;
let isInstalled = false;

// Service Worker kaydı
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(() => {
    console.log('Service Worker registered');
  });
}

// Install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBanner').classList.remove('hidden');
});

window.addEventListener('appinstalled', () => {
  isInstalled = true;
  document.getElementById('installBanner').classList.add('hidden');
  console.log('PWA installed');
});

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install');
      }
      deferredPrompt = null;
    });
  }
}

function closeInstallBanner() {
  document.getElementById('installBanner').classList.add('hidden');
}

// Veri Yönetimi
const STORAGE_KEYS = {
  ACTIVITIES: 'completedActivities',
  VOCABULARY: 'vocabulary',
  NOTES: 'notes',
  GOALS: 'goals',
  STREAK: 'streak',
  BADGES: 'badges',
  TIMER: 'timerState'
};

// LocalStorage wrapper
const storage = {
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

// Aktiviteler CSV'den tam data
const ACTIVITIES = [
  {
    id: 1,
    time: 'Her Gün – Sabah Yolculuğu (Gidiş)',
    duration: '30–45 dk',
    title: 'Yeni Dinleme & Shadowing',
    description: `- Yeni dinleme: 4 bölüm dinle (ortalama 6–10 dk'lık podcast).
- İlk dinleme: Sadece dinle, genel anlamı (gist) yakala, detaylara takılma.
- Transkript açıkken takip et, anlamadığın kelimeleri işaretle (kırmızı kalem veya telefon notu).
- Kelimeyi önce context clue ile tahmin et (cümle öncesi/sonrası ipucu).
- Tahmin edemiyorsan hızlıca bak (Cambridge Dictionary veya Google Translate, 1–2 saniye).
- Hafif shadowing dene: Fısıldayarak veya dudak hareketiyle cümleleri tekrarla (trafik varsa sessiz).`,
    resources: [
      'BBC Learning English – 6 Minute English',
      'Espresso English Podcast, Slow English Podcast',
      'Spotify/YouTube (hız 0.75x–0.9x)'
    ],
    tips: `- Yeni comprehensible input + anlam bütünlüğü geliştirme.
- Kelime işaretleme: Günde max 5–8 yüksek değerli seç.
- Anlama %70+ hedefle; düşükse seviyeyi düşür.`,
    color: '#FF6B6B',
    links: [
      { name: 'BBC 6 Min English', url: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english' },
      { name: 'Cambridge Dict', url: 'https://dictionary.cambridge.org/' }
    ]
  },
  {
    id: 2,
    time: 'Her Gün – Akşam Dönüş Yolculuğu',
    duration: '30–45 dk',
    title: 'Tekrar Dinleme & Aktif Shadowing',
    description: `- Tekrar dinleme: Sabahki 4 bölümü X2 dinle (her birini 2 kez).
- 1. tekrarda: Dinle + transkript açıkken takip et, işaretli kelimeleri not et.
- 2. tekrarda: Aktif shadowing yap (podcast hızını düşür, konuşmacıyı aynı anda veya 0.5–1 sn gecikmeyle yüksek sesle tekrarla – vurgu, tonlama, ritim, duraklamaları taklit et).
- Serbest shadowing: Podcast'i durdur, aynı cümleyi kendi kelimelerinle değiştirerek tekrarla.
- Eğer çok yorgunsan sadece dinle, shadowing atla.`,
    resources: [
      'Sabah dinlenen bölümler',
      'Friends, The Office audio (altyazısız)',
      'Spotify/YouTube hız kontrolü'
    ],
    tips: `- Pekiştirme + anlam oranı %85–95'e çıkarma.
- Gramer pattern'leri subconscious oturtturma.
- Shadowing ile telaffuz + akıcılık otomatikleşir.`,
    color: '#4ECDC4',
    links: [
      { name: 'Netflix', url: 'https://www.netflix.com' }
    ]
  },
  {
    id: 3,
    time: 'Her Gün – Evde Akşam',
    duration: '30–45 dk',
    title: 'Kelime Kartları, AI Konuşma & Mini Output',
    description: `1. Kelime / Phrase Seçme & Kart Ekleme (10–15 dk):
   - İşaretlediklerinden 5–8 yüksek değerli seç.
   - Tam cümle içinde öğren (tek kelime değil).
   - Kart ekle: Cloze veya Basic/production.

2. AI Konuşma Pratiği (15–20 dk):
   - Prompt'la konuş, hataları nazikçe düzelttir.
   - Kelime hatırlayamazsan "help" de.

3. Mini Output (5 dk):
   - Yüksek sesle 1–2 dk kendini anlat.
   - Telefonla kaydet → dinle, takıldığın yerleri not et.`,
    resources: [
      'Anki, Quizlet, Memrise',
      'ChatGPT / Claude / Grok',
      'News in Levels, British Council'
    ],
    tips: `- Kelime haznesi genişletme + konuşma hızı.
- Kendi kartlar kişisel bağlam için kritik.
- NotebookLM entegrasyonu güçlü.`,
    color: '#95E1D3',
    links: [
      { name: 'Anki', url: 'https://apps.ankiweb.net/' },
      { name: 'ChatGPT', url: 'https://chat.openai.com' },
      { name: 'Claude', url: 'https://claude.ai' }
    ]
  },
  {
    id: 4,
    time: 'Cumartesi',
    duration: '1–2 saat',
    title: 'Hafta Sonu Keyif & Opsiyonel Pratik',
    description: `- 13:30–15:00: Dinlen, öğle yemeği, hafif yürüyüş.
- 15:00–16:00: Opsiyonel podcast/Netflix.
- 16:00–17:00: Opsiyonel AI konuşma.
- Akşam: Tamamen serbest.`,
    resources: [
      'Netflix: Friends, The Office',
      'HelloTalk/Tandem',
      'NotebookLM Audio Overview'
    ],
    tips: `- Hafif keyif + motivasyon koruma.
- İngilizce'yi zorunlu yapma.`,
    color: '#F38181',
    links: [
      { name: 'HelloTalk', url: 'https://www.hellotalk.com' }
    ]
  },
  {
    id: 5,
    time: 'Pazar',
    duration: '1–2 saat',
    title: 'Dinlenme, Okuma & Gramer',
    description: `- Sabah: Geç kalk, kahvaltı, dinlen.
- Öğleden sonra: Opsiyonel gramer/okuma.
- Akşam: Opsiyonel tandem, ilerleme videosu.`,
    resources: [
      'British Council A1/A2 reading',
      'Raymond Murphy Grammar',
      'HelloTalk/Tandem'
    ],
    tips: `- Dinlenme + opsiyonel ilerleme.
- İlerleme videosu motivasyon için kritik.`,
    color: '#AA96DA',
    links: [
      { name: 'British Council', url: 'https://learnenglish.britishcouncil.org' }
    ]
  },
  {
    id: 6,
    time: 'Haftalık Ekstra',
    duration: '+1–2 saat',
    title: 'Gerçek İnsan Pratiği & İlerleme',
    description: `- Gerçek insan pratiği: 2–3 kez sesli mesaj/arama.
- İlerleme kontrolü: 3–4 haftada 1 video çek.
- Opsiyonel italki dersi.
- NotebookLM entegrasyonu.`,
    resources: [
      'HelloTalk, Tandem, Discord',
      'italki/Preply',
      'NotebookLM'
    ],
    tips: `- Gerçek etkileşim + ilerleme takibi.
- B1 işaretleri: 10 dk kesintisiz konuşma.`,
    color: '#FCBAD3',
    links: [
      { name: 'italki', url: 'https://www.italki.com' }
    ]
  }
];

// State
let state = {
  currentPage: 'dashboard',
  darkMode: true,
  completedActivities: [],
  vocabulary: [],
  notes: {},
  goals: { daily: 120, weekly: 840, monthly: 3600 },
  streak: 0,
  badges: [],
  timerSeconds: 0,
  timerActive: false,
  pomodoroMode: false,
  pomodoroPhase: 'work',
  selectedActivity: null,
  fabMenuOpen: false
};

// Init
function init() {
  loadState();
  renderDashboard();
  updateStats();
  
  // Timer interval
  setInterval(() => {
    if (state.timerActive) {
      state.timerSeconds++;
      updateTimerDisplay();
      
      if (state.pomodoroMode) {
        if (state.pomodoroPhase === 'work' && state.timerSeconds >= 1500) {
          state.pomodoroPhase = 'break';
          state.timerSeconds = 0;
          checkBadge('pomodoro');
          alert('🍅 Pomodoro tamamlandı! Şimdi 5 dk mola.');
        } else if (state.pomodoroPhase === 'break' && state.timerSeconds >= 300) {
          state.pomodoroPhase = 'work';
          state.timerSeconds = 0;
          alert('☕ Mola bitti! Yeni çalışma başlıyor.');
        }
      }
      
      saveState();
    }
  }, 1000);
}

function loadState() {
  state.completedActivities = storage.get(STORAGE_KEYS.ACTIVITIES) || [];
  state.vocabulary = storage.get(STORAGE_KEYS.VOCABULARY) || [];
  state.notes = storage.get(STORAGE_KEYS.NOTES) || {};
  state.goals = storage.get(STORAGE_KEYS.GOALS) || { daily: 120, weekly: 840, monthly: 3600 };
  state.streak = storage.get(STORAGE_KEYS.STREAK) || 0;
  state.badges = storage.get(STORAGE_KEYS.BADGES) || [];
}

function saveState() {
  storage.set(STORAGE_KEYS.ACTIVITIES, state.completedActivities);
  storage.set(STORAGE_KEYS.VOCABULARY, state.vocabulary);
  storage.set(STORAGE_KEYS.NOTES, state.notes);
  storage.set(STORAGE_KEYS.GOALS, state.goals);
  storage.set(STORAGE_KEYS.STREAK, state.streak);
  storage.set(STORAGE_KEYS.BADGES, state.badges);
}

// Navigation
function showPage(pageName) {
  state.currentPage = pageName;
  
  // Update nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.page === pageName) {
      btn.classList.add('active');
    }
  });
  
  // Hide all pages
  ['dashboard', 'activities', 'vocabulary', 'timer', 'stats', 'badges'].forEach(page => {
    document.getElementById(page + 'Page').classList.add('hidden');
  });
  
  // Show selected page
  document.getElementById(pageName + 'Page').classList.remove('hidden');
  
  // Render page
  switch(pageName) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'activities':
      renderActivities();
      break;
    case 'vocabulary':
      renderVocabulary();
      break;
    case 'timer':
      renderTimer();
      break;
    case 'stats':
      renderStats();
      break;
    case 'badges':
      renderBadges();
      break;
  }
}

// Dashboard
function renderDashboard() {
  updateStats();
}

function updateStats() {
  const stats = calculateStats();
  
  document.getElementById('streakText').textContent = `${state.streak} gün streak 🔥`;
  document.getElementById('streakValue').textContent = state.streak;
  document.getElementById('vocabValue').textContent = state.vocabulary.length;
  document.getElementById('badgesValue').textContent = state.badges.length;
  
  document.getElementById('todayProgress').textContent = `${stats.todayMinutes} / ${state.goals.daily} dk`;
  document.getElementById('todayBar').style.width = `${Math.min(stats.todayProgress, 100)}%`;
  
  document.getElementById('weekProgress').textContent = `${stats.weekMinutes} / ${state.goals.weekly} dk`;
  document.getElementById('weekBar').style.width = `${Math.min(stats.weekProgress, 100)}%`;
  
  document.getElementById('monthProgress').textContent = `${stats.monthMinutes} / ${state.goals.monthly} dk`;
  document.getElementById('monthBar').style.width = `${Math.min(stats.monthProgress, 100)}%`;
}

function calculateStats() {
  const today = new Date();
  const todayStr = today.toDateString();
  
  const todayActivities = state.completedActivities.filter(a => 
    new Date(a.date).toDateString() === todayStr
  );
  
  const thisWeek = state.completedActivities.filter(a => {
    const diff = Math.floor((today - new Date(a.date)) / (1000 * 60 * 60 * 24));
    return diff < 7;
  });
  
  const thisMonth = state.completedActivities.filter(a => {
    const date = new Date(a.date);
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  });
  
  const todayMinutes = Math.round(todayActivities.reduce((sum, a) => sum + a.duration, 0) / 60);
  const weekMinutes = Math.round(thisWeek.reduce((sum, a) => sum + a.duration, 0) / 60);
  const monthMinutes = Math.round(thisMonth.reduce((sum, a) => sum + a.duration, 0) / 60);
  
  return {
    todayMinutes,
    weekMinutes,
    monthMinutes,
    todayProgress: Math.round((todayMinutes / state.goals.daily) * 100),
    weekProgress: Math.round((weekMinutes / state.goals.weekly) * 100),
    monthProgress: Math.round((monthMinutes / state.goals.monthly) * 100)
  };
}

// Activities
function renderActivities() {
  const page = document.getElementById('activitiesPage');
  
  let html = '<h2 class="card-title" style="margin-bottom: 1.5rem;">📅 Günlük Aktiviteler</h2>';
  
  ACTIVITIES.forEach(activity => {
    const isCompleted = state.completedActivities.some(c => 
      c.activityId === activity.id && 
      new Date(c.date).toDateString() === new Date().toDateString()
    );
    
    html += `
      <div class="activity-card" style="border-color: ${activity.color}">
        <div class="activity-header">
          <div class="activity-icon">${isCompleted ? '✅' : '⭕'}</div>
          <div class="activity-info">
            <h3>${activity.title}</h3>
            <div class="activity-time">${activity.time} • ${activity.duration}</div>
          </div>
        </div>
        
        <div class="activity-description">${activity.description}</div>
        
        <div class="activity-actions">
          <button class="btn-small btn-gradient" onclick="startActivity(${activity.id})">
            ⏱️ Başlat
          </button>
          <button class="btn-small btn-gray" onclick="showActivityDetails(${activity.id})">
            📖 Detaylar
          </button>
          <button class="btn-small btn-gray" onclick="addNote(${activity.id})">
            📝 Not
          </button>
          ${isCompleted ? '<span class="btn-small btn-green">✓ Tamamlandı</span>' : ''}
        </div>
      </div>
    `;
  });
  
  page.innerHTML = html;
}

function startActivity(activityId) {
  state.selectedActivity = ACTIVITIES.find(a => a.id === activityId);
  showPage('timer');
}

function showActivityDetails(activityId) {
  const activity = ACTIVITIES.find(a => a.id === activityId);
  
  let linksHtml = '';
  if (activity.links) {
    linksHtml = '<div style="margin-top: 1rem;"><strong>🔗 Hızlı Linkler:</strong><br>';
    activity.links.forEach(link => {
      linksHtml += `<a href="${link.url}" target="_blank" style="color: #8b5cf6; margin-right: 1rem;">${link.name}</a>`;
    });
    linksHtml += '</div>';
  }
  
  showModal(
    activity.title,
    `
      <div style="line-height: 1.8;">
        <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
          <strong>📚 Kaynaklar:</strong><br>
          ${activity.resources.map(r => `• ${r}`).join('<br>')}
        </div>
        
        <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 0.5rem;">
          <strong>💡 İpuçları:</strong><br>
          <pre style="white-space: pre-wrap; font-family: inherit; margin-top: 0.5rem;">${activity.tips}</pre>
        </div>
        
        ${linksHtml}
      </div>
    `,
    [
      { text: 'Kapat', class: 'btn-gray', action: 'closeModal' }
    ]
  );
}

// Vocabulary
function renderVocabulary() {
  const page = document.getElementById('vocabularyPage');
  
  const sorted = [...state.vocabulary].sort((a, b) => 
    new Date(a.nextReview) - new Date(b.nextReview)
  );
  
  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h2 class="card-title" style="margin: 0;">📚 Kelime Defteri (${state.vocabulary.length})</h2>
      <button class="btn-small btn-gradient" onclick="showAddWord()">
        ➕ Ekle
      </button>
    </div>
    
    <div style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 0.75rem; padding: 1rem; margin-bottom: 1.5rem;">
      <p style="font-size: 0.875rem;">
        💡 <strong>Spaced Repetition:</strong> Kelimeleri belirli aralıklarla tekrar edin (1, 2, 4, 8, 16 gün).
      </p>
    </div>
    
    <div class="vocab-grid">
  `;
  
  if (sorted.length === 0) {
    html += `
      <div class="card" style="text-align: center; padding: 3rem 1rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">📚</div>
        <p style="color: #9ca3af;">Henüz kelime eklenmemiş</p>
      </div>
    `;
  } else {
    sorted.forEach(word => {
      const needsReview = new Date(word.nextReview) <= new Date();
      const daysUntil = Math.ceil((new Date(word.nextReview) - new Date()) / (1000 * 60 * 60 * 24));
      
      html += `
        <div class="vocab-card ${needsReview ? 'highlight' : ''}">
          <div class="vocab-header">
            <div>
              <div class="vocab-word">${word.word}</div>
              <div class="vocab-translation">${word.translation}</div>
              ${word.sentence ? `<div class="vocab-sentence">"${word.sentence}"</div>` : ''}
              <div class="vocab-meta">
                <span>Tekrar: ${word.reviewCount || 0}x</span>
                ${needsReview 
                  ? '<span style="background: #eab308; color: white; padding: 0.25rem 0.5rem; border-radius: 999px;">⏰ Tekrar zamanı!</span>'
                  : `<span>${daysUntil} gün sonra</span>`
                }
              </div>
            </div>
            <div class="vocab-actions">
              <button class="btn" style="background: ${needsReview ? '#eab308' : 'rgba(55, 65, 81, 0.8)'};" onclick="reviewWord(${word.id})">
                🔄
              </button>
              <button class="btn" style="background: rgba(220, 38, 38, 0.3); color: #ef4444;" onclick="deleteWord(${word.id})">
                🗑️
              </button>
            </div>
          </div>
        </div>
      `;
    });
  }
  
  html += '</div>';
  page.innerHTML = html;
}

function showAddWord() {
  showModal(
    '📚 Yeni Kelime Ekle',
    `
      <div class="form-group">
        <label class="form-label">Kelime (İngilizce)</label>
        <input type="text" class="form-input" id="wordInput" placeholder="örn: accomplish">
      </div>
      
      <div class="form-group">
        <label class="form-label">Türkçe Anlamı</label>
        <input type="text" class="form-input" id="translationInput" placeholder="örn: başarmak">
      </div>
      
      <div class="form-group">
        <label class="form-label">Örnek Cümle (opsiyonel)</label>
        <textarea class="form-textarea" id="sentenceInput" rows="3" placeholder="I accomplished my goals today."></textarea>
      </div>
    `,
    [
      { text: 'Kaydet', class: 'btn-gradient', action: () => {
        const word = document.getElementById('wordInput').value.trim();
        const translation = document.getElementById('translationInput').value.trim();
        const sentence = document.getElementById('sentenceInput').value.trim();
        
        if (word && translation) {
          const newWord = {
            id: Date.now(),
            word,
            translation,
            sentence,
            addedDate: new Date().toISOString(),
            reviewCount: 0,
            lastReview: null,
            nextReview: new Date().toISOString()
          };
          
          state.vocabulary.push(newWord);
          saveState();
          
          if (state.vocabulary.length === 50) checkBadge('vocab_50');
          if (state.vocabulary.length === 100) checkBadge('vocab_100');
          if (state.vocabulary.length === 500) checkBadge('vocab_500');
          
          closeModal();
          renderVocabulary();
        } else {
          alert('Lütfen kelime ve anlamını girin!');
        }
      }},
      { text: 'İptal', class: 'btn-gray', action: 'closeModal' }
    ]
  );
}

function reviewWord(wordId) {
  state.vocabulary = state.vocabulary.map(w => {
    if (w.id === wordId) {
      const reviewCount = (w.reviewCount || 0) + 1;
      const daysToAdd = Math.pow(2, reviewCount);
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + daysToAdd);
      
      return {
        ...w,
        reviewCount,
        lastReview: new Date().toISOString(),
        nextReview: nextReview.toISOString()
      };
    }
    return w;
  });
  
  saveState();
  renderVocabulary();
}

function deleteWord(wordId) {
  if (confirm('Bu kelimeyi silmek istediğinizden emin misiniz?')) {
    state.vocabulary = state.vocabulary.filter(w => w.id !== wordId);
    saveState();
    renderVocabulary();
  }
}

// Timer
function renderTimer() {
  const page = document.getElementById('timerPage');
  
  const activity = state.selectedActivity;
  
  let html = `
    <div class="card">
      <h2 class="card-title" style="text-align: center;">⏱️ Zamanlayıcı</h2>
      
      ${activity ? `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <span style="background: ${activity.color}; color: white; padding: 0.5rem 1rem; border-radius: 999px; font-size: 0.875rem;">
            ${activity.title}
          </span>
        </div>
      ` : ''}
      
      <div class="timer-display">
        <div class="timer-time" id="timerDisplay">00:00</div>
        
        ${state.pomodoroMode ? `
          <div style="text-align: center; margin-bottom: 1rem;">
            <span style="padding: 0.5rem 1rem; border-radius: 0.5rem; ${state.pomodoroPhase === 'work' ? 'background: #ef4444;' : 'background: #10b981;'} color: white;">
              ${state.pomodoroPhase === 'work' ? '🍅 Çalışma (25 dk)' : '☕ Mola (5 dk)'}
            </span>
          </div>
        ` : ''}
        
        <div class="timer-controls">
          <button class="timer-btn ${state.timerActive ? 'pause' : 'play'}" onclick="toggleTimer()">
            ${state.timerActive ? '⏸️' : '▶️'}
          </button>
          
          <button class="timer-btn reset" onclick="resetTimer()">
            🔄
          </button>
          
          ${activity ? `
            <button class="timer-btn complete" onclick="completeActivity()">
              ✓
            </button>
          ` : ''}
        </div>
        
        <div style="text-align: center;">
          <button class="btn-small ${state.pomodoroMode ? 'btn-gradient' : 'btn-gray'}" onclick="togglePomodoro()">
            🍅 Pomodoro ${state.pomodoroMode ? 'Aktif' : 'Pasif'}
          </button>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h3 class="card-title">⚡ Hızlı Başlat</h3>
      <div class="preset-grid">
        ${[5, 10, 15, 25, 30, 45, 60, 90].map(mins => `
          <button class="preset-btn" onclick="startPreset(${mins})">${mins} dk</button>
        `).join('')}
      </div>
    </div>
  `;
  
  page.innerHTML = html;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const display = document.getElementById('timerDisplay');
  if (display) {
    const mins = Math.floor(state.timerSeconds / 60);
    const secs = state.timerSeconds % 60;
    display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

function toggleTimer() {
  state.timerActive = !state.timerActive;
  renderTimer();
}

function resetTimer() {
  state.timerSeconds = 0;
  state.timerActive = false;
  renderTimer();
}

function togglePomodoro() {
  state.pomodoroMode = !state.pomodoroMode;
  state.pomodoroPhase = 'work';
  state.timerSeconds = 0;
  renderTimer();
}

function startPreset(minutes) {
  state.timerSeconds = 0;
  state.timerActive = true;
  state.pomodoroMode = false;
  renderTimer();
}

function completeActivity() {
  if (!state.selectedActivity) return;
  
  const activity = state.selectedActivity;
  
  const completion = {
    activityId: activity.id,
    date: new Date().toISOString(),
    duration: state.timerSeconds,
    activityTitle: activity.title
  };
  
  state.completedActivities.push(completion);
  updateStreak();
  
  if (state.completedActivities.length === 1) checkBadge('first_complete');
  if (activity.time.includes('Sabah')) checkBadge('early_bird');
  if (activity.time.includes('Akşam')) checkBadge('night_owl');
  if (activity.time.includes('Cumartesi') || activity.time.includes('Pazar')) checkBadge('weekend_warrior');
  
  state.timerSeconds = 0;
  state.timerActive = false;
  state.selectedActivity = null;
  
  saveState();
  updateStats();
  
  alert('✅ Aktivite tamamlandı! Harika iş! 🎉');
  showPage('dashboard');
}

function updateStreak() {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  const todayActivities = state.completedActivities.filter(a => 
    new Date(a.date).toDateString() === today
  );
  
  const yesterdayActivities = state.completedActivities.filter(a => 
    new Date(a.date).toDateString() === yesterday
  );
  
  if (todayActivities.length > 0) {
    if (yesterdayActivities.length > 0 || state.streak === 0) {
      state.streak++;
      if (state.streak === 7) checkBadge('streak_7');
      if (state.streak === 30) checkBadge('streak_30');
      if (state.streak === 100) checkBadge('streak_100');
    }
  }
}

// Stats
function renderStats() {
  const page = document.getElementById('statsPage');
  
  const recent = [...state.completedActivities]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20);
  
  let html = `
    <h2 class="card-title">📊 Detaylı İstatistikler</h2>
    
    <div class="card">
      <h3 class="card-title">Son Aktiviteler</h3>
      <div style="max-height: 400px; overflow-y: auto;">
  `;
  
  if (recent.length === 0) {
    html += '<p style="text-align: center; color: #9ca3af; padding: 2rem;">Henüz aktivite yok</p>';
  } else {
    recent.forEach(comp => {
      const date = new Date(comp.date);
      html += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(55, 65, 81, 0.5); border-radius: 0.5rem; margin-bottom: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="font-size: 1.25rem;">✅</div>
            <div>
              <div style="font-weight: 500;">${comp.activityTitle}</div>
              <div style="font-size: 0.875rem; color: #9ca3af;">
                ${date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          <div style="font-family: monospace; font-weight: bold;">
            ${Math.round(comp.duration / 60)} dk
          </div>
        </div>
      `;
    });
  }
  
  html += `
      </div>
    </div>
    
    <div class="card">
      <h3 class="card-title">💾 Veri Yönetimi</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
        <button class="btn-small btn-gradient" onclick="exportData()">
          ⬇️ JSON İndir
        </button>
        <button class="btn-small btn-gradient" onclick="document.getElementById('importFile').click()">
          ⬆️ JSON Yükle
        </button>
        <button class="btn-small btn-gradient" onclick="generateReport()">
          📄 Rapor İndir
        </button>
        <button class="btn-small btn-gradient" onclick="shareProgress()">
          📤 Paylaş
        </button>
      </div>
      <input type="file" id="importFile" accept=".json" style="display: none;" onchange="importData(event)">
    </div>
  `;
  
  page.innerHTML = html;
}

function exportData() {
  const data = {
    completedActivities: state.completedActivities,
    vocabulary: state.vocabulary,
    notes: state.notes,
    goals: state.goals,
    streak: state.streak,
    badges: state.badges,
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ingilizce-yedek-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}

function importData(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        state.completedActivities = data.completedActivities || [];
        state.vocabulary = data.vocabulary || [];
        state.notes = data.notes || {};
        state.goals = data.goals || { daily: 120, weekly: 840, monthly: 3600 };
        state.streak = data.streak || 0;
        state.badges = data.badges || [];
        saveState();
        updateStats();
        alert('✅ Veriler başarıyla yüklendi!');
        showPage('dashboard');
      } catch (error) {
        alert('❌ Dosya okuma hatası!');
      }
    };
    reader.readAsText(file);
  }
}

function generateReport() {
  const stats = calculateStats();
  const report = `
İNGİLİZCE ÖĞRENME RAPORU
Tarih: ${new Date().toLocaleDateString('tr-TR')}

📊 İSTATİSTİKLER
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 Streak: ${state.streak} gün
📚 Toplam Kelime: ${state.vocabulary.length}
✅ Tamamlanan Aktivite: ${state.completedActivities.length}

⏱️ ÇALIŞMA SÜRELERİ
━━━━━━━━━━━━━━━━━━━━━━━━━━
Bugün: ${stats.todayMinutes} dk (${stats.todayProgress}%)
Bu Hafta: ${stats.weekMinutes} dk (${stats.weekProgress}%)
Bu Ay: ${stats.monthMinutes} dk (${stats.monthProgress}%)

🏆 ROZETLER (${state.badges.length})
━━━━━━━━━━━━━━━━━━━━━━━━━━
${state.badges.map(b => `✓ ${b}`).join('\n')}

📈 İLERLEME
━━━━━━━━━━━━━━━━━━━━━━━━━━
Günlük Hedef: ${state.goals.daily} dk
Haftalık Hedef: ${state.goals.weekly} dk
Aylık Hedef: ${state.goals.monthly} dk

Harika gidiyorsun! Devam et! 💪
  `;
  
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ingilizce-rapor-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
}

function shareProgress() {
  const text = `🔥 ${state.streak} gün streak!\n📚 ${state.vocabulary.length} kelime öğrendim\n✅ ${state.completedActivities.length} aktivite tamamladım\n\n#İngilizceÖğreniyorum #Streak`;
  
  if (navigator.share) {
    navigator.share({ text });
  } else {
    navigator.clipboard.writeText(text);
    alert('📋 Paylaşım metni kopyalandı!');
  }
}

// Badges
function renderBadges() {
  const page = document.getElementById('badgesPage');
  
  const allBadges = [
    { id: 'first_complete', icon: '🎯', title: 'İlk Adım', desc: 'İlk aktiviteyi tamamladın!' },
    { id: 'streak_7', icon: '🔥', title: '1 Hafta', desc: '7 gün streak!' },
    { id: 'streak_30', icon: '⭐', title: '1 Ay', desc: '30 gün streak!' },
    { id: 'streak_100', icon: '💎', title: '100 Gün', desc: '100 gün streak!' },
    { id: 'vocab_50', icon: '📚', title: '50 Kelime', desc: '50 kelime öğrendin!' },
    { id: 'vocab_100', icon: '🎓', title: '100 Kelime', desc: '100 kelime öğrendin!' },
    { id: 'vocab_500', icon: '🌟', title: '500 Kelime', desc: '500 kelime öğrendin!' },
    { id: 'pomodoro', icon: '🍅', title: 'Pomodoro Master', desc: 'İlk pomodoro tamamlandı!' },
    { id: 'early_bird', icon: '🌅', title: 'Sabahçı', desc: 'Sabah aktivitesi tamamlandı!' },
    { id: 'night_owl', icon: '🌙', title: 'Gece Kuşu', desc: 'Akşam aktivitesi tamamlandı!' },
    { id: 'weekend_warrior', icon: '🎮', title: 'Hafta Sonu Savaşçısı', desc: 'Hafta sonu çalıştın!' }
  ];
  
  let html = `
    <h2 class="card-title">🏆 Başarı Rozetleri</h2>
    
    <div class="badge-grid">
  `;
  
  allBadges.forEach(badge => {
    const earned = state.badges.includes(badge.id);
    html += `
      <div class="badge-card ${earned ? 'earned' : 'locked'}">
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-title">${badge.title}</div>
        <div class="badge-desc">${badge.desc}</div>
        ${earned ? '<div style="margin-top: 0.75rem; font-size: 1.5rem;">🏅</div>' : ''}
      </div>
    `;
  });
  
  html += `
    </div>
    
    <div class="card" style="text-align: center;">
      <h3 class="card-title">${state.badges.length} / ${allBadges.length} Rozet Kazanıldı</h3>
      <div class="progress-bar" style="margin: 1rem auto; max-width: 400px;">
        <div class="progress-fill" style="background: linear-gradient(to right, #eab308, #f59e0b); width: ${(state.badges.length / allBadges.length) * 100}%"></div>
      </div>
      <p style="color: #9ca3af; margin-top: 1rem;">
        ${state.badges.length === allBadges.length ? '🎉 Tüm rozetler toplandı!' : 'Devam et, yeni rozetler yakında!'}
      </p>
    </div>
  `;
  
  page.innerHTML = html;
}

function checkBadge(badgeId) {
  if (!state.badges.includes(badgeId)) {
    state.badges.push(badgeId);
    saveState();
    
    const badgeNames = {
      'first_complete': '🎯 İlk Adım',
      'streak_7': '🔥 1 Hafta',
      'streak_30': '⭐ 1 Ay',
      'streak_100': '💎 100 Gün',
      'vocab_50': '📚 50 Kelime',
      'vocab_100': '🎓 100 Kelime',
      'vocab_500': '🌟 500 Kelime',
      'pomodoro': '🍅 Pomodoro Master',
      'early_bird': '🌅 Sabahçı',
      'night_owl': '🌙 Gece Kuşu',
      'weekend_warrior': '🎮 Hafta Sonu Savaşçısı'
    };
    
    setTimeout(() => {
      alert(`🏆 Yeni Rozet Kazandınız!\n${badgeNames[badgeId]}`);
    }, 500);
  }
}

// FAB Menu
function toggleFABMenu() {
  state.fabMenuOpen = !state.fabMenuOpen;
  
  const menu = document.getElementById('fabMenu');
  const icon = document.getElementById('fabIcon');
  
  if (state.fabMenuOpen) {
    menu.classList.remove('hidden');
    icon.style.transform = 'rotate(45deg)';
    
    menu.innerHTML = `
      <button class="fab-item" onclick="showGoals(); toggleFABMenu();">
        <span>🎯</span>
        <span style="font-weight: 500;">Hedefler</span>
      </button>
      <button class="fab-item" onclick="showAddWord(); toggleFABMenu();">
        <span>📚</span>
        <span style="font-weight: 500;">Kelime Ekle</span>
      </button>
      <button class="fab-item" onclick="generateReport(); toggleFABMenu();">
        <span>📄</span>
        <span style="font-weight: 500;">Rapor</span>
      </button>
      <button class="fab-item" onclick="exportData(); toggleFABMenu();">
        <span>⬇️</span>
        <span style="font-weight: 500;">Dışa Aktar</span>
      </button>
    `;
  } else {
    menu.classList.add('hidden');
    icon.style.transform = 'rotate(0deg)';
  }
}

function showGoals() {
  showModal(
    '🎯 Hedeflerim',
    `
      <div class="form-group">
        <label class="form-label">Günlük Hedef (dakika)</label>
        <input type="number" class="form-input" id="dailyGoal" value="${state.goals.daily}">
      </div>
      
      <div class="form-group">
        <label class="form-label">Haftalık Hedef (dakika)</label>
        <input type="number" class="form-input" id="weeklyGoal" value="${state.goals.weekly}">
      </div>
      
      <div class="form-group">
        <label class="form-label">Aylık Hedef (dakika)</label>
        <input type="number" class="form-input" id="monthlyGoal" value="${state.goals.monthly}">
      </div>
    `,
    [
      { text: 'Kaydet', class: 'btn-gradient', action: () => {
        state.goals.daily = parseInt(document.getElementById('dailyGoal').value) || 120;
        state.goals.weekly = parseInt(document.getElementById('weeklyGoal').value) || 840;
        state.goals.monthly = parseInt(document.getElementById('monthlyGoal').value) || 3600;
        saveState();
        updateStats();
        closeModal();
      }},
      { text: 'İptal', class: 'btn-gray', action: 'closeModal' }
    ]
  );
}

function addNote(activityId) {
  const activity = ACTIVITIES.find(a => a.id === activityId);
  const currentNote = state.notes[activityId] || '';
  
  showModal(
    `📝 Not: ${activity.title}`,
    `
      <div class="form-group">
        <label class="form-label">Notunuz</label>
        <textarea class="form-textarea" id="noteInput" rows="6">${currentNote}</textarea>
      </div>
    `,
    [
      { text: 'Kaydet', class: 'btn-gradient', action: () => {
        state.notes[activityId] = document.getElementById('noteInput').value;
        saveState();
        closeModal();
        alert('✅ Not kaydedildi!');
      }},
      { text: 'İptal', class: 'btn-gray', action: 'closeModal' }
    ]
  );
}

// Modal
function showModal(title, content, buttons) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'activeModal';
  
  let buttonsHtml = '';
  buttons.forEach(btn => {
    buttonsHtml += `
      <button class="btn-full ${btn.class}" onclick="${typeof btn.action === 'function' ? 'window._modalAction()' : btn.action + '()'}">
        ${btn.text}
      </button>
    `;
    
    if (typeof btn.action === 'function') {
      window._modalAction = btn.action;
    }
  });
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="close-btn" onclick="closeModal()">✕</button>
      </div>
      ${content}
      <div class="modal-actions">
        ${buttonsHtml}
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').appendChild(modal);
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function closeModal() {
  const modal = document.getElementById('activeModal');
  if (modal) {
    modal.remove();
  }
  window._modalAction = null;
}

// Dark mode toggle
function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  // For now just alert, could implement actual theme switch
  alert('Tema değiştirme özelliği yakında eklenecek!');
}

// Init on load
window.addEventListener('load', init);
