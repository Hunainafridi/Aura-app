// Aura Internationalization (i18n) & Bidirectional RTL Engine

export const translations = {
  en: {
    brand: 'AURA',
    welcome: 'Welcome',
    sanctuary: 'Sanctuary Active',
    vault: 'Vault',
    journal: 'Journal',
    breathwave: 'Breathwave',
    insights: 'Insights',
    thoughtPurge: 'Thought Purge',
    timeLockVault: 'Time-Lock Vault',
    typeBurden: 'Type what weighs on you... (Dissolves permanently)',
    typeLocked: 'Type thoughts requiring delayed attention tomorrow morning...',
    dissolveButton: 'Dissolve & Let Go',
    lockButton: 'Seal in Time-Lock Vault',
    clarityIndex: 'Clarity Index',
    dissolved: 'Dissolved',
    burdensCleared: 'burdens released',
    frequenciesTitle: 'Frequencies of Weight',
    morningDeliberation: 'The Morning Deliberation Phase',
    optionB: 'Option B: "This no longer matters. Purge immediately without viewing."',
    optionA: 'Option A: "I am ready to review this with a clear mind."',
    emergencyTitle: 'Emergency Crisis Directory',
    emergencyDisclaimer: 'Aura is a digital mindfulness tool, not a diagnostic medical device for psychiatric crises.',
    shredTitle: 'GDPR Right to Be Forgotten',
    shredButton: 'Cryptographic Shred All Data',
    gad7Title: 'Clinical Micro-Check-in (PHQ-4 / GAD-7)'
  },
  ar: {
    brand: 'أورا',
    welcome: 'مرحباً',
    sanctuary: 'الملاذ نشط',
    vault: 'الخزينة',
    journal: 'اليوميات',
    breathwave: 'موجة التنفس',
    insights: 'البصائر',
    thoughtPurge: 'تطهير الأفكار',
    timeLockVault: 'خزينة القفل الزمني',
    typeBurden: 'اكتب ما يثقل كاهلك... (يذوب نهائياً)',
    typeLocked: 'اكتب أفكاراً تحتاج إلى اهتمام صباح الغد...',
    dissolveButton: 'أذب ودع الأمر يرحل',
    lockButton: 'أحكم القفل في الخزينة',
    clarityIndex: 'مؤشر الوضوح',
    dissolved: 'تمت إذابته',
    burdensCleared: 'أعباء تم تحريرها',
    frequenciesTitle: 'ترددات الثقل',
    morningDeliberation: 'مرحلة التداول الصباحي',
    optionB: 'الخيار ب: "لم يعد هذا مهماً. احذف فوراً دون قراءة."',
    optionA: 'الخيار أ: "أنا مستعد لمراجعة هذا بذهن صافٍ."',
    emergencyTitle: 'دليل خطوط الطوارئ الدولية',
    emergencyDisclaimer: 'أورا أداة للتنفس واليقظة الذهنية وليست جهازاً تشخيصياً طبياً للطوارئ النفسية.',
    shredTitle: 'حق النسيان (GDPR)',
    shredButton: 'تمزيق وتدمير كافة البيانات تشفيرياً',
    gad7Title: 'التقييم السريري المصغر'
  },
  de: {
    brand: 'AURA',
    welcome: 'Willkommen',
    sanctuary: 'Zufluchtsort Aktiv',
    vault: 'Tresor',
    journal: 'Tagebuch',
    breathwave: 'Atemwelle',
    insights: 'Einblicke',
    thoughtPurge: 'Gedankenbereinigung',
    timeLockVault: 'Zeitschloss-Tresor',
    typeBurden: 'Schreiben Sie, was Sie belastet... (Löst sich auf)',
    typeLocked: 'Schreiben Sie Gedanken auf, die morgen Beachtung erfordern...',
    dissolveButton: 'Auflösen & Loslassen',
    lockButton: 'Im Zeitschloss-Tresor versiegeln',
    clarityIndex: 'Klarheitsindex',
    dissolved: 'Aufgelöst',
    burdensCleared: 'Belastungen befreit',
    frequenciesTitle: 'Schwerefrequenzen',
    morningDeliberation: 'Morgendliche Überlegungsphase',
    optionB: 'Option B: "Das spielt keine Rolle mehr. Sofort ungelesen löschen."',
    optionA: 'Option A: "Ich bin bereit, dies mit klarem Verstand zu prüfen."',
    emergencyTitle: 'Notfall-Krisenverzeichnis',
    emergencyDisclaimer: 'Aura ist ein digitales Achtsamkeitswerkzeug, kein medizinisches Diagnosegerät.',
    shredTitle: 'DSGVO Recht auf Vergessenwerden',
    shredButton: 'Alle Daten kryptografisch vernichten',
    gad7Title: 'Klinischer Kurz-Check (GAD-7)'
  },
  ja: {
    brand: 'オーラ',
    welcome: 'ようこそ',
    sanctuary: 'サンクチュアリ有効',
    vault: '保管庫',
    journal: '記録',
    breathwave: '呼吸波',
    insights: '洞察',
    thoughtPurge: '思考の浄化',
    timeLockVault: 'タイムロック保管庫',
    typeBurden: '心に重くのしかかることを入力してください...',
    typeLocked: '明朝まで延期したい思考を入力してください...',
    dissolveButton: '消去して手放す',
    lockButton: 'タイムロックに封印する',
    clarityIndex: '明晰度指数',
    dissolved: '解放済み',
    burdensCleared: '解放された重荷',
    frequenciesTitle: '思考の周波数',
    morningDeliberation: '朝の検討フェーズ',
    optionB: '選択肢B：「もう重要ではありません。読まずに即座に消去」',
    optionA: '選択肢A：「澄んだ心でこれを確認する準備ができました」',
    emergencyTitle: '国際緊急ホットライン相談窓口',
    emergencyDisclaimer: 'オーラはメンタルヘルスツールであり、精神疾患の診断機器ではありません。',
    shredTitle: 'GDPR 忘れられる権利',
    shredButton: '全データを暗号学的に完全抹消',
    gad7Title: '臨床簡易評価 (GAD-7)'
  }
};

const LANG_KEY = 'aura_language_v1';

export function getLanguage() {
  return localStorage.getItem(LANG_KEY) || 'en';
}

export function setLanguage(lang) {
  localStorage.setItem(LANG_KEY, lang);
  if (typeof document !== 'undefined') {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }
}

export function t(key) {
  const lang = getLanguage();
  return translations[lang]?.[key] || translations['en'][key] || key;
}
