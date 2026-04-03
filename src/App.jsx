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
  "Mayan":"#70A890","Na-Dené":"#A08060","Algonquian":"#8090B0","Dravidian":"#C07860",
  "Uto-Aztecan":"#B09060","Tupian":"#80A870","Afro-Asiatic":"#B89060","Tibeto-Burman":"#9080C0",
  "Indo-European (isolate)":"#A090C0",
};

const LANGUAGES = [
  { name:"French", family:"Romance", region:"Europe", script:"Latin", speakers:"~310M",
    tip:"Look for accented vowels like é, è, ê, and the cedilla ç. The combination 'eau' (as in beau) and frequent use of apostrophes are very French.",
    confusables:["Italian","Spanish","Portuguese","Romanian","Catalan"],
    quotes:[
      {s:"La seule façon de faire du bon travail est d'aimer ce que vous faites.",t:"The only way to do great work is to love what you do."},
      {s:"La vie est ce qui se passe pendant qu'on fait d'autres projets.",t:"Life is what happens while you're busy making other plans."},
      {s:"Soyez le changement que vous voulez voir dans le monde.",t:"Be the change you wish to see in the world."},
    ]},
  { name:"Spanish", family:"Romance", region:"Europe / Americas", script:"Latin", speakers:"~500M",
    tip:"Spot the inverted question mark ¿ and exclamation mark ¡ at the start of sentences. The letter ñ and ll/rr combinations are distinctively Spanish.",
    confusables:["Portuguese","Italian","French","Romanian","Catalan"],
    quotes:[
      {s:"No importa cuán lento vayas, siempre y cuando no te detengas.",t:"It doesn't matter how slowly you go, as long as you don't stop."},
      {s:"La vida es sueño, y los sueños, sueños son.",t:"Life is a dream, and dreams are just dreams."},
      {s:"Dime con quién andas y te diré quién eres.",t:"Tell me who you walk with and I'll tell you who you are."},
    ]},
  { name:"Portuguese", family:"Romance", region:"Europe / Americas", script:"Latin", speakers:"~260M",
    tip:"Look for the unique ã and õ (nasal vowels with tilde), and the letters lh and nh. Portuguese has many words ending in -ão, -ção, and -mente.",
    confusables:["Spanish","Galician","Italian","French","Romanian"],
    quotes:[
      {s:"A vida é o que acontece enquanto estamos ocupados fazendo outros planos.",t:"Life is what happens while we are busy making other plans."},
      {s:"Quem não arrisca não petisca.",t:"Nothing ventured, nothing gained."},
      {s:"A sabedoria começa com o silêncio.",t:"Wisdom begins with silence."},
    ]},
  { name:"Italian", family:"Romance", region:"Europe", script:"Latin", speakers:"~67M",
    tip:"Italian loves double consonants (ll, tt, cc) and words ending in vowels. Look for -zione, -mente endings and the frequent use of gli and gn.",
    confusables:["Spanish","Portuguese","French","Romanian","Latin"],
    quotes:[
      {s:"La vita è bella quando hai qualcuno con cui condividerla.",t:"Life is beautiful when you have someone to share it with."},
      {s:"Chi dorme non piglia pesci.",t:"He who sleeps doesn't catch fish."},
      {s:"Tutto è bene quel che finisce bene.",t:"All's well that ends well."},
    ]},
  { name:"Romanian", family:"Romance", region:"Europe", script:"Latin", speakers:"~24M",
    tip:"Romanian is unique among Romance languages for letters like ă, â, î, ș, ț. It looks vaguely Italian but has Slavic-influenced spellings.",
    confusables:["Italian","Spanish","Portuguese","French","Moldovan"],
    quotes:[
      {s:"Omul sfințește locul, nu locul pe om.",t:"The person sanctifies the place, not the place the person."},
      {s:"Graba strică treaba.",t:"Haste makes waste."},
      {s:"Vorba dulce mult aduce.",t:"Sweet words bring much."},
    ]},
  { name:"German", family:"Germanic", region:"Europe", script:"Latin", speakers:"~135M",
    tip:"German capitalizes ALL nouns, not just proper names. Look for long compound words, umlauts (ä, ö, ü), and the sharp ß (eszett).",
    confusables:["Dutch","Swedish","Norwegian","Danish","Afrikaans"],
    quotes:[
      {s:"Der Mensch wächst mit seinen Aufgaben.",t:"A person grows with their tasks."},
      {s:"Übung macht den Meister.",t:"Practice makes perfect."},
      {s:"Was dich nicht umbringt, macht dich stärker.",t:"What doesn't kill you makes you stronger."},
    ]},
  { name:"Dutch", family:"Germanic", region:"Europe", script:"Latin", speakers:"~25M",
    tip:"Dutch has distinctive double vowels (aa, ee, oo) and the unique ij digraph. Look for words like 'de', 'het', 'een' and the 'sch' combination.",
    confusables:["German","Afrikaans","Swedish","Norwegian","Danish"],
    quotes:[
      {s:"Wie niet waagt, die niet wint.",t:"Who dares not, wins not."},
      {s:"Oost west, thuis best.",t:"East or west, home is best."},
      {s:"Goed voorbeeld doet goed volgen.",t:"Good example leads to good following."},
    ]},
  { name:"Swedish", family:"Germanic", region:"Europe", script:"Latin", speakers:"~13M",
    tip:"Swedish has three extra letters: å, ä, ö. It uses many double letters and has distinctive words like 'och' (and) and 'att' (to). Looks cleaner than German.",
    confusables:["Norwegian","Danish","Dutch","German","Finnish"],
    quotes:[
      {s:"Det är inte hur långt du faller, utan hur högt du studsar.",t:"It is not how far you fall, but how high you bounce."},
      {s:"Lär av gårdagen, lev för idag, hoppas på morgondagen.",t:"Learn from yesterday, live for today, hope for tomorrow."},
      {s:"Den som gapar efter mycket mister ofta hela stycket.",t:"He who grabs for too much often loses it all."},
    ]},
  { name:"Norwegian", family:"Germanic", region:"Europe", script:"Latin", speakers:"~5M",
    tip:"Norwegian shares å, æ, ø with Danish. It often looks like Danish but uses 'ikke' (not) instead of 'ikke' spelled differently. Very similar to Swedish.",
    confusables:["Swedish","Danish","Dutch","German","Faroese"],
    quotes:[
      {s:"Det er ikke fjellene foran deg som sliter deg ut, men steinen i skoen din.",t:"It is not the mountains ahead that wear you out, but the pebble in your shoe."},
      {s:"Den som ler sist, ler best.",t:"He who laughs last, laughs best."},
      {s:"Veien blir til mens du går.",t:"The road is made by walking."},
    ]},
  { name:"Russian", family:"Slavic", region:"Europe / Asia", script:"Cyrillic", speakers:"~258M",
    tip:"Russian Cyrillic has letters like Ж, Щ, Ъ, Ы, Э that don't appear in other Cyrillic scripts. Look for the hard sign ъ and the letter ы — unique to Russian.",
    confusables:["Ukrainian","Bulgarian","Serbian","Macedonian","Mongolian"],
    quotes:[
      {s:"Не тот велик, кто никогда не падал, а тот велик, кто падал и вставал.",t:"Not the one who never fell is great, but the one who fell and rose again."},
      {s:"Терпение и труд всё перетрут.",t:"Patience and hard work will overcome everything."},
      {s:"Без труда не выловишь и рыбку из пруда.",t:"Without effort, you can't even pull a fish from a pond."},
    ]},
  { name:"Ukrainian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~40M",
    tip:"Ukrainian has unique letters І (i with dot), Ї (yi), Є (ye), and Ґ (hard g) not found in Russian. It also lacks the Russian Ъ and Ы.",
    confusables:["Russian","Bulgarian","Serbian","Macedonian","Belarusian"],
    quotes:[
      {s:"Де є воля, там є і шлях.",t:"Where there is a will, there is a way."},
      {s:"Не май сто рублів, а май сто друзів.",t:"Don't have a hundred rubles, have a hundred friends."},
      {s:"Хто рано встає, тому Бог дає.",t:"God gives to those who rise early."},
    ]},
  { name:"Bulgarian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~8M",
    tip:"Bulgarian Cyrillic looks similar to Russian but uses the letter Ъ frequently as a vowel (meaning 'uh'). It has no ы, ё, or э like Russian does.",
    confusables:["Russian","Ukrainian","Macedonian","Serbian","Mongolian"],
    quotes:[
      {s:"Търпението е горчиво, но плодовете му са сладки.",t:"Patience is bitter, but its fruits are sweet."},
      {s:"Каквото посееш, това ще пожънеш.",t:"You reap what you sow."},
      {s:"Без мъка няма наука.",t:"No pain, no gain."},
    ]},
  { name:"Serbian", family:"Slavic", region:"Europe", script:"Cyrillic", speakers:"~12M",
    tip:"Serbian Cyrillic includes Љ, Њ, Џ — letters not found in Russian or Ukrainian. These represent sounds lj, nj, and dz unique to South Slavic languages.",
    confusables:["Russian","Bulgarian","Ukrainian","Macedonian","Mongolian"],
    quotes:[
      {s:"Дунав пролази кроз многе земље Европе и носи са собом историју векова.",t:"The Danube flows through many lands of Europe, carrying the history of centuries."},
      {s:"Ко рано рани, две среће граби.",t:"He who rises early catches two fortunes."},
      {s:"Слога и мала сила надвладава велику.",t:"Unity makes even a small force overcome a great one."},
    ]},
  { name:"Mongolian", family:"Mongolic", region:"East Asia", script:"Cyrillic", speakers:"~6M",
    tip:"Mongolian in Cyrillic looks like Russian but uses letters like Ү, Ө which are not standard Russian. Words tend to be longer and the vocabulary looks completely unlike Slavic languages.",
    confusables:["Russian","Bulgarian","Ukrainian","Kazakh","Serbian"],
    quotes:[
      {s:"Эрдэм мэдлэг — далай, тэвчээр — онгоц.",t:"Knowledge is the ocean, patience is the boat."},
      {s:"Номын хүч — зэвсгийн хүчнээс хүчтэй.",t:"The power of books is stronger than the power of weapons."},
      {s:"Өнөөдрийн ажлыг маргааш болдоггүй.",t:"Don't put off today's work until tomorrow."},
    ]},
  { name:"Arabic", family:"Semitic", region:"Middle East / Africa", script:"Arabic", speakers:"~422M",
    tip:"Arabic is written right-to-left with letters connected in a cursive style. Dots above and below letters are key. Look for the distinctive looping shapes and the absence of short vowels in writing.",
    confusables:["Persian (Farsi)","Urdu","Pashto","Uyghur","Kurdish"],
    quotes:[
      {s:"من لم يعرف كيف يقف على المرتفعات لم يعش.",t:"He who has not learned to stand on the heights has not truly lived."},
      {s:"العلم في الصغر كالنقش على الحجر.",t:"Learning in youth is like engraving on stone."},
      {s:"اطلبوا العلم من المهد إلى اللحد.",t:"Seek knowledge from the cradle to the grave."},
    ]},
  { name:"Persian (Farsi)", family:"Indo-Iranian", region:"Middle East", script:"Perso-Arabic", speakers:"~110M",
    tip:"Persian uses Arabic script but has 4 extra letters: پ, چ, ژ, گ. It looks rounder and more flowing than Arabic. Words often end in distinctive patterns unlike Arabic.",
    confusables:["Arabic","Urdu","Pashto","Kurdish","Dari"],
    quotes:[
      {s:"هر که طاووس خواهد جور هندوستان کشد.",t:"Whoever wants the peacock must endure the thorns of Hindustan."},
      {s:"قطره قطره جمع گردد وانگهی دریا شود.",t:"Drop by drop gathers, and then becomes a sea."},
      {s:"آدم باید از خطاهای خود درس بگیرد.",t:"A person must learn from their mistakes."},
    ]},
  { name:"Urdu", family:"Indo-Iranian", region:"South Asia", script:"Perso-Arabic", speakers:"~230M",
    tip:"Urdu looks similar to Persian/Arabic but has unique letters like ٹ, ڈ, ڑ for retroflex sounds specific to South Asia. It's written right-to-left like Arabic.",
    confusables:["Arabic","Persian (Farsi)","Pashto","Sindhi","Uyghur"],
    quotes:[
      {s:"ہر مشکل کے بعد آسانی ہے۔",t:"After every hardship comes ease."},
      {s:"عقلمند وہ ہے جو اپنی غلطیوں سے سیکھے۔",t:"The wise one is he who learns from his mistakes."},
      {s:"محنت کا پھل میٹھا ہوتا ہے۔",t:"The fruit of hard work is sweet."},
    ]},
  { name:"Hebrew", family:"Semitic", region:"Middle East", script:"Hebrew", speakers:"~9M",
    tip:"Hebrew is written right-to-left with a block-like alphabet of 22 letters. Unlike Arabic it is not cursively connected. Look for the distinctive square letterforms.",
    confusables:["Arabic","Yiddish","Aramaic","Maltese","Amharic"],
    quotes:[
      {s:"אם תרצו, אין זו אגדה.",t:"If you will it, it is no dream."},
      {s:"כל הדרכים ארוכות לאדם עייף.",t:"All roads are long to a tired person."},
      {s:"מי שמחפש חבר בלי פגמים נשאר בלי חברים.",t:"He who seeks a friend without faults remains without friends."},
    ]},
  { name:"Amharic", family:"Semitic", region:"Africa", script:"Ethiopic", speakers:"~57M",
    tip:"Amharic uses the Ethiopic (Ge'ez) script — round, circular characters unlike any other writing system. Each symbol represents a consonant+vowel combination (syllabary).",
    confusables:["Tigrinya","Tigre","Hebrew","Georgian","Sinhala"],
    quotes:[
      {s:"ብዙ ሲሄዱ ይደርሳሉ፤ ጥቂት ሲሄዱ ይቀራሉ።",t:"Those who keep going will arrive; those who give up will remain behind."},
      {s:"ዕውቀት ሲጨምር ትዕቢት ይቀንሳል።",t:"As knowledge increases, arrogance decreases."},
      {s:"ፍቅር ተራራን ያንቀሳቅሳል።",t:"Love moves mountains."},
    ]},
  { name:"Mandarin Chinese", family:"Sino-Tibetan", region:"East Asia", script:"Chinese (Simplified)", speakers:"~920M",
    tip:"Simplified Chinese uses streamlined characters with fewer strokes than Traditional. Look for characters with simplified radicals. No spaces between words — characters flow continuously.",
    confusables:["Cantonese","Japanese","Wu Chinese","Classical Chinese","Korean"],
    quotes:[
      {s:"千里之行，始于足下。",t:"A journey of a thousand miles begins with a single step."},
      {s:"学而不思则罔，思而不学则殆。",t:"Learning without thought is labor lost; thought without learning is dangerous."},
      {s:"己所不欲，勿施于人。",t:"Do not do to others what you do not want done to yourself."},
    ]},
  { name:"Cantonese", family:"Sino-Tibetan", region:"East Asia", script:"Chinese (Traditional)", speakers:"~85M",
    tip:"Cantonese typically uses Traditional Chinese characters — more strokes and complex forms compared to Simplified. Look for characters like 為, 來, 國 instead of 为, 来, 国.",
    confusables:["Mandarin Chinese","Japanese","Wu Chinese","Korean","Classical Chinese"],
    quotes:[
      {s:"路遙知馬力，日久見人心。",t:"Distance tests a horse's strength; time reveals a person's heart."},
      {s:"一步一腳印。",t:"One step, one footprint — take things one step at a time."},
      {s:"天下無難事，只怕有心人。",t:"Nothing in the world is difficult; it only takes a determined person."},
    ]},
  { name:"Japanese", family:"Japonic", region:"East Asia", script:"Japanese", speakers:"~125M",
    tip:"Japanese mixes three scripts: Hiragana (curved, round: あいう), Katakana (angular: アイウ), and Kanji (Chinese characters). The mix of all three is uniquely Japanese.",
    confusables:["Mandarin Chinese","Cantonese","Korean","Classical Chinese","Wu Chinese"],
    quotes:[
      {s:"七転び八起き。",t:"Fall seven times, stand up eight."},
      {s:"継続は力なり。",t:"Continuity is power."},
      {s:"急がば回れ。",t:"More haste, less speed."},
    ]},
  { name:"Korean", family:"Koreanic", region:"East Asia", script:"Korean", speakers:"~82M",
    tip:"Korean (Hangul) uses geometric blocks made of circles, vertical and horizontal lines. Each block is a syllable combining consonants and vowels. The round ㅇ and ㅎ are very distinctive.",
    confusables:["Japanese","Mandarin Chinese","Cantonese","Mongolian","Tibetan"],
    quotes:[
      {s:"시작이 반이다.",t:"Starting is half the battle."},
      {s:"세 살 버릇 여든까지 간다.",t:"Habits formed at three last until eighty."},
      {s:"티끌 모아 태산.",t:"Many a little makes a mickle."},
    ]},
  { name:"Vietnamese", family:"Austroasiatic", region:"Southeast Asia", script:"Latin (tonal)", speakers:"~96M",
    tip:"Vietnamese uses Latin letters but with an extraordinary number of diacritical marks — tone marks (`, ´, ˜, ?, ̣) stacked on letters like ộ, ẫ, ướ. No other Latin language looks like this.",
    confusables:["Hmong","Thai","Tagalog","Malay","Indonesian"],
    quotes:[
      {s:"Có công mài sắt, có ngày nên kim.",t:"With enough perseverance, iron can be ground into a needle."},
      {s:"Học thầy không tày học bạn.",t:"Learning from a teacher is not as good as learning from friends."},
      {s:"Lời nói không mất tiền mua.",t:"Words cost nothing."},
    ]},
  { name:"Thai", family:"Kra-Dai", region:"Southeast Asia", script:"Thai", speakers:"~61M",
    tip:"Thai script has rounded characters with small circles and loops. It has no spaces between words, uses vowels that appear above, below, or around consonants, and has 5 tone marks.",
    confusables:["Khmer","Lao","Myanmar (Burmese)","Kannada","Sinhala"],
    quotes:[
      {s:"ทางไกลเริ่มต้นด้วยก้าวแรก",t:"A long road begins with the first step."},
      {s:"น้ำขึ้นให้รีบตัก",t:"When the water rises, hurry to fetch it — seize the moment."},
      {s:"ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น",t:"Where there is perseverance, there is success."},
    ]},
  { name:"Khmer", family:"Austroasiatic", region:"Southeast Asia", script:"Khmer", speakers:"~18M",
    tip:"Khmer script has many circular and looping shapes like Thai, but is more angular and elaborate. It uses distinctive 'subscript' forms of letters written below the main line.",
    confusables:["Thai","Myanmar (Burmese)","Kannada","Telugu","Sinhala"],
    quotes:[
      {s:"បើចង់ឆ្ងាញ់ ត្រូវអត់ធ្មត់រង់ចាំ។",t:"If you want something good, you must be patient and wait."},
      {s:"ស្អប់ខ្លួនឯង គឺស្អប់ជីវិត។",t:"To hate oneself is to hate life."},
      {s:"ដើរម្តងមួយជំហាន ក៏ដល់ផង។",t:"Walk one step at a time, and you will still arrive."},
    ]},
  { name:"Myanmar (Burmese)", family:"Tibeto-Burman", region:"Southeast Asia", script:"Myanmar", speakers:"~43M",
    tip:"Myanmar script is made of circles and rounded strokes — very similar to Khmer but rounder and more uniform. The perfectly circular letters ၀, ဝ are a giveaway.",
    confusables:["Khmer","Thai","Sinhala","Kannada","Telugu"],
    quotes:[
      {s:"ကြိုးစားသမျှ အောင်မြင်မည်။",t:"Whatever you strive for, you will achieve."},
      {s:"ပညာသည် ချမ်းသာကြွယ်ဝမှုထက် တန်ဖိုးကြီးသည်။",t:"Knowledge is more valuable than wealth."},
      {s:"မမှန်သောစကား မပြောနှင့်။",t:"Do not speak words that are not true."},
    ]},
  { name:"Hindi", family:"Indo-Iranian", region:"South Asia", script:"Devanagari", speakers:"~600M",
    tip:"Hindi uses Devanagari — characters hang from a horizontal line at the top. Look for the distinctive top bar connecting letters. Words are separated clearly, unlike Thai or Khmer.",
    confusables:["Marathi","Nepali","Sanskrit","Bengali","Gujarati"],
    quotes:[
      {s:"जब तक आप अपने आप पर विश्वास नहीं करते, तब तक आप भगवान पर विश्वास नहीं कर सकते।",t:"Until you believe in yourself, you cannot believe in God."},
      {s:"कर्म करो, फल की चिंता मत करो।",t:"Do your work, don't worry about the results."},
      {s:"जो बीत गई सो बात गई।",t:"What has passed has passed."},
    ]},
  { name:"Nepali", family:"Indo-Iranian", region:"South Asia", script:"Devanagari", speakers:"~17M",
    tip:"Nepali also uses Devanagari like Hindi and looks nearly identical. Key difference: Nepali has conjunct consonants stacked differently and uses words like 'छ' (cha) very frequently.",
    confusables:["Hindi","Marathi","Sanskrit","Bengali","Gujarati"],
    quotes:[
      {s:"हार मान्नु भनेको मृत्यु हो।",t:"To accept defeat is to die."},
      {s:"परिश्रम नै सफलताको सिँढी हो।",t:"Hard work is the staircase to success."},
      {s:"आफ्नो काम आफैं गर।",t:"Do your own work yourself."},
    ]},
  { name:"Bengali", family:"Indo-Iranian", region:"South Asia", script:"Bengali", speakers:"~230M",
    tip:"Bengali script resembles Devanagari but the top line is broken, not continuous. Letters have a distinctive drooping quality and the letter ব looks like a closed loop.",
    confusables:["Assamese","Manipuri","Sylheti","Odia","Maithili"],
    quotes:[
      {s:"যে সহে সে রহে।",t:"He who endures, remains."},
      {s:"পরিশ্রমই সাফল্যের চাবিকাঠি।",t:"Hard work is the key to success."},
      {s:"সত্য কথা বলা সাহসের কাজ।",t:"Speaking the truth is an act of courage."},
    ]},
  { name:"Tamil", family:"Dravidian", region:"South Asia / SE Asia", script:"Tamil", speakers:"~87M",
    tip:"Tamil script is very rounded and curvy with lots of loops. It has no straight lines — every letter curves. It looks more decorative than Devanagari and has unique dotted letters.",
    confusables:["Kannada","Telugu","Malayalam","Sinhala","Khmer"],
    quotes:[
      {s:"கற்றது கைமண் அளவு, கல்லாதது உலகளவு.",t:"What we have learned is a handful; what we have yet to learn is the world."},
      {s:"அன்பே தெய்வம்.",t:"Love is God."},
      {s:"ஆற்றல் இருக்கும் போது உதவு.",t:"Help when you have the power to do so."},
    ]},
  { name:"Kannada", family:"Dravidian", region:"South Asia", script:"Kannada", speakers:"~56M",
    tip:"Kannada script has rounded letters with small 'fish-hook' serifs. It looks similar to Telugu but Kannada letters tend to be rounder with more circular loops at the top.",
    confusables:["Telugu","Tamil","Malayalam","Khmer","Myanmar (Burmese)"],
    quotes:[
      {s:"ಕಲಿಯುವವನು ಎಂದೂ ಸೋಲುವುದಿಲ್ಲ.",t:"One who keeps learning never truly loses."},
      {s:"ಒಗ್ಗಟ್ಟಿನಲ್ಲಿ ಬಲವಿದೆ.",t:"There is strength in unity."},
      {s:"ಮಾತು ಬೆಳ್ಳಿ, ಮೌನ ಬಂಗಾರ.",t:"Speech is silver, silence is gold."},
    ]},
  { name:"Telugu", family:"Dravidian", region:"South Asia", script:"Telugu", speakers:"~96M",
    tip:"Telugu script is rounder than Kannada with more circular shapes. Letters often end in a curling tail. The combination of circles with hanging curves is distinctive.",
    confusables:["Kannada","Tamil","Malayalam","Khmer","Sinhala"],
    quotes:[
      {s:"ఓర్పు ఉన్నవాడికి ఓటమి లేదు.",t:"One who has patience knows no defeat."},
      {s:"విద్య వినయమును ఇస్తుంది.",t:"Education gives humility."},
      {s:"మంచి మాట మనసుకు హాయి.",t:"A good word is a comfort to the heart."},
    ]},
  { name:"Turkish", family:"Turkic", region:"Middle East / Europe", script:"Latin", speakers:"~88M",
    tip:"Turkish uses Latin script with extra letters: ç, ş, ğ, ı (dotless i), ö, ü. The dotless 'ı' is a unique giveaway. Words tend to be long due to agglutination (adding suffixes).",
    confusables:["Azerbaijani","Uzbek","Kazakh","Kyrgyz","Indonesian"],
    quotes:[
      {s:"Damlaya damlaya göl olur.",t:"Drop by drop, a lake is formed."},
      {s:"Bugünün işini yarına bırakma.",t:"Don't leave today's work for tomorrow."},
      {s:"Sabreden derviş muradına ermiş.",t:"The patient dervish reached his goal."},
    ]},
  { name:"Swahili", family:"Niger-Congo (Bantu)", region:"Africa", script:"Latin", speakers:"~200M",
    tip:"Swahili looks like a clean Latin language but uses distinctive prefixes on nouns: m-, wa-, ki-, vi-. Words like 'hakuna', 'safari', 'ubuntu' are Swahili. No accents or special characters.",
    confusables:["Zulu","Yoruba","Hausa","Igbo","Somali"],
    quotes:[
      {s:"Haraka haraka haina baraka.",t:"Hurry hurry has no blessings."},
      {s:"Umoja ni nguvu, utengano ni udhaifu.",t:"Unity is strength, division is weakness."},
      {s:"Mtu ni watu.",t:"A person is people — we are defined by our community."},
    ]},
  { name:"Yoruba", family:"Niger-Congo", region:"Africa", script:"Latin", speakers:"~45M",
    tip:"Yoruba uses Latin script with many diacritical tone marks (acute ´, grave `, dot below ̣). The frequent use of ọ and ẹ (with subscript dots) is a strong identifier.",
    confusables:["Igbo","Hausa","Swahili","Wolof","Fula"],
    quotes:[
      {s:"Ọmọ tí a kò kọ ni yóò ta ilé ẹni jẹ.",t:"A child who is not taught will sell the family home."},
      {s:"Inú rere làá ti ń ṣe rere.",t:"Goodness comes from a good heart."},
      {s:"Agbára ọ̀pọ̀lọpọ̀ ló ń gbé oko.",t:"It takes many to lift a farm."},
    ]},
  { name:"Zulu", family:"Niger-Congo (Bantu)", region:"Africa", script:"Latin", speakers:"~28M",
    tip:"Zulu uses Latin without special characters but has unique click consonants written as 'c', 'q', 'x'. Words frequently use the prefix 'uku-', 'aba-', 'ama-' — Bantu noun class markers.",
    confusables:["Swahili","Xhosa","Sotho","Igbo","Hausa"],
    quotes:[
      {s:"Umuntu ngumuntu ngabantu.",t:"A person is a person through other people."},
      {s:"Indlela ibuzwa kwabaphambili.",t:"The road is asked of those who have gone ahead."},
      {s:"Isandla sihlamba esinye.",t:"One hand washes the other."},
    ]},
  { name:"Greek", family:"Hellenic", region:"Europe", script:"Greek", speakers:"~13M",
    tip:"Greek uses its own alphabet with letters like α, β, γ, δ, θ, λ, φ, ψ, ω. Some look like Latin (A, E, K, O) but letters like Θ, Ξ, Ψ, Ω are uniquely Greek.",
    confusables:["Coptic","Armenian","Georgian","Hebrew","Cyrillic languages"],
    quotes:[
      {s:"Η αρχή είναι το ήμισυ του παντός.",t:"The beginning is half of everything."},
      {s:"Γνώθι σαυτόν.",t:"Know thyself."},
      {s:"Ο χρόνος είναι χρήμα.",t:"Time is money."},
    ]},
  { name:"Georgian", family:"Kartvelian", region:"Caucasus", script:"Georgian", speakers:"~4M",
    tip:"Georgian script is one of the most distinctive in the world — round, asymmetric letters with curving arms. No capital letters, no script related to any other. Looks almost like decorated spirals.",
    confusables:["Armenian","Amharic","Tigrinya","Greek","Hebrew"],
    quotes:[
      {s:"ენა კაცს ჰყავს მონად, ჭკუა კი ბატონად.",t:"The tongue is man's servant, but wisdom is his master."},
      {s:"ვარდი ეკლის გარეშე არ მოდის.",t:"A rose does not come without thorns."},
      {s:"სიბრძნე სიყვარულიდან იბადება.",t:"Wisdom is born from love."},
    ]},
  { name:"Armenian", family:"Indo-European (isolate)", region:"Caucasus", script:"Armenian", speakers:"~8M",
    tip:"Armenian has its own unique alphabet invented in 405 AD. Letters have a medieval angular quality. Look for the distinctive shapes like Փ, Ձ, Ղ — nothing like Greek or Georgian.",
    confusables:["Georgian","Greek","Amharic","Hebrew","Coptic"],
    quotes:[
      {s:"Ո՛չ ոք կ'ապրի քո կյանքը, քեզ համար.",t:"No one will live your life for you."},
      {s:"Մութ գիշերն ունի վերջ, բայց խելքը՝ ոչ:",t:"The dark night has an end, but wisdom does not."},
      {s:"Ժամանակ ոչ ոք չի կարող գնել:",t:"No one can buy time."},
    ]},
  { name:"Finnish", family:"Uralic", region:"Europe", script:"Latin", speakers:"~5M",
    tip:"Finnish has no articles, double vowels and consonants everywhere (aa, ee, ll, kk), and very long words. The letters ä and ö are common. Words like 'kyllä' and 'ei' are very Finnish.",
    confusables:["Estonian","Hungarian","Turkish","Azerbaijani","Mongolian"],
    quotes:[
      {s:"Ei se ole viisas, joka viisaasti ei puhu.",t:"It is not wise who does not speak wisely."},
      {s:"Työ tekijäänsä kiittää.",t:"Work praises its maker."},
      {s:"Parempi myöhään kuin ei milloinkaan.",t:"Better late than never."},
    ]},
  { name:"Hungarian", family:"Uralic", region:"Europe", script:"Latin", speakers:"~13M",
    tip:"Hungarian uses long vowels marked with double accents: á, é, í, ó, ő, ú, ű. The double-acute ő and ű are unique to Hungarian. Words are often very long with many suffixes.",
    confusables:["Finnish","Estonian","Turkish","Romanian","Czech"],
    quotes:[
      {s:"Aki mer, az nyer.",t:"He who dares, wins."},
      {s:"Lassan járj, tovább érsz.",t:"Go slowly, you'll get further."},
      {s:"Több szem többet lát.",t:"More eyes see more."},
    ]},
  { name:"Hmong", family:"Hmong-Mien", region:"SE Asia / diaspora", script:"Latin (Romanized)", speakers:"~4M",
    tip:"Hmong (RPA system) uses familiar Latin letters but ends words with consonants like -b, -m, -d, -v, -s, -g, -j that indicate tones (they're not pronounced as consonants). Very distinctive pattern.",
    confusables:["Vietnamese","Lao","Thai","Indonesian","Tagalog"],
    quotes:[
      {s:"Txoj kev ntev pib ntawm ib kauj ruam.",t:"A long journey begins with one step."},
      {s:"Tus neeg tsis kawm, yog tus neeg dig muag.",t:"A person who does not learn is a person who is blind."},
      {s:"Kev sib hlub yog lub zog loj tshaj plaws.",t:"Love is the greatest strength of all."},
    ]},
  { name:"Quechua", family:"Quechuan", region:"South America (Andes)", script:"Latin", speakers:"~10M",
    tip:"Quechua uses Latin but with very frequent use of 'q' and 'k', and apostrophes for ejective consonants (p', t', k'). Words often end in -y, -pi, -kta, -wan suffixes.",
    confusables:["Guaraní","Nahuatl","Aymara","Maya (Yucatec)","Mapuche"],
    quotes:[
      {s:"Llank'aypin kawsay tarikun.",t:"In work, life is found."},
      {s:"Mana yachasqaqa, yana tukunmi.",t:"Without knowledge, one becomes darkness."},
      {s:"Aynipin kawsay.",t:"Life is in reciprocity."},
    ]},
  { name:"Nahuatl", family:"Uto-Aztecan", region:"Mexico / Central America", script:"Latin", speakers:"~2M",
    tip:"Nahuatl uses Latin but has very frequent 'tl' endings (a unique sound) and 'tz' clusters. Words like 'tlatoa' (speak) and 'tlahtoa' with glottal marks are distinctive.",
    confusables:["Maya (Yucatec)","Quechua","Guaraní","Hmong","Zapotec"],
    quotes:[
      {s:"In tlein amo miqui, yolchicahua.",t:"What does not die, grows stronger."},
      {s:"Tlen miec tlamati, miec quimati in ahtle ipan mopoa.",t:"The more one knows, the more one knows how little they know."},
      {s:"Xitlazohtla in motlaltzi.",t:"Love your land."},
    ]},
  { name:"Guaraní", family:"Tupian", region:"South America", script:"Latin", speakers:"~7M",
    tip:"Guaraní uses Latin with nasalized vowels marked by tilde (ã, ẽ, ĩ, õ, ũ, ỹ) and the unique letters ñ and the glottal stop '. The combination of nasal vowels throughout is very distinctive.",
    confusables:["Quechua","Nahuatl","Maya (Yucatec)","Hmong","Aymara"],
    quotes:[
      {s:"Ha'e oñepyrũ porã haguã oñepyrũ.",t:"To begin well is to end well."},
      {s:"Mba'eve nde resẽi haguã ndaipóri.",t:"There is nothing that can stop you from leaving — start moving."},
      {s:"Ko'ág̃a roiko vaerã.",t:"We must live well now."},
    ]},
  { name:"Maya (Yucatec)", family:"Mayan", region:"Mexico / Central America", script:"Latin", speakers:"~900K",
    tip:"Yucatec Maya uses apostrophes heavily for glottal stops and ejective consonants. You'll see unusual combinations like 'ts'', 'k'', 'p'' and the special letter 'x' pronounced 'sh'.",
    confusables:["Nahuatl","Quechua","Guaraní","Hmong","Zapotec"],
    quotes:[
      {s:"Bix a beel? Ma' to'on kiin.",t:"How is your road? The sun is still ours."},
      {s:"Je'el bin yojelt'aan, je'el bin a na'at.",t:"As much as you speak, so much you understand."},
      {s:"Mix ba'al ku páajtal ti' le k'iino'.",t:"Nothing is impossible on a given day."},
    ]},
  { name:"Navajo", family:"Na-Dené", region:"North America", script:"Latin", speakers:"~170K",
    tip:"Navajo uses Latin with many accented vowels (á, é, í, ó) for tone and ogonek letters (ą, ę, į, ǫ) for nasalization. The consonant clusters 'zh', 'dl', 'tł' are uniquely Navajo.",
    confusables:["Hmong","Quechua","Nahuatl","Maya (Yucatec)","Guaraní"],
    quotes:[
      {s:"Hózhó nahasdlíí'. Hózhó nahasdlíí'.",t:"Beauty is restored. Beauty is restored."},
      {s:"T'áá hwó' ají t'éego.",t:"It is up to you — self-reliance is key."},
      {s:"Nizhóní baa nitsáhákees.",t:"Think beautifully — walk in beauty."},
    ]},
  { name:"Hawaiian", family:"Austronesian", region:"Pacific", script:"Latin", speakers:"~24K",
    tip:"Hawaiian has only 13 letters total — 5 vowels and 8 consonants. Words are made almost entirely of open syllables (vowel-heavy). The 'okina (') glottal stop and macron ā are key markers.",
    confusables:["Māori","Samoan","Tagalog","Malay","Indonesian"],
    quotes:[
      {s:"ʻAʻohe hana nui ke alu ʻia.",t:"No task is too great when done together."},
      {s:"I ola nō i ka pono.",t:"Righteousness is life."},
      {s:"He aliʻi ka ʻāina, he kauwā ke kanaka.",t:"The land is chief, man is its servant."},
    ]},
  { name:"Māori", family:"Austronesian", region:"Pacific (New Zealand)", script:"Latin", speakers:"~185K",
    tip:"Māori uses Latin with macrons on vowels (ā, ē, ī, ō, ū) to show long sounds. Like Hawaiian, it's vowel-heavy. Look for 'wh' (pronounced 'f'), 'ng' at word starts, and words ending in vowels.",
    confusables:["Hawaiian","Samoan","Tagalog","Indonesian","Malay"],
    quotes:[
      {s:"He aha te mea nui o te ao? He tāngata, he tāngata, he tāngata.",t:"What is the greatest thing in the world? It is people, it is people, it is people."},
      {s:"Ehara taku toa i te toa takitahi, engari he toa takitini.",t:"My strength is not that of a single warrior but that of many."},
      {s:"Whāia te iti kahurangi ki te tūohu koe me he maunga teitei.",t:"Seek the treasure you value most dearly; if you bow your head, let it be to a lofty mountain."},
    ]},
  { name:"Tibetan", family:"Tibeto-Burman", region:"Central Asia", script:"Tibetan", speakers:"~6M",
    tip:"Tibetan script has stacked letters (consonant clusters piled vertically) and many silent prefix consonants. The horizontal lines and stacking pattern make it unlike any other script.",
    confusables:["Myanmar (Burmese)","Khmer","Mongolian","Georgian","Amharic"],
    quotes:[
      {s:"རང་གི་སེམས་ལ་རང་གིས་དབང་བྱེད་མི་ཤེས་ན་སྐྱིད་པ་ཡོང་གི་མེད།",t:"If you cannot master your own mind, happiness will not come."},
      {s:"ཤེས་རབ་ནི་གཏེར་མཆོག་ཡིན།",t:"Wisdom is the supreme treasure."},
      {s:"བདེ་སྐྱིད་ཀྱི་རྒྱུ་ནི་གཞན་ལ་ཕན་པ་ཡིན།",t:"The cause of happiness is benefiting others."},
    ]},
  { name:"Wolof", family:"Niger-Congo", region:"West Africa", script:"Latin", speakers:"~12M",
    tip:"Wolof uses Latin with consonant combinations like 'mb', 'nd', 'ng', 'nj' at the start of words — unusual in European languages. Look for prenasalized consonants throughout.",
    confusables:["Yoruba","Igbo","Hausa","Swahili","Fula"],
    quotes:[
      {s:"Ku am kersa, am na nit.",t:"Who has dignity, has humanity."},
      {s:"Nit, nit ay garabam.",t:"Man is the remedy for man."},
      {s:"Liggéey moo tax ngoon dem.",t:"Work is what makes the afternoon come — work leads to reward."},
    ]},
  { name:"Tetum", family:"Austronesian", region:"Southeast Asia (Timor-Leste)", script:"Latin", speakers:"~1.5M",
    tip:"Tetum uses clean Latin script with no special characters. Look for the very frequent word 'iha' (in/at/there is), 'mak' (which/that), and '-na' suffixes. Portuguese loanwords mixed with Austronesian roots give it a unique feel — you might see 'obrigadu' (thank you) and 'maromak' (God) side by side.",
    confusables:["Indonesian","Malay","Tagalog","Māori","Hawaiian"],
    quotes:[
      {s:"Hafoin udan mak loron sai.",t:"After rain, the sun comes out."},
      {s:"Ema ne'ebé keta lakon nia kultura, keta lakon nia an.",t:"A person who loses their culture loses themselves."},
      {s:"Hamutuk ita forte liu.",t:"Together we are stronger."},
    ]},
  { name:"Tigrinya", family:"Semitic", region:"Africa", script:"Ethiopic", speakers:"~9M",
    tip:"Tigrinya uses the same Ethiopic (Ge'ez) script as Amharic — circular syllabic characters. Very hard to distinguish from Amharic visually; the vocabulary and specific character combinations differ.",
    confusables:["Amharic","Tigre","Hebrew","Georgian","Armenian"],
    quotes:[
      {s:"ዝሓለፈ ዝሓለፈ፤ ወደፊት ዝጸንሕ ዝጸንሕ።",t:"What has passed has passed; what lies ahead awaits."},
      {s:"ፍቕሪ ዘለዋ ልቢ ዝሓዘ ሰብ ዕጥቁ ሓያል ኣዩ።",t:"A person with a heart full of love is strongly armed."},
      {s:"ብትዕግስቲ እቲ ዝኸበደ ሽግር ይሓልፍ።",t:"With patience, even the heaviest hardship passes."},
    ]},
];

const EASY_LANGS = ["French","Spanish","Portuguese","Italian","German","Dutch","Russian","Arabic","Mandarin Chinese","Japanese","Korean","Hindi","Turkish","Swahili","Greek"];
const MEDIUM_LANGS = ["Romanian","Swedish","Norwegian","Ukrainian","Hebrew","Persian (Farsi)","Vietnamese","Thai","Bengali","Tamil","Finnish","Hungarian","Yoruba","Zulu","Georgian","Mongolian","Cantonese","Indonesian","Māori"];
const HARD_LANGS = ["Bulgarian","Serbian","Amharic","Tigrinya","Khmer","Myanmar (Burmese)","Nepali","Kannada","Telugu","Urdu","Armenian","Wolof","Hmong","Quechua","Nahuatl","Guaraní","Maya (Yucatec)","Navajo","Hawaiian","Tibetan"];

function getLangPool(level) {
  if(level==="easy") return LANGUAGES.filter(l=>EASY_LANGS.includes(l.name));
  if(level==="hard") return LANGUAGES;
  return LANGUAGES.filter(l=>!HARD_LANGS.includes(l.name));
}
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
  "Tetum":"🇹🇱",
  "Tibetan":"🏔️","Wolof":"🇸🇳","Tigrinya":"🇪🇷",
};

const CONGRATS = [
  "Nailed it! 🎯","You legend! 🌟","Spot on! ✨","Impressive! 🔥","Brilliant! 💡",
  "Outstanding! 🏆","Sharp eye! 👁️","Polyglot vibes! 🌍","That's the one! 💪","Unstoppable! 🚀",
];

function CountdownOverlay({onDone}) {
  const [phase, setPhase] = useState("flags"); // flags | go
  const [visible, setVisible] = useState(true);

  // Random selection of flags for animation
  const allFlags = Object.values(LANG_FLAGS);
  const flagRows = [
    shuffle([...allFlags]).slice(0, 8),
    shuffle([...allFlags]).slice(0, 8),
    shuffle([...allFlags]).slice(0, 8),
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("go"), 1800);
    const t2 = setTimeout(() => { setVisible(false); onDone(); }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
      {phase === "flags" ? (
        <>
          <div style={{marginBottom:16,animation:"fadeIn 0.3s ease"}}>
            {flagRows.map((row, ri) => (
              <div key={ri} style={{display:"flex",gap:8,marginBottom:8,transform:`translateX(${ri%2===0?"-10px":"10px"})`,animation:`slide${ri%2===0?"Left":"Right"} 1.8s linear infinite`}}>
                {[...row,...row].map((f,i) => (
                  <span key={i} style={{fontSize:32,lineHeight:1}}>{f}</span>
                ))}
              </div>
            ))}
          </div>
          <div style={{color:C.white,fontSize:18,fontWeight:500,letterSpacing:"0.05em",opacity:0.9}}>Get ready...</div>
          <style>{`
            @keyframes slideLeft { from{transform:translateX(0)} to{transform:translateX(-50%)} }
            @keyframes slideRight { from{transform:translateX(-50%)} to{transform:translateX(0)} }
            @keyframes fadeIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
            @keyframes popIn { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
          `}</style>
        </>
      ) : (
        <div style={{color:C.coral,fontSize:64,fontWeight:700,letterSpacing:"-2px",animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"}}>
          GO! 🌍
        </div>
      )}
    </div>
  );
}

function CorrectPopup({lang, score, onDone}) {
  const msg = CONGRATS[Math.floor(Math.random()*CONGRATS.length)];
  const flag = LANG_FLAGS[lang.name] || "🌍";
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
      <div style={{background:C.white,borderRadius:20,padding:"1.5rem 2rem",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,0.18)",animation:"popIn 0.35s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <div style={{fontSize:52,marginBottom:8}}>{flag}</div>
        <div style={{fontSize:18,fontWeight:500,color:C.dark,marginBottom:4}}>{msg}</div>
        <div style={{fontSize:13,color:C.mid}}>{lang.name} · <span style={{color:"#4A9B6F",fontWeight:500}}>+{score} pts</span></div>
      </div>
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
}

export default function App() {
  const [screen,setScreen]=useState("home");
  const [showCountdown,setShowCountdown]=useState(false);
  const [pendingLevel,setPendingLevel]=useState(null);
  const [showCorrect,setShowCorrect]=useState(null); // {lang, score}
  const [questions,setQuestions]=useState([]);
  const [qIndex,setQIndex]=useState(0);
  const [selected,setSelected]=useState(null);
  const [scores,setScores]=useState([]);
  const [results,setResults]=useState([]);
  const [phase,setPhase]=useState("question");
  const [timeLeft,setTimeLeft]=useState(15);
  const [streak,setStreak]=useState(0);
  const [leaderboard,setLeaderboard]=useState([]);
  const timerRef=useRef(null);

  const [level,setLevel]=useState("medium");

  useEffect(()=>{loadLeaderboard();},[]);

  async function loadLeaderboard() {
    try{const r=await window.storage.get("lg_leaderboard");if(r)setLeaderboard(JSON.parse(r.value));}catch(e){}
  }

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
    setResults(prev=>[...prev,{lang:q.lang,sample:q.sample,translation:q.translation,guessed:"(time's up)",score:0,base:0}]);
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
      {showCountdown && <CountdownOverlay onDone={handleCountdownDone}/>}
      <Home onStart={startGame} leaderboard={leaderboard}/>
    </>
  );
  if(screen==="done") return <Done results={results} total={parseFloat(scores.reduce((a,b)=>a+b,0).toFixed(1))} max={questions.length*13} onRestart={()=>setScreen("home")} leaderboard={leaderboard} setLeaderboard={setLeaderboard} level={level}/>;

  const q=questions[qIndex];
  const runningScore=parseFloat(scores.reduce((a,b)=>a+b,0).toFixed(1));
  const lastScore=scores[scores.length-1];

  return (
    <>
      {showCorrect && <CorrectPopup lang={showCorrect.lang} score={showCorrect.score} onDone={()=>setShowCorrect(null)}/>}
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
            else if(opt.name===selected&&selected!==q.lang.name){bg="#FDECEA";color="#A32D2D";border="1.5px solid #E09090";}
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
                {selected===q.lang.name?"Correct!":selected==="__timeout__"?"Time's up!":` It was ${q.lang.name}`}
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
          {/* Tip */}
          {results[results.length-1]?.lang?.tip && (
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
  );
}

function Home({onStart,leaderboard}) {
  const [level,setLevel]=useState("medium");
  const levels=[
    {id:"easy",label:"Easy",desc:"Common world languages only"},
    {id:"medium",label:"Medium",desc:"Mix of major & regional languages"},
    {id:"hard",label:"Hard",desc:"Includes rare & indigenous languages"},
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
      <p style={{fontSize:11,color:C.light,marginTop:"0.75rem"}}>15s per question · 50+ languages · partial points for close guesses</p>
    </div>
  );
}

function Done({results,total,max,onRestart,leaderboard,setLeaderboard}) {
  const [nickname,setNickname]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const pct=Math.round((total/max)*100);
  const label=pct===100?"Polyglot legend":pct>=70?"Language lover":pct>=40?"Decent detective":"Keep exploring!";
  const gameUrl = "https://guessthelanguage-liard.vercel.app/";
  const shareText=`LanguageGuessr — ${total}/${max} pts · ${label}\n${results.map((r,i)=>`Q${i+1}: ${r.guessed===r.lang.name?"✅":"❌"} (${r.score}/13)`).join("\n")}\nTry to beat me: ${gameUrl}`;

  async function submitScore() {
    if(!nickname.trim()) return;
    const entry={name:nickname.trim(),score:total,date:new Date().toLocaleDateString()};
    const board=[...leaderboard,entry].sort((a,b)=>b.score-a.score).slice(0,10);
    setLeaderboard(board);setSubmitted(true);
    try{await window.storage.set("gtl_leaderboard",JSON.stringify(board),true);}catch(e){}
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
            <div style={{padding:"0.5rem 0.75rem",background:`${C.ocean}10`,borderRadius:8,borderLeft:`3px solid ${C.ocean}`,marginBottom:8}}>
              <p style={{fontSize:11,color:C.ocean,fontWeight:500,margin:"0 0 2px"}}>How to spot {r.lang.name}</p>
              <p style={{fontSize:12,color:C.dark,margin:0,lineHeight:1.5}}>{r.lang.tip}</p>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <FamilyTag family={r.lang.family}/>
              <span style={{fontSize:11,color:C.mid}}>{r.lang.script} · {r.lang.speakers} speakers</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <button onClick={onRestart} style={{flex:1,padding:"0.7rem",borderRadius:99,border:`1.5px solid ${C.ocean}`,background:C.white,color:C.ocean,cursor:"pointer",fontSize:14,fontWeight:500}}>
          Play again
        </button>
        {navigator.share ? (
          <button onClick={()=>navigator.share({title:"LanguageGuessr",text:shareText}).catch(()=>{})}
            style={{flex:1,padding:"0.7rem",borderRadius:99,border:"none",background:C.coral,color:C.white,cursor:"pointer",fontSize:14,fontWeight:500}}>
            Share score ↗
          </button>
        ) : (
          <button onClick={()=>navigator.clipboard.writeText(shareText).catch(()=>{})}
            style={{flex:1,padding:"0.7rem",borderRadius:99,border:"none",background:C.coral,color:C.white,cursor:"pointer",fontSize:14,fontWeight:500}}>
            Copy score
          </button>
        )}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
        {[
          {label:"WhatsApp", color:"#25D366", url:`https://wa.me/?text=${encodeURIComponent(shareText)}`},
          {label:"Telegram", color:"#229ED9", url:`https://t.me/share/url?url=${encodeURIComponent(gameUrl)}&text=${encodeURIComponent(shareText)}`},
          {label:"X / Twitter", color:"#000000", url:`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`},
        ].map(({label,color,url})=>(
          <a key={label} href={url} target="_blank" rel="noopener noreferrer"
            style={{display:"block",padding:"0.55rem",borderRadius:8,border:`1.5px solid ${color}30`,background:`${color}10`,color,cursor:"pointer",fontSize:12,fontWeight:500,textAlign:"center",textDecoration:"none"}}>
            {label}
          </a>
        ))}
      </div>
      {!navigator.share && <p style={{fontSize:11,color:C.light,textAlign:"center",marginTop:6}}>iMessage / Messenger: copy score then paste</p>}
    </div>
  );
}
