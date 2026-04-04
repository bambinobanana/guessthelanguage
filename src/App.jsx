import { useState, useEffect, useRef } from "react";

// ── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  ocean:   "#42708C",  // primary interactive
  oceanDk: "#2F5470",  // hover/active
  sky:     "#7EADBF",  // accent
  earth:   "#8C6746",  // partial score
  coral:   "#F25A38",  // CTA / wrong
  coralDk: "#D44828",  // coral hover
  fog:     "#EAEAEA",  // surface
  fogDk:   "#D8D8D4",  // surface hover
  white:   "#FFFFFF",
  dark:    "#1A1A18",  // body text (not pure black)
  mid:     "#4A4A47",  // secondary text (≥4.5:1 on white)
  muted:   "#6B6B68",  // tertiary text (≥4.5:1 on white)
  border:  "#C4C4C0",  // UI borders (≥3:1 on white)
  success: "#2D7A4F",  // correct
  error:   "#B83030",  // wrong
};

const REDUCED = typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TRANSITION = REDUCED ? "none" : "all 0.2s ease";
const ANIM_DUR   = REDUCED ? "0.01ms" : null;

// ── LANGUAGE DATA ─────────────────────────────────────────────────────────
const FAMILY_COLOR = {
  "Romance":"#C8402A","Germanic":"#2A6080","Slavic":"#3A5F8A","Semitic":"#7A5230",
  "Sino-Tibetan":"#8A4A30","Japonic":"#7A5020","Koreanic":"#2A7A6A","Austroasiatic":"#2A6A5A",
  "Kra-Dai":"#3A7A8A","Indo-Iranian":"#7A6030","Turkic":"#6A5020","Niger-Congo (Bantu)":"#3A6A30",
  "Niger-Congo":"#3A6A30","Austronesian":"#2A6A8A","Hellenic":"#4A4A8A","Uralic":"#4A6A7A",
  "Kartvelian":"#7A3A5A","Mongolic":"#5A5030","Hmong-Mien":"#6A3A7A","Quechuan":"#7A6020",
  "Mayan":"#2A6A5A","Na-Dene":"#5A4030","Dravidian":"#7A3A30","Uto-Aztecan":"#6A5020",
  "Tupian":"#3A6A30","Afro-Asiatic":"#7A6030","Afro-Asiatic (Chadic)":"#7A6030",
  "Afro-Asiatic (Cushitic)":"#7A6030","Tibeto-Burman":"#4A3A7A",
  "Indo-European (isolate)":"#5A3A7A","Celtic":"#2A4A6A","Baltic":"#2A6A6A",
  "Language isolate":"#5A5A30","Aymaran":"#7A6020","Araucanian":"#3A6A30",
  "Algonquian":"#3A4A7A","Iroquoian":"#5A2A7A","Eskimo-Aleut":"#2A5A8A",
  "Northeast Caucasian":"#7A3A20","Northwest Caucasian":"#6A2A4A",
  "English Creole":"#4A6A20",
};

const LANG_FLAGS = {
  "French":"🇫🇷","Spanish":"🇪🇸","Portuguese":"🇧🇷","Italian":"🇮🇹","Romanian":"🇷🇴",
  "German":"🇩🇪","Dutch":"🇳🇱","Swedish":"🇸🇪","Norwegian":"🇳🇴","Russian":"🇷🇺",
  "Ukrainian":"🇺🇦","Bulgarian":"🇧🇬","Serbian":"🇷🇸","Mongolian":"🇲🇳","Arabic":"🇸🇦",
  "Persian (Farsi)":"🇮🇷","Urdu":"🇵🇰","Hebrew":"🇮🇱","Amharic":"🇪🇹","Mandarin Chinese":"🇨🇳",
  "Cantonese":"🇭🇰","Japanese":"🇯🇵","Korean":"🇰🇷","Vietnamese":"🇻🇳","Thai":"🇹🇭",
  "Khmer":"🇰🇭","Myanmar (Burmese)":"🇲🇲","Hindi":"🇮🇳","Nepali":"🇳🇵","Bengali":"🇧🇩",
  "Tamil":"🇱🇰","Kannada":"🇮🇳","Telugu":"🇮🇳","Turkish":"🇹🇷","Swahili":"🇰🇪",
  "Yoruba":"🇳🇬","Zulu":"🇿🇦","Greek":"🇬🇷","Georgian":"🇬🇪","Armenian":"🇦🇲",
  "Finnish":"🇫🇮","Hungarian":"🇭🇺","Hmong":"🌏","Quechua":"🇵🇪","Nahuatl":"🇲🇽",
  "Guarani":"🇵🇾","Maya (Yucatec)":"🇲🇽","Navajo":"🇺🇸","Hawaiian":"🇺🇸","Māori":"🇳🇿",
  "Tibetan":"🏔️","Wolof":"🇸🇳","Tigrinya":"🇪🇷","Tetum":"🇹🇱","Catalan":"🏳️",
  "Galician":"🏴","Basque":"🏴","Welsh":"🏴","Irish":"🇮🇪","Scottish Gaelic":"🏴",
  "Breton":"🏳️","Maltese":"🇲🇹","Albanian":"🇦🇱","Macedonian":"🇲🇰","Slovenian":"🇸🇮",
  "Croatian":"🇭🇷","Slovak":"🇸🇰","Lithuanian":"🇱🇹","Latvian":"🇱🇻","Estonian":"🇪🇪",
  "Belarusian":"🇧🇾","Luxembourgish":"🇱🇺","Faroese":"🇫🇴","Icelandic":"🇮🇸",
  "Afrikaans":"🇿🇦","Occitan":"🏳️","Azerbaijani":"🇦🇿","Uzbek":"🇺🇿","Kazakh":"🇰🇿",
  "Kyrgyz":"🇰🇬","Tajik":"🇹🇯","Pashto":"🇦🇫","Sinhala":"🇱🇰","Lao":"🇱🇦",
  "Tagalog":"🇵🇭","Malay":"🇲🇾","Javanese":"🇮🇩","Uyghur":"🌏","Marathi":"🇮🇳",
  "Gujarati":"🇮🇳","Punjabi":"🇮🇳","Odia":"🇮🇳","Dzongkha":"🇧🇹","Hausa":"🇳🇬",
  "Igbo":"🇳🇬","Somali":"🇸🇴","Oromo":"🇪🇹","Lingala":"🇨🇩","Xhosa":"🇿🇦",
  "Shona":"🇿🇼","Fula":"🌍","Sundanese":"🇮🇩","Cebuano":"🇵🇭","Turkmen":"🇹🇲",
  "Sindhi":"🇵🇰","Assamese":"🇮🇳","Maithili":"🇮🇳","Balochi":"🇵🇰","Santali":"🇮🇳",
  "Shan":"🇲🇲","Buryat":"🇷🇺","Tok Pisin":"🇵🇬","Sardinian":"🇮🇹","Corsican":"🇫🇷",
  "Romani":"🌍","Chechen":"🇷🇺","Abkhazian":"🌍","Aymara":"🇧🇴","Mapuche":"🇨🇱",
  "Ojibwe":"🇨🇦","Cherokee":"🇺🇸","Inuktitut":"🇨🇦","Polish":"🇵🇱","Czech":"🇨🇿",
  "Indonesian":"🇮🇩",
};

const CONGRATS = [
  "Nailed it!","You legend!","Spot on!","Impressive!","Brilliant!",
  "Outstanding!","Sharp eye!","Polyglot vibes!","That's the one!","Unstoppable!",
];

// difficulty bucket for each language (for mixed mode selection)
const EASY_NAMES = new Set([
  "Mandarin Chinese","Spanish","Hindi","Arabic","Bengali","Portuguese","Russian",
  "Indonesian","Swahili","German","Japanese","Punjabi","Marathi","Telugu","Turkish",
  "Tamil","Cantonese","Vietnamese","Korean","Javanese","Italian","Hausa","Thai",
  "Pashto","Kannada","Gujarati","Tagalog","Malay","Yoruba","Urdu","French",
  "Amharic","Polish",
]);
const HARD_NAMES = new Set([
  "Basque","Welsh","Irish","Scottish Gaelic","Breton","Occitan","Corsican",
  "Sardinian","Faroese","Romani","Chechen","Abkhazian","Tigrinya","Wolof",
  "Xhosa","Shona","Buryat","Dzongkha","Santali","Shan","Balochi","Hmong",
  "Tetum","Aymara","Mapuche","Ojibwe","Cherokee","Inuktitut","Quechua",
  "Nahuatl","Guarani","Maya (Yucatec)","Navajo","Hawaiian","Maori","Tibetan",
]);
// everything else = medium

const LANGUAGES = [
  { name:"French", family:"Romance", region:"Europe", script:"Latin", speakers:"~310M",
    tip:"Look for accented vowels like e-acute, e-grave, e-circumflex and the cedilla c. The combination eau and frequent apostrophes are very French.",
    confusables:["Italian","Spanish","Portuguese","Romanian","Catalan"],
    quotes:[{s:"La seule façon de faire du bon travail est d'aimer ce que vous faites.",t:"The only way to do great work is to love what you do."},{s:"Soyez le changement que vous voulez voir dans le monde.",t:"Be the change you wish to see in the world."}]},
  { name:"Spanish", family:"Romance", region:"Europe / Americas", script:"Latin", speakers:"~500M",
    tip:"Spot the inverted question mark and exclamation mark at sentence starts. The letter n-tilde and ll or rr combinations are distinctively Spanish.",
    confusables:["Portuguese","Italian","French","Romanian","Catalan"],
    quotes:[{s:"No importa cuán lento vayas, siempre y cuando no te detengas.",t:"It does not matter how slowly you go as long as you do not stop."},{s:"Dime con quién andas y te diré quién eres.",t:"Tell me who you walk with and I will tell you who you are."}]},
  { name:"Portuguese", family:"Romance", region:"Europe / Americas", script:"Latin", speakers:"~260M",
    tip:"Look for unique nasal vowels with tilde and words ending in -ao and -cao. The letters lh and nh are distinctive.",
    confusables:["Spanish","Italian","French","Romanian","Galician"],
    quotes:[{s:"Quem não arrisca não petisca.",t:"Nothing ventured, nothing gained."},{s:"A sabedoria começa com o silêncio.",t:"Wisdom begins with silence."}]},
  { name:"Italian", family:"Romance", region:"Europe", script:"Latin", speakers:"~67M",
    tip:"Italian loves double consonants like ll, tt, cc and words ending in vowels. Look for -zione and -mente endings.",
    confusables:["Spanish","Portuguese","French","Romanian"],
    quotes:[{s:"La vita è bella quando hai qualcuno con cui condividerla.",t:"Life is beautiful when you have someone to share it with."},{s:"Tutto è bene quel che finisce bene.",t:"All is well that ends well."}]},
  { name:"Romanian", family:"Romance", region:"Europe", script:"Latin", speakers:"~24M",
    tip:"Romanian is unique among Romance languages for letters ă, â, î, ș, ț. It looks vaguely Italian but has Slavic-influenced spellings.",
    confusables:["Italian","Spanish","Portuguese","French"],
    quotes:[{s:"Omul sfințește locul, nu locul pe om.",t:"The person sanctifies the place, not the place the person."},{s:"Graba strică treaba.",t:"Haste makes waste."}]},
  { name:"Catalan", family:"Romance", region:"Europe", script:"Latin", speakers:"~10M",
    tip:"Catalan looks like a blend of Spanish and French. Key giveaways: the midpoint dot · in words like col·legi, endings like -ció and -ment. No ñ unlike Spanish.",
    confusables:["Spanish","Portuguese","French","Italian","Occitan"],
    quotes:[{s:"Qui no s'arrisca, no pisca.",t:"Nothing ventured, nothing gained."},{s:"Val més tard que mai.",t:"Better late than never."}]},
  { name:"Galician", family:"Romance", region:"Europe", script:"Latin", speakers:"~2.4M",
    tip:"Galician looks very close to Portuguese with nh and lh digraphs. Unlike Spanish there is no ñ. Confusable with both Spanish and Portuguese.",
    confusables:["Portuguese","Spanish","Catalan","Italian","Occitan"],
    quotes:[{s:"Quen non arrisca, non gaña.",t:"He who does not risk, does not gain."},{s:"A lingua é a alma do pobo.",t:"Language is the soul of the people."}]},
  { name:"Occitan", family:"Romance", region:"Europe", script:"Latin", speakers:"~200K",
    tip:"Occitan looks like a blend of French, Spanish, and Catalan. Look for words ending in -oc and -al. Often confused with Catalan.",
    confusables:["Catalan","French","Spanish","Italian","Galician"],
    quotes:[{s:"La lenga es l'ama del poble.",t:"Language is the soul of the people."},{s:"Qui cerca, trapa.",t:"He who seeks, finds."}]},
  { name:"Sardinian", family:"Romance", region:"Europe", script:"Latin", speakers:"~1M",
    tip:"Sardinian is the closest living language to Latin. Look for the -u ending on masculine words instead of Italian -o. The letters k and z sounds written as ch and tz.",
    confusables:["Italian","Corsican","Catalan","Spanish"],
    quotes:[{s:"Sa limba est s'anima de su populu.",t:"Language is the soul of the people."},{s:"Chie cercat troat.",t:"He who seeks, finds."}]},
  { name:"Corsican", family:"Romance", region:"Europe", script:"Latin", speakers:"~150K",
    tip:"Corsican looks like a mix of Italian and Sardinian. Look for double consonants and words ending in -u instead of Italian -o. The -ghju and -cciu endings are distinctively Corsican.",
    confusables:["Italian","Sardinian","Catalan","Spanish"],
    quotes:[{s:"A lingua e l'anima di un populu.",t:"Language is the soul of a people."},{s:"Chi cerca trova.",t:"He who seeks, finds."}]},
  { name:"German", family:"Germanic", region:"Europe", script:"Latin", speakers:"~135M",
    tip:"German capitalizes ALL nouns. Look for long compound words, umlauts a-umlaut, o-umlaut, u-umlaut and the sharp letter eszett.",
    confusables:["Dutch","Swedish","Norwegian","Danish","Luxembourgish"],
    quotes:[{s:"Der Mensch wächst mit seinen Aufgaben.",t:"A person grows with their tasks."},{s:"Übung macht den Meister.",t:"Practice makes perfect."}]},
  { name:"Dutch", family:"Germanic", region:"Europe", script:"Latin", speakers:"~25M",
    tip:"Dutch has distinctive double vowels like aa, ee, oo and the unique ij digraph. Look for de, het, een and the sch combination.",
    confusables:["German","Afrikaans","Swedish","Norwegian","Danish"],
    quotes:[{s:"Wie niet waagt, die niet wint.",t:"Who dares not, wins not."},{s:"Oost west, thuis best.",t:"East or west, home is best."}]},
  { name:"Swedish", family:"Germanic", region:"Europe", script:"Latin", speakers:"~13M",
    tip:"Swedish has three extra letters: a-ring, a-umlaut, o-umlaut. Distinctive words include och meaning and and att meaning to.",
    confusables:["Norwegian","Danish","Dutch","German","Finnish"],
    quotes:[{s:"Det är inte hur långt du faller, utan hur högt du studsar.",t:"It is not how far you fall, but how high you bounce."}]},
  { name:"Norwegian", family:"Germanic", region:"Europe", script:"Latin", speakers:"~5M",
    tip:"Norwegian shares a-ring, ae, o-slash with Danish. Very similar to Swedish. Look for words ending in -ig and -lig.",
    confusables:["Swedish","Danish","Dutch","German","Faroese"],
    quotes:[{s:"Det er ikke fjellene foran deg som sliter deg ut, men steinen i skoen din.",t:"It is not the mountains ahead that wear you out, but the pebble in your shoe."},{s:"Veien blir til mens du går.",t:"The road is made by walking."}]},
  { name:"Icelandic", family:"Germanic", region:"Europe", script:"Latin", speakers:"~370K",
    tip:"Icelandic uniquely preserves eth and thorn from Old Norse. Look for the thorn letter at word starts and eth in the middle of words.",
    confusables:["Faroese","Norwegian","Danish","Swedish"],
    quotes:[{s:"Þolinmæði er móðir allra dyggða.",t:"Patience is the mother of all virtues."}]},
  { name:"Faroese", family:"Germanic", region:"Europe", script:"Latin", speakers:"~72K",
    tip:"Faroese looks like Icelandic with some Norwegian influence. Uses eth and the letters a-acute, ae, o-slash. The combination hv pronounced kv is distinctive.",
    confusables:["Icelandic","Norwegian","Danish","Swedish"],
    quotes:[{s:"Tað sum ikki drepur, harðar.",t:"What does not kill you makes you stronger."}]},
  { name:"Luxembourgish", family:"Germanic", region:"Europe", script:"Latin", speakers:"~390K",
    tip:"Luxembourgish looks like German but with French loanwords. Words like Ech meaning I and ass meaning is are giveaways.",
    confusables:["German","Dutch","French","Afrikaans"],
    quotes:[{s:"Wann een net probéiert, kann een net gewannen.",t:"If one does not try, one cannot win."}]},
  { name:"Afrikaans", family:"Germanic", region:"Africa / Europe origin", script:"Latin", speakers:"~7M",
    tip:"Afrikaans looks like simplified Dutch. Words like die meaning the, is, nie meaning not and van appear very frequently. The double negative nie...nie is unique.",
    confusables:["Dutch","German","Flemish"],
    quotes:[{s:"Sonder taal, sonder siel.",t:"Without language, without soul."},{s:"Geduld is 'n deug.",t:"Patience is a virtue."}]},
  { name:"Russian", family:"Slavic", region:"Europe / Asia", script:"Cyrillic", speakers:"~258M",
    tip:"Russian Cyrillic has unique letters Zh, Shch, hard sign, Yeru, E-reverse. Look for the hard sign and the letter Yeru which are unique to Russian.",
    confusables:["Ukrainian","Bulgarian","Serbian","Macedonian","Mongolian"],
    quotes:[{s:"Не тот велик, кто никогда не падал, а тот велик, кто падал и вставал.",t:"Not the one who never fell is great, but the one who fell and rose again."},{s:"Терпение и труд всё перетрут.",t:"Patience and hard work will overcome everything."}]},
  { name:"Ukrainian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~40M",
    tip:"Ukrainian has unique letters I-dotted, Yi, Ye, and hard G not found in Russian. It also lacks the Russian hard sign and Yeru.",
    confusables:["Russian","Bulgarian","Serbian","Macedonian","Belarusian"],
    quotes:[{s:"Де є воля, там є і шлях.",t:"Where there is a will, there is a way."},{s:"Хто рано встає, тому Бог дає.",t:"God gives to those who rise early."}]},
  { name:"Bulgarian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~8M",
    tip:"Bulgarian Cyrillic looks similar to Russian but uses the hard sign frequently as a vowel. It has no Yeru, Yo, or E-reverse like Russian.",
    confusables:["Russian","Ukrainian","Macedonian","Serbian","Mongolian"],
    quotes:[{s:"Търпението е горчиво, но плодовете му са сладки.",t:"Patience is bitter, but its fruits are sweet."}]},
  { name:"Serbian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~12M",
    tip:"Serbian Cyrillic includes Lj, Nj, Dzh letters not in Russian or Ukrainian. These represent sounds lj, nj, dz unique to South Slavic languages.",
    confusables:["Russian","Bulgarian","Ukrainian","Macedonian","Mongolian"],
    quotes:[{s:"Ко рано рани, две среће граби.",t:"He who rises early catches two fortunes."}]},
  { name:"Macedonian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~2M",
    tip:"Macedonian Cyrillic is very close to Bulgarian and Serbian. Unique letters include soft-G and soft-K not found in Russian or Ukrainian.",
    confusables:["Bulgarian","Serbian","Russian","Ukrainian"],
    quotes:[{s:"Трпениe носи среќа.",t:"Patience brings happiness."},{s:"Знаењето е моќ.",t:"Knowledge is power."}]},
  { name:"Belarusian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~5M",
    tip:"Belarusian Cyrillic has the unique letter short-U which looks like a u with a breve above it. This letter appears in no other Cyrillic alphabet.",
    confusables:["Russian","Ukrainian","Bulgarian","Macedonian"],
    quotes:[{s:"Хто шукае, той знаходзіць.",t:"He who seeks, finds."}]},
  { name:"Slovenian", family:"Slavic", region:"Europe", script:"Latin", speakers:"~2.5M",
    tip:"Slovenian uses Latin with č, š, ž. It has a unique dual grammatical number (separate forms for exactly two of something). Look for the word je meaning is and frequent -ski, -ška endings.",
    confusables:["Croatian","Serbian","Czech","Slovak","Polish"],
    quotes:[{s:"Kdor išče, ta najde.",t:"He who seeks, finds."},{s:"Bolje vrabec v roki kot golob na strehi.",t:"Better a sparrow in the hand than a pigeon on the roof."}]},
  { name:"Croatian", family:"Slavic", region:"Europe", script:"Latin", speakers:"~5.5M",
    tip:"Croatian uses Latin with č, ć, š, ž, đ. The letters ć and đ distinguish it from Serbian. Look for the word nije meaning is not.",
    confusables:["Slovenian","Serbian","Slovak","Czech"],
    quotes:[{s:"Bolje spriječiti nego liječiti.",t:"Better to prevent than to cure."},{s:"Tko traži, taj i nalazi.",t:"He who seeks, finds."}]},
  { name:"Slovak", family:"Slavic", region:"Europe", script:"Latin", speakers:"~5M",
    tip:"Slovak uses Latin with č, š, ž and uniquely the letter ľ (soft l) and syllabic consonants ŕ, ĺ. The háček and dĺžeň diacritics appear frequently.",
    confusables:["Czech","Slovenian","Polish","Croatian","Ukrainian"],
    quotes:[{s:"Kde je vôľa, tam je aj cesta.",t:"Where there is a will, there is a way."},{s:"Trpezlivosť ruže prináša.",t:"Patience brings roses."}]},
  { name:"Polish", family:"Slavic", region:"Europe", script:"Latin", speakers:"~45M",
    tip:"Polish uses Latin with many unique letters: ą, ć, ę, ł, ń, ó, ś, ź, ż. The ł pronounced like English w is a strong giveaway. Look for sz, cz, rz combinations.",
    confusables:["Czech","Slovak","Belarusian","Lithuanian","Ukrainian"],
    quotes:[{s:"Nie ma tego złego, co by na dobre nie wyszło.",t:"There is no evil that does not turn into something good."},{s:"Czas to pieniądz.",t:"Time is money."}]},
  { name:"Czech", family:"Slavic", region:"Europe", script:"Latin", speakers:"~11M",
    tip:"Czech uses Latin with č, ď, ě, ň, ř, š, ť, ž. The ř is a unique consonant not found in any other language — a rolled r with simultaneous zh sound.",
    confusables:["Slovak","Polish","Slovenian","Croatian"],
    quotes:[{s:"Kdo hledá, ten najde.",t:"He who seeks, finds."},{s:"Bez práce nejsou koláče.",t:"Without work there are no cakes."}]},
  { name:"Lithuanian", family:"Baltic", region:"Europe", script:"Latin", speakers:"~3M",
    tip:"Lithuanian is one of the oldest living Indo-European languages. Look for letters ą, č, ę, ė, į, š, ų, ū, ž. The double vowel ė and the nasal vowels ą, ę, į, ų are distinctive.",
    confusables:["Latvian","Estonian","Polish","Finnish"],
    quotes:[{s:"Kas ieško, tas randa.",t:"He who seeks, finds."},{s:"Geriau vėliau negu niekada.",t:"Better late than never."}]},
  { name:"Latvian", family:"Baltic", region:"Europe", script:"Latin", speakers:"~1.5M",
    tip:"Latvian uses macrons for long vowels: ā, ē, ī, ū and has č, ģ, ķ, ļ, ņ, š, ž. The cedilla variants ģ, ķ, ļ, ņ are unique to Latvian. Almost all nouns end in -s or -a.",
    confusables:["Lithuanian","Estonian","Finnish","Slovenian"],
    quotes:[{s:"Kas meklē, tas atrod.",t:"He who seeks, finds."},{s:"Valoda ir tautas dvēsele.",t:"Language is the soul of the nation."}]},
  { name:"Finnish", family:"Uralic", region:"Europe", script:"Latin", speakers:"~5M",
    tip:"Finnish has no articles, double vowels and consonants everywhere: aa, ee, ll, kk. The letters ä and ö are very common. Words like kyllä and ei are distinctively Finnish.",
    confusables:["Estonian","Hungarian","Turkish","Latvian"],
    quotes:[{s:"Ei se ole viisas, joka viisaasti ei puhu.",t:"It is not wise who does not speak wisely."},{s:"Työ tekijäänsä kiittää.",t:"Work praises its maker."}]},
  { name:"Hungarian", family:"Uralic", region:"Europe", script:"Latin", speakers:"~13M",
    tip:"Hungarian uses long vowels with double accents: á, é, í, ó, ő, ú, ű. The double-acute ő and ű are unique to Hungarian and found in no other language.",
    confusables:["Finnish","Estonian","Turkish","Romanian","Czech"],
    quotes:[{s:"Aki mer, az nyer.",t:"He who dares, wins."},{s:"Lassan járj, tovább érsz.",t:"Go slowly, you will get further."}]},
  { name:"Estonian", family:"Uralic", region:"Europe", script:"Latin", speakers:"~1.1M",
    tip:"Estonian is related to Finnish, not to Latvian or Lithuanian. Look for the unique letter õ, and ä, ö, ü. Estonian has three vowel lengths and very long compound words.",
    confusables:["Finnish","Latvian","Lithuanian","Hungarian"],
    quotes:[{s:"Kus viga näed laita, seal täida ise.",t:"Where you see a fault, fix it yourself."},{s:"Töö kiidab tegijat.",t:"Work praises its maker."}]},
  { name:"Welsh", family:"Celtic", region:"Europe", script:"Latin", speakers:"~880K",
    tip:"Welsh uses Latin but with striking consonant clusters: dd like th, ll a voiceless lateral, rh, ch, ng. Words like dw i and mae are distinctively Welsh.",
    confusables:["Breton","Irish","Scottish Gaelic"],
    quotes:[{s:"Nid aur yw popeth melyn.",t:"All that glitters is not gold."},{s:"Heb iaith, heb galon.",t:"Without language, without heart."},{s:"Dyfal donc a dyr y garreg.",t:"Persistent tapping breaks the stone."}]},
  { name:"Irish", family:"Celtic", region:"Europe", script:"Latin", speakers:"~1.8M",
    tip:"Irish uses Latin but words change their first letter in mutations: bean becomes mbean or bhean. The combination mh and bh are pronounced v. Very unusual spelling-to-sound relationship.",
    confusables:["Welsh","Scottish Gaelic","Breton"],
    quotes:[{s:"Is fearr Gaeilge bhriste ná Béarla cliste.",t:"Broken Irish is better than clever English."},{s:"Ní neart go cur le chéile.",t:"There is no strength without unity."}]},
  { name:"Scottish Gaelic", family:"Celtic", region:"Europe", script:"Latin", speakers:"~57K",
    tip:"Scottish Gaelic looks like Irish but uses grave accents only. Look for tha meaning is which appears constantly, and apostrophes for contractions.",
    confusables:["Irish","Welsh","Breton"],
    quotes:[{s:"Is treasa tuath na tighearna.",t:"The people are stronger than a lord."},{s:"Buannaichidh foighidinn.",t:"Patience will prevail."}]},
  { name:"Breton", family:"Celtic", region:"Europe", script:"Latin", speakers:"~210K",
    tip:"Breton is a Celtic language of northwest France. Look for ch, and frequent z and v. Words often end in consonants unlike French. Resembles Welsh more than French.",
    confusables:["Welsh","Irish","French"],
    quotes:[{s:"Ar pezh a vez kavet en douar a vez kavet er galon.",t:"What is found in the earth is found in the heart."}]},
  { name:"Greek", family:"Hellenic", region:"Europe", script:"Greek", speakers:"~13M",
    tip:"Greek uses its own alphabet with letters like alpha, beta, gamma, theta, lambda, phi, psi, omega. Some look like Latin but theta, xi, psi, omega are uniquely Greek.",
    confusables:["Armenian","Georgian","Hebrew","Coptic"],
    quotes:[{s:"Η αρχή είναι το ήμισυ του παντός.",t:"The beginning is half of everything."},{s:"Γνώθι σαυτόν.",t:"Know thyself."}]},
  { name:"Albanian", family:"Indo-European (isolate)", region:"Europe", script:"Latin", speakers:"~7.5M",
    tip:"Albanian is a language isolate in Indo-European. Look for the letter ë (schwa) and digraphs dh, gj, ll, nj, rr, sh, th, xh, zh. Many two-letter combinations unique to Albanian.",
    confusables:["Romanian","Serbian","Macedonian","Croatian","Bulgarian"],
    quotes:[{s:"Ku ka dashuri, ka jetë.",t:"Where there is love, there is life."},{s:"Dija është fuqia më e madhe.",t:"Knowledge is the greatest power."}]},
  { name:"Maltese", family:"Semitic", region:"Europe", script:"Latin", speakers:"~520K",
    tip:"Maltese is the only Semitic language written in Latin script. It has Arabic roots but heavy Italian and English influence. Look for the unique letters gh with bar, h with bar, and c with dot.",
    confusables:["Arabic","Italian","Hebrew","Catalan"],
    quotes:[{s:"Min jithabbat, jirbah.",t:"He who strives, wins."},{s:"Il-kelma tajba tiftah il-bibien kollha.",t:"A good word opens all doors."}]},
  { name:"Basque", family:"Language isolate", region:"Europe", script:"Latin", speakers:"~750K",
    tip:"Basque is a language isolate completely unrelated to any other language. Look for the letter combination tx pronounced ch, tz, ts, and frequent use of k and z.",
    confusables:["Spanish","Catalan","Galician","French"],
    quotes:[{s:"Nork bere burua ezagutzen duena, jakintsu da.",t:"He who knows himself is wise."},{s:"Lan egiten duenak, irabazten du.",t:"He who works, earns."}]},
  { name:"Georgian", family:"Kartvelian", region:"Caucasus", script:"Georgian", speakers:"~4M",
    tip:"Georgian script is one of the most distinctive in the world. Round asymmetric letters with curving arms, no capital letters. Looks almost like decorated spirals.",
    confusables:["Armenian","Amharic","Tigrinya","Greek","Hebrew"],
    quotes:[{s:"ენა კაცს ჰქავს მხოლოდ, გუა კი ბატონდ.",t:"The tongue is man's servant, but wisdom is his master."},{s:"ვარდი ეკლის გარეშე არ მოდის.",t:"A rose does not come without thorns."}]},
  { name:"Armenian", family:"Indo-European (isolate)", region:"Caucasus", script:"Armenian", speakers:"~8M",
    tip:"Armenian has its own unique alphabet invented in 405 AD. Letters have a medieval angular quality with distinctive shapes. Nothing like Greek or Georgian.",
    confusables:["Georgian","Greek","Amharic","Hebrew"],
    quotes:[{s:"Ժամանակ ոչ ոք չի կարո գնել.",t:"No one can buy time."}]},
  { name:"Romani", family:"Indo-Iranian", region:"Europe (diaspora)", script:"Latin", speakers:"~3.5M",
    tip:"Romani uses Latin but with Indo-Iranian roots making it look surprisingly different from European languages. Look for words like baro meaning big, miro meaning my.",
    confusables:["Romanian","Hindi","Sanskrit"],
    quotes:[{s:"Čačipen si baro zor.",t:"Truth is great strength."}]},
  { name:"Chechen", family:"Northeast Caucasian", region:"Caucasus", script:"Cyrillic", speakers:"~1.5M",
    tip:"Chechen uses Cyrillic with extra letters for ejective consonants and pharyngeal sounds not in Russian. Very different vocabulary from Russian despite using the same script.",
    confusables:["Russian","Ingush","Georgian","Armenian"],
    quotes:[{s:"Сабр бар хьекалан бух бу.",t:"Patience is the foundation of wisdom."}]},
  { name:"Abkhazian", family:"Northwest Caucasian", region:"Caucasus", script:"Cyrillic", speakers:"~190K",
    tip:"Abkhazian uses Cyrillic with many extra letters for its complex consonant inventory. Look for letters with multiple diacritics stacked on them. Very few vowels but many consonant clusters.",
    confusables:["Georgian","Chechen","Russian"],
    quotes:[{s:"Ашьара далырхо иаарыхо.",t:"He who seeks wisdom finds it."}]},
  { name:"Arabic", family:"Semitic", region:"Middle East / Africa", script:"Arabic", speakers:"~422M",
    tip:"Arabic is right-to-left with letters connecting cursively. Dots above and below letters are key. No short vowels are written in standard text.",
    confusables:["Persian (Farsi)","Urdu","Pashto","Uyghur"],
    quotes:[{s:"من لم يعرف كيف يقف على المرتفعات لم يعش.",t:"He who has not learned to stand on the heights has not truly lived."},{s:"العلم في الصغر كالنقش على الحجر.",t:"Learning in youth is like engraving on stone."}]},
  { name:"Persian (Farsi)", family:"Indo-Iranian", region:"Middle East", script:"Perso-Arabic", speakers:"~110M",
    tip:"Persian uses Arabic script but has 4 extra letters for sounds not in Arabic. It looks rounder and more flowing than Arabic.",
    confusables:["Arabic","Urdu","Pashto","Dari"],
    quotes:[{s:"هر که طاووس خواهد جور هندوستان کشد.",t:"Whoever wants the peacock must endure the thorns of Hindustan."},{s:"قطره قطره جمع گردد وانگهی دریا شود.",t:"Drop by drop gathers and then becomes a sea."}]},
  { name:"Urdu", family:"Indo-Iranian", region:"South Asia", script:"Perso-Arabic", speakers:"~230M",
    tip:"Urdu looks like Persian and Arabic but has unique letters for retroflex sounds specific to South Asia. Written right-to-left like Arabic.",
    confusables:["Arabic","Persian (Farsi)","Pashto","Sindhi"],
    quotes:[{s:"ہر مشکل کے بعد آسانی ہے.",t:"After every hardship comes ease."},{s:"محنت کا پھل میٹھا ہوتا ہے.",t:"The fruit of hard work is sweet."}]},
  { name:"Pashto", family:"Indo-Iranian", region:"Central / South Asia", script:"Perso-Arabic", speakers:"~60M",
    tip:"Pashto uses a modified Perso-Arabic script with extra letters for sounds unique to Pashto. These special letters distinguish it from Arabic, Persian, and Urdu.",
    confusables:["Arabic","Persian (Farsi)","Urdu","Dari"],
    quotes:[{s:"صبر دے بڑیا لار دا.",t:"Patience is the path to victory."}]},
  { name:"Hebrew", family:"Semitic", region:"Middle East", script:"Hebrew", speakers:"~9M",
    tip:"Hebrew is right-to-left with a block-like 22-letter alphabet. Unlike Arabic it is not cursively connected. Look for the distinctive square letterforms.",
    confusables:["Arabic","Yiddish","Amharic","Maltese"],
    quotes:[{s:"אם תרצו אין זו אגדה.",t:"If you will it, it is no dream."},{s:"כל הדרכים ארוכות לאדם עייף.",t:"All roads are long to a tired person."}]},
  { name:"Amharic", family:"Semitic", region:"Africa", script:"Ethiopic", speakers:"~57M",
    tip:"Amharic uses the Ethiopic Ge'ez script with round circular characters unlike any other writing system. Each symbol is a consonant plus vowel syllable.",
    confusables:["Tigrinya","Hebrew","Georgian","Sinhala"],
    quotes:[{s:"ፍቅር ተራሮን ያንቀሳቅሳል.",t:"Love moves mountains."}]},
  { name:"Tigrinya", family:"Semitic", region:"Africa", script:"Ethiopic", speakers:"~9M",
    tip:"Tigrinya uses the same Ethiopic Ge'ez script as Amharic. Very hard to distinguish from Amharic visually. The vocabulary and specific character combinations differ.",
    confusables:["Amharic","Hebrew","Georgian","Armenian"],
    quotes:[{s:"ብትጽናዕ ዝኸበደ ሽግር ይሓልፍ.",t:"With patience even the heaviest hardship passes."}]},
  { name:"Mandarin Chinese", family:"Sino-Tibetan", region:"East Asia", script:"Chinese (Simplified)", speakers:"~1.1B",
    tip:"Simplified Chinese uses streamlined characters with fewer strokes. No spaces between words. Characters flow continuously.",
    confusables:["Cantonese","Japanese","Korean"],
    quotes:[{s:"千里之行，始于足下。",t:"A journey of a thousand miles begins with a single step."},{s:"己所不欲，勿施于人。",t:"Do not do to others what you do not want done to yourself."}]},
  { name:"Cantonese", family:"Sino-Tibetan", region:"East Asia", script:"Chinese (Traditional)", speakers:"~85M",
    tip:"Cantonese uses Traditional Chinese with more strokes than Simplified. Look for characters in traditional form with more complex stroke patterns.",
    confusables:["Mandarin Chinese","Japanese","Korean"],
    quotes:[{s:"路遙知馬力，日久見人心。",t:"Distance tests a horse's strength. Time reveals a person's heart."},{s:"天下無難事，只怕有心人。",t:"Nothing is difficult to a determined person."}]},
  { name:"Japanese", family:"Japonic", region:"East Asia", script:"Japanese", speakers:"~125M",
    tip:"Japanese mixes three scripts: Hiragana curved round letters, Katakana angular letters, and Kanji Chinese characters. The simultaneous mix of all three is uniquely Japanese.",
    confusables:["Mandarin Chinese","Cantonese","Korean"],
    quotes:[{s:"七転び八起き。",t:"Fall seven times, stand up eight."},{s:"継続は力なり。",t:"Continuity is power."},{s:"急がば回れ。",t:"More haste, less speed."}]},
  { name:"Korean", family:"Koreanic", region:"East Asia", script:"Korean", speakers:"~82M",
    tip:"Korean Hangul uses geometric blocks of circles and lines. Each block is a syllable combining consonants and vowels. The round letters are very distinctive.",
    confusables:["Japanese","Mandarin Chinese","Cantonese","Mongolian"],
    quotes:[{s:"시작이 반이다.",t:"Starting is half the battle."},{s:"세 살 버릇 여든까지 간다.",t:"Habits formed at three last until eighty."}]},
  { name:"Mongolian", family:"Mongolic", region:"East Asia", script:"Cyrillic", speakers:"~6M",
    tip:"Mongolian Cyrillic looks like Russian but uses letters not in standard Russian. Words are longer and vocabulary is completely unlike Slavic languages.",
    confusables:["Russian","Bulgarian","Ukrainian","Kazakh","Serbian"],
    quotes:[{s:"Эрдэм мэдлэг далай, тэвчээр онгоц.",t:"Knowledge is the ocean, patience is the boat."}]},
  { name:"Tibetan", family:"Tibeto-Burman", region:"Central Asia", script:"Tibetan", speakers:"~6M",
    tip:"Tibetan script has stacked letter clusters with consonants piled vertically and many silent prefix consonants. The stacking pattern makes it unlike any other script.",
    confusables:["Myanmar (Burmese)","Khmer","Mongolian","Georgian","Amharic"],
    quotes:[{s:"ཤེས་རབ་ནི་གཏེར་མཆོག་ཡིན།",t:"Wisdom is the supreme treasure."}]},
  { name:"Dzongkha", family:"Tibeto-Burman", region:"South Asia", script:"Tibetan", speakers:"~640K",
    tip:"Dzongkha is Bhutan's national language using the same Tibetan script. Indistinguishable from Tibetan visually for most people.",
    confusables:["Tibetan","Myanmar (Burmese)","Mongolian"],
    quotes:[{s:"ཤེས་ཡོན་ནི་ནོར་བུ་ལས་ཀྱང་རིན་ཐང་ཆེ།",t:"Knowledge is more precious than jewels."}]},
  { name:"Buryat", family:"Mongolic", region:"East Asia / Siberia", script:"Cyrillic", speakers:"~265K",
    tip:"Buryat uses Cyrillic with extra open-o and open-u vowels unique to Mongolian languages. It looks very similar to Mongolian Cyrillic. Vocabulary is Mongolian in origin.",
    confusables:["Mongolian","Russian","Kazakh","Kyrgyz"],
    quotes:[{s:"Эрдэм далай, тэнгэри хязаар.",t:"Knowledge is the ocean, the sky is the limit."}]},
  { name:"Vietnamese", family:"Austroasiatic", region:"Southeast Asia", script:"Latin (tonal)", speakers:"~96M",
    tip:"Vietnamese uses Latin with an extraordinary number of stacked diacritical marks. Tone marks pile up on letters like ộ, ẫ, ướ. No other Latin script language looks like this.",
    confusables:["Hmong","Thai","Tagalog","Malay","Indonesian"],
    quotes:[{s:"Có công mài sắt, có ngày nên kim.",t:"With enough perseverance iron can be ground into a needle."},{s:"Lời nói không mất tiền mua.",t:"Words cost nothing."}]},
  { name:"Thai", family:"Kra-Dai", region:"Southeast Asia", script:"Thai", speakers:"~61M",
    tip:"Thai has rounded characters with small circles and loops, no spaces between words, and vowels that appear above, below, or around consonants.",
    confusables:["Khmer","Lao","Myanmar (Burmese)","Kannada","Sinhala"],
    quotes:[{s:"ทางไกลเริ่มต้นด้วยก้าวแรก.",t:"A long road begins with the first step."}]},
  { name:"Lao", family:"Kra-Dai", region:"Southeast Asia", script:"Lao", speakers:"~7M",
    tip:"Lao script is very similar to Thai. Both have circular characters, no spaces between words, and stacked vowels. Lao letters are rounder and simpler than Thai.",
    confusables:["Thai","Khmer","Myanmar (Burmese)"],
    quotes:[{s:"ຄວາມອົດທົນຄືກຸນແຈສູ່ຄວາມສໍາເລັດ.",t:"Patience is the key to success."}]},
  { name:"Khmer", family:"Austroasiatic", region:"Southeast Asia", script:"Khmer", speakers:"~18M",
    tip:"Khmer has many circular and looping shapes like Thai but more angular and elaborate. Distinctive subscript consonant forms appear written below the main line.",
    confusables:["Thai","Myanmar (Burmese)","Kannada","Telugu","Sinhala"],
    quotes:[{s:"ដើរម្ដងមួយជំហានកូវដល់ផ្លូវ.",t:"Walk one step at a time and you will still arrive."}]},
  { name:"Myanmar (Burmese)", family:"Tibeto-Burman", region:"Southeast Asia", script:"Myanmar", speakers:"~43M",
    tip:"Myanmar script is made of circles and rounded strokes. No straight lines at all. The perfectly circular letters are a giveaway.",
    confusables:["Khmer","Thai","Sinhala","Kannada","Telugu"],
    quotes:[{s:"ပညာသည် ချမ်းသာမကွဲ ရွေ့တည်ရှိသည်.",t:"Knowledge is more valuable than wealth."}]},
  { name:"Tagalog", family:"Austronesian", region:"Southeast Asia", script:"Latin", speakers:"~82M",
    tip:"Tagalog uses Latin without special characters. Look for the very frequent word ng as a preposition or marker, mga as plural marker, and affixes -um-, mag-, -an, -in attached to roots.",
    confusables:["Indonesian","Malay","Hawaiian","Maori","Cebuano"],
    quotes:[{s:"Ang hindi marunong lumingon sa pinanggalingan ay hindi makakarating sa paroroonan.",t:"One who does not look back at where they came from will not reach their destination."}]},
  { name:"Indonesian", family:"Austronesian", region:"Southeast Asia", script:"Latin", speakers:"~270M",
    tip:"Indonesian uses clean Latin script without special characters. Look for prefixes me-, pe-, ber-, ter- and suffixes -kan, -an. The words dan meaning and, yang meaning which, di meaning at appear very frequently.",
    confusables:["Malay","Tagalog","Javanese"],
    quotes:[{s:"Bersatu kita teguh, bercerai kita runtuh.",t:"United we stand, divided we fall."},{s:"Di mana ada kemauan, di sana ada jalan.",t:"Where there is a will there is a way."}]},
  { name:"Malay", family:"Austronesian", region:"Southeast Asia", script:"Latin", speakers:"~290M",
    tip:"Malay uses clean Latin script without special characters. Very similar to Indonesian. Look for the word bahasa meaning language appearing in its own name.",
    confusables:["Indonesian","Tagalog","Javanese"],
    quotes:[{s:"Biar lambat asal selamat.",t:"Better slow than sorry."},{s:"Bahasa jiwa bangsa.",t:"Language is the soul of the nation."}]},
  { name:"Javanese", family:"Austronesian", region:"Southeast Asia", script:"Latin", speakers:"~98M",
    tip:"Javanese uses Latin in modern writing. Look for the letters dh and th as retroflex sounds, the word iku meaning that, and frequent vowel e as schwa.",
    confusables:["Indonesian","Malay","Tagalog"],
    quotes:[{s:"Alon-alon waton kelakon.",t:"Slowly but surely."},{s:"Urip iku urup.",t:"Life is a flame. Live to give light to others."}]},
  { name:"Sundanese", family:"Austronesian", region:"Southeast Asia", script:"Latin", speakers:"~42M",
    tip:"Sundanese uses Latin and looks similar to Indonesian and Malay. Look for the combination eu as a vowel and the -eun suffix which are distinctively Sundanese.",
    confusables:["Indonesian","Malay","Javanese","Tagalog","Cebuano"],
    quotes:[{s:"Kudu daek diajar ti nu leuwih boga pangaweruh.",t:"One must be willing to learn from those with more knowledge."}]},
  { name:"Cebuano", family:"Austronesian", region:"Southeast Asia", script:"Latin", speakers:"~27M",
    tip:"Cebuano uses Latin without special characters. Look for the very frequent word nga as a linker between words, the prefix mag- for verbs, and -on, -an, -i suffixes.",
    confusables:["Tagalog","Indonesian","Malay","Hiligaynon"],
    quotes:[{s:"Ang kaalam mahal pa sa bulawan.",t:"Wisdom is more precious than gold."}]},
  { name:"Tetum", family:"Austronesian", region:"Southeast Asia (Timor-Leste)", script:"Latin", speakers:"~1.5M",
    tip:"Tetum uses clean Latin script with no special characters. Look for the very frequent word iha meaning in or at or there is, mak meaning which or that.",
    confusables:["Indonesian","Malay","Tagalog","Maori","Hawaiian"],
    quotes:[{s:"Hafoin udan mak loron sai.",t:"After rain the sun comes out."},{s:"Hamutuk ita forte liu.",t:"Together we are stronger."}]},
  { name:"Hmong", family:"Hmong-Mien", region:"SE Asia / diaspora", script:"Latin (Romanized)", speakers:"~4M",
    tip:"Hmong RPA system ends words with consonants -b, -m, -d, -v, -s, -g, -j that indicate tones and are not pronounced as consonants. This distinctive final consonant pattern appears throughout.",
    confusables:["Vietnamese","Lao","Thai","Indonesian","Tagalog"],
    quotes:[{s:"Txoj kev ntev pib ntawm ib kauj ruam.",t:"A long journey begins with one step."},{s:"Tus neeg tsis kawm, yog tus neeg dig muag.",t:"A person who does not learn is a person who is blind."}]},
  { name:"Shan", family:"Tai-Kadai", region:"Southeast Asia", script:"Shan", speakers:"~6M",
    tip:"Shan script is related to Myanmar and Khmer but has rounder forms. Characters sit on a baseline with vowel markers above and below.",
    confusables:["Myanmar (Burmese)","Thai","Lao","Khmer"],
    quotes:[{s:"ᦜᧂᦷᦖᧈᦷᦙᧃᦍᦱᧂ.",t:"A patient heart finds the way forward."}]},
  { name:"Tok Pisin", family:"English Creole", region:"Pacific (Papua New Guinea)", script:"Latin", speakers:"~5M",
    tip:"Tok Pisin looks like broken English but is a fully distinct creole language. Words like gras meaning grass or hair, save meaning to know reveal its English roots twisted into new meanings.",
    confusables:["Indonesian","Malay","Tetum","Bislama"],
    quotes:[{s:"Gutpela sindaun i kamap long gutpela wok.",t:"Good living comes from good work."},{s:"Yumi wankain olsem.",t:"We are all the same."}]},
  { name:"Hindi", family:"Indo-Iranian", region:"South Asia", script:"Devanagari", speakers:"~600M",
    tip:"Hindi uses Devanagari where characters hang from a horizontal line at the top. The continuous top bar connecting letters is the key visual identifier.",
    confusables:["Marathi","Nepali","Sanskrit","Bengali","Gujarati"],
    quotes:[{s:"कर्म करो, फल की चिंता मत करो.",t:"Do your work, do not worry about the results."},{s:"जो बीत गई सो बात गई.",t:"What has passed has passed."}]},
  { name:"Nepali", family:"Indo-Iranian", region:"South Asia", script:"Devanagari", speakers:"~17M",
    tip:"Nepali also uses Devanagari like Hindi and looks nearly identical. Key difference: Nepali uses the word cha very frequently as a verb ending.",
    confusables:["Hindi","Marathi","Sanskrit","Bengali","Gujarati"],
    quotes:[{s:"हार मान्नु भनेको मृत्यु हो.",t:"To accept defeat is to die."},{s:"परिश्रम नै सफलताको सिंढी हो.",t:"Hard work is the staircase to success."}]},
  { name:"Marathi", family:"Indo-Iranian", region:"South Asia", script:"Devanagari", speakers:"~83M",
    tip:"Marathi uses Devanagari like Hindi but with distinctive letters not commonly used in Hindi. The word aahe meaning is appears constantly.",
    confusables:["Hindi","Nepali","Sanskrit","Gujarati"],
    quotes:[{s:"ज्ञान हेच खरे धन आहे.",t:"Knowledge is the true wealth."},{s:"कर्माच श्रेष्ठ आहे.",t:"Action is supreme."}]},
  { name:"Bengali", family:"Indo-Iranian", region:"South Asia", script:"Bengali", speakers:"~270M",
    tip:"Bengali script resembles Devanagari but the top line is broken not continuous. Letters have a distinctive drooping quality.",
    confusables:["Assamese","Odia","Maithili"],
    quotes:[{s:"যে সহে সে রহে.",t:"He who endures, remains."},{s:"পরিশ্রমই সফলতার চাবিকাঠি.",t:"Hard work is the key to success."}]},
  { name:"Gujarati", family:"Indo-Iranian", region:"South Asia", script:"Gujarati", speakers:"~56M",
    tip:"Gujarati script is derived from Devanagari but the top horizontal line is replaced by a curve or is absent. Letters look rounder and more cursive than Devanagari.",
    confusables:["Hindi","Marathi","Punjabi","Rajasthani"],
    quotes:[{s:"ધૈર્ય ફળ આપે છે.",t:"Patience bears fruit."}]},
  { name:"Punjabi", family:"Indo-Iranian", region:"South Asia", script:"Gurmukhi", speakers:"~125M",
    tip:"Punjabi in India uses Gurmukhi script, a flowing script with a horizontal bar at the top like Devanagari but with more circular letter bodies.",
    confusables:["Hindi","Gujarati","Marathi","Sindhi"],
    quotes:[{s:"ਜਿੱਥੇ ਚਾਹ, ਉੱਥੇ ਰਾਹ.",t:"Where there is a will there is a way."},{s:"ਮਿਹਨਤ ਦਾ ਫਲ ਮਿੱਠਾ ਹੁੰਦਾ ਹੈ.",t:"The fruit of hard work is sweet."}]},
  { name:"Odia", family:"Indo-Iranian", region:"South Asia", script:"Odia", speakers:"~38M",
    tip:"Odia script has distinctive circular letters. Almost every character has a curved top that loops around, unlike Devanagari's straight horizontal bar.",
    confusables:["Bengali","Kannada","Telugu","Assamese"],
    quotes:[{s:"ଜ୍ଞାନ ଅମୂଲ୍ୟ ସମ୍ପଦ.",t:"Knowledge is priceless wealth."}]},
  { name:"Tamil", family:"Dravidian", region:"South Asia / SE Asia", script:"Tamil", speakers:"~87M",
    tip:"Tamil script is very rounded and curvy with lots of loops. Every letter curves with no straight lines. More decorative than Devanagari.",
    confusables:["Kannada","Telugu","Malayalam","Sinhala","Khmer"],
    quotes:[{s:"கற்றது கை மண் அளவு, கல்லாதது உலகளவே.",t:"What we have learned is a handful. What we have yet to learn is the world."},{s:"அன்பே தெய்வம்.",t:"Love is God."}]},
  { name:"Kannada", family:"Dravidian", region:"South Asia", script:"Kannada", speakers:"~56M",
    tip:"Kannada script has rounded letters with small fish-hook serifs. Similar to Telugu but Kannada letters are rounder with more circular loops at the top.",
    confusables:["Telugu","Tamil","Malayalam","Khmer","Myanmar (Burmese)"],
    quotes:[{s:"ಕಲಿಯುವವನು ಎಂದು ಸೋಲುವುದಿಲ್ಲ.",t:"One who keeps learning never truly loses."},{s:"ಮಾತು ಬೆಳ್ಳಿ, ಮೌನ ಬಂಗಾರ.",t:"Speech is silver, silence is gold."}]},
  { name:"Telugu", family:"Dravidian", region:"South Asia", script:"Telugu", speakers:"~96M",
    tip:"Telugu script is rounder than Kannada. Letters often end in a curling tail. The combination of circles with hanging curves is distinctive.",
    confusables:["Kannada","Tamil","Malayalam","Khmer","Sinhala"],
    quotes:[{s:"ఓర్పు ఉన్నవాడికి ఓటమి లేదు.",t:"One who has patience knows no defeat."},{s:"విద్య వినయమును ఇస్తుంది.",t:"Education gives humility."}]},
  { name:"Sinhala", family:"Indo-Iranian", region:"South Asia", script:"Sinhala", speakers:"~17M",
    tip:"Sinhala uses a unique rounded script with oval and circular letterforms. Vowels appear as marks around consonants.",
    confusables:["Tamil","Myanmar (Burmese)","Khmer","Telugu","Kannada"],
    quotes:[{s:"දැනුම ජීවිතයේ ආලෝකයයි.",t:"Knowledge is the light of life."}]},
  { name:"Assamese", family:"Indo-Iranian", region:"South Asia", script:"Bengali", speakers:"~15M",
    tip:"Assamese uses a script nearly identical to Bengali with tiny differences in a few characters. The language has a breathy quality with aspirated consonants.",
    confusables:["Bengali","Odia","Maithili","Manipuri"],
    quotes:[{s:"ज्ञानेहि शक्ति.",t:"Knowledge is power."}]},
  { name:"Maithili", family:"Indo-Iranian", region:"South Asia", script:"Devanagari", speakers:"~34M",
    tip:"Maithili uses Devanagari like Hindi and Nepali. Look for the words chhi and achhi as verbs meaning is which are distinctively Maithili.",
    confusables:["Hindi","Nepali","Bengali","Bhojpuri"],
    quotes:[{s:"যে সহে সে রহে.",t:"He who endures, remains."}]},
  { name:"Sindhi", family:"Indo-Iranian", region:"South Asia", script:"Perso-Arabic", speakers:"~30M",
    tip:"Sindhi uses a modified Perso-Arabic script with more dots and special characters than standard Arabic or Urdu. It has 52 letters compared to Arabic's 28.",
    confusables:["Urdu","Arabic","Persian (Farsi)","Pashto","Balochi"],
    quotes:[{s:"علم اهو آهي جو ڪم اچي.",t:"Knowledge is what is useful."}]},
  { name:"Balochi", family:"Indo-Iranian", region:"South Asia / Middle East", script:"Perso-Arabic", speakers:"~9M",
    tip:"Balochi uses Perso-Arabic script similar to Urdu and Persian. Look for the -ag and -it verb endings which distinguish it from Urdu.",
    confusables:["Urdu","Pashto","Persian (Farsi)","Sindhi"],
    quotes:[{s:"علم گنج است.",t:"Knowledge is a treasure."}]},
  { name:"Santali", family:"Austroasiatic", region:"South Asia", script:"Ol Chiki", speakers:"~7.6M",
    tip:"Santali uses the Ol Chiki script, invented in 1925 by Pandit Raghunath Murmu. The characters are rounded and unique with no resemblance to any other script.",
    confusables:["Odia","Bengali","Myanmar (Burmese)","Khmer","Tibetan"],
    quotes:[{s:"পঢ়া আকান আলো এম আকান.",t:"Learning is light, ignorance is darkness."}]},
  { name:"Turkish", family:"Turkic", region:"Middle East / Europe", script:"Latin", speakers:"~88M",
    tip:"Turkish uses Latin with ç, ş, ğ, ı (dotless i), ö, ü. The dotless ı is a unique giveaway. Words tend to be very long due to agglutination.",
    confusables:["Azerbaijani","Uzbek","Kazakh","Kyrgyz","Indonesian"],
    quotes:[{s:"Damlaya damlaya göl olur.",t:"Drop by drop a lake is formed."},{s:"Sabreden derviş muradına ermiş.",t:"The patient dervish reached his goal."}]},
  { name:"Azerbaijani", family:"Turkic", region:"Caucasus / Middle East", script:"Latin", speakers:"~35M",
    tip:"Azerbaijani uses Latin with letters including ə (schwa), ğ, ı (dotless), ö, ş, ü, ç. Very similar to Turkish. The ə distinguishes it from Turkish.",
    confusables:["Turkish","Uzbek","Kazakh","Kyrgyz"],
    quotes:[{s:"Səbr et, qızıl taparsan.",t:"Be patient, you will find gold."}]},
  { name:"Uzbek", family:"Turkic", region:"Central Asia", script:"Latin", speakers:"~44M",
    tip:"Uzbek uses Latin script with letters oʻ and gʻ (with curly apostrophe) representing specific Uzbek sounds. These modified letters are uniquely Uzbek.",
    confusables:["Turkish","Azerbaijani","Kazakh","Kyrgyz"],
    quotes:[{s:"Ilm — nurdir.",t:"Knowledge is light."},{s:"Sabr qilgan — murodiga yetgan.",t:"He who is patient reaches his goal."}]},
  { name:"Kazakh", family:"Turkic", region:"Central Asia", script:"Cyrillic", speakers:"~19M",
    tip:"Kazakh is currently written in Cyrillic with eight extra letters not in Russian. These distinctive characters make Kazakh recognizable among Cyrillic scripts.",
    confusables:["Kyrgyz","Mongolian","Russian","Uzbek"],
    quotes:[{s:"Білім бұлақ, ішкен тоймас.",t:"Knowledge is a spring. He who drinks is never full."}]},
  { name:"Kyrgyz", family:"Turkic", region:"Central Asia", script:"Cyrillic", speakers:"~4.5M",
    tip:"Kyrgyz Cyrillic has two extra letters not in Russian. Very similar to Kazakh Cyrillic but with fewer extra characters.",
    confusables:["Kazakh","Mongolian","Russian","Uzbek"],
    quotes:[{s:"Bilim altyn kazyna.",t:"Knowledge is a golden treasure."}]},
  { name:"Tajik", family:"Indo-Iranian", region:"Central Asia", script:"Cyrillic", speakers:"~8M",
    tip:"Tajik is written in Cyrillic but is linguistically close to Persian. It has extra letters including i with macron and u with macron.",
    confusables:["Russian","Kazakh","Kyrgyz","Persian (Farsi)"],
    quotes:[{s:"Илм чароғи зиндагист.",t:"Knowledge is the lamp of life."}]},
  { name:"Uyghur", family:"Turkic", region:"Central Asia", script:"Perso-Arabic", speakers:"~11M",
    tip:"Uyghur is written right-to-left in a modified Arabic script. Unlike standard Arabic, Uyghur marks all vowels making them fully visible in the text.",
    confusables:["Arabic","Persian (Farsi)","Urdu","Pashto","Kazakh"],
    quotes:[{s:"Илим нур, жаалаттык аратаңдылык.",t:"Knowledge is light, ignorance is darkness."}]},
  { name:"Turkmen", family:"Turkic", region:"Central Asia", script:"Latin", speakers:"~11M",
    tip:"Turkmen uses Latin with letters like y with circumflex, n with hook, o-umlaut, u-umlaut, zh, and a distinctive c for the ch sound.",
    confusables:["Uzbek","Azerbaijani","Turkish","Kazakh","Kyrgyz"],
    quotes:[{s:"Bilim baylik.",t:"Knowledge is wealth."}]},
  { name:"Swahili", family:"Niger-Congo (Bantu)", region:"Africa", script:"Latin", speakers:"~200M",
    tip:"Swahili uses distinctive noun prefixes: m-, wa-, ki-, vi-. Words like hakuna, safari, ubuntu are Swahili. No accents or special characters.",
    confusables:["Zulu","Yoruba","Hausa","Igbo","Wolof"],
    quotes:[{s:"Haraka haraka haina baraka.",t:"Hurry hurry has no blessings."},{s:"Umoja ni nguvu, utengano ni udhaifu.",t:"Unity is strength, division is weakness."}]},
  { name:"Hausa", family:"Afro-Asiatic (Chadic)", region:"West Africa", script:"Latin", speakers:"~70M",
    tip:"Hausa uses clean Latin with letters b with hook and d with hook for implosive consonants. Very frequent use of -na, -ta, -ya suffixes for gender agreement.",
    confusables:["Swahili","Yoruba","Igbo","Wolof","Somali"],
    quotes:[{s:"Hakuri maganin zaman duniya.",t:"Patience is the medicine for the trials of the world."},{s:"Gaskiya ta fi kobo.",t:"Truth is worth more than money."}]},
  { name:"Yoruba", family:"Niger-Congo", region:"West Africa", script:"Latin", speakers:"~45M",
    tip:"Yoruba uses Latin with many tone marks including acute, grave, and dot below. The frequent use of o-dot and e-dot with subscript dots is a strong identifier.",
    confusables:["Igbo","Hausa","Swahili","Wolof"],
    quotes:[{s:"Omo ti a ko ko ni yoo ta ile eni je.",t:"A child who is not taught will sell the family home."},{s:"Inu rere laa ti n se rere.",t:"Goodness comes from a good heart."}]},
  { name:"Igbo", family:"Niger-Congo", region:"West Africa", script:"Latin", speakers:"~44M",
    tip:"Igbo uses Latin with many tone marks: dot below vowels like o-dot and u-dot, and the letter n-dot. The combinations nw and ny appear frequently.",
    confusables:["Yoruba","Hausa","Swahili","Wolof","Lingala"],
    quotes:[{s:"Onye wetara oji wetara ndu.",t:"He who brings kola brings life."},{s:"Egbe bere, ugo bere.",t:"Let the eagle perch, let the hawk perch. Live and let live."}]},
  { name:"Zulu", family:"Niger-Congo (Bantu)", region:"Africa", script:"Latin", speakers:"~28M",
    tip:"Zulu uses Latin but has unique click consonants written as c, q, x. Words frequently use prefixes uku-, aba-, ama- which are Bantu noun class markers.",
    confusables:["Swahili","Xhosa","Sotho","Igbo","Hausa"],
    quotes:[{s:"Umuntu ngumuntu ngabantu.",t:"A person is a person through other people."},{s:"Indlela ibuzwa kwabaphambili.",t:"The road is asked of those who have gone ahead."}]},
  { name:"Amharic", family:"Semitic", region:"Africa", script:"Ethiopic", speakers:"~57M",
    tip:"Amharic uses the Ethiopic Ge'ez script with round circular characters unlike any other writing system. Each symbol is a consonant plus vowel syllable.",
    confusables:["Tigrinya","Hebrew","Georgian","Sinhala"],
    quotes:[{s:"ፍቅር ተራሮን ያንቀሳቅሳል.",t:"Love moves mountains."}]},
  { name:"Somali", family:"Afro-Asiatic (Cushitic)", region:"East Africa", script:"Latin", speakers:"~22M",
    tip:"Somali uses Latin with a very distinctive double vowel pattern like aa, ee, oo and the letter c for a pharyngeal sound. Look for words ending in vowels and the frequent -ta, -ka suffixes.",
    confusables:["Swahili","Hausa","Oromo","Tigrinya"],
    quotes:[{s:"Nin baa lagu gartaa xikmaddiisa.",t:"A man is known by his wisdom."},{s:"Aqoon la'aani waa iftiin la'aan.",t:"Lack of knowledge is lack of light."}]},
  { name:"Oromo", family:"Afro-Asiatic (Cushitic)", region:"East Africa", script:"Latin", speakers:"~40M",
    tip:"Oromo uses Latin with long vowels written double like aa, ee, ii, oo, uu. The letters ph, dh, ch, bh represent aspirated or breathy sounds.",
    confusables:["Somali","Hausa","Swahili","Amharic"],
    quotes:[{s:"Beekumsi bilisummaa.",t:"Knowledge is freedom."},{s:"Obsi miaa firii guddaa qaba.",t:"Patience has the sweetness of great fruit."}]},
  { name:"Lingala", family:"Niger-Congo (Bantu)", region:"Central Africa", script:"Latin", speakers:"~45M",
    tip:"Lingala uses Latin with a distinctive open-o letter. Look for the prefix mo- for singular nouns and ba- for plural. The word na meaning and or with appears very frequently.",
    confusables:["Swahili","Igbo","Yoruba","Zulu"],
    quotes:[{s:"Boyokani ezali nguya.",t:"Unity is strength."},{s:"Moto azali na ntina ya moto.",t:"A person is important because of other people."}]},
  { name:"Xhosa", family:"Niger-Congo (Bantu)", region:"Southern Africa", script:"Latin", speakers:"~19M",
    tip:"Xhosa uses Latin but has three types of click consonants: c for dental click, q for palatal click, x for lateral click. The clicks make it instantly recognizable.",
    confusables:["Zulu","Swahili","Sotho","Ndebele"],
    quotes:[{s:"Umntu ngumntu ngabantu.",t:"A person is a person through other people."},{s:"Inyaniso ayipheli.",t:"Truth never ends."}]},
  { name:"Shona", family:"Niger-Congo (Bantu)", region:"Southern Africa", script:"Latin", speakers:"~15M",
    tip:"Shona uses Latin without special characters. Look for the distinctive consonant clusters sv, zv, dz and the prefix mu- for people and chi- for languages or things.",
    confusables:["Zulu","Swahili","Xhosa","Ndebele"],
    quotes:[{s:"Ukama igasva hunozadziswa nekudya.",t:"Kinship is incomplete without sharing food."}]},
  { name:"Wolof", family:"Niger-Congo", region:"West Africa", script:"Latin", speakers:"~12M",
    tip:"Wolof uses Latin with consonant combinations like mb, nd, ng, nj at the start of words which is unusual in European languages. Prenasalized consonants appear throughout.",
    confusables:["Yoruba","Igbo","Hausa","Swahili"],
    quotes:[{s:"Ku am kersa, am na nit.",t:"Who has dignity, has humanity."},{s:"Nit, nit ay garabam.",t:"Man is the remedy for man."}]},
  { name:"Fula", family:"Niger-Congo", region:"West Africa", script:"Latin", speakers:"~40M",
    tip:"Fula uses Latin with the special ng-hook at word starts and frequent long vowels marked double. Look for -nde, -ngal, -wal endings.",
    confusables:["Wolof","Hausa","Igbo","Bambara"],
    quotes:[{s:"Munyal yowitii ko nano.",t:"Patience sweetens what is bitter."},{s:"Ganndal woni dimo.",t:"Knowledge makes one free."}]},
  { name:"Hawaiian", family:"Austronesian", region:"Pacific", script:"Latin", speakers:"~24K",
    tip:"Hawaiian has only 13 letters total, 5 vowels and 8 consonants. Words are extremely vowel-heavy with open syllables. The okina apostrophe glottal stop and macron are key markers.",
    confusables:["Maori","Samoan","Tagalog","Malay","Indonesian"],
    quotes:[{s:"Aohe hana nui ke alu ia.",t:"No task is too great when done together."},{s:"I ola no i ka pono.",t:"Righteousness is life."}]},
  { name:"Māori", family:"Austronesian", region:"Pacific (New Zealand)", script:"Latin", speakers:"~185K",
    tip:"Māori uses Latin with macrons on long vowels (ā, ē, ī, ō, ū). Vowel-heavy like Hawaiian. Look for wh pronounced f and ng at word starts.",
    confusables:["Hawaiian","Samoan","Tagalog","Indonesian","Malay"],
    quotes:[{s:"He aha te mea nui o te ao? He tāngata, he tāngata, he tāngata.",t:"What is the greatest thing in the world? It is people, it is people, it is people."},{s:"Ehara taku toa i te toa takitahi, engari he toa takitini.",t:"My strength is not that of a single warrior but that of many."}]},
  { name:"Quechua", family:"Quechuan", region:"South America (Andes)", script:"Latin", speakers:"~10M",
    tip:"Quechua uses Latin but with very frequent q and k, and apostrophes for ejective consonants. Words often end in -y, -pi, -kta, -wan suffixes.",
    confusables:["Aymara","Nahuatl","Guarani","Maya (Yucatec)"],
    quotes:[{s:"Llankaypin kawsay tarikun.",t:"In work, life is found."},{s:"Aynipin kawsay.",t:"Life is in reciprocity."}]},
  { name:"Nahuatl", family:"Uto-Aztecan", region:"Mexico / Central America", script:"Latin", speakers:"~2M",
    tip:"Nahuatl uses Latin but has very frequent tl endings, a unique sound cluster, and tz combinations. The ending -tl on many words is the strongest giveaway.",
    confusables:["Maya (Yucatec)","Quechua","Guarani","Hmong"],
    quotes:[{s:"In tlein amo miqui, yolchicahua.",t:"What does not die, grows stronger."},{s:"Xitlazohtla in motlaltzi.",t:"Love your land."}]},
  { name:"Guarani", family:"Tupian", region:"South America", script:"Latin", speakers:"~7M",
    tip:"Guarani uses Latin with nasalized vowels marked by tilde and the glottal stop apostrophe. Nasal vowels throughout the word are very distinctive.",
    confusables:["Quechua","Nahuatl","Maya (Yucatec)","Hmong"],
    quotes:[{s:"Koa ga roiko vaera.",t:"We must live well now."}]},
  { name:"Maya (Yucatec)", family:"Mayan", region:"Mexico / Central America", script:"Latin", speakers:"~900K",
    tip:"Yucatec Maya uses apostrophes heavily for glottal stops and ejective consonants. Unusual combinations like ts-apostrophe, k-apostrophe, p-apostrophe and the letter x pronounced sh.",
    confusables:["Nahuatl","Quechua","Guarani","Hmong"],
    quotes:[{s:"Bix a beel? Ma to on kiin.",t:"How is your road? The sun is still ours."}]},
  { name:"Navajo", family:"Na-Dene", region:"North America", script:"Latin", speakers:"~170K",
    tip:"Navajo uses Latin with ogonek letters for nasalization and the unique consonant clusters zh, dl, tl-stroke. Nasal vowels and these clusters are distinctively Navajo.",
    confusables:["Hmong","Quechua","Nahuatl","Maya (Yucatec)"],
    quotes:[{s:"Hozho nahasdzii. Hozho nahasdzii.",t:"Beauty is restored. Beauty is restored."},{s:"T aa hwo aji t eego.",t:"It is up to you. Self-reliance is key."}]},
  { name:"Aymara", family:"Aymaran", region:"South America (Andes)", script:"Latin", speakers:"~2M",
    tip:"Aymara uses Latin with apostrophes for ejective consonants similar to Quechua. Look for the suffix -wa at sentence ends for assertion and -ti for questions.",
    confusables:["Quechua","Nahuatl","Guarani","Mapuche"],
    quotes:[{s:"Yatina unjawi ukhamaraki.",t:"To know is to see."}]},
  { name:"Mapuche", family:"Araucanian", region:"South America (Chile/Argentina)", script:"Latin", speakers:"~260K",
    tip:"Mapuche uses Latin with the distinctive letters tr for a retroflex sound. Look for the suffixes -nge, -le, -fu and the word feley meaning it is so.",
    confusables:["Quechua","Aymara","Guarani","Nahuatl"],
    quotes:[{s:"Kimeltuve che pu mogen mew.",t:"Knowledge gives life to the people."}]},
  { name:"Ojibwe", family:"Algonquian", region:"North America", script:"Latin", speakers:"~170K",
    tip:"Ojibwe uses Latin with long vowels marked by macrons or double letters: aa, ii, oo. The letters zh, sh, ch and the combination gw appear frequently.",
    confusables:["Cree","Navajo","Hmong","Inuktitut","Cherokee"],
    quotes:[{s:"Mii dash ezhi-bimaadiziyaang.",t:"And so we live this way."}]},
  { name:"Cherokee", family:"Iroquoian", region:"North America", script:"Cherokee syllabary", speakers:"~2K",
    tip:"Cherokee uses its own syllabary invented by Sequoyah in 1821. Each character represents a syllable. The characters look somewhat like Latin letters but represent completely different sounds.",
    confusables:["Inuktitut","Santali","Tibetan","Cree"],
    quotes:[{s:"Nigada tsunilvwisdanedi tseniyvtlvhi.",t:"We will always remember where we came from."}]},
  { name:"Inuktitut", family:"Eskimo-Aleut", region:"Arctic (Canada / Greenland)", script:"Syllabics / Latin", speakers:"~40K",
    tip:"Inuktitut in Canada uses Canadian Aboriginal Syllabics. Geometric shapes that look like triangles, wedges and small circles in different orientations. Each orientation represents a different vowel with the same consonant.",
    confusables:["Cherokee","Cree","Ojibwe","Santali","Tibetan"],
    quotes:[{s:"Ilinniarniq pitsimavoq.",t:"Learning is necessary for life."}]},
];

// ── HELPERS ────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function pickQuote(lang) {
  return lang.quotes[Math.floor(Math.random()*lang.quotes.length)];
}

function getDifficulty(name) {
  if(EASY_NAMES.has(name)) return "easy";
  if(HARD_NAMES.has(name)) return "hard";
  return "medium";
}

// Build survival pool: 10 easy → 10 medium → 10 hard (then repeat hard)
function buildSurvivalPool() {
  const easy = shuffle(LANGUAGES.filter(l => EASY_NAMES.has(l.name))).slice(0, 10);
  const medium = shuffle(LANGUAGES.filter(l => !EASY_NAMES.has(l.name) && !HARD_NAMES.has(l.name))).slice(0, 10);
  const hard = shuffle(LANGUAGES.filter(l => HARD_NAMES.has(l.name)));
  return [...easy, ...medium, ...hard];
}

function buildMixedPool() {
  const easy = shuffle(LANGUAGES.filter(l => EASY_NAMES.has(l.name)));
  const medium = shuffle(LANGUAGES.filter(l => !EASY_NAMES.has(l.name) && !HARD_NAMES.has(l.name)));
  const hard = shuffle(LANGUAGES.filter(l => HARD_NAMES.has(l.name)));
  return shuffle([
    ...easy.slice(0, 2),
    ...medium.slice(0, 2),
    ...hard.slice(0, 2),
  ]);
}

function getOptions(correct, all) {
  const confuse=(correct.confusables||[]).map(n=>all.find(l=>l.name===n)).filter(Boolean);
  const confusePick=shuffle(confuse).slice(0,5);
  const remaining=shuffle(all.filter(l=>l.name!==correct.name&&!confusePick.find(c=>c.name===l.name)));
  return shuffle([correct,...confusePick,...remaining.slice(0,9-confusePick.length)]).slice(0,10);
}

function sameScript(a,b) {
  const base=s=>{
    if(!s) return s;
    if(s.startsWith("Cyrillic")) return "Cyrillic";
    if(s.startsWith("Latin")) return "Latin";
    if(s==="Perso-Arabic"||s==="Arabic") return "Arabic-script";
    if(s.startsWith("Chinese")) return "Chinese";
    if(s.startsWith("Devanagari")) return "Devanagari";
    if(s.startsWith("Ethiopic")) return "Ethiopic";
    if(s.startsWith("Tibetan")) return "Tibetan";
    return s;
  };
  return base(a.script)===base(b.script);
}

function baseScore(guessed,correct,all) {
  if(guessed===correct.name) return 10;
  const g=all.find(l=>l.name===guessed);
  if(!g) return 0;
  if(g.family===correct.family) return 5;
  if(sameScript(g,correct)) return 3;
  if(g.region===correct.region) return 2;
  return 0;
}

function calcScore(base,timeLeft,streak) {
  if(base===0) return 0;
  const speedBonus=base===10&&timeLeft>=10?parseFloat(((timeLeft-10)/5*2).toFixed(1)):0;
  const streakBonus=base===10&&streak>=2?(streak>=4?1:0.5):0;
  return parseFloat((base+speedBonus+streakBonus).toFixed(1));
}

// ── SHARED STYLES ─────────────────────────────────────────────────────────
const focusStyle = {
  outline:`3px solid ${C.ocean}`,
  outlineOffset:"2px",
};

const btnBase = {
  display:"flex", alignItems:"center", justifyContent:"center",
  minHeight:"44px", minWidth:"44px",
  borderRadius:"10px", cursor:"pointer",
  fontFamily:"inherit", fontSize:"16px", fontWeight:500,
  transition: TRANSITION,
  border:"2px solid transparent",
};

const primaryBtn = {
  ...btnBase,
  background:C.coral, color:C.white,
  border:`2px solid ${C.coral}`,
  padding:"0 1.5rem",
};

const outlineBtn = {
  ...btnBase,
  background:"transparent", color:C.ocean,
  border:`2px solid ${C.ocean}`,
  padding:"0 1.5rem",
};

// ── REUSABLE COMPONENTS ───────────────────────────────────────────────────
function ScoreBar({score,max=13}) {
  const pct=Math.round((score/max)*100);
  const color=score>=10?C.success:score>=5?C.earth:C.error;
  const label=score>=10?"Correct":score>=5?"Partial":"Incorrect";
  return (
    <div role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={max} aria-label={`Score: ${score} out of ${max}`}>
      <div style={{background:C.fogDk,borderRadius:99,height:8,width:"100%",overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:99,
          transition: REDUCED?"none":"width 0.5s ease"}}/>
      </div>
    </div>
  );
}

function FamilyTag({family}) {
  const bg=FAMILY_COLOR[family]||C.earth;
  return (
    <span style={{background:bg,color:C.white,borderRadius:99,padding:"4px 12px",
      fontSize:"13px",fontWeight:500,lineHeight:1.4}}>
      {family}
    </span>
  );
}

function DiffBadge({name}) {
  const d=getDifficulty(name);
  const map={easy:{label:"Easy",color:"#1A6B30"},medium:{label:"Medium",color:"#7A5200"},hard:{label:"Hard",color:"#8A1A1A"}};
  const {label,color}=map[d];
  return (
    <span style={{fontSize:"12px",fontWeight:500,color,background:`${color}18`,
      borderRadius:99,padding:"2px 10px",border:`1px solid ${color}40`}}>
      {label}
    </span>
  );
}

function Timer({timeLeft,total=15}) {
  const pct=(timeLeft/total)*100;
  const color=timeLeft>8?C.ocean:timeLeft>4?C.earth:C.coral;
  return (
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <div role="progressbar" aria-valuenow={timeLeft} aria-valuemin={0} aria-valuemax={total}
        aria-label={`${timeLeft} seconds remaining`}
        style={{flex:1,background:C.fogDk,borderRadius:99,height:8,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:99,
          transition:REDUCED?"none":"width 1s linear"}}/>
      </div>
      <span style={{fontSize:"14px",fontWeight:600,color,minWidth:40,textAlign:"right"}}
        aria-live="polite" aria-atomic="true">
        {timeLeft}s
      </span>
    </div>
  );
}

function BlitzTimer({timeLeft,total=60}) {
  const pct=(timeLeft/total)*100;
  const color=timeLeft>20?C.success:timeLeft>10?C.earth:C.coral;
  return (
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <div role="progressbar" aria-valuenow={timeLeft} aria-valuemin={0} aria-valuemax={total}
        aria-label={`${timeLeft} seconds remaining`}
        style={{flex:1,background:C.fogDk,borderRadius:99,height:8,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:99,
          transition:REDUCED?"none":"width 1s linear"}}/>
      </div>
      <span style={{fontSize:"18px",fontWeight:700,color,minWidth:48,textAlign:"right"}}
        aria-live="polite" aria-atomic="true">
        {timeLeft}s
      </span>
    </div>
  );
}

function CountdownOverlay({onDone}) {
  const [visible,setVisible]=useState(true);
  const allFlags=Object.values(LANG_FLAGS);
  const rows=[shuffle([...allFlags]).slice(0,8),shuffle([...allFlags]).slice(0,8),shuffle([...allFlags]).slice(0,8)];

  useEffect(()=>{
    if(REDUCED){setVisible(false);onDone();return;}
    const t=setTimeout(()=>{setVisible(false);onDone();},1200);
    return()=>clearTimeout(t);
  },[]);

  if(!visible) return null;
  return (
    <div role="dialog" aria-label="Game starting"
      style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:1000,
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <style>{`
        @keyframes slideLeft{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes slideRight{from{transform:translateX(-50%)}to{transform:translateX(0)}}
        button:focus-visible{outline:3px solid #7EADBF;outline-offset:2px;}
        a:focus-visible{outline:3px solid #42708C;outline-offset:2px;}
      `}</style>
      <div style={{marginBottom:20}} aria-hidden="true">
        {rows.map((row,ri)=>(
          <div key={ri} style={{display:"flex",gap:8,marginBottom:8,
            animation:`${ri%2===0?"slideLeft":"slideRight"} 1.8s linear infinite`}}>
            {[...row,...row].map((f,i)=><span key={i} style={{fontSize:32,lineHeight:1}}>{f}</span>)}
          </div>
        ))}
      </div>
      <p style={{color:C.white,fontSize:"20px",fontWeight:500}}>Get ready...</p>
    </div>
  );
}

function CorrectPopup({lang,score,onDone}) {
  const msg=CONGRATS[Math.floor(Math.random()*CONGRATS.length)];
  const flag=LANG_FLAGS[lang.name]||"🌍";
  useEffect(()=>{
    if(REDUCED){onDone();return;}
    const t=setTimeout(onDone,1400);
    return()=>clearTimeout(t);
  },[]);
  return (
    <div role="status" aria-live="polite"
      style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",
        justifyContent:"center",pointerEvents:"none"}}>
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{background:C.white,borderRadius:20,padding:"1.5rem 2rem",textAlign:"center",
        boxShadow:"0 8px 40px rgba(0,0,0,0.2)",
        animation:REDUCED?"none":"popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        border:`2px solid ${C.success}`}}>
        <div style={{fontSize:"52px",marginBottom:8}} aria-hidden="true">{flag}</div>
        <p style={{fontSize:"20px",fontWeight:600,color:C.dark,margin:"0 0 4px"}}>{msg}</p>
        <p style={{fontSize:"14px",color:C.mid,margin:0}}>{lang.name} <span style={{color:C.success,fontWeight:600}}>+{score} {score===1?"pt":"pts"}</span></p>
      </div>
    </div>
  );
}

// ── QUESTION CARD (shared between Classic, Survival, Blitz) ──────────────
function QuestionCard({q, selected, onSelect, phase, lastResult, onNext, isLast, showTimer, timeLeft, hideTip=false, hideMeta=false}) {
  const lastScore=lastResult?.score??0;
  return (
    <>
      {showTimer&&<div style={{marginBottom:12}}><Timer timeLeft={timeLeft}/></div>}

      {/* Quote card */}
      <div style={{background:C.fog,borderRadius:16,padding:"1.25rem",marginBottom:"1rem",
        minHeight:80,display:"flex",alignItems:"center",justifyContent:"center",
        border:`1px solid ${C.border}`}}>
        <p style={{fontSize:"18px",lineHeight:1.7,margin:0,color:C.dark,fontStyle:"italic",
          textAlign:"center",maxWidth:"52ch"}}>
          "{q.sample}"
        </p>
      </div>

      <p style={{fontSize:"14px",color:C.mid,marginBottom:"0.5rem",fontWeight:500,
        textTransform:"uppercase",letterSpacing:"0.08em"}}>
        Which language is this?
      </p>

      {/* Options grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:"1rem"}}>
        {q.options.map(opt=>{
          const isCorrect=opt.name===q.lang.name;
          const isWrong=opt.name===selected&&selected!==q.lang.name;
          let bg=C.white, border=`2px solid ${C.border}`, color=C.dark, icon=null;
          if(selected){
            if(isCorrect){bg="#EBF7EF";border=`2px solid ${C.success}`;color=C.success;icon="✓";}
            else if(isWrong){bg="#FDECEA";border=`2px solid ${C.error}`;color=C.error;icon="✗";}
          }
          return (
            <button key={opt.name}
              onClick={()=>onSelect(opt.name)}
              disabled={!!selected}
              aria-pressed={opt.name===selected}
              aria-label={`${opt.name}${isCorrect&&selected?" (correct)":""}${isWrong?" (incorrect)":""}`}
              style={{...btnBase,background:bg,border,color,padding:"0.6rem 0.85rem",
                textAlign:"left",justifyContent:"flex-start",minHeight:"48px",
                fontSize:"14px",fontWeight:400,gap:6,
                cursor:selected?"default":"pointer",
                opacity:selected&&!isCorrect&&!isWrong?0.6:1,
                transition:TRANSITION}}>
              {icon&&<span aria-hidden="true" style={{fontWeight:700,fontSize:"16px"}}>{icon}</span>}
              {opt.name}
            </button>
          );
        })}
      </div>

      {/* Reveal panel */}
      {phase==="reveal"&&lastResult&&(
        <div style={{background:C.fog,borderRadius:14,padding:"1rem 1.25rem",
          marginBottom:"0.75rem",border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div>
              <p style={{fontSize:"16px",fontWeight:600,color:C.dark,margin:"0 0 2px"}}>
                {selected===q.lang.name?"Correct!":selected==="__timeout__"?"Time's up!":
                  `It was ${q.lang.name}`}
              </p>
              {!hideMeta&&<p style={{fontSize:"13px",color:C.mid,margin:0}}>
                {lastScore>0&&`+${lastScore} ${lastScore===1?"pt":"pts"}`}
                {lastResult.base===10&&lastResult.timeLeft>=10?" · speed bonus":""}
                {lastResult.streak>=2?" · streak bonus":""}
              </p>}
            </div>

          </div>
          {!hideMeta&&<ScoreBar score={lastScore}/>}

          {/* Quote + translation */}
          <div style={{margin:"12px 0",padding:"0.75rem 1rem",background:C.white,
            borderRadius:10,borderLeft:`4px solid ${C.sky}`,border:`1px solid ${C.border}`}}>
            <p style={{fontSize:"14px",color:C.dark,margin:"0 0 6px",fontStyle:"italic",lineHeight:1.6}}>
              "{q.sample}"
            </p>
            <p style={{fontSize:"13px",color:C.mid,margin:0,lineHeight:1.5}}>"{q.translation}"</p>
          </div>

          {/* How to spot tip */}
          {q.lang.tip&&!hideTip&&(
            <div style={{padding:"0.75rem 1rem",background:`${C.ocean}0F`,borderRadius:10,
              borderLeft:`4px solid ${C.ocean}`,border:`1px solid ${C.ocean}30`,marginBottom:10}}>
              <p style={{fontSize:"12px",color:C.ocean,fontWeight:600,margin:"0 0 4px",
                textTransform:"uppercase",letterSpacing:"0.06em"}}>
                How to spot {q.lang.name}
              </p>
              <p style={{fontSize:"14px",color:C.dark,margin:0,lineHeight:1.6}}>{q.lang.tip}</p>
            </div>
          )}

          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:12}}>
            <FamilyTag family={q.lang.family}/>
            <DiffBadge name={q.lang.name}/>
            <span style={{fontSize:"13px",color:C.mid}}>{q.lang.script}</span>
            <span aria-hidden="true" style={{fontSize:"13px",color:C.muted}}>·</span>
            <span style={{fontSize:"13px",color:C.mid}}>{q.lang.speakers}</span>
          </div>

          {selected!==q.lang.name&&lastResult.base===5&&
            <p style={{fontSize:"14px",color:C.earth,margin:"0 0 10px",fontWeight:500}}>Same language family — close!</p>}
          {selected!==q.lang.name&&lastResult.base===3&&
            <p style={{fontSize:"14px",color:C.sky,margin:"0 0 10px",fontWeight:500}}>Same script — you spotted the alphabet!</p>}
          {selected!==q.lang.name&&lastResult.base===2&&
            <p style={{fontSize:"14px",color:C.mid,margin:"0 0 10px",fontWeight:500}}>Same region — not too far!</p>}

          <button onClick={onNext} style={{...primaryBtn,width:"100%",justifyContent:"center"}}>
            {isLast?"See results":"Next question →"}
          </button>
        </div>
      )}
    </>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────
function Home({onStart,leaderboard}) {
  const [lbFilter,setLbFilter]=useState("classic");
  const [filteredBoard,setFilteredBoard]=useState([]);

  useEffect(()=>{
    async function loadFiltered() {
      try{
        const r=await fetch(`/api/leaderboard?level=${lbFilter}`);
        const data=await r.json();
        if(Array.isArray(data)) setFilteredBoard(data);
      }catch(e){
        setFilteredBoard(leaderboard.filter(e=>(e.mode||"classic")===lbFilter));
      }
    }
    loadFiltered();
  },[lbFilter,leaderboard]);

  const modes=[
    {id:"classic",icon:"🔵",label:"Classic",sub:"6 rounds",desc:"6 rounds: score as high as you can!"},
    {id:"survival",icon:"🔴",label:"Survival",sub:"How far can you go?",desc:"Answer correctly to keep playing. One wrong answer ends the game."},
    {id:"blitz",icon:"🟡",label:"Blitz",sub:"60 seconds",desc:"Answer as many as you can before the clock runs out."},
  ];
  const [selectedMode,setSelectedMode]=useState("classic");

  return (
    <main style={{maxWidth:480,margin:"0 auto",padding:"2rem 1rem",fontFamily:"sans-serif",color:C.dark}}>
      <header style={{textAlign:"center",marginBottom:"1.5rem"}}>
        <div style={{width:56,height:56,borderRadius:14,margin:"0 auto 1rem",overflow:"hidden"}} aria-hidden="true">
        <img src="/mainlogo.png" alt="LanguageGuessr logo" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
      </div>
        <h1 style={{fontSize:"28px",fontWeight:700,margin:"0 0 0.5rem",color:C.dark,letterSpacing:"-0.5px"}}>
          LanguageGuessr
        </h1>
        <p style={{color:C.mid,fontSize:"16px",lineHeight:1.6,margin:0}}>
          How fast can you identify a language?<br/>Challenge your friends across 100 languages.
        </p>
      </header>



      {/* Mode selector */}
      <section aria-label="Game mode" style={{marginBottom:"1.25rem"}}>
        <h2 style={{fontSize:"13px",fontWeight:600,color:C.mid,margin:"0 0 8px",
          textTransform:"uppercase",letterSpacing:"0.08em"}}>Choose mode</h2>
        <div style={{display:"flex",flexDirection:"column",gap:8}} role="radiogroup" aria-label="Game mode">
          {modes.map(m=>(
            <button key={m.id}
              role="radio"
              aria-checked={selectedMode===m.id}
              onClick={()=>setSelectedMode(m.id)}
              style={{...btnBase,padding:"0.85rem 1rem",borderRadius:12,textAlign:"left",
                justifyContent:"flex-start",background:selectedMode===m.id?`${C.ocean}10`:C.white,
                border:`2px solid ${selectedMode===m.id?C.ocean:C.border}`,
                flexDirection:"column",alignItems:"flex-start",gap:2,minHeight:72}}>
              <div style={{display:"flex",gap:8,alignItems:"center",width:"100%"}}>
                <span aria-hidden="true" style={{fontSize:"20px"}}>{m.icon}</span>
                <span style={{fontSize:"16px",fontWeight:600,color:selectedMode===m.id?C.ocean:C.dark}}>{m.label}</span>
                <span style={{fontSize:"13px",color:C.muted,marginLeft:"auto"}}>{m.sub}</span>
              </div>
              <p style={{fontSize:"14px",color:C.mid,margin:"0 0 0 28px",lineHeight:1.5}}>{m.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <button onClick={()=>onStart(selectedMode)}
        style={{...primaryBtn,width:"100%",justifyContent:"center",
          fontSize:"18px",minHeight:56,marginBottom:"1.25rem",
          background:C.coral,borderColor:C.coral}}>
        Start game
      </button>

      {/* Global leaderboard */}
      <section aria-label="Global leaderboard" style={{background:C.fog,borderRadius:12,
        padding:"0.85rem 1rem",border:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}>
          <h2 style={{fontSize:"14px",fontWeight:600,color:C.dark,margin:0}}>🌍 Global leaderboard</h2>
          <div style={{display:"flex",gap:4}} role="tablist" aria-label="Filter leaderboard by mode">
            {["classic","survival","blitz"].map(f=>(
              <button key={f} role="tab" aria-selected={lbFilter===f}
                onClick={()=>setLbFilter(f)}
                style={{...btnBase,fontSize:"11px",padding:"4px 8px",borderRadius:99,minHeight:28,
                  border:`1px solid ${lbFilter===f?C.ocean:C.border}`,
                  background:lbFilter===f?C.ocean:"transparent",
                  color:lbFilter===f?C.white:C.mid,fontWeight:lbFilter===f?600:400}}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {(()=>{
          const board = filteredBoard.filter(e=>(e.mode||"classic")===lbFilter).slice(0,5);
          if(board.length===0) return (
            <p style={{fontSize:"14px",color:C.muted,textAlign:"center",padding:"0.5rem 0",margin:0}}>No scores yet. Be the first!</p>
          );
          const medals=["🥇","🥈","🥉","4️⃣","5️⃣"];
          return board.map((e,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"8px 0",borderBottom:i<board.length-1?`1px solid ${C.fogDk}`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span aria-hidden="true" style={{fontSize:"18px"}}>{medals[i]}</span>
                <div>
                  <p style={{fontSize:"15px",color:i===0?C.coral:C.dark,fontWeight:i===0?600:400,margin:"0 0 1px"}}>
                    {e.name}
                  </p>
                  <p style={{fontSize:"12px",color:C.muted,margin:0}}>{e.date}</p>
                </div>
              </div>
              <span style={{fontSize:"16px",fontWeight:700,color:C.ocean}}>
                {e.score}<span style={{fontSize:"12px",color:C.muted,fontWeight:400}}>
                  {(e.mode==="survival"||e.mode==="blitz")?" correct":" pts"}
                </span>
              </span>
            </div>
          ));
        })()}
      </section>


    </main>
  );
}

// ── GAME NAV BAR (logo + back button shown during gameplay) ──────────────
function GameNav({onHome}) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"0.75rem 1rem",borderBottom:`1px solid ${C.border}`,
      background:C.white,position:"sticky",top:0,zIndex:100}}>
      <button onClick={onHome} aria-label="Go back to home"
        style={{...btnBase,background:"transparent",border:"none",
          gap:8,padding:"4px 8px",minHeight:36,color:C.ocean,fontWeight:700,fontSize:"16px"}}>
        <img src="/mainlogo.png" alt="LanguageGuessr logo"
          style={{width:28,height:28,borderRadius:8,objectFit:"cover",flexShrink:0}}/>
        LanguageGuessr
      </button>
      <button onClick={onHome} aria-label="Quit and go home"
        style={{...btnBase,background:"transparent",border:`1px solid ${C.border}`,
          color:C.mid,fontSize:"13px",padding:"4px 12px",minHeight:32,borderRadius:99}}>
        ✕ Quit
      </button>
    </div>
  );
}
function ClassicGame({onDone, onHome}) {
  const TOTAL=6;
  const [questions]=useState(()=>{
    const pool=buildMixedPool();
    return pool.map(lang=>{const q=pickQuote(lang);return{lang,options:getOptions(lang,LANGUAGES),sample:q.s,translation:q.t};});
  });
  const [qIndex,setQIndex]=useState(0);
  const [selected,setSelected]=useState(null);
  const [scores,setScores]=useState([]);
  const [results,setResults]=useState([]);
  const [phase,setPhase]=useState("question");
  const [timeLeft,setTimeLeft]=useState(15);
  const [streak,setStreak]=useState(0);
  const [showCorrect,setShowCorrect]=useState(null);
  const timerRef=useRef(null);
  const resultsRef=useRef([]);
  const scoresRef=useRef([]);
  const selectedRef=useRef(null);
  const qIndexRef=useRef(0);
  const streakRef=useRef(0);
  const timeLeftRef=useRef(15);
  const phaseRef=useRef("question");

  useEffect(()=>{selectedRef.current=selected;},[selected]);
  useEffect(()=>{qIndexRef.current=qIndex;},[qIndex]);
  useEffect(()=>{streakRef.current=streak;},[streak]);
  useEffect(()=>{timeLeftRef.current=timeLeft;},[timeLeft]);
  useEffect(()=>{phaseRef.current=phase;},[phase]);

  useEffect(()=>{
    if(phase!=="question") return;
    setTimeLeft(15);
    timeLeftRef.current=15;
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{
        const next=t-1;
        timeLeftRef.current=next;
        if(next<=0){
          clearInterval(timerRef.current);
          // Use refs to avoid stale closure
          if(!selectedRef.current && phaseRef.current==="question"){
            const qi=qIndexRef.current;
            const q=questions[qi];
            const newResult={lang:q.lang,sample:q.sample,translation:q.translation,guessed:"time's up",score:0,base:0,timeLeft:0,streak:0};
            resultsRef.current=[...resultsRef.current,newResult];
            scoresRef.current=[...scoresRef.current,0];
            setScores(p=>[...p,0]);
            setResults(p=>[...p,newResult]);
            setStreak(0);
            streakRef.current=0;
            setSelected("__timeout__");
            selectedRef.current="__timeout__";
            setPhase("reveal");
            phaseRef.current="reveal";
          }
          return 0;
        }
        return next;
      });
    },1000);
    return()=>clearInterval(timerRef.current);
  },[qIndex,phase]);

  function handleSelect(opt){
    if(selectedRef.current||phaseRef.current==="reveal") return;
    clearInterval(timerRef.current);
    const qi=qIndexRef.current;
    const q=questions[qi];
    const base=baseScore(opt,q.lang,LANGUAGES);
    const newStreak=base===10?streakRef.current+1:0;
    const s=calcScore(base,timeLeftRef.current,streakRef.current);
    const newResult={lang:q.lang,sample:q.sample,translation:q.translation,guessed:opt,score:s,base,timeLeft:timeLeftRef.current,streak:newStreak};
    resultsRef.current=[...resultsRef.current,newResult];
    scoresRef.current=[...scoresRef.current,s];
    selectedRef.current=opt;
    streakRef.current=newStreak;
    phaseRef.current="reveal";
    setSelected(opt);
    setStreak(newStreak);
    setScores(p=>[...p,s]);
    setResults(p=>[...p,newResult]);
    if(base===10) setShowCorrect({lang:q.lang,score:s});
    setPhase("reveal");
  }

  function next(){
    const qi=qIndexRef.current;
    if(qi+1>=TOTAL){
      onDone(resultsRef.current,scoresRef.current,"classic");
    } else {
      selectedRef.current=null;
      phaseRef.current="question";
      setQIndex(qi+1);
      setSelected(null);
      setPhase("question");
    }
  }

  const q=questions[qIndex];
  const runningScore=parseFloat(scores.reduce((a,b)=>a+b,0).toFixed(1));

  return (
    <main style={{maxWidth:560,margin:"0 auto",fontFamily:"sans-serif",color:C.dark}}>
      {showCorrect&&<CorrectPopup lang={showCorrect.lang} score={showCorrect.score} onDone={()=>setShowCorrect(null)}/>}
      <GameNav onHome={onHome}/>
      <div style={{padding:"1rem 1rem"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}>
        <div style={{display:"flex",gap:6}} role="progressbar" aria-valuenow={qIndex} aria-valuemax={TOTAL}
          aria-label={`Question ${qIndex+1} of ${TOTAL}`}>
          {questions.map((_,i)=>(
            <div key={i} aria-hidden="true" style={{width:28,height:6,borderRadius:99,
              background:i<qIndex?C.ocean:i===qIndex?C.coral:C.fogDk}}/>
          ))}
        </div>
        <span style={{fontSize:"14px",fontWeight:600,color:C.ocean}} aria-live="polite" aria-atomic="true">
          {runningScore} pts
        </span>
      </header>
      {streak>=2&&phase==="question"&&(
        <p role="status" style={{fontSize:"14px",color:C.coral,fontWeight:600,margin:"0 0 8px",
          padding:"4px 12px",background:`${C.coral}15`,borderRadius:8,display:"inline-block",
          border:`1px solid ${C.coral}30`}}>
          {streak} streak — bonus active!
        </p>
      )}
      <QuestionCard q={q} selected={selected} onSelect={handleSelect}
        phase={phase} lastResult={results[results.length-1]}
        onNext={next} isLast={qIndex+1>=TOTAL}
        showTimer={true} timeLeft={timeLeft}/>
      </div>
    </main>
  );
}

// ── SURVIVAL MODE ─────────────────────────────────────────────────────────
function SurvivalGame({onDone, onHome}) {
  const pool = useRef(buildSurvivalPool());
  const poolIdx = useRef(0);

  function makeQ(lang) {
    const q = pickQuote(lang);
    // 4 options only: correct + 3 confusables/random
    const confuse = (lang.confusables||[]).map(n=>LANGUAGES.find(l=>l.name===n)).filter(Boolean);
    const confusePick = shuffle(confuse).slice(0, 2);
    const remaining = shuffle(LANGUAGES.filter(l=>l.name!==lang.name&&!confusePick.find(c=>c.name===l.name)));
    const options = shuffle([lang, ...confusePick, ...remaining.slice(0, 3-confusePick.length)]).slice(0, 4);
    return {lang, options, sample:q.s, translation:q.t};
  }

  const [currentQ, setCurrentQ] = useState(()=>makeQ(pool.current[0]));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0); // just count of correct answers
  const [results, setResults] = useState([]);
  const [phase, setPhase] = useState("question");
  const [timeLeft, setTimeLeft] = useState(15);
  const [showCorrect, setShowCorrect] = useState(null);
  const timerRef = useRef(null);

  // Current difficulty label for display
  const idx = poolIdx.current;
  const currentDiff = idx < 10 ? "Easy" : idx < 20 ? "Medium" : "Hard";
  const currentDiffColor = idx < 10 ? C.success : idx < 20 ? C.earth : C.error;

  useEffect(()=>{
    if(phase !== "question") return;
    setTimeLeft(15);
    timerRef.current = setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){clearInterval(timerRef.current); handleSelect("__timeout__"); return 0;}
        return t-1;
      });
    }, 1000);
    return()=>clearInterval(timerRef.current);
  }, [phase, results.length]);

  function handleSelect(opt) {
    if(selected || phase==="reveal") return;
    clearInterval(timerRef.current);
    const q = currentQ;
    const correct = opt === q.lang.name;
    const r = {lang:q.lang, sample:q.sample, translation:q.translation, guessed:opt, score:correct?1:0, base:correct?10:0, timeLeft, streak:0};
    setSelected(opt);
    setResults(p=>[...p, r]);
    if(correct) {
      setScore(s=>s+1);
      setShowCorrect({lang:q.lang, score:1});
      setPhase("reveal");
    } else {
      // Eliminated — go straight to results
      onDone([...results, r], Array(results.length).fill(1).concat([0]), "survival");
    }
  }

  function next() {
    poolIdx.current++;
    // If we've exhausted the pool, keep cycling hard languages
    if(poolIdx.current >= pool.current.length) {
      const hardLangs = shuffle(LANGUAGES.filter(l=>HARD_NAMES.has(l.name)));
      pool.current = [...pool.current, ...hardLangs];
    }
    const lang = pool.current[poolIdx.current];
    setCurrentQ(makeQ(lang));
    setSelected(null);
    setPhase("question");
  }

  const correctCount = results.filter(r=>r.base===10).length;

  return (
    <main style={{maxWidth:560, margin:"0 auto", fontFamily:"sans-serif", color:C.dark}}>
      {showCorrect&&<CorrectPopup lang={showCorrect.lang} score={showCorrect.score} onDone={()=>setShowCorrect(null)}/>}
      <GameNav onHome={onHome}/>
      <div style={{padding:"1rem"}}>
        <header style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.75rem"}}>
          <div style={{display:"flex", alignItems:"center", gap:8}}>
            <span style={{fontSize:"20px"}} aria-hidden="true">🔴</span>
            <span style={{fontSize:"16px", fontWeight:600, color:C.dark}}>Survival</span>
            <span style={{fontSize:"14px", color:C.mid}}>· {correctCount} correct</span>
          </div>
          <span style={{fontSize:"13px", fontWeight:600, color:currentDiffColor,
            background:`${currentDiffColor}18`, borderRadius:99, padding:"2px 10px",
            border:`1px solid ${currentDiffColor}30`}}>
            {currentDiff}
          </span>
        </header>
        <div style={{marginBottom:"0.75rem"}}><Timer timeLeft={timeLeft}/></div>

        {/* Quote card */}
        <div style={{background:C.fog, borderRadius:16, padding:"1.25rem", marginBottom:"1rem",
          minHeight:80, display:"flex", alignItems:"center", justifyContent:"center",
          border:`1px solid ${C.border}`}}>
          <p style={{fontSize:"18px", lineHeight:1.7, margin:0, color:C.dark, fontStyle:"italic",
            textAlign:"center", maxWidth:"52ch"}}>
            "{currentQ.sample}"
          </p>
        </div>

        <p style={{fontSize:"14px", color:C.mid, marginBottom:"0.5rem", fontWeight:500,
          textTransform:"uppercase", letterSpacing:"0.08em"}}>
          Which language is this?
        </p>

        {/* 4 options */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:"1rem"}}>
          {currentQ.options.map(opt=>{
            const isCorrect = opt.name===currentQ.lang.name;
            const isWrong = opt.name===selected && !isCorrect;
            let bg=C.white, border=`2px solid ${C.border}`, color=C.dark, icon=null;
            if(selected){
              if(isCorrect){bg="#EBF7EF"; border=`2px solid ${C.success}`; color=C.success; icon="✓";}
              else if(isWrong){bg="#FDECEA"; border=`2px solid ${C.error}`; color=C.error; icon="✗";}
            }
            return (
              <button key={opt.name} onClick={()=>handleSelect(opt.name)}
                disabled={!!selected}
                aria-pressed={opt.name===selected}
                style={{...btnBase, background:bg, border, color, padding:"0.6rem 0.85rem",
                  textAlign:"left", justifyContent:"flex-start", minHeight:"52px",
                  fontSize:"15px", fontWeight:400, gap:6,
                  cursor:selected?"default":"pointer",
                  opacity:selected&&!isCorrect&&!isWrong?0.5:1,
                  transition:TRANSITION}}>
                {icon&&<span aria-hidden="true" style={{fontWeight:700, fontSize:"16px"}}>{icon}</span>}
                {opt.name}
              </button>
            );
          })}
        </div>

        {/* Reveal panel (only on correct) */}
        {phase==="reveal" && results.length>0 && (
          <div style={{background:C.fog, borderRadius:14, padding:"1rem 1.25rem",
            marginBottom:"0.75rem", border:`1px solid ${C.border}`}}>
            <p style={{fontSize:"16px", fontWeight:600, color:C.success, margin:"0 0 8px"}}>
              ✓ Correct! Keep going!
            </p>
            <div style={{padding:"0.75rem 1rem", background:C.white, borderRadius:10,
              borderLeft:`4px solid ${C.sky}`, marginBottom:10, border:`1px solid ${C.border}`}}>
              <p style={{fontSize:"14px", color:C.dark, margin:"0 0 6px", fontStyle:"italic", lineHeight:1.6}}>
                "{currentQ.sample}"
              </p>
              <p style={{fontSize:"13px", color:C.mid, margin:0, lineHeight:1.5}}>"{currentQ.translation}"</p>
            </div>
            {currentQ.lang.tip&&(
              <div style={{padding:"0.65rem 0.85rem", background:`${C.ocean}0F`, borderRadius:10,
                borderLeft:`4px solid ${C.ocean}`, marginBottom:10, border:`1px solid ${C.ocean}25`}}>
                <p style={{fontSize:"12px", color:C.ocean, fontWeight:600, margin:"0 0 3px"}}>How to spot {currentQ.lang.name}</p>
                <p style={{fontSize:"13px", color:C.dark, margin:0, lineHeight:1.5}}>{currentQ.lang.tip}</p>
              </div>
            )}
            <div style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginBottom:12}}>
              <FamilyTag family={currentQ.lang.family}/>
              <DiffBadge name={currentQ.lang.name}/>
              <span style={{fontSize:"13px", color:C.mid}}>{currentQ.lang.speakers}</span>
            </div>
            <button onClick={next}
              style={{...primaryBtn, width:"100%", justifyContent:"center"}}>
              Next question →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// ── BLITZ MODE (60 seconds) ───────────────────────────────────────────────
function BlitzGame({onDone, onHome}) {
  const BLITZ_TIME=60;
  const pool=useRef(shuffle(LANGUAGES));
  const poolIdx=useRef(0);
  const [currentQ,setCurrentQ]=useState(()=>{
    const lang=pool.current[0];
    const q=pickQuote(lang);
    return {lang,options:getOptions(lang,LANGUAGES),sample:q.s,translation:q.t};
  });
  const [selected,setSelected]=useState(null);
  const [scores,setScores]=useState([]);
  const [results,setResults]=useState([]);
  const [phase,setPhase]=useState("question");
  const [timeLeft,setTimeLeft]=useState(BLITZ_TIME);
  const [streak,setStreak]=useState(0);
  const [showCorrect,setShowCorrect]=useState(null);
  const globalTimerRef=useRef(null);
  const doneRef=useRef(false);
  const resultsRef=useRef([]);
  const scoresRef=useRef([]);

  // Keep refs in sync so the timer callback can access latest state
  useEffect(()=>{resultsRef.current=results;},[results]);
  useEffect(()=>{scoresRef.current=scores;},[scores]);

  useEffect(()=>{
    globalTimerRef.current=setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){
          clearInterval(globalTimerRef.current);
          if(!doneRef.current){
            doneRef.current=true;
            // Use setTimeout to ensure state updates have flushed
            setTimeout(()=>onDone(resultsRef.current,scoresRef.current,"blitz"),100);
          }
          return 0;
        }
        return t-1;
      });
    },1000);
    return()=>clearInterval(globalTimerRef.current);
  },[]);

  function handleSelect(opt){
    if(selected||doneRef.current) return;
    const q=currentQ;
    const base=baseScore(opt,q.lang,LANGUAGES);
    const correct = base===10;
    const newStreak=correct?streak+1:0;
    setStreak(newStreak);
    const s=correct?1:0; // 1pt correct, 0pt wrong
    setSelected(opt);
    setScores(p=>[...p,s]);
    setResults(p=>[...p,{lang:q.lang,sample:q.sample,translation:q.translation,guessed:opt,score:s,base,timeLeft:15,streak:newStreak}]);
    if(correct) setShowCorrect({lang:q.lang,score:1});
    setPhase("reveal");
  }

  function next(){
    if(doneRef.current){onDone(resultsRef.current,scoresRef.current,"blitz");return;}
    poolIdx.current++;
    if(poolIdx.current>=pool.current.length){pool.current=shuffle(LANGUAGES);poolIdx.current=0;}
    const lang=pool.current[poolIdx.current];
    const q=pickQuote(lang);
    setCurrentQ({lang,options:getOptions(lang,LANGUAGES),sample:q.s,translation:q.t});
    setSelected(null);setPhase("question");
  }

  const total=parseFloat(scores.reduce((a,b)=>a+b,0).toFixed(1));
  const correct=results.filter(r=>r.base===10).length;

  return (
    <main style={{maxWidth:560,margin:"0 auto",fontFamily:"sans-serif",color:C.dark}}>
      {showCorrect&&<CorrectPopup lang={showCorrect.lang} score={showCorrect.score} onDone={()=>setShowCorrect(null)}/>}
      <GameNav onHome={onHome}/>
      <div style={{padding:"1rem 1rem"}}>
      <header style={{marginBottom:"0.75rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:"20px"}} aria-hidden="true">🟡</span>
            <span style={{fontSize:"16px",fontWeight:600,color:C.dark}}>Blitz</span>
            <span style={{fontSize:"14px",color:C.mid}}>· {correct} correct · {total} pts</span>
          </div>
        </div>
        <BlitzTimer timeLeft={timeLeft} total={BLITZ_TIME}/>
      </header>
      {streak>=2&&phase==="question"&&(
        <p role="status" style={{fontSize:"14px",color:C.coral,fontWeight:600,margin:"0 0 8px",
          padding:"4px 12px",background:`${C.coral}15`,borderRadius:8,display:"inline-block",
          border:`1px solid ${C.coral}30`}}>
          {streak} streak!
        </p>
      )}
      <QuestionCard q={currentQ} selected={selected} onSelect={handleSelect}
        phase={phase} lastResult={results[results.length-1]}
        onNext={next} isLast={timeLeft<=3}
        showTimer={false} timeLeft={15} hideTip={true} hideMeta={true}/>
      </div>
    </main>
  );
}

// ── DONE SCREEN ───────────────────────────────────────────────────────────
function Done({results,scores,mode,onRestart,leaderboard,setLeaderboard}) {
  const [nickname,setNickname]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const correct = results.filter(r=>r.base===10).length;
  const pct = results.length>0 ? Math.round((correct/results.length)*100) : 0;
  const total = mode==="survival" || mode==="blitz"
    ? correct
    : parseFloat(scores.reduce((a,b)=>a+b,0).toFixed(1));
  const survivalStreak = results.length>0 && results[results.length-1].base!==10
    ? results.filter(r=>r.base===10).length
    : correct;
  const modeLabels={classic:`${correct}/${results.length} correct`,survival:`${survivalStreak} correct in a row`,blitz:`${correct} correct in 60s`};
  const label=mode==="survival"?(results.length<=3?"Better luck next time":results.length<=8?"Good run!":"Unstoppable!"):
    pct===100?"Polyglot legend":pct>=70?"Language lover":pct>=50?"Decent detective":"Keep exploring!";

  const gameUrl="https://languageguessr.com/";
  const modeEmoji={classic:"🔵",survival:"🔴",blitz:"🟡"};
  const survivalShareLines = results.map((r,i)=>`Q${i+1}: ${r.guessed===r.lang.name?"✅":"❌"} ${r.lang.name}`).join("\n");
  const classicBlitzShareLines = results.slice(0,6).map((r,i)=>`Q${i+1}: ${r.guessed===r.lang.name?"✅":"❌"} (${r.score}/13)`).join("\n");
  const shareText = mode==="survival"
    ? `🔴 LanguageGuessr (Survival Mode)\n\nI got ${total} correct in a row ☀️\nTry to beat me: ${gameUrl}\n\n${survivalShareLines}`
    : mode==="blitz"
      ? `🟡 LanguageGuessr (Blitz Mode)\n\nI got ${total} correct in 60s ☀️\nTry to beat me: ${gameUrl}\n\n${classicBlitzShareLines}`
      : `${modeEmoji[mode]||"🌍"} LanguageGuessr (${mode.charAt(0).toUpperCase()+mode.slice(1)} Mode)\n\nI scored ${total} pts ☀️\nTry to beat me: ${gameUrl}\n\n${classicBlitzShareLines}`;

  async function submitScore(){
    if(!nickname.trim()) return;
    const entry={
      name:nickname.trim(),score:total,mode,
      date:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"2-digit"})
    };
    try{
      const r=await fetch("/api/leaderboard",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify(entry),
      });
      const board=await r.json();
      if(Array.isArray(board)) setLeaderboard(board);
    }catch(e){
      // Sort per-mode so survival/blitz counts aren't compared against classic pts
      const allEntries=[...leaderboard,entry];
      const board=allEntries.sort((a,b)=>{
        if((a.mode||"classic")===(b.mode||"classic")) return b.score-a.score;
        return b.score-a.score; // fallback: still sort by score but API handles proper separation
      }).slice(0,20);
      setLeaderboard(board);
      try{localStorage.setItem("lg_leaderboard",JSON.stringify(board));}catch(e2){}
    }
    setSubmitted(true);
  }

  return (
    <main style={{maxWidth:500,margin:"0 auto",padding:"1.75rem 1rem",fontFamily:"sans-serif",color:C.dark}}>
      {/* Score summary */}
      <section style={{textAlign:"center",marginBottom:"1.5rem"}} aria-label="Your score">
        <p style={{fontSize:"13px",color:C.muted,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600}}>
          {mode.charAt(0).toUpperCase()+mode.slice(1)} mode · {modeLabels[mode]}
        </p>
        <div style={{fontSize:"52px",fontWeight:700,color:C.ocean,letterSpacing:"-2px",lineHeight:1}}>
          {mode==="survival" || mode==="blitz"
            ? <>{total}<span style={{fontSize:"22px",color:C.muted,fontWeight:400}}> correct</span></>
            : <>{total}<span style={{fontSize:"22px",color:C.muted,fontWeight:400}}> pts</span></>
          }
        </div>
        <p style={{fontSize:"18px",color:C.mid,margin:"8px 0 12px",fontWeight:500}}>{label}</p>
      </section>

      {/* Leaderboard submit */}
      <section aria-label="Leaderboard" style={{background:C.fog,borderRadius:14,
        padding:"1rem 1.25rem",marginBottom:"1.25rem",border:`1px solid ${C.border}`}}>
        {!submitted?(
          <>
            <h2 style={{fontSize:"15px",fontWeight:600,color:C.dark,margin:"0 0 0.75rem"}}>
              Add your score to the leaderboard
            </h2>
            <div style={{display:"flex",gap:8}}>
              <label htmlFor="nickname" style={{position:"absolute",width:1,height:1,overflow:"hidden",clip:"rect(0,0,0,0)"}}>
                Your nickname
              </label>
              <input id="nickname" value={nickname} onChange={e=>setNickname(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&submitScore()}
                placeholder="Your nickname..." maxLength={20} autoComplete="nickname"
                style={{flex:1,padding:"0 0.75rem",borderRadius:8,border:`2px solid ${C.border}`,
                  fontSize:"16px",background:C.white,color:C.dark,outline:"none",height:"44px",
                  fontFamily:"inherit"}}/>
              <button onClick={submitScore} disabled={!nickname.trim()}
                style={{...primaryBtn,padding:"0 1.25rem",background:nickname.trim()?C.ocean:"#B0B0AC",
                  borderColor:nickname.trim()?C.ocean:"#B0B0AC",cursor:nickname.trim()?"pointer":"not-allowed"}}>
                Submit
              </button>
            </div>
          </>
        ):(
          <>
            <h2 style={{fontSize:"15px",fontWeight:600,color:C.dark,margin:"0 0 0.75rem"}}>
              🌍 Global leaderboard
            </h2>
            {leaderboard.slice(0,5).map((e,i)=>{
              const medals=["🥇","🥈","🥉","4️⃣","5️⃣"];
              return (
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"7px 0",borderBottom:i<Math.min(leaderboard.length,5)-1?`1px solid ${C.fogDk}`:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span aria-hidden="true" style={{fontSize:"18px"}}>{medals[i]}</span>
                    <div>
                      <p style={{fontSize:"15px",color:i===0?C.coral:C.dark,fontWeight:i===0?600:400,margin:"0 0 1px"}}>{e.name}</p>
                      <p style={{fontSize:"12px",color:C.muted,margin:0}}>{e.mode||"classic"} · {e.date}</p>
                    </div>
                  </div>
                  <span style={{fontSize:"16px",fontWeight:700,color:C.ocean}}>
                    {e.score}<span style={{fontSize:"12px",color:C.muted,fontWeight:400}}>
                      {(e.mode==="survival"||e.mode==="blitz")?" correct":" pts"}
                    </span>
                  </span>
                </div>
              );
            })}
          </>
        )}
      </section>

      {/* Per-question results */}
      <section aria-label="Round breakdown" style={{marginBottom:"1.5rem"}}>
        <h2 style={{fontSize:"14px",fontWeight:600,color:C.mid,margin:"0 0 0.75rem",
          textTransform:"uppercase",letterSpacing:"0.06em"}}>Round breakdown</h2>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {results.map((r,i)=>(
            <article key={i} style={{background:C.fog,borderRadius:12,padding:"0.85rem 1rem",
              border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span aria-hidden="true" style={{fontSize:"16px"}}>{r.guessed===r.lang.name?"✅":"❌"}</span>
                  <span style={{fontSize:"15px",fontWeight:600,color:C.dark}}>{r.lang.name}</span>
                  {r.guessed!==r.lang.name&&<span style={{fontSize:"13px",color:C.mid}}>you said: {r.guessed}</span>}
                </div>
                <span style={{fontSize:"15px",fontWeight:700,
                  color:mode==="survival"||mode==="blitz"
                    ?(r.base===10?C.success:C.error)
                    :(r.score>=10?C.success:r.score>=5?C.earth:C.muted)}}>
                  {mode==="survival"||mode==="blitz"
                    ?(r.base===10?"✓ Correct":"✗ Wrong")
                    :`${r.score}/13`}
                </span>
              </div>
              {/* Quote + translation */}
              <div style={{padding:"0.6rem 0.85rem",background:C.white,borderRadius:8,
                borderLeft:`4px solid ${C.sky}`,marginBottom:8,border:`1px solid ${C.border}`}}>
                <p style={{fontSize:"13px",color:C.dark,margin:"0 0 4px",fontStyle:"italic",lineHeight:1.6}}>
                  "{r.sample}"
                </p>
                <p style={{fontSize:"12px",color:C.mid,margin:0,lineHeight:1.5}}>"{r.translation}"</p>
              </div>
              {/* Tip */}
              {r.lang.tip&&(
                <div style={{padding:"0.5rem 0.75rem",background:`${C.ocean}0F`,borderRadius:8,
                  borderLeft:`4px solid ${C.ocean}`,marginBottom:8,border:`1px solid ${C.ocean}25`}}>
                  <p style={{fontSize:"12px",color:C.ocean,fontWeight:600,margin:"0 0 3px"}}>How to spot {r.lang.name}</p>
                  <p style={{fontSize:"13px",color:C.dark,margin:0,lineHeight:1.5}}>{r.lang.tip}</p>
                </div>
              )}
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <FamilyTag family={r.lang.family}/>
                <DiffBadge name={r.lang.name}/>
                <span style={{fontSize:"12px",color:C.mid}}>{r.lang.speakers}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div style={{display:"flex",gap:8}}>
        <button onClick={onRestart} style={{...outlineBtn,flex:1,justifyContent:"center"}}>
          Play again
        </button>
        {typeof navigator!=="undefined"&&navigator.share?(
          <button onClick={()=>navigator.share({title:"LanguageGuessr",text:shareText}).catch(()=>{})}
            style={{...primaryBtn,flex:1,justifyContent:"center"}}>
            Share score
          </button>
        ):(
          <button onClick={()=>navigator.clipboard.writeText(shareText).catch(()=>{})}
            style={{...primaryBtn,flex:1,justifyContent:"center"}}>
            Copy score
          </button>
        )}
      </div>
    </main>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState("home");

  // Inject PWA meta tags for home screen icon
  useEffect(()=>{
    // Apple touch icon
    if(!document.querySelector('link[rel="apple-touch-icon"]')){
      const link=document.createElement('link');
      link.rel='apple-touch-icon';
      link.href='/mainlogo.png';
      document.head.appendChild(link);
    }
    // Manifest
    if(!document.querySelector('link[rel="manifest"]')){
      const manifest={
        name:"LanguageGuessr",
        short_name:"LangGuessr",
        start_url:"/",
        display:"standalone",
        background_color:"#FAFAF8",
        theme_color:"#42708C",
        icons:[
          {src:"/mainlogo.png",sizes:"192x192",type:"image/png"},
          {src:"/mainlogo.png",sizes:"512x512",type:"image/png"}
        ]
      };
      const blob=new Blob([JSON.stringify(manifest)],{type:"application/manifest+json"});
      const url=URL.createObjectURL(blob);
      const link=document.createElement('link');
      link.rel='manifest';
      link.href=url;
      document.head.appendChild(link);
    }
    // Theme color meta
    if(!document.querySelector('meta[name="theme-color"]')){
      const meta=document.createElement('meta');
      meta.name='theme-color';
      meta.content='#42708C';
      document.head.appendChild(meta);
    }
    // Apple mobile web app capable
    if(!document.querySelector('meta[name="apple-mobile-web-app-capable"]')){
      const meta=document.createElement('meta');
      meta.name='apple-mobile-web-app-capable';
      meta.content='yes';
      document.head.appendChild(meta);
    }
  },[]);
  const [mode,setMode]=useState("classic");
  const [showCountdown,setShowCountdown]=useState(false);
  const [pendingMode,setPendingMode]=useState(null);
  const [gameResults,setGameResults]=useState(null);
  const [gameScores,setGameScores]=useState([]);
  const [leaderboard,setLeaderboard]=useState([]);

  useEffect(()=>{
    // Clear old leaderboard data (reset)
    try{localStorage.removeItem("lg_leaderboard");}catch(e){}
    async function load(){
      try{
        const r=await fetch("/api/leaderboard?level=all");
        const data=await r.json();
        if(Array.isArray(data)) setLeaderboard(data);
      }catch(e){
        // Start fresh - no local fallback after reset
      }
    }
    load();
  },[]);

  function handleStart(m){
    setPendingMode(m);
    setShowCountdown(true);
  }

  function handleCountdownDone(){
    setShowCountdown(false);
    setMode(pendingMode);
    setScreen("game");
  }

  function handleDone(results,scores,m){
    setGameResults(results);
    setGameScores(scores);
    setMode(m);
    setScreen("done");
  }

  function handleRestart(){
    setGameResults(null);
    setGameScores([]);
    setScreen("home");
  }

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#FAFAF8;color:${C.dark};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
        button:focus-visible,a:focus-visible,input:focus-visible{
          outline:3px solid ${C.ocean};outline-offset:2px;border-radius:6px;
        }
        button:hover:not(:disabled){filter:brightness(0.93);}
        @media(prefers-reduced-motion:reduce){
          *,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important;}
        }
        @media(max-width:400px){body{font-size:15px;}}
      `}</style>

      {showCountdown&&<CountdownOverlay onDone={handleCountdownDone}/>}

      {screen==="home"&&<Home onStart={handleStart} leaderboard={leaderboard}/>}

      {screen==="game"&&mode==="classic"&&
        <ClassicGame onDone={handleDone} onHome={handleRestart}/>}
      {screen==="game"&&mode==="survival"&&
        <SurvivalGame onDone={handleDone} onHome={handleRestart}/>}
      {screen==="game"&&mode==="blitz"&&
        <BlitzGame onDone={handleDone} onHome={handleRestart}/>}

      {screen==="done"&&gameResults&&
        <Done results={gameResults} scores={gameScores} mode={mode}
          onRestart={handleRestart} leaderboard={leaderboard} setLeaderboard={setLeaderboard}/>}
    </>
  );
}
