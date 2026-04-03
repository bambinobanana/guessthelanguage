import { useState, useEffect, useRef } from "react";

const C = {
  ocean:"#42708C", sky:"#7EADBF", earth:"#8C6746", coral:"#F25A38",
  fog:"#F2F2F2", white:"#FFFFFF", dark:"#2C2C2A", mid:"#5F5E5A", light:"#B4B2A9",
};

const FAMILY_COLOR = {
  "Romance":"#F25A38","Germanic":"#7EADBF","Slavic":"#42708C","Semitic":"#8C6746",
  "Sino-Tibetan":"#C0796A","Japonic":"#D4906A","Koreanic":"#5A9BAD","Austroasiatic":"#6B9E8C",
  "Kra-Dai":"#9BBFCE","Indo-Iranian":"#B8875A","Turkic":"#A07850","Niger-Congo (Bantu)":"#7DA870",
  "Niger-Congo":"#7DA870","Austronesian":"#6EAAB5","Hellenic":"#7B8CC2","Uralic":"#8FAABC",
  "Kartvelian":"#C08090","Mongolic":"#9E8870","Hmong-Mien":"#B07AB0","Quechuan":"#C09A40",
  "Mayan":"#70A890","Na-Dene":"#A08060","Dravidian":"#C07860","Uto-Aztecan":"#B09060",
  "Tupian":"#80A870","Afro-Asiatic":"#B89060","Tibeto-Burman":"#9080C0",
  "Indo-European (isolate)":"#A090C0","Celtic":"#6080A0","Baltic":"#80A0A0",
  "Language isolate":"#A0A080","Mongolic (vertical)":"#8070A0",
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
  "Guarani":"🇵🇾","Maya (Yucatec)":"🇲🇽","Navajo":"🇺🇸","Hawaiian":"🇺🇸","Maori":"🇳🇿",
  "Tibetan":"🏔️","Wolof":"🇸🇳","Tigrinya":"🇪🇷","Tetum":"🇹🇱",
  "Catalan":"🏳️","Galician":"🏴","Basque":"🏴","Welsh":"🏴",
  "Irish":"🇮🇪","Scottish Gaelic":"🏴","Breton":"🏳️","Maltese":"🇲🇹",
  "Albanian":"🇦🇱","Macedonian":"🇲🇰","Slovenian":"🇸🇮","Croatian":"🇭🇷",
  "Slovak":"🇸🇰","Lithuanian":"🇱🇹","Latvian":"🇱🇻","Estonian":"🇪🇪",
  "Belarusian":"🇧🇾","Luxembourgish":"🇱🇺","Faroese":"🇫🇴","Icelandic":"🇮🇸",
  "Afrikaans":"🇿🇦","Occitan":"🏳️","Azerbaijani":"🇦🇿","Uzbek":"🇺🇿",
  "Kazakh":"🇰🇿","Kyrgyz":"🇰🇬","Tajik":"🇹🇯","Pashto":"🇦🇫","Sinhala":"🇱🇰",
  "Lao":"🇱🇦","Tagalog":"🇵🇭","Malay":"🇲🇾","Javanese":"🇮🇩","Uyghur":"🌏",
  "Marathi":"🇮🇳","Gujarati":"🇮🇳","Punjabi":"🇮🇳","Odia":"🇮🇳","Dzongkha":"🇧🇹",
};

const CONGRATS = [
  "Nailed it! 🎯","You legend! 🌟","Spot on! ✨","Impressive! 🔥","Brilliant! 💡",
  "Outstanding! 🏆","Sharp eye! 👁️","Polyglot vibes! 🌍","That's the one! 💪","Unstoppable! 🚀",
];

const LANGUAGES = [
  // ── ROMANCE ──
  { name:"French", family:"Romance", region:"Europe", script:"Latin", speakers:"~310M",
    tip:"Look for accented vowels like é, è, ê and the cedilla ç. The combination eau and frequent apostrophes are very French.",
    confusables:["Italian","Spanish","Portuguese","Romanian","Catalan"],
    quotes:[
      {s:"La seule façon de faire du bon travail est d'aimer ce que vous faites.",t:"The only way to do great work is to love what you do."},
      {s:"La vie est ce qui se passe pendant qu'on fait d'autres projets.",t:"Life is what happens while you are busy making other plans."},
      {s:"Soyez le changement que vous voulez voir dans le monde.",t:"Be the change you wish to see in the world."},
    ]},
  { name:"Spanish", family:"Romance", region:"Europe / Americas", script:"Latin", speakers:"~500M",
    tip:"Spot the inverted question mark and exclamation mark at sentence starts. The letter n with tilde and ll or rr combinations are distinctively Spanish.",
    confusables:["Portuguese","Italian","French","Romanian","Catalan"],
    quotes:[
      {s:"No importa cuán lento vayas, siempre y cuando no te detengas.",t:"It does not matter how slowly you go, as long as you do not stop."},
      {s:"La vida es sueño, y los sueños, sueños son.",t:"Life is a dream, and dreams are just dreams."},
      {s:"Dime con quién andas y te diré quién eres.",t:"Tell me who you walk with and I will tell you who you are."},
    ]},
  { name:"Portuguese", family:"Romance", region:"Europe / Americas", script:"Latin", speakers:"~260M",
    tip:"Look for unique nasal vowels with tilde like ao and oe, and words ending in -ao and -cao. The letters lh and nh are distinctive.",
    confusables:["Spanish","Italian","French","Romanian","Galician"],
    quotes:[
      {s:"A vida é o que acontece enquanto estamos ocupados fazendo outros planos.",t:"Life is what happens while we are busy making other plans."},
      {s:"Quem não arrisca não petisca.",t:"Nothing ventured, nothing gained."},
      {s:"A sabedoria começa com o silêncio.",t:"Wisdom begins with silence."},
    ]},
  { name:"Italian", family:"Romance", region:"Europe", script:"Latin", speakers:"~67M",
    tip:"Italian loves double consonants like ll, tt, cc and words ending in vowels. Look for -zione and -mente endings.",
    confusables:["Spanish","Portuguese","French","Romanian"],
    quotes:[
      {s:"La vita è bella quando hai qualcuno con cui condividerla.",t:"Life is beautiful when you have someone to share it with."},
      {s:"Chi dorme non piglia pesci.",t:"He who sleeps does not catch fish."},
      {s:"Tutto è bene quel che finisce bene.",t:"All is well that ends well."},
    ]},
  { name:"Romanian", family:"Romance", region:"Europe", script:"Latin", speakers:"~24M",
    tip:"Romanian is unique among Romance languages for letters a-breve, a-circumflex, i-circumflex, s-comma, t-comma. It looks vaguely Italian but has Slavic-influenced spellings.",
    confusables:["Italian","Spanish","Portuguese","French"],
    quotes:[
      {s:"Omul sfințește locul, nu locul pe om.",t:"The person sanctifies the place, not the place the person."},
      {s:"Graba strică treaba.",t:"Haste makes waste."},
      {s:"Vorba dulce mult aduce.",t:"Sweet words bring much."},
    ]},
  { name:"Catalan", family:"Romance", region:"Europe", script:"Latin", speakers:"~10M",
    tip:"Catalan looks like a blend of Spanish and French. Key giveaways: the midpoint dot in words like col-legi, endings like -cio and -ment. No n-tilde unlike Spanish.",
    confusables:["Spanish","Portuguese","French","Italian","Occitan"],
    quotes:[
      {s:"Qui no s'arrisca, no pisca.",t:"Nothing ventured, nothing gained."},
      {s:"Val més tard que mai.",t:"Better late than never."},
      {s:"L'home proposa i Déu disposa.",t:"Man proposes and God disposes."},
    ]},
  { name:"Galician", family:"Romance", region:"Europe", script:"Latin", speakers:"~2.4M",
    tip:"Galician looks very close to Portuguese with nh and lh digraphs. Unlike Spanish there is no n-tilde. Very similar to old Portuguese and confusable with both Spanish and Portuguese.",
    confusables:["Portuguese","Spanish","Catalan","Italian","Occitan"],
    quotes:[
      {s:"Quen non arrisca, non gaña.",t:"He who does not risk, does not gain."},
      {s:"A lingua é a alma do pobo.",t:"Language is the soul of the people."},
      {s:"Máis vale tarde que nunca.",t:"Better late than never."},
    ]},
  { name:"Occitan", family:"Romance", region:"Europe", script:"Latin", speakers:"~200K",
    tip:"Occitan looks like a blend of French, Spanish, and Catalan. Look for words ending in -oc and -al. Often confused with Catalan.",
    confusables:["Catalan","French","Spanish","Italian","Galician"],
    quotes:[
      {s:"La lenga es l'ama del pòble.",t:"Language is the soul of the people."},
      {s:"Qui cerca, trapa.",t:"He who seeks, finds."},
    ]},

  // ── GERMANIC ──
  { name:"German", family:"Germanic", region:"Europe", script:"Latin", speakers:"~135M",
    tip:"German capitalizes ALL nouns. Look for long compound words, umlauts a-umlaut, o-umlaut, u-umlaut and the sharp letter eszett.",
    confusables:["Dutch","Swedish","Norwegian","Danish","Luxembourgish"],
    quotes:[
      {s:"Der Mensch wächst mit seinen Aufgaben.",t:"A person grows with their tasks."},
      {s:"Übung macht den Meister.",t:"Practice makes perfect."},
      {s:"Was dich nicht umbringt, macht dich stärker.",t:"What does not kill you makes you stronger."},
    ]},
  { name:"Dutch", family:"Germanic", region:"Europe", script:"Latin", speakers:"~25M",
    tip:"Dutch has distinctive double vowels like aa, ee, oo and the unique ij digraph. Look for de, het, een and the sch combination.",
    confusables:["German","Afrikaans","Swedish","Norwegian","Danish"],
    quotes:[
      {s:"Wie niet waagt, die niet wint.",t:"Who dares not, wins not."},
      {s:"Oost west, thuis best.",t:"East or west, home is best."},
      {s:"Goed voorbeeld doet goed volgen.",t:"Good example leads to good following."},
    ]},
  { name:"Swedish", family:"Germanic", region:"Europe", script:"Latin", speakers:"~13M",
    tip:"Swedish has three extra letters: a-ring, a-umlaut, o-umlaut. Distinctive words include och meaning and and att meaning to. Cleaner-looking than German.",
    confusables:["Norwegian","Danish","Dutch","German","Finnish"],
    quotes:[
      {s:"Det är inte hur långt du faller, utan hur högt du studsar.",t:"It is not how far you fall, but how high you bounce."},
      {s:"Lär av gårdagen, lev för idag, hoppas på morgondagen.",t:"Learn from yesterday, live for today, hope for tomorrow."},
      {s:"Den som gapar efter mycket mister ofta hela stycket.",t:"He who grabs for too much often loses it all."},
    ]},
  { name:"Norwegian", family:"Germanic", region:"Europe", script:"Latin", speakers:"~5M",
    tip:"Norwegian shares a-ring, ae, o-slash with Danish. Very similar to Swedish but uses ikke for not. Look for words ending in -ig and -lig.",
    confusables:["Swedish","Danish","Dutch","German","Faroese"],
    quotes:[
      {s:"Det er ikke fjellene foran deg som sliter deg ut, men steinen i skoen din.",t:"It is not the mountains ahead that wear you out, but the pebble in your shoe."},
      {s:"Den som ler sist, ler best.",t:"He who laughs last, laughs best."},
      {s:"Veien blir til mens du går.",t:"The road is made by walking."},
    ]},
  { name:"Icelandic", family:"Germanic", region:"Europe", script:"Latin", speakers:"~370K",
    tip:"Icelandic uniquely preserves eth and thorn from Old Norse. Look for the thorn letter at word starts pronounced th and eth in the middle of words. Also uses a-acute, e-acute, i-acute, o-acute, u-acute, y-acute, o-umlaut, ae.",
    confusables:["Faroese","Norwegian","Danish","Swedish"],
    quotes:[
      {s:"Þolinmæði er móðir allra dyggða.",t:"Patience is the mother of all virtues."},
      {s:"Sá er vitr, er þegir.",t:"He is wise who stays silent."},
      {s:"Lífið er stutt, nýttu það vel.",t:"Life is short, use it well."},
    ]},
  { name:"Faroese", family:"Germanic", region:"Europe", script:"Latin", speakers:"~72K",
    tip:"Faroese looks like Icelandic with some Norwegian influence. Uses eth, and the letters a-acute, i-acute, o-acute, u-acute, y-acute, ae, o-slash. The combination hv pronounced kv and gj are distinctive.",
    confusables:["Icelandic","Norwegian","Danish","Swedish"],
    quotes:[
      {s:"Tað sum ikki drepur, harðnar.",t:"What does not kill you makes you stronger."},
      {s:"Tíðin fer, men minningar liva.",t:"Time passes, but memories live on."},
    ]},
  { name:"Luxembourgish", family:"Germanic", region:"Europe", script:"Latin", speakers:"~390K",
    tip:"Luxembourgish looks like German but with French loanwords. The letter combinations ae-i and e-acute-i are distinctive. Words like Ech meaning I and ass meaning is are giveaways.",
    confusables:["German","Dutch","French","Afrikaans"],
    quotes:[
      {s:"Wann een net probéiert, kann een net gewannen.",t:"If one does not try, one cannot win."},
      {s:"D'Sprooch ass d'Séil vum Vollek.",t:"Language is the soul of the people."},
    ]},
  { name:"Afrikaans", family:"Germanic", region:"Africa / Europe origin", script:"Latin", speakers:"~7M",
    tip:"Afrikaans looks like simplified Dutch with no grammatical gender and no verb conjugation for person. Words like die meaning the, is, nie meaning not and van appear very frequently. The double negative nie...nie is a unique giveaway.",
    confusables:["Dutch","German","Flemish"],
    quotes:[
      {s:"'n Boer maak 'n plan.",t:"A farmer makes a plan, meaning resourcefulness."},
      {s:"Sonder taal, sonder siel.",t:"Without language, without soul."},
      {s:"Geduld is 'n deug.",t:"Patience is a virtue."},
    ]},

  // ── SLAVIC ──
  { name:"Russian", family:"Slavic", region:"Europe / Asia", script:"Cyrillic", speakers:"~258M",
    tip:"Russian Cyrillic has unique letters Zh, Shch, hard sign, Yeru, E-reverse. Look for the hard sign and the letter Yeru which are unique to Russian.",
    confusables:["Ukrainian","Bulgarian","Serbian","Macedonian","Mongolian"],
    quotes:[
      {s:"Не тот велик, кто никогда не падал, а тот велик, кто падал и вставал.",t:"Not the one who never fell is great, but the one who fell and rose again."},
      {s:"Терпение и труд всё перетрут.",t:"Patience and hard work will overcome everything."},
      {s:"Без труда не выловишь и рыбку из пруда.",t:"Without effort you cannot even pull a fish from a pond."},
    ]},
  { name:"Ukrainian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~40M",
    tip:"Ukrainian has unique letters I-dotted, Yi, Ye, and hard G not found in Russian. It also lacks the Russian hard sign and Yeru.",
    confusables:["Russian","Bulgarian","Serbian","Macedonian","Belarusian"],
    quotes:[
      {s:"Де є воля, там є і шлях.",t:"Where there is a will, there is a way."},
      {s:"Не май сто рублів, а май сто друзів.",t:"Do not have a hundred rubles, have a hundred friends."},
      {s:"Хто рано встає, тому Бог дає.",t:"God gives to those who rise early."},
    ]},
  { name:"Bulgarian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~8M",
    tip:"Bulgarian Cyrillic looks similar to Russian but uses the hard sign frequently as a vowel meaning uh. It has no Yeru, Yo, or E-reverse like Russian.",
    confusables:["Russian","Ukrainian","Macedonian","Serbian","Mongolian"],
    quotes:[
      {s:"Търпението е горчиво, но плодовете му са сладки.",t:"Patience is bitter, but its fruits are sweet."},
      {s:"Каквото посееш, това ще пожънеш.",t:"You reap what you sow."},
      {s:"Без мъка няма наука.",t:"No pain, no gain."},
    ]},
  { name:"Serbian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~12M",
    tip:"Serbian Cyrillic includes Lj, Nj, Dzh letters not in Russian or Ukrainian. These represent sounds lj, nj, dz unique to South Slavic languages.",
    confusables:["Russian","Bulgarian","Ukrainian","Macedonian","Mongolian"],
    quotes:[
      {s:"Дунав пролази кроз многе земље Европе и носи са собом историју векова.",t:"The Danube flows through many lands of Europe carrying the history of centuries."},
      {s:"Ко рано рани, две среће граби.",t:"He who rises early catches two fortunes."},
      {s:"Слога и мала сила надвладава велику.",t:"Unity makes even a small force overcome a great one."},
    ]},
  { name:"Macedonian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~2M",
    tip:"Macedonian Cyrillic is very close to Bulgarian and Serbian. Unique letters include soft-G and soft-K not found in Russian or Ukrainian. The definite article is appended to the end of nouns.",
    confusables:["Bulgarian","Serbian","Russian","Ukrainian"],
    quotes:[
      {s:"Трпение носи среќа.",t:"Patience brings happiness."},
      {s:"Знаењето е моќ.",t:"Knowledge is power."},
    ]},
  { name:"Belarusian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~5M",
    tip:"Belarusian Cyrillic is close to Russian and Ukrainian but has the unique letter short-U which looks like a u with a breve above it. This letter appears in no other Cyrillic alphabet.",
    confusables:["Russian","Ukrainian","Bulgarian","Macedonian"],
    quotes:[
      {s:"Хто шукае, той знаходзіць.",t:"He who seeks, finds."},
      {s:"Мова — душа народа.",t:"Language is the soul of the people."},
    ]},
  { name:"Slovenian", family:"Slavic", region:"Europe", script:"Latin", speakers:"~2.5M",
    tip:"Slovenian uses Latin with three extra letters: c-caron, s-caron, z-caron. It has a unique dual grammatical number. Look for the word je meaning is and frequent -ski and -ska endings.",
    confusables:["Croatian","Serbian","Czech","Slovak","Polish"],
    quotes:[
      {s:"Kdor išče, ta najde.",t:"He who seeks, finds."},
      {s:"Bolje vrabec v roki kot golob na strehi.",t:"Better a sparrow in the hand than a pigeon on the roof."},
    ]},
  { name:"Croatian", family:"Slavic", region:"Europe", script:"Latin", speakers:"~5.5M",
    tip:"Croatian uses Latin with c-caron, c-acute, s-caron, z-caron, d-stroke. The letters c-acute and d-stroke distinguish it from Serbian. Look for the word nije meaning is not.",
    confusables:["Slovenian","Serbian","Slovak","Czech"],
    quotes:[
      {s:"Bolje spriječiti nego liječiti.",t:"Better to prevent than to cure."},
      {s:"Tko traži, taj i nalazi.",t:"He who seeks, finds."},
    ]},
  { name:"Slovak", family:"Slavic", region:"Europe", script:"Latin", speakers:"~5M",
    tip:"Slovak uses Latin with c-caron, s-caron, z-caron and uniquely the letters l-caron soft l and syllabic consonants with accent. The caron and acute diacritics appear frequently. Similar to Czech but distinct.",
    confusables:["Czech","Slovenian","Polish","Croatian","Ukrainian"],
    quotes:[
      {s:"Kde je vôľa, tam je aj cesta.",t:"Where there is a will, there is a way."},
      {s:"Trpezlivosť ruže prináša.",t:"Patience brings roses."},
    ]},
  { name:"Polish", family:"Slavic", region:"Europe", script:"Latin", speakers:"~45M",
    tip:"Polish uses Latin but with many unique letters: a-ogonek, c-acute, e-ogonek, l-stroke, n-acute, o-acute, s-acute, z-acute, z-dot. The l-stroke pronounced like English w is a strong giveaway.",
    confusables:["Czech","Slovak","Belarusian","Lithuanian","Ukrainian"],
    quotes:[
      {s:"Polska kuchnia jest bogata w smaki i tradycje.",t:"Polish cuisine is rich in flavors and traditions."},
      {s:"Nie ma tego złego, co by na dobre nie wyszło.",t:"There is no evil that does not turn into something good."},
    ]},
  { name:"Czech", family:"Slavic", region:"Europe", script:"Latin", speakers:"~11M",
    tip:"Czech uses Latin with c-caron, d-caron, e-caron, n-caron, r-caron, s-caron, t-caron, z-caron. The r-caron is a unique consonant not found in any other language. Look for the word je and common -ost endings.",
    confusables:["Slovak","Polish","Slovenian","Croatian"],
    quotes:[
      {s:"Praha je jedno z nejkrásnějších měst v Evropě.",t:"Prague is one of the most beautiful cities in Europe."},
      {s:"Kdo hledá, ten najde.",t:"He who seeks, finds."},
    ]},

  // ── BALTIC ──
  { name:"Lithuanian", family:"Baltic", region:"Europe", script:"Latin", speakers:"~3M",
    tip:"Lithuanian is one of the oldest living Indo-European languages. Look for letters a-ogonek, c-caron, e-ogonek, e-dot, i-ogonek, s-caron, u-ogonek, u-macron, z-caron. Words tend to be long with many noun case endings.",
    confusables:["Latvian","Estonian","Polish","Finnish"],
    quotes:[
      {s:"Kas ieško, tas randa.",t:"He who seeks, finds."},
      {s:"Geriau vėliau negu niekada.",t:"Better late than never."},
      {s:"Draugystė yra didžiausia vertybė.",t:"Friendship is the greatest value."},
    ]},
  { name:"Latvian", family:"Baltic", region:"Europe", script:"Latin", speakers:"~1.5M",
    tip:"Latvian uses macrons for long vowels like a-macron, e-macron, i-macron, u-macron and has c-caron, g-cedilla, k-cedilla, l-cedilla, n-cedilla, s-caron, z-caron. Almost all nouns end in -s masculine or -a feminine.",
    confusables:["Lithuanian","Estonian","Finnish","Slovenian"],
    quotes:[
      {s:"Kas meklē, tas atrod.",t:"He who seeks, finds."},
      {s:"Labāk vēlu, nekā nekad.",t:"Better late than never."},
      {s:"Valoda ir tautas dvēsele.",t:"Language is the soul of the nation."},
    ]},

  // ── URALIC ──
  { name:"Finnish", family:"Uralic", region:"Europe", script:"Latin", speakers:"~5M",
    tip:"Finnish has no articles, double vowels and consonants everywhere like aa, ee, ll, kk, and very long words. The letters a-umlaut and o-umlaut are common. Words like kylla and ei are very Finnish.",
    confusables:["Estonian","Hungarian","Turkish","Latvian"],
    quotes:[
      {s:"Ei se ole viisas, joka viisaasti ei puhu.",t:"It is not wise who does not speak wisely."},
      {s:"Työ tekijäänsä kiittää.",t:"Work praises its maker."},
      {s:"Parempi myöhään kuin ei milloinkaan.",t:"Better late than never."},
    ]},
  { name:"Hungarian", family:"Uralic", region:"Europe", script:"Latin", speakers:"~13M",
    tip:"Hungarian uses long vowels with double accents: a-acute, e-acute, i-acute, o-acute, o-double-acute, u-acute, u-double-acute. The double-acute o and u are unique to Hungarian.",
    confusables:["Finnish","Estonian","Turkish","Romanian","Czech"],
    quotes:[
      {s:"Aki mer, az nyer.",t:"He who dares, wins."},
      {s:"Lassan járj, tovább érsz.",t:"Go slowly, you will get further."},
      {s:"Több szem többet lát.",t:"More eyes see more."},
    ]},
  { name:"Estonian", family:"Uralic", region:"Europe", script:"Latin", speakers:"~1.1M",
    tip:"Estonian is related to Finnish, not to Latvian or Lithuanian. Look for the unique letter o-tilde, a-umlaut, o-umlaut, u-umlaut. Very long compound words and no grammatical gender.",
    confusables:["Finnish","Latvian","Lithuanian","Hungarian"],
    quotes:[
      {s:"Kus viga näed laita, seal täida ise.",t:"Where you see a fault, fix it yourself."},
      {s:"Töö kiidab tegijat.",t:"Work praises its maker."},
    ]},

  // ── CELTIC ──
  { name:"Welsh", family:"Celtic", region:"Europe", script:"Latin", speakers:"~880K",
    tip:"Welsh uses Latin but with striking consonant clusters: dd like th, ll a voiceless lateral, rh, ch, ng. Words like dw in and mae are distinctively Welsh. Very few vowels by European standards.",
    confusables:["Breton","Irish","Scottish Gaelic"],
    quotes:[
      {s:"Nid aur yw popeth melyn.",t:"All that glitters is not gold."},
      {s:"Heb iaith, heb galon.",t:"Without language, without heart."},
      {s:"Dyfal donc a dyr y garreg.",t:"Persistent tapping breaks the stone."},
    ]},
  { name:"Irish", family:"Celtic", region:"Europe", script:"Latin", speakers:"~1.8M",
    tip:"Irish uses Latin but words change their first letter in mutations: bean becomes mbean or bhean. The combination mh and bh are pronounced v. Very unusual spelling-to-sound relationship.",
    confusables:["Welsh","Scottish Gaelic","Breton"],
    quotes:[
      {s:"Is fearr Gaeilge bhriste ná Béarla cliste.",t:"Broken Irish is better than clever English."},
      {s:"Ní neart go cur le chéile.",t:"There is no strength without unity."},
      {s:"Maireann croí éadrom i bhfad.",t:"A light heart lives longest."},
    ]},
  { name:"Scottish Gaelic", family:"Celtic", region:"Europe", script:"Latin", speakers:"~57K",
    tip:"Scottish Gaelic looks like Irish but uses grave accents only while Irish uses acute. Look for tha meaning is which appears constantly, and apostrophes for contractions.",
    confusables:["Irish","Welsh","Breton"],
    quotes:[
      {s:"Is treasa tuath ná tighearna.",t:"The people are stronger than a lord."},
      {s:"Buannaichidh foighidinn.",t:"Patience will prevail."},
    ]},
  { name:"Breton", family:"Celtic", region:"Europe", script:"Latin", speakers:"~210K",
    tip:"Breton is a Celtic language of northwest France. Look for ch, and frequent z and v. Words often end in consonants unlike French. Resembles Welsh more than French.",
    confusables:["Welsh","Irish","French"],
    quotes:[
      {s:"Ar pezh a vez kavet en douar a vez kavet er galon.",t:"What is found in the earth is found in the heart."},
    ]},

  // ── OTHER EUROPEAN ──
  { name:"Greek", family:"Hellenic", region:"Europe", script:"Greek", speakers:"~13M",
    tip:"Greek uses its own alphabet with letters like alpha, beta, gamma, theta, lambda, phi, psi, omega. Some look like Latin but theta, xi, psi, omega are uniquely Greek.",
    confusables:["Armenian","Georgian","Hebrew","Coptic"],
    quotes:[
      {s:"Η αρχή είναι το ήμισυ του παντός.",t:"The beginning is half of everything."},
      {s:"Γνώθι σαυτόν.",t:"Know thyself."},
      {s:"Ο χρόνος είναι χρήμα.",t:"Time is money."},
    ]},
  { name:"Albanian", family:"Indo-European (isolate)", region:"Europe", script:"Latin", speakers:"~7.5M",
    tip:"Albanian is a language isolate in Indo-European, related to no other living language. Look for the letters e-umlaut as schwa and digraphs dh, gj, ll, nj, rr, sh, th, xh, zh. Many two-letter combinations unique to Albanian.",
    confusables:["Romanian","Serbian","Macedonian","Croatian","Bulgarian"],
    quotes:[
      {s:"Ku ka dashuri, ka jetë.",t:"Where there is love, there is life."},
      {s:"Dija është fuqia më e madhe.",t:"Knowledge is the greatest power."},
      {s:"Kush punon, fitton.",t:"He who works, gains."},
    ]},
  { name:"Maltese", family:"Semitic", region:"Europe", script:"Latin", speakers:"~520K",
    tip:"Maltese is the only Semitic language written in Latin script. It has Arabic roots but heavy Italian and English influence. Look for the unique letters gh with bar, h with bar, and c with dot. A mixture unlike anything else in Europe.",
    confusables:["Arabic","Italian","Hebrew","Catalan"],
    quotes:[
      {s:"Min jitħabat, jirbaħ.",t:"He who strives, wins."},
      {s:"Il-kelma tajba tiftaħ il-bibien kollha.",t:"A good word opens all doors."},
    ]},
  { name:"Basque", family:"Language isolate", region:"Europe", script:"Latin", speakers:"~750K",
    tip:"Basque is a language isolate completely unrelated to any other language. Look for the letter combination tx pronounced ch, tz, ts, and frequent use of k and z. Words ending in -a, -ak, -ean are common.",
    confusables:["Spanish","Catalan","Galician","French"],
    quotes:[
      {s:"Nork bere burua ezagutzen duena, jakintsu da.",t:"He who knows himself is wise."},
      {s:"Hitza hitz, ardoa ardo.",t:"A word is a word, wine is wine. Keep your promises."},
      {s:"Lan egiten duenak, irabazten du.",t:"He who works, earns."},
    ]},
  { name:"Georgian", family:"Kartvelian", region:"Caucasus", script:"Georgian", speakers:"~4M",
    tip:"Georgian script is one of the most distinctive in the world. Round asymmetric letters with curving arms, no capital letters. Looks almost like decorated spirals.",
    confusables:["Armenian","Amharic","Tigrinya","Greek","Hebrew"],
    quotes:[
      {s:"ენა კაცს ჰყავს მონად, ჭკუა კი ბატონად.",t:"The tongue is man's servant, but wisdom is his master."},
      {s:"ვარდი ეკლის გარეშე არ მოდის.",t:"A rose does not come without thorns."},
    ]},
  { name:"Armenian", family:"Indo-European (isolate)", region:"Caucasus", script:"Armenian", speakers:"~8M",
    tip:"Armenian has its own unique alphabet invented in 405 AD. Letters have a medieval angular quality with distinctive shapes. Nothing like Greek or Georgian.",
    confusables:["Georgian","Greek","Amharic","Hebrew"],
    quotes:[
      {s:"Ո՛չ ոք կ'ապրի քո կյանքը, քեզ համար.",t:"No one will live your life for you."},
      {s:"Ժամանակ ոչ ոք չի կարող գնել.",t:"No one can buy time."},
    ]},

  // ── SEMITIC ──
  { name:"Arabic", family:"Semitic", region:"Middle East / Africa", script:"Arabic", speakers:"~422M",
    tip:"Arabic is right-to-left with letters connecting cursively. Dots above and below letters are key. No short vowels are written in standard text.",
    confusables:["Persian (Farsi)","Urdu","Pashto","Uyghur"],
    quotes:[
      {s:"من لم يعرف كيف يقف على المرتفعات لم يعش.",t:"He who has not learned to stand on the heights has not truly lived."},
      {s:"العلم في الصغر كالنقش على الحجر.",t:"Learning in youth is like engraving on stone."},
      {s:"اطلبوا العلم من المهد إلى اللحد.",t:"Seek knowledge from the cradle to the grave."},
    ]},
  { name:"Persian (Farsi)", family:"Indo-Iranian", region:"Middle East", script:"Perso-Arabic", speakers:"~110M",
    tip:"Persian uses Arabic script but has 4 extra letters for sounds not in Arabic. It looks rounder and more flowing than Arabic.",
    confusables:["Arabic","Urdu","Pashto","Dari"],
    quotes:[
      {s:"هر که طاووس خواهد جور هندوستان کشد.",t:"Whoever wants the peacock must endure the thorns of Hindustan."},
      {s:"قطره قطره جمع گردد وانگهی دریا شود.",t:"Drop by drop gathers and then becomes a sea."},
    ]},
  { name:"Urdu", family:"Indo-Iranian", region:"South Asia", script:"Perso-Arabic", speakers:"~230M",
    tip:"Urdu looks like Persian and Arabic but has unique letters for retroflex sounds specific to South Asia. Written right-to-left like Arabic.",
    confusables:["Arabic","Persian (Farsi)","Pashto","Sindhi"],
    quotes:[
      {s:"ہر مشکل کے بعد آسانی ہے۔",t:"After every hardship comes ease."},
      {s:"محنت کا پھل میٹھا ہوتا ہے۔",t:"The fruit of hard work is sweet."},
    ]},
  { name:"Pashto", family:"Indo-Iranian", region:"Central / South Asia", script:"Perso-Arabic", speakers:"~60M",
    tip:"Pashto uses a modified Perso-Arabic script with extra letters for sounds unique to Pashto. These special letters distinguish it from Arabic, Persian, and Urdu.",
    confusables:["Arabic","Persian (Farsi)","Urdu","Dari"],
    quotes:[
      {s:"زده کړه د ژوند رڼا ده.",t:"Learning is the light of life."},
      {s:"صبر د بریا لار ده.",t:"Patience is the path to victory."},
    ]},
  { name:"Hebrew", family:"Semitic", region:"Middle East", script:"Hebrew", speakers:"~9M",
    tip:"Hebrew is right-to-left with a block-like 22-letter alphabet. Unlike Arabic it is not cursively connected. Look for the distinctive square letterforms.",
    confusables:["Arabic","Yiddish","Amharic","Maltese"],
    quotes:[
      {s:"אם תרצו, אין זו אגדה.",t:"If you will it, it is no dream."},
      {s:"כל הדרכים ארוכות לאדם עייף.",t:"All roads are long to a tired person."},
    ]},
  { name:"Amharic", family:"Semitic", region:"Africa", script:"Ethiopic", speakers:"~57M",
    tip:"Amharic uses the Ethiopic Ge'ez script with round circular characters unlike any other writing system. Each symbol is a consonant plus vowel syllable.",
    confusables:["Tigrinya","Hebrew","Georgian","Sinhala"],
    quotes:[
      {s:"ብዙ ሲሄዱ ይደርሳሉ፤ ጥቂት ሲሄዱ ይቀራሉ።",t:"Those who keep going will arrive. Those who give up will remain behind."},
      {s:"ፍቅር ተራራን ያንቀሳቅሳል።",t:"Love moves mountains."},
    ]},
  { name:"Tigrinya", family:"Semitic", region:"Africa", script:"Ethiopic", speakers:"~9M",
    tip:"Tigrinya uses the same Ethiopic Ge'ez script as Amharic. Very hard to distinguish from Amharic visually. The vocabulary and specific character combinations differ.",
    confusables:["Amharic","Hebrew","Georgian","Armenian"],
    quotes:[
      {s:"ዝሓለፈ ዝሓለፈ፤ ወደፊት ዝጸንሕ ዝጸንሕ።",t:"What has passed has passed. What lies ahead awaits."},
      {s:"ብትዕግስቲ እቲ ዝኸበደ ሽግር ይሓልፍ።",t:"With patience even the heaviest hardship passes."},
    ]},

  // ── EAST ASIAN ──
  { name:"Mandarin Chinese", family:"Sino-Tibetan", region:"East Asia", script:"Chinese (Simplified)", speakers:"~920M",
    tip:"Simplified Chinese uses streamlined characters with fewer strokes. No spaces between words. Characters flow continuously.",
    confusables:["Cantonese","Japanese","Korean"],
    quotes:[
      {s:"千里之行，始于足下。",t:"A journey of a thousand miles begins with a single step."},
      {s:"己所不欲，勿施于人。",t:"Do not do to others what you do not want done to yourself."},
    ]},
  { name:"Cantonese", family:"Sino-Tibetan", region:"East Asia", script:"Chinese (Traditional)", speakers:"~85M",
    tip:"Cantonese uses Traditional Chinese with more strokes than Simplified. Look for characters like wei, lai, guo in traditional form versus the simplified versions.",
    confusables:["Mandarin Chinese","Japanese","Korean"],
    quotes:[
      {s:"路遙知馬力，日久見人心。",t:"Distance tests a horse's strength. Time reveals a person's heart."},
      {s:"天下無難事，只怕有心人。",t:"Nothing is difficult to a determined person."},
    ]},
  { name:"Japanese", family:"Japonic", region:"East Asia", script:"Japanese", speakers:"~125M",
    tip:"Japanese mixes three scripts: Hiragana curved round letters, Katakana angular letters, and Kanji Chinese characters. The simultaneous mix of all three is uniquely Japanese.",
    confusables:["Mandarin Chinese","Cantonese","Korean"],
    quotes:[
      {s:"七転び八起き。",t:"Fall seven times, stand up eight."},
      {s:"継続は力なり。",t:"Continuity is power."},
      {s:"急がば回れ。",t:"More haste, less speed."},
    ]},
  { name:"Korean", family:"Koreanic", region:"East Asia", script:"Korean", speakers:"~82M",
    tip:"Korean Hangul uses geometric blocks of circles and lines. Each block is a syllable combining consonants and vowels. The round letters are very distinctive.",
    confusables:["Japanese","Mandarin Chinese","Cantonese","Mongolian"],
    quotes:[
      {s:"시작이 반이다.",t:"Starting is half the battle."},
      {s:"세 살 버릇 여든까지 간다.",t:"Habits formed at three last until eighty."},
    ]},
  { name:"Mongolian", family:"Mongolic", region:"East Asia", script:"Cyrillic", speakers:"~6M",
    tip:"Mongolian Cyrillic looks like Russian but uses letters not in standard Russian. Words are longer and vocabulary is completely unlike Slavic languages.",
    confusables:["Russian","Bulgarian","Ukrainian","Kazakh","Serbian"],
    quotes:[
      {s:"Эрдэм мэдлэг — далай, тэвчээр — онгоц.",t:"Knowledge is the ocean, patience is the boat."},
      {s:"Номын хүч — зэвсгийн хүчнээс хүчтэй.",t:"The power of books is stronger than the power of weapons."},
    ]},
  { name:"Tibetan", family:"Tibeto-Burman", region:"Central Asia", script:"Tibetan", speakers:"~6M",
    tip:"Tibetan script has stacked letter clusters with consonants piled vertically and many silent prefix consonants. The stacking pattern makes it unlike any other script.",
    confusables:["Myanmar (Burmese)","Khmer","Mongolian","Georgian","Amharic"],
    quotes:[
      {s:"རང་གི་སེམས་ལ་རང་གིས་དབང་བྱེད་མི་ཤེས་ན་སྐྱིད་པ་ཡོང་གི་མེད།",t:"If you cannot master your own mind happiness will not come."},
      {s:"ཤེས་རབ་ནི་གཏེར་མཆོག་ཡིན།",t:"Wisdom is the supreme treasure."},
    ]},
  { name:"Dzongkha", family:"Tibeto-Burman", region:"South Asia", script:"Tibetan", speakers:"~640K",
    tip:"Dzongkha is Bhutan's national language using the same Tibetan script. The stacked letter clusters and horizontal stroke separating syllables are distinctive. Indistinguishable from Tibetan visually for most people.",
    confusables:["Tibetan","Myanmar (Burmese)","Mongolian"],
    quotes:[
      {s:"ཤེས་ཡོན་ནི་ནོར་བུ་ལས་ཀྱང་རིན་ཐང་ཆེ།",t:"Knowledge is more precious than jewels."},
    ]},

  // ── SOUTHEAST ASIAN ──
  { name:"Vietnamese", family:"Austroasiatic", region:"Southeast Asia", script:"Latin (tonal)", speakers:"~96M",
    tip:"Vietnamese uses Latin with an extraordinary number of stacked diacritical marks. Tone marks pile up on letters. No other Latin script language looks like this.",
    confusables:["Hmong","Thai","Tagalog","Malay","Indonesian"],
    quotes:[
      {s:"Có công mài sắt, có ngày nên kim.",t:"With enough perseverance iron can be ground into a needle."},
      {s:"Lời nói không mất tiền mua.",t:"Words cost nothing."},
    ]},
  { name:"Thai", family:"Kra-Dai", region:"Southeast Asia", script:"Thai", speakers:"~61M",
    tip:"Thai has rounded characters with small circles and loops, no spaces between words, and vowels that appear above, below, or around consonants.",
    confusables:["Khmer","Lao","Myanmar (Burmese)","Kannada","Sinhala"],
    quotes:[
      {s:"ทางไกลเริ่มต้นด้วยก้าวแรก",t:"A long road begins with the first step."},
      {s:"ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น",t:"Where there is perseverance there is success."},
    ]},
  { name:"Lao", family:"Kra-Dai", region:"Southeast Asia", script:"Lao", speakers:"~7M",
    tip:"Lao script is very similar to Thai. Both have circular characters, no spaces between words, and stacked vowels. Lao letters are rounder and simpler than Thai. The Lao alphabet has fewer characters.",
    confusables:["Thai","Khmer","Myanmar (Burmese)"],
    quotes:[
      {s:"ຄວາມອົດທົນ ຄືກຸນແຈສູ່ຄວາມສໍາເລັດ.",t:"Patience is the key to success."},
      {s:"ຮູ້ຈັກໂຕເອງ ຄືຮູ້ຈັກໂລກ.",t:"To know yourself is to know the world."},
    ]},
  { name:"Khmer", family:"Austroasiatic", region:"Southeast Asia", script:"Khmer", speakers:"~18M",
    tip:"Khmer has many circular and looping shapes like Thai but more angular and elaborate. Distinctive subscript consonant forms appear written below the main line.",
    confusables:["Thai","Myanmar (Burmese)","Kannada","Telugu","Sinhala"],
    quotes:[
      {s:"បើចង់ឆ្ងាញ់ ត្រូវអត់ធ្មត់រង់ចាំ។",t:"If you want something good you must be patient and wait."},
      {s:"ដើរម្តងមួយជំហាន ក៏ដល់ផង។",t:"Walk one step at a time and you will still arrive."},
    ]},
  { name:"Myanmar (Burmese)", family:"Tibeto-Burman", region:"Southeast Asia", script:"Myanmar", speakers:"~43M",
    tip:"Myanmar script is made of circles and rounded strokes. No straight lines at all. The perfectly circular letters are a giveaway. Similar to Mon and Shan scripts.",
    confusables:["Khmer","Thai","Sinhala","Kannada","Telugu"],
    quotes:[
      {s:"ကြိုးစားသမျှ အောင်မြင်မည်။",t:"Whatever you strive for you will achieve."},
      {s:"ပညာသည် ချမ်းသာကြွယ်ဝမှုထက် တန်ဖိုးကြီးသည်။",t:"Knowledge is more valuable than wealth."},
    ]},
  { name:"Tagalog", family:"Austronesian", region:"Southeast Asia", script:"Latin", speakers:"~82M",
    tip:"Tagalog uses Latin without special characters. Look for the very frequent word ng as a preposition or marker, mga as plural marker, and affixes -um-, mag-, -an, -in attached to roots.",
    confusables:["Indonesian","Malay","Hawaiian","Maori","Cebuano"],
    quotes:[
      {s:"Ang hindi marunong lumingon sa pinanggalingan ay hindi makakarating sa paroroonan.",t:"One who does not look back at where they came from will not reach their destination."},
    ]},
  { name:"Indonesian", family:"Austronesian", region:"Southeast Asia", script:"Latin", speakers:"~270M",
    tip:"Indonesian uses clean Latin script without special characters. Look for prefixes me-, pe-, ber-, ter- and suffixes -kan, -an. The words dan meaning and, yang meaning which, and di meaning at appear very frequently.",
    confusables:["Malay","Tagalog","Javanese"],
    quotes:[
      {s:"Bersatu kita teguh, bercerai kita runtuh.",t:"United we stand, divided we fall."},
      {s:"Di mana ada kemauan, di sana ada jalan.",t:"Where there is a will there is a way."},
    ]},
  { name:"Malay", family:"Austronesian", region:"Southeast Asia", script:"Latin", speakers:"~290M",
    tip:"Malay uses clean Latin script without special characters. Look for prefixes me-, pe-, ber-, ter- and suffixes -kan, -an. The words dan, yang, and di appear constantly, very similar to Indonesian.",
    confusables:["Indonesian","Tagalog","Javanese"],
    quotes:[
      {s:"Biar lambat asal selamat.",t:"Better slow than sorry."},
      {s:"Bahasa jiwa bangsa.",t:"Language is the soul of the nation."},
    ]},
  { name:"Javanese", family:"Austronesian", region:"Southeast Asia", script:"Latin", speakers:"~98M",
    tip:"Javanese uses Latin in modern contexts. Look for the letters dh and th as retroflex sounds, the word iku meaning that, and frequent vowel e as schwa. Has its own traditional script but Latin is common today.",
    confusables:["Indonesian","Malay","Tagalog"],
    quotes:[
      {s:"Alon-alon waton kelakon.",t:"Slowly but surely."},
      {s:"Urip iku urup.",t:"Life is a flame. Live to give light to others."},
    ]},
  { name:"Tetum", family:"Austronesian", region:"Southeast Asia (Timor-Leste)", script:"Latin", speakers:"~1.5M",
    tip:"Tetum uses clean Latin script with no special characters. Look for the very frequent word iha meaning in or at or there is, mak meaning which or that, and the suffix -na. Portuguese loanwords mixed with Austronesian roots give it a unique feel.",
    confusables:["Indonesian","Malay","Tagalog","Maori","Hawaiian"],
    quotes:[
      {s:"Hafoin udan mak loron sai.",t:"After rain the sun comes out."},
      {s:"Ema ne'ebe keta lakon nia kultura, keta lakon nia an.",t:"A person who loses their culture loses themselves."},
      {s:"Hamutuk ita forte liu.",t:"Together we are stronger."},
    ]},
  { name:"Hmong", family:"Hmong-Mien", region:"SE Asia / diaspora", script:"Latin (Romanized)", speakers:"~4M",
    tip:"Hmong RPA system ends words with consonants -b, -m, -d, -v, -s, -g, -j that indicate tones and are not pronounced as consonants. This distinctive final consonant pattern appears throughout.",
    confusables:["Vietnamese","Lao","Thai","Indonesian","Tagalog"],
    quotes:[
      {s:"Txoj kev ntev pib ntawm ib kauj ruam.",t:"A long journey begins with one step."},
      {s:"Tus neeg tsis kawm, yog tus neeg dig muag.",t:"A person who does not learn is a person who is blind."},
    ]},

  // ── SOUTH ASIAN ──
  { name:"Hindi", family:"Indo-Iranian", region:"South Asia", script:"Devanagari", speakers:"~600M",
    tip:"Hindi uses Devanagari where characters hang from a horizontal line at the top. The continuous top bar connecting letters is the key visual identifier.",
    confusables:["Marathi","Nepali","Sanskrit","Bengali","Gujarati"],
    quotes:[
      {s:"कर्म करो, फल की चिंता मत करो।",t:"Do your work, do not worry about the results."},
      {s:"जो बीत गई सो बात गई।",t:"What has passed has passed."},
    ]},
  { name:"Nepali", family:"Indo-Iranian", region:"South Asia", script:"Devanagari", speakers:"~17M",
    tip:"Nepali also uses Devanagari like Hindi and looks nearly identical. Key difference: Nepali uses the word cha very frequently as a verb ending and the honorific suffix -nuhoss.",
    confusables:["Hindi","Marathi","Sanskrit","Bengali","Gujarati"],
    quotes:[
      {s:"हार मान्नु भनेको मृत्यु हो।",t:"To accept defeat is to die."},
      {s:"परिश्रम नै सफलताको सिँढी हो।",t:"Hard work is the staircase to success."},
    ]},
  { name:"Marathi", family:"Indo-Iranian", region:"South Asia", script:"Devanagari", speakers:"~83M",
    tip:"Marathi uses Devanagari like Hindi but with distinctive letters not commonly used in Hindi. Words ending in -ne, -to, -te are very Marathi. The word aahe meaning is appears constantly.",
    confusables:["Hindi","Nepali","Sanskrit","Gujarati"],
    quotes:[
      {s:"ज्ञान हेच खरे धन आहे।",t:"Knowledge is the true wealth."},
      {s:"कर्मच श्रेष्ठ आहे।",t:"Action is supreme."},
    ]},
  { name:"Bengali", family:"Indo-Iranian", region:"South Asia", script:"Bengali", speakers:"~230M",
    tip:"Bengali script resembles Devanagari but the top line is broken not continuous. Letters have a distinctive drooping quality.",
    confusables:["Assamese","Odia","Maithili"],
    quotes:[
      {s:"যে সহে সে রহে।",t:"He who endures, remains."},
      {s:"পরিশ্রমই সাফল্যের চাবিকাঠি।",t:"Hard work is the key to success."},
    ]},
  { name:"Gujarati", family:"Indo-Iranian", region:"South Asia", script:"Gujarati", speakers:"~56M",
    tip:"Gujarati script is derived from Devanagari but the top horizontal line is replaced by a curve or is absent. Letters look rounder and more cursive than Devanagari. No top bar connecting letters.",
    confusables:["Hindi","Marathi","Punjabi","Rajasthani"],
    quotes:[
      {s:"ધૈર્ય ફળ આપે છે.",t:"Patience bears fruit."},
      {s:"ધ્યેય વિના જીવન નહીં.",t:"Life without purpose is no life."},
    ]},
  { name:"Punjabi", family:"Indo-Iranian", region:"South Asia", script:"Gurmukhi", speakers:"~125M",
    tip:"Punjabi in India uses Gurmukhi script, a flowing script with a horizontal bar at the top like Devanagari but with more circular letter bodies and fewer conjunct forms.",
    confusables:["Hindi","Gujarati","Marathi","Sindhi"],
    quotes:[
      {s:"ਜਿੱਥੇ ਚਾਹ, ਉੱਥੇ ਰਾਹ।",t:"Where there is a will there is a way."},
      {s:"ਮਿਹਨਤ ਦਾ ਫਲ ਮਿੱਠਾ ਹੁੰਦਾ ਹੈ।",t:"The fruit of hard work is sweet."},
    ]},
  { name:"Odia", family:"Indo-Iranian", region:"South Asia", script:"Odia", speakers:"~38M",
    tip:"Odia script has distinctive circular letters. Almost every character has a curved top that loops around, unlike Devanagari's straight horizontal bar. The script looks like bubbles and loops.",
    confusables:["Bengali","Kannada","Telugu","Assamese"],
    quotes:[
      {s:"ଜ୍ଞାନ ଅମୂଲ୍ୟ ସମ୍ପଦ।",t:"Knowledge is priceless wealth."},
      {s:"ଧୈର୍ଯ ସଫଳତାର ଚାବି।",t:"Patience is the key to success."},
    ]},
  { name:"Tamil", family:"Dravidian", region:"South Asia / SE Asia", script:"Tamil", speakers:"~87M",
    tip:"Tamil script is very rounded and curvy with lots of loops. Every letter curves with no straight lines. More decorative than Devanagari.",
    confusables:["Kannada","Telugu","Malayalam","Sinhala","Khmer"],
    quotes:[
      {s:"கற்றது கைமண் அளவு, கல்லாதது உலகளவு.",t:"What we have learned is a handful. What we have yet to learn is the world."},
      {s:"அன்பே தெய்வம்.",t:"Love is God."},
    ]},
  { name:"Kannada", family:"Dravidian", region:"South Asia", script:"Kannada", speakers:"~56M",
    tip:"Kannada script has rounded letters with small fish-hook serifs. Similar to Telugu but Kannada letters are rounder with more circular loops at the top.",
    confusables:["Telugu","Tamil","Malayalam","Khmer","Myanmar (Burmese)"],
    quotes:[
      {s:"ಕಲಿಯುವವನು ಎಂದೂ ಸೋಲುವುದಿಲ್ಲ.",t:"One who keeps learning never truly loses."},
      {s:"ಮಾತು ಬೆಳ್ಳಿ, ಮೌನ ಬಂಗಾರ.",t:"Speech is silver, silence is gold."},
    ]},
  { name:"Telugu", family:"Dravidian", region:"South Asia", script:"Telugu", speakers:"~96M",
    tip:"Telugu script is rounder than Kannada. Letters often end in a curling tail. The combination of circles with hanging curves is distinctive.",
    confusables:["Kannada","Tamil","Malayalam","Khmer","Sinhala"],
    quotes:[
      {s:"ఓర్పు ఉన్నవాడికి ఓటమి లేదు.",t:"One who has patience knows no defeat."},
      {s:"విద్య వినయమును ఇస్తుంది.",t:"Education gives humility."},
    ]},
  { name:"Sinhala", family:"Indo-Iranian", region:"South Asia", script:"Sinhala", speakers:"~17M",
    tip:"Sinhala uses a unique rounded script with oval and circular letterforms. Vowels appear as marks around consonants. Looks superficially like Khmer but is rounder and more symmetrical.",
    confusables:["Tamil","Myanmar (Burmese)","Khmer","Telugu","Kannada"],
    quotes:[
      {s:"දැනුම ජීවිතයේ ආලෝකයයි.",t:"Knowledge is the light of life."},
      {s:"ඉවසීමෙන් සෑම දෙයක්ම ජය ගත හැකිය.",t:"With patience everything can be conquered."},
    ]},

  // ── CENTRAL ASIAN / TURKIC ──
  { name:"Turkish", family:"Turkic", region:"Middle East / Europe", script:"Latin", speakers:"~88M",
    tip:"Turkish uses Latin with c-cedilla, s-cedilla, g-breve, i-dotless, o-umlaut, u-umlaut. The dotless i is a unique giveaway. Words tend to be very long due to agglutination.",
    confusables:["Azerbaijani","Uzbek","Kazakh","Kyrgyz","Indonesian"],
    quotes:[
      {s:"Damlaya damlaya göl olur.",t:"Drop by drop a lake is formed."},
      {s:"Bugünün işini yarına bırakma.",t:"Do not leave today's work for tomorrow."},
      {s:"Sabreden derviş muradına ermiş.",t:"The patient dervish reached his goal."},
    ]},
  { name:"Azerbaijani", family:"Turkic", region:"Caucasus / Middle East", script:"Latin", speakers:"~35M",
    tip:"Azerbaijani uses Latin with letters including e-schwa, g-breve, i-dotless, o-umlaut, s-cedilla, u-umlaut, c-cedilla. Very similar to Turkish. The schwa letter e distinguishes it from Turkish.",
    confusables:["Turkish","Uzbek","Kazakh","Kyrgyz"],
    quotes:[
      {s:"Səbr et, qızıl taparsan.",t:"Be patient, you will find gold."},
      {s:"Elm xəzinədir.",t:"Knowledge is a treasure."},
    ]},
  { name:"Uzbek", family:"Turkic", region:"Central Asia", script:"Latin", speakers:"~44M",
    tip:"Uzbek uses Latin script since 1992 with letters o-apostrophe and g-apostrophe representing specific Uzbek sounds. These apostrophe-modified letters are uniquely Uzbek.",
    confusables:["Turkish","Azerbaijani","Kazakh","Kyrgyz"],
    quotes:[
      {s:"Ilm nurdir.",t:"Knowledge is light."},
      {s:"Sabr qilgan murodiga yetgan.",t:"He who is patient reaches his goal."},
    ]},
  { name:"Kazakh", family:"Turkic", region:"Central Asia", script:"Cyrillic", speakers:"~13M",
    tip:"Kazakh is currently written in Cyrillic with eight extra letters not in Russian. These distinctive characters make Kazakh recognizable among Cyrillic scripts.",
    confusables:["Kyrgyz","Mongolian","Russian","Uzbek"],
    quotes:[
      {s:"Білім бұлақ, ішкен тоймас.",t:"Knowledge is a spring. He who drinks is never full."},
      {s:"Жақсы сөз жарым ырыс.",t:"A good word is half of fortune."},
    ]},
  { name:"Kyrgyz", family:"Turkic", region:"Central Asia", script:"Cyrillic", speakers:"~4.5M",
    tip:"Kyrgyz Cyrillic has two extra letters not in Russian: Ng and a front rounded vowel. Very similar to Kazakh Cyrillic but with fewer extra characters.",
    confusables:["Kazakh","Mongolian","Russian","Uzbek"],
    quotes:[
      {s:"Билим алтын казына.",t:"Knowledge is a golden treasure."},
      {s:"Эмгек байлыктын булагы.",t:"Work is the source of wealth."},
    ]},
  { name:"Tajik", family:"Indo-Iranian", region:"Central Asia", script:"Cyrillic", speakers:"~8M",
    tip:"Tajik is written in Cyrillic but is linguistically close to Persian. It has extra letters including i with macron and u with macron. The macron vowels are distinctive.",
    confusables:["Russian","Kazakh","Kyrgyz","Persian (Farsi)"],
    quotes:[
      {s:"Илм чароғи зиндагӣ.",t:"Knowledge is the lamp of life."},
      {s:"Сабр кун, ба мурод мерасӣ.",t:"Be patient, you will reach your goal."},
    ]},
  { name:"Uyghur", family:"Turkic", region:"Central Asia", script:"Perso-Arabic", speakers:"~11M",
    tip:"Uyghur is written right-to-left in a modified Arabic script. Unlike standard Arabic, Uyghur marks all vowels making them fully visible in the text.",
    confusables:["Arabic","Persian (Farsi)","Urdu","Pashto","Kazakh"],
    quotes:[
      {s:"ئىلىم نۇر، جاھالەت قاراڭغۇلۇق.",t:"Knowledge is light, ignorance is darkness."},
    ]},

  // ── AFRICAN (non-Semitic) ──
  { name:"Swahili", family:"Niger-Congo (Bantu)", region:"Africa", script:"Latin", speakers:"~200M",
    tip:"Swahili uses distinctive noun prefixes: m-, wa-, ki-, vi-. Words like hakuna, safari, ubuntu are Swahili. No accents or special characters.",
    confusables:["Zulu","Yoruba","Hausa","Igbo","Wolof"],
    quotes:[
      {s:"Haraka haraka haina baraka.",t:"Hurry hurry has no blessings."},
      {s:"Umoja ni nguvu, utengano ni udhaifu.",t:"Unity is strength, division is weakness."},
      {s:"Mtu ni watu.",t:"A person is people. We are defined by our community."},
    ]},
  { name:"Yoruba", family:"Niger-Congo", region:"Africa", script:"Latin", speakers:"~45M",
    tip:"Yoruba uses Latin with many tone marks including acute, grave, and dot below. The frequent use of o-dot and e-dot with subscript dots is a strong identifier.",
    confusables:["Igbo","Hausa","Swahili","Wolof"],
    quotes:[
      {s:"Ọmọ tí a kò kọ ni yóò ta ilé ẹni jẹ.",t:"A child who is not taught will sell the family home."},
      {s:"Inú rere làá ti ń ṣe rere.",t:"Goodness comes from a good heart."},
    ]},
  { name:"Zulu", family:"Niger-Congo (Bantu)", region:"Africa", script:"Latin", speakers:"~28M",
    tip:"Zulu uses Latin but has unique click consonants written as c, q, x. Words frequently use prefixes uku-, aba-, ama- which are Bantu noun class markers.",
    confusables:["Swahili","Xhosa","Sotho","Igbo","Hausa"],
    quotes:[
      {s:"Umuntu ngumuntu ngabantu.",t:"A person is a person through other people."},
      {s:"Indlela ibuzwa kwabaphambili.",t:"The road is asked of those who have gone ahead."},
    ]},
  { name:"Wolof", family:"Niger-Congo", region:"West Africa", script:"Latin", speakers:"~12M",
    tip:"Wolof uses Latin with consonant combinations like mb, nd, ng, nj at the start of words which is unusual in European languages. Prenasalized consonants appear throughout.",
    confusables:["Yoruba","Igbo","Hausa","Swahili"],
    quotes:[
      {s:"Ku am kersa, am na nit.",t:"Who has dignity, has humanity."},
      {s:"Nit, nit ay garabam.",t:"Man is the remedy for man."},
    ]},

  // ── PACIFIC / INDIGENOUS ──
  { name:"Hawaiian", family:"Austronesian", region:"Pacific", script:"Latin", speakers:"~24K",
    tip:"Hawaiian has only 13 letters total, 5 vowels and 8 consonants. Words are extremely vowel-heavy with open syllables. The okina apostrophe glottal stop and macron are key markers.",
    confusables:["Maori","Samoan","Tagalog","Malay","Indonesian"],
    quotes:[
      {s:"'A'ohe hana nui ke alu 'ia.",t:"No task is too great when done together."},
      {s:"I ola no i ka pono.",t:"Righteousness is life."},
    ]},
  { name:"Maori", family:"Austronesian", region:"Pacific (New Zealand)", script:"Latin", speakers:"~185K",
    tip:"Maori uses Latin with macrons on long vowels. Vowel-heavy like Hawaiian. Look for wh pronounced f and ng at word starts.",
    confusables:["Hawaiian","Samoan","Tagalog","Indonesian","Malay"],
    quotes:[
      {s:"He aha te mea nui o te ao? He tangata, he tangata, he tangata.",t:"What is the greatest thing in the world? It is people, it is people, it is people."},
      {s:"Ehara taku toa i te toa takitahi, engari he toa takitini.",t:"My strength is not that of a single warrior but that of many."},
    ]},
  { name:"Quechua", family:"Quechuan", region:"South America (Andes)", script:"Latin", speakers:"~10M",
    tip:"Quechua uses Latin but with very frequent q and k, and apostrophes for ejective consonants like p-apostrophe, t-apostrophe, k-apostrophe. Words often end in -y, -pi, -kta, -wan suffixes.",
    confusables:["Guarani","Nahuatl","Aymara","Maya (Yucatec)"],
    quotes:[
      {s:"Llank'aypin kawsay tarikun.",t:"In work, life is found."},
      {s:"Aynipin kawsay.",t:"Life is in reciprocity."},
    ]},
  { name:"Nahuatl", family:"Uto-Aztecan", region:"Mexico / Central America", script:"Latin", speakers:"~2M",
    tip:"Nahuatl uses Latin but has very frequent tl endings, a unique sound cluster, and tz combinations. The ending -tl on many words is the strongest giveaway.",
    confusables:["Maya (Yucatec)","Quechua","Guarani","Hmong"],
    quotes:[
      {s:"In tlein amo miqui, yolchicahua.",t:"What does not die, grows stronger."},
      {s:"Xitlazohtla in motlaltzi.",t:"Love your land."},
    ]},
  { name:"Guarani", family:"Tupian", region:"South America", script:"Latin", speakers:"~7M",
    tip:"Guarani uses Latin with nasalized vowels marked by tilde and the glottal stop apostrophe. Nasal vowels throughout the word are very distinctive.",
    confusables:["Quechua","Nahuatl","Maya (Yucatec)","Hmong"],
    quotes:[
      {s:"Ha'e onyepyru pora hagua onyepyru.",t:"To begin well is to end well."},
      {s:"Ko'aga roiko vaera.",t:"We must live well now."},
    ]},
  { name:"Maya (Yucatec)", family:"Mayan", region:"Mexico / Central America", script:"Latin", speakers:"~900K",
    tip:"Yucatec Maya uses apostrophes heavily for glottal stops and ejective consonants. Unusual combinations like ts-apostrophe, k-apostrophe, p-apostrophe and the letter x pronounced sh.",
    confusables:["Nahuatl","Quechua","Guarani","Hmong"],
    quotes:[
      {s:"Bix a beel? Ma' to'on kiin.",t:"How is your road? The sun is still ours."},
    ]},
  { name:"Navajo", family:"Na-Dene", region:"North America", script:"Latin", speakers:"~170K",
    tip:"Navajo uses Latin with ogonek letters for nasalization and the unique consonant clusters zh, dl, tl-stroke. Nasal vowels and these clusters are distinctively Navajo.",
    confusables:["Hmong","Quechua","Nahuatl","Maya (Yucatec)"],
    quotes:[
      {s:"Hozho nahasdzii'. Hozho nahasdzii'.",t:"Beauty is restored. Beauty is restored."},
      {s:"T'aa hwo' aji t'eego.",t:"It is up to you. Self-reliance is key."},
    ]},
];

const EASY_LANGS = [
  "French","Spanish","Portuguese","Italian","German","Dutch",
  "Russian","Arabic","Mandarin Chinese","Japanese","Korean",
  "Hindi","Turkish","Swahili","Greek","Indonesian","Malay",
];

const HARD_LANGS = [
  "Basque","Welsh","Irish","Scottish Gaelic","Breton","Occitan","Faroese","Luxembourgish","Galician","Belarusian",
  "Dzongkha","Uyghur","Pashto","Sinhala","Odia","Javanese","Tetum","Lao",
  "Bulgarian","Serbian","Amharic","Tigrinya","Khmer","Myanmar (Burmese)",
  "Nepali","Kannada","Telugu","Armenian","Wolof","Hmong",
  "Quechua","Nahuatl","Guarani","Maya (Yucatec)","Navajo","Hawaiian","Tibetan","Maori",
];

function getLangPool(level) {
  if(level==="easy") return LANGUAGES.filter(l=>EASY_LANGS.includes(l.name));
  if(level==="hard") return LANGUAGES;
  return LANGUAGES.filter(l=>!HARD_LANGS.includes(l.name));
}

function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function pickQuote(lang) {
  return lang.quotes[Math.floor(Math.random()*lang.quotes.length)];
}

function getOptions(correct, all) {
  const confuse=(correct.confusables||[]).map(n=>all.find(l=>l.name===n)).filter(Boolean);
  const confusePick=shuffle(confuse).slice(0,5);
  const remaining=shuffle(all.filter(l=>l.name!==correct.name&&!confusePick.find(c=>c.name===l.name)));
  return shuffle([correct,...confusePick,...remaining.slice(0,9-confusePick.length)]).slice(0,10);
}

function sameScript(a,b) {
  const base=s=>{
    if(!s) return "";
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

function ScoreBar({score,max=13}) {
  const pct=Math.round((score/max)*100);
  const color=score>=10?"#4A9B6F":score>=5?C.earth:"#C04040";
  return (
    <div style={{background:"#E0E0DC",borderRadius:99,height:6,width:"100%",overflow:"hidden"}}>
      <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:99,transition:"width 0.5s ease"}}/>
    </div>
  );
}

function FamilyTag({family}) {
  const bg=FAMILY_COLOR[family]||C.earth;
  return <span style={{background:bg,color:"#fff",borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:500}}>{family}</span>;
}

function Timer({timeLeft,total=15}) {
  const pct=(timeLeft/total)*100;
  const color=timeLeft>8?C.ocean:timeLeft>4?C.earth:C.coral;
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{flex:1,background:C.fog,borderRadius:99,height:5,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:99,transition:"width 1s linear"}}/>
      </div>
      <span style={{fontSize:13,fontWeight:500,color,minWidth:20,textAlign:"right"}}>{timeLeft}s</span>
    </div>
  );
}

function CountdownOverlay({onDone}) {
  const [phase,setPhase]=useState("flags");
  const [visible,setVisible]=useState(true);
  const allFlags=Object.values(LANG_FLAGS);
  const rows=[shuffle([...allFlags]).slice(0,8),shuffle([...allFlags]).slice(0,8),shuffle([...allFlags]).slice(0,8)];
  useEffect(()=>{
    const t1=setTimeout(()=>setPhase("go"),1800);
    const t2=setTimeout(()=>{setVisible(false);onDone();},2500);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);
  if(!visible) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      <style>{`
        @keyframes slideLeft{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes slideRight{from{transform:translateX(-50%)}to{transform:translateX(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
      `}</style>
      {phase==="flags"?(
        <>
          <div style={{marginBottom:16}}>
            {rows.map((row,ri)=>(
              <div key={ri} style={{display:"flex",gap:8,marginBottom:8,animation:`${ri%2===0?"slideLeft":"slideRight"} 1.8s linear infinite`}}>
                {[...row,...row].map((f,i)=><span key={i} style={{fontSize:32,lineHeight:1}}>{f}</span>)}
              </div>
            ))}
          </div>
          <div style={{color:C.white,fontSize:18,fontWeight:500,opacity:0.9}}>Get ready...</div>
        </>
      ):(
        <div style={{color:C.coral,fontSize:64,fontWeight:700,letterSpacing:"-2px",animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
          GO! 🌍
        </div>
      )}
    </div>
  );
}

function CorrectPopup({lang,score,onDone}) {
  const msg=CONGRATS[Math.floor(Math.random()*CONGRATS.length)];
  const flag=LANG_FLAGS[lang.name]||"🌍";
  useEffect(()=>{const t=setTimeout(onDone,1400);return()=>clearTimeout(t);},[]);
  return (
    <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{background:C.white,borderRadius:20,padding:"1.5rem 2rem",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,0.18)",animation:"popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <div style={{fontSize:52,marginBottom:8}}>{flag}</div>
        <div style={{fontSize:18,fontWeight:500,color:C.dark,marginBottom:4}}>{msg}</div>
        <div style={{fontSize:13,color:C.mid}}>{lang.name} · <span style={{color:"#4A9B6F",fontWeight:500}}>+{score} pts</span></div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen,setScreen]=useState("home");
  const [showCountdown,setShowCountdown]=useState(false);
  const [pendingLevel,setPendingLevel]=useState(null);
  const [showCorrect,setShowCorrect]=useState(null);
  const [questions,setQuestions]=useState([]);
  const [qIndex,setQIndex]=useState(0);
  const [selected,setSelected]=useState(null);
  const [scores,setScores]=useState([]);
  const [results,setResults]=useState([]);
  const [phase,setPhase]=useState("question");
  const [timeLeft,setTimeLeft]=useState(15);
  const [streak,setStreak]=useState(0);
  const [level,setLevel]=useState("medium");
  const [leaderboard,setLeaderboard]=useState([]);
  const timerRef=useRef(null);

  useEffect(()=>{
    try{const r=localStorage.getItem("lg_leaderboard");if(r)setLeaderboard(JSON.parse(r));}catch(e){}
  },[]);

  function startGame(selectedLevel) {
    setPendingLevel(selectedLevel);
    setShowCountdown(true);
  }

  function actuallyStartGame(selectedLevel) {
    setLevel(selectedLevel);
    const pool=getLangPool(selectedLevel);
    const qs=shuffle(pool).slice(0,5).map(lang=>{
      const q=pickQuote(lang);
      return {lang,options:getOptions(lang,LANGUAGES),sample:q.s,translation:q.t};
    });
    setQuestions(qs);setQIndex(0);setSelected(null);
    setScores([]);setResults([]);setPhase("question");setTimeLeft(15);setStreak(0);setScreen("game");
  }

  function handleCountdownDone() {
    setShowCountdown(false);
    actuallyStartGame(pendingLevel);
  }

  useEffect(()=>{
    if(screen!=="game"||phase!=="question") return;
    setTimeLeft(15);
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{if(t<=1){clearInterval(timerRef.current);handleTimeout();return 0;}return t-1;});
    },1000);
    return()=>clearInterval(timerRef.current);
  },[qIndex,phase,screen]);

  function handleTimeout() {
    if(selected) return;
    setSelected("__timeout__");
    const q=questions[qIndex];
    setScores(prev=>[...prev,0]);
    setResults(prev=>[...prev,{lang:q.lang,sample:q.sample,translation:q.translation,guessed:"time's up",score:0,base:0}]);
    setStreak(0);setPhase("reveal");
  }

  function handleSelect(opt) {
    if(selected||phase==="reveal") return;
    clearInterval(timerRef.current);
    setSelected(opt);
    const q=questions[qIndex];
    const base=baseScore(opt,q.lang,LANGUAGES);
    const newStreak=base===10?streak+1:0;
    setStreak(newStreak);
    const s=calcScore(base,timeLeft,streak);
    setScores(prev=>[...prev,s]);
    setResults(prev=>[...prev,{lang:q.lang,sample:q.sample,translation:q.translation,guessed:opt,score:s,base,streak:newStreak,timeLeft}]);
    if(base===10) setShowCorrect({lang:q.lang,score:s});
    setPhase("reveal");
  }

  function next() {
    if(qIndex+1>=questions.length){setScreen("done");}
    else{setQIndex(i=>i+1);setSelected(null);setPhase("question");}
  }

  if(screen==="home") return (
    <>
      {showCountdown&&<CountdownOverlay onDone={handleCountdownDone}/>}
      <Home onStart={startGame} leaderboard={leaderboard}/>
    </>
  );
  if(screen==="done") return <Done results={results} total={parseFloat(scores.reduce((a,b)=>a+b,0).toFixed(1))} max={questions.length*13} onRestart={()=>setScreen("home")} leaderboard={leaderboard} setLeaderboard={setLeaderboard} level={level}/>;

  const q=questions[qIndex];
  const runningScore=parseFloat(scores.reduce((a,b)=>a+b,0).toFixed(1));
  const lastScore=scores[scores.length-1];

  return (
    <>
      {showCorrect&&<CorrectPopup lang={showCorrect.lang} score={showCorrect.score} onDone={()=>setShowCorrect(null)}/>}
      <div style={{maxWidth:560,margin:"0 auto",padding:"1.25rem 1rem",fontFamily:"sans-serif"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}>
          <div style={{display:"flex",gap:4}}>
            {questions.map((_,i)=>(
              <div key={i} style={{width:24,height:4,borderRadius:99,background:i<qIndex?C.ocean:i===qIndex?C.coral:C.fog}}/>
            ))}
          </div>
          <span style={{fontSize:13,fontWeight:500,color:C.ocean}}>{runningScore} pts</span>
        </div>
        <div style={{marginBottom:"0.75rem"}}><Timer timeLeft={timeLeft}/></div>
        {streak>=2&&phase==="question"&&(
          <div style={{background:`${C.coral}18`,border:`1px solid ${C.coral}40`,borderRadius:8,padding:"4px 10px",marginBottom:"0.6rem",fontSize:12,color:C.coral,display:"inline-block"}}>
            {streak} streak — bonus active!
          </div>
        )}
        <div style={{background:C.fog,borderRadius:16,padding:"1.25rem",marginBottom:"1rem",minHeight:80,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <p style={{fontSize:18,lineHeight:1.7,margin:0,color:C.dark,fontStyle:"italic",textAlign:"center"}}>"{q.sample}"</p>
        </div>
        <p style={{fontSize:11,color:C.mid,marginBottom:"0.5rem",textTransform:"uppercase",letterSpacing:"0.08em"}}>Which language is this?</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:"1rem"}}>
          {q.options.map(opt=>{
            let bg=C.white,border=`1.5px solid ${C.fog}`,color=C.dark;
            if(selected){
              if(opt.name===q.lang.name){bg=C.ocean;color=C.white;border=`1.5px solid ${C.ocean}`;}
              else if(opt.name===selected&&selected!==q.lang.name){bg="#FDECEA";color:"#A32D2D";border="1.5px solid #E09090";}
            }
            return (
              <button key={opt.name} onClick={()=>handleSelect(opt.name)}
                style={{background:bg,border,borderRadius:10,padding:"0.6rem 0.85rem",textAlign:"left",cursor:selected?"default":"pointer",fontSize:13,fontWeight:400,color,transition:"all 0.2s",lineHeight:1.3}}>
                {opt.name}
              </button>
            );
          })}
        </div>
        {phase==="reveal"&&(
          <div style={{background:C.fog,borderRadius:14,padding:"1rem 1.25rem",marginBottom:"0.75rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div>
                <span style={{fontSize:14,fontWeight:500,color:C.dark}}>
                  {selected===q.lang.name?"Correct!":selected==="__timeout__"?"Time's up!":`It was ${q.lang.name}`}
                </span>
                <div style={{fontSize:11,color:C.mid,marginTop:2}}>
                  {lastScore>0&&`+${lastScore} pts`}
                  {results[results.length-1]?.base===10&&results[results.length-1]?.timeLeft>=10?" · speed bonus!":""}
                  {results[results.length-1]?.streak>=2?" · streak bonus!":""}
                </div>
              </div>
              <span style={{fontSize:18,fontWeight:500,color:lastScore>=10?"#4A9B6F":lastScore>=5?C.earth:"#C04040"}}>{lastScore}/13</span>
            </div>
            <ScoreBar score={lastScore}/>
            <div style={{margin:"10px 0",padding:"0.75rem 1rem",background:C.white,borderRadius:10,borderLeft:`3px solid ${C.sky}`}}>
              <p style={{fontSize:13,color:C.dark,margin:"0 0 5px",fontStyle:"italic"}}>"{q.sample}"</p>
              <p style={{fontSize:12,color:C.mid,margin:0}}>"{q.translation}"</p>
            </div>
            {results[results.length-1]?.lang?.tip&&(
              <div style={{padding:"0.65rem 0.85rem",background:`${C.ocean}12`,borderRadius:10,borderLeft:`3px solid ${C.ocean}`,marginBottom:8}}>
                <p style={{fontSize:11,color:C.ocean,fontWeight:500,margin:"0 0 3px",textTransform:"uppercase",letterSpacing:"0.06em"}}>How to spot {results[results.length-1].lang.name}</p>
                <p style={{fontSize:12,color:C.dark,margin:0,lineHeight:1.5}}>{results[results.length-1].lang.tip}</p>
              </div>
            )}
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:8}}>
              <FamilyTag family={q.lang.family}/>
              <span style={{fontSize:12,color:C.mid}}>{q.lang.script}</span>
              <span style={{fontSize:12,color:C.light}}>·</span>
              <span style={{fontSize:12,color:C.mid}}>{q.lang.region}</span>
              <span style={{fontSize:12,color:C.light}}>·</span>
              <span style={{fontSize:12,color:C.mid}}>{q.lang.speakers} speakers</span>
            </div>
            {selected!==q.lang.name&&results[results.length-1]?.base===5&&<p style={{fontSize:12,color:C.earth,margin:"0 0 8px"}}>Same language family — close!</p>}
            {selected!==q.lang.name&&results[results.length-1]?.base===3&&<p style={{fontSize:12,color:C.sky,margin:"0 0 8px"}}>Same script — you spotted the alphabet!</p>}
            {selected!==q.lang.name&&results[results.length-1]?.base===2&&<p style={{fontSize:12,color:C.mid,margin:"0 0 8px"}}>Same region — not too far!</p>}
            <button onClick={next} style={{width:"100%",padding:"0.65rem",borderRadius:99,border:"none",background:C.coral,color:C.white,cursor:"pointer",fontSize:14,fontWeight:500}}>
              {qIndex+1>=questions.length?"See results":"Next question"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function Home({onStart,leaderboard}) {
  const [level,setLevel]=useState("medium");
  const levels=[
    {id:"easy",label:"Easy",desc:"Common world languages"},
    {id:"medium",label:"Medium",desc:"Mix of major and regional"},
    {id:"hard",label:"Hard",desc:"Includes rare and indigenous"},
  ];
  return (
    <div style={{maxWidth:420,margin:"0 auto",padding:"2rem 1rem",textAlign:"center",fontFamily:"sans-serif"}}>
      <div style={{width:52,height:52,borderRadius:14,background:C.ocean,margin:"0 auto 1rem",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{color:C.white,fontSize:18,fontWeight:500}}>LG</span>
      </div>
      <h1 style={{fontSize:26,fontWeight:500,margin:"0 0 0.4rem",color:C.dark,letterSpacing:"-0.5px"}}>LanguageGuessr</h1>
      <p style={{color:C.mid,fontSize:14,marginBottom:"0.75rem",lineHeight:1.6}}>
        How fast can you identify a language?<br/>5 rounds to challenge your friends!
      </p>
      <div style={{background:C.fog,borderRadius:12,padding:"0.75rem 1rem",marginBottom:"1rem",fontSize:12,color:C.mid,textAlign:"left"}}>
        <div style={{marginBottom:4}}><span style={{color:C.ocean,fontWeight:500}}>Scoring:</span> 10 pts for correct answer</div>
        <div style={{marginBottom:4}}>+ up to <span style={{color:C.ocean,fontWeight:500}}>2 pts</span> speed bonus (answer correctly within 5s!)</div>
        <div>+ up to <span style={{color:C.ocean,fontWeight:500}}>1 pt</span> streak bonus (2+ correct in a row)</div>
      </div>
      <div style={{marginBottom:"1rem",textAlign:"left"}}>
        <p style={{fontSize:12,color:C.mid,margin:"0 0 6px",textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:500}}>Difficulty</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
          {levels.map(l=>(
            <button key={l.id} onClick={()=>setLevel(l.id)}
              style={{padding:"0.6rem 0.5rem",borderRadius:10,border:`1.5px solid ${level===l.id?C.ocean:C.fog}`,background:level===l.id?`${C.ocean}12`:C.white,cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:500,color:level===l.id?C.ocean:C.dark}}>{l.label}</div>
              <div style={{fontSize:10,color:C.mid,marginTop:2,lineHeight:1.3}}>{l.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <button onClick={()=>onStart(level)} style={{width:"100%",padding:"0.85rem",borderRadius:99,border:"none",background:C.coral,color:C.white,cursor:"pointer",fontSize:16,fontWeight:500,marginBottom:"1rem"}}>
        Start game
      </button>
      {leaderboard.length>0&&(
        <div style={{background:C.fog,borderRadius:12,padding:"0.85rem 1rem",textAlign:"left"}}>
          <p style={{fontSize:12,fontWeight:500,color:C.dark,margin:"0 0 0.6rem",textTransform:"uppercase",letterSpacing:"0.06em"}}>Leaderboard</p>
          {leaderboard.slice(0,8).map((e,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:i<Math.min(leaderboard.length,8)-1?`1px solid ${C.light}30`:"none"}}>
              <span style={{fontSize:13,color:i===0?C.coral:C.dark,fontWeight:i===0?500:400}}>{i+1}. {e.name} <span style={{fontSize:10,color:C.light}}>({e.level||"medium"})</span></span>
              <span style={{fontSize:13,fontWeight:500,color:C.ocean}}>{e.score}<span style={{fontSize:11,color:C.light}}> pts</span></span>
            </div>
          ))}
        </div>
      )}
      <p style={{fontSize:11,color:C.light,marginTop:"0.75rem"}}>15s per question · 70+ languages · partial points for close guesses</p>
    </div>
  );
}

function Done({results,total,max,onRestart,leaderboard,setLeaderboard,level}) {
  const [nickname,setNickname]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const pct=Math.round((total/max)*100);
  const label=pct===100?"Polyglot legend":pct>=70?"Language lover":pct>=40?"Decent detective":"Keep exploring!";
  const gameUrl="https://languageguessr.com/";
  const shareText=`LanguageGuessr: can you recognize all the languages? — ${total}/${max} pts · ${label}\n${results.map((r,i)=>`Q${i+1}: ${r.guessed===r.lang.name?"✅":"❌"} (${r.score}/13)`).join("\n")}\nTry to beat me: ${gameUrl}`;

  function submitScore() {
    if(!nickname.trim()) return;
    const entry={name:nickname.trim(),score:total,level,date:new Date().toLocaleDateString()};
    const board=[...leaderboard,entry].sort((a,b)=>b.score-a.score).slice(0,10);
    setLeaderboard(board);
    setSubmitted(true);
    try{localStorage.setItem("lg_leaderboard",JSON.stringify(board));}catch(e){}
  }

  return (
    <div style={{maxWidth:500,margin:"0 auto",padding:"1.75rem 1rem",fontFamily:"sans-serif"}}>
      <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
        <div style={{fontSize:44,fontWeight:500,color:C.ocean,letterSpacing:"-2px"}}>
          {total}<span style={{fontSize:20,color:C.light,fontWeight:400}}>/{max}</span>
        </div>
        <div style={{fontSize:15,color:C.mid,marginBottom:"0.75rem"}}>{label}</div>
        <div style={{maxWidth:220,margin:"0 auto"}}><ScoreBar score={total} max={max}/></div>
      </div>
      <div style={{background:C.fog,borderRadius:14,padding:"1rem 1.25rem",marginBottom:"1.25rem"}}>
        {!submitted?(
          <>
            <p style={{fontSize:13,fontWeight:500,color:C.dark,margin:"0 0 0.6rem"}}>Add your score to the leaderboard</p>
            <div style={{display:"flex",gap:8}}>
              <input value={nickname} onChange={e=>setNickname(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitScore()}
                placeholder="Your nickname..." maxLength={20}
                style={{flex:1,padding:"0.55rem 0.75rem",borderRadius:8,border:`1px solid ${C.light}`,fontSize:13,background:C.white,color:C.dark,outline:"none"}}/>
              <button onClick={submitScore} disabled={!nickname.trim()}
                style={{padding:"0.55rem 1rem",borderRadius:8,border:"none",background:nickname.trim()?C.ocean:C.light,color:C.white,cursor:nickname.trim()?"pointer":"default",fontSize:13,fontWeight:500}}>
                Submit
              </button>
            </div>
          </>
        ):(
          <>
            <p style={{fontSize:13,fontWeight:500,color:C.dark,margin:"0 0 0.75rem"}}>Leaderboard</p>
            {leaderboard.map((e,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i<leaderboard.length-1?`1px solid ${C.fog}80`:"none"}}>
                <span style={{fontSize:13,color:i===0?C.coral:C.dark,fontWeight:i===0?500:400}}>{i+1}. {e.name}</span>
                <span style={{fontSize:13,fontWeight:500,color:C.ocean}}>{e.score}<span style={{fontSize:11,color:C.light}}>/{max}</span></span>
              </div>
            ))}
          </>
        )}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:"1.5rem"}}>
        {results.map((r,i)=>(
          <div key={i} style={{background:C.fog,borderRadius:12,padding:"0.85rem 1rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div>
                <span style={{fontSize:14,fontWeight:500,color:C.dark}}>{r.lang.name}</span>
                {r.guessed!==r.lang.name&&<span style={{fontSize:12,color:C.mid,marginLeft:8}}>you said: {r.guessed}</span>}
              </div>
              <span style={{fontSize:14,fontWeight:500,color:r.score>=10?"#4A9B6F":r.score>=5?C.earth:C.mid}}>{r.score}/13</span>
            </div>
            <div style={{padding:"0.6rem 0.85rem",background:C.white,borderRadius:8,borderLeft:`3px solid ${C.sky}`,marginBottom:8}}>
              <p style={{fontSize:13,color:C.dark,margin:"0 0 5px",fontStyle:"italic"}}>"{r.sample}"</p>
              <p style={{fontSize:12,color:C.mid,margin:0}}>"{r.translation}"</p>
            </div>
            {r.lang.tip&&(
              <div style={{padding:"0.5rem 0.75rem",background:`${C.ocean}10`,borderRadius:8,borderLeft:`3px solid ${C.ocean}`,marginBottom:8}}>
                <p style={{fontSize:11,color:C.ocean,fontWeight:500,margin:"0 0 2px"}}>How to spot {r.lang.name}</p>
                <p style={{fontSize:12,color:C.dark,margin:0,lineHeight:1.5}}>{r.lang.tip}</p>
              </div>
            )}
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <FamilyTag family={r.lang.family}/>
              <span style={{fontSize:11,color:C.mid}}>{r.lang.script} · {r.lang.speakers} speakers</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onRestart} style={{flex:1,padding:"0.7rem",borderRadius:99,border:`1.5px solid ${C.ocean}`,background:C.white,color:C.ocean,cursor:"pointer",fontSize:14,fontWeight:500}}>
          Play again
        </button>
        {navigator.share?(
          <button onClick={()=>navigator.share({title:"LanguageGuessr",text:shareText}).catch(()=>{})}
            style={{flex:1,padding:"0.7rem",borderRadius:99,border:"none",background:C.coral,color:C.white,cursor:"pointer",fontSize:14,fontWeight:500}}>
            Share score
          </button>
        ):(
          <button onClick={()=>navigator.clipboard.writeText(shareText).catch(()=>{})}
            style={{flex:1,padding:"0.7rem",borderRadius:99,border:"none",background:C.coral,color:C.white,cursor:"pointer",fontSize:14,fontWeight:500}}>
            Copy score
          </button>
        )}
      </div>
    </div>
  );
}
