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
  "Tupian":"#80A870","Afro-Asiatic":"#B89060","Afro-Asiatic (Chadic)":"#C09060",
  "Afro-Asiatic (Cushitic)":"#B09070","Tibeto-Burman":"#9080C0",
  "Indo-European (isolate)":"#A090C0","Celtic":"#6080A0","Baltic":"#80A0A0",
  "Language isolate":"#A0A080","Aymaran":"#C0A040","Araucanian":"#A0B060",
  "Algonquian":"#8090B0","Iroquoian":"#9080A0","Eskimo-Aleut":"#80A0C0",
  "English Creole":"#A0A070","Northwest Caucasian":"#B080A0","Northeast Caucasian":"#A07090",
  "Ol Chiki":"#80B090","Tai-Kadai":"#9BBFCE",
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
  "Guaraní":"🇵🇾","Maya (Yucatec)":"🇲🇽","Navajo":"🇺🇸","Hawaiian":"🇺🇸","Māori":"🇳🇿",
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
  "Hausa":"🇳🇬","Igbo":"🇳🇬","Somali":"🇸🇴","Oromo":"🇪🇹","Lingala":"🇨🇩",
  "Xhosa":"🇿🇦","Shona":"🇿🇼","Fula":"🌍","Sundanese":"🇮🇩","Cebuano":"🇵🇭",
  "Turkmen":"🇹🇲","Sindhi":"🇵🇰","Assamese":"🇮🇳","Maithili":"🇮🇳","Balochi":"🇵🇰",
  "Santali":"🇮🇳","Shan":"🇲🇲","Buryat":"🇷🇺","Tok Pisin":"🇵🇬",
  "Sardinian":"🇮🇹","Corsican":"🇫🇷","Romani":"🌍","Chechen":"🇷🇺","Abkhazian":"🌍",
  "Aymara":"🇧🇴","Mapuche":"🇨🇱","Ojibwe":"🇨🇦","Cherokee":"🇺🇸","Inuktitut":"🇨🇦",
  "Polish":"🇵🇱","Czech":"🇨🇿","Belarusian":"🇧🇾",
};

const CONGRATS = [
  "Nailed it! 🎯","You legend! 🌟","Spot on! ✨","Impressive! 🔥","Brilliant! 💡",
  "Outstanding! 🏆","Sharp eye! 👁️","Polyglot vibes! 🌍","That's the one! 💪","Unstoppable! 🚀",
];

const LANGUAGES = [
  // ── ROMANCE ──
  { name:"French", family:"Romance", region:"Europe", script:"Latin", speakers:"~310M",
    tip:"Look for accented vowels like e-acute, e-grave, e-circumflex and the cedilla c. The combination eau and frequent apostrophes are very French.",
    confusables:["Italian","Spanish","Portuguese","Romanian","Catalan"],
    quotes:[
      {s:"La seule façon de faire du bon travail est d'aimer ce que vous faites.",t:"The only way to do great work is to love what you do."},
      {s:"La vie est ce qui se passe pendant qu'on fait d'autres projets.",t:"Life is what happens while you are busy making other plans."},
      {s:"Soyez le changement que vous voulez voir dans le monde.",t:"Be the change you wish to see in the world."},
    ]},
  { name:"Spanish", family:"Romance", region:"Europe / Americas", script:"Latin", speakers:"~500M",
    tip:"Spot the inverted question mark and exclamation mark at sentence starts. The letter n-tilde and ll or rr combinations are distinctively Spanish.",
    confusables:["Portuguese","Italian","French","Romanian","Catalan"],
    quotes:[
      {s:"No importa cuán lento vayas, siempre y cuando no te detengas.",t:"It does not matter how slowly you go, as long as you do not stop."},
      {s:"La vida es sueño, y los sueños, sueños son.",t:"Life is a dream, and dreams are just dreams."},
      {s:"Dime con quién andas y te diré quién eres.",t:"Tell me who you walk with and I will tell you who you are."},
    ]},
  { name:"Portuguese", family:"Romance", region:"Europe / Americas", script:"Latin", speakers:"~260M",
    tip:"Look for unique nasal vowels with tilde like ao and oe, and the letters lh and nh. Words ending in -ao and -cao are distinctively Portuguese.",
    confusables:["Spanish","Italian","French","Romanian","Galician"],
    quotes:[
      {s:"A vida é o que acontece enquanto estamos ocupados fazendo outros planos.",t:"Life is what happens while we are busy making other plans."},
      {s:"Quem não arrisca não petisca.",t:"Nothing ventured, nothing gained."},
      {s:"A sabedoria começa com o silêncio.",t:"Wisdom begins with silence."},
    ]},
  { name:"Italian", family:"Romance", region:"Europe", script:"Latin", speakers:"~67M",
    tip:"Italian loves double consonants like ll, tt, cc and words ending in vowels. Look for -zione and -mente endings.",
    confusables:["Spanish","Portuguese","French","Romanian","Sardinian"],
    quotes:[
      {s:"La vita è bella quando hai qualcuno con cui condividerla.",t:"Life is beautiful when you have someone to share it with."},
      {s:"Chi dorme non piglia pesci.",t:"He who sleeps does not catch fish."},
      {s:"Tutto è bene quel che finisce bene.",t:"All is well that ends well."},
    ]},
  { name:"Romanian", family:"Romance", region:"Europe", script:"Latin", speakers:"~24M",
    tip:"Romanian is unique among Romance languages for letters a-breve, a-circumflex, i-circumflex, s-comma, t-comma. Looks vaguely Italian but has Slavic-influenced spellings.",
    confusables:["Italian","Spanish","Portuguese","French","Moldovan"],
    quotes:[
      {s:"Omul sfințește locul, nu locul pe om.",t:"The person sanctifies the place, not the place the person."},
      {s:"Graba strică treaba.",t:"Haste makes waste."},
      {s:"Vorba dulce mult aduce.",t:"Sweet words bring much."},
    ]},
  { name:"Catalan", family:"Romance", region:"Europe", script:"Latin", speakers:"~10M",
    tip:"Catalan looks like a blend of Spanish and French. Key giveaways: the midpoint dot in words, endings like -cio and -ment. No n-tilde unlike Spanish.",
    confusables:["Spanish","Portuguese","French","Italian","Occitan"],
    quotes:[
      {s:"Qui no s'arrisca, no pisca.",t:"Nothing ventured, nothing gained."},
      {s:"Val més tard que mai.",t:"Better late than never."},
    ]},
  { name:"Galician", family:"Romance", region:"Europe", script:"Latin", speakers:"~2.4M",
    tip:"Galician looks very close to Portuguese with nh and lh digraphs. Unlike Spanish there is no n-tilde. Very similar to old Portuguese.",
    confusables:["Portuguese","Spanish","Catalan","Italian","Occitan"],
    quotes:[
      {s:"Quen non arrisca, non gaña.",t:"He who does not risk, does not gain."},
      {s:"A lingua é a alma do pobo.",t:"Language is the soul of the people."},
    ]},
  { name:"Occitan", family:"Romance", region:"Europe", script:"Latin", speak
