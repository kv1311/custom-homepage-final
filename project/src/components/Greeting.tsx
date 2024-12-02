import React from 'react';

interface GreetingPhrase {
  text: string;
  language: string;
  pronunciation?: string;
  translation?: string;
}

const getMorningGreetings = (): GreetingPhrase[] => [
  { text: "Good morning! May your day be full of possibilities", language: "English" },
  { text: "おはようございます。今日も一日頑張りましょう", language: "Japanese", pronunciation: "Ohayou gozaimasu. Kyou mo ichinichi ganbarimashou", translation: "Good morning. Let’s do our best today" },
  { text: "早安！希望你的一天充满阳光", language: "Chinese", pronunciation: "Zǎo ān! Xīwàng nǐ de yītiān chōngmǎn yángguāng", translation: "Good morning! May your day be full of sunshine" },
  { text: "Bonjour! Que cette journée soit magnifique", language: "French", translation: "Good morning! May this day be magnificent" },
  { text: "Buenos días, empieza con una sonrisa", language: "Spanish", translation: "Good morning, start with a smile" },
  { text: "Guten Morgen! Zeit für neue Abenteuer", language: "German", translation: "Good morning! Time for new adventures" },
  { text: "Buongiorno! Che sia un giorno pieno di gioia", language: "Italian", translation: "Good morning! May it be a day full of joy" },
  { text: "Доброе утро! Пусть этот день будет особенным", language: "Russian", pronunciation: "Dobroe utro! Pust' etot den' budet osobennym", translation: "Good morning! May this day be special" },
  { text: "صباح الخير! اجعل هذا اليوم مميزًا", language: "Arabic", pronunciation: "Sabah alkhayr! Ij'al hadha alyawm mumayaza", translation: "Good morning! Make this day special" },
  { text: "सुप्रभात! आपके दिन में खुशियाँ हों", language: "Hindi", pronunciation: "Suprabhat! Aapke din mein khushiyan ho", translation: "Good morning! May your day be filled with happiness" }
];

const getAfternoonGreetings = (): GreetingPhrase[] => [
  { text: "Good afternoon! Take a moment to appreciate the day", language: "English" },
  { text: "こんにちは。午後も素晴らしい時間を過ごしてください", language: "Japanese", pronunciation: "Konnichiwa. Gogo mo subarashii jikan wo sugoshite kudasai", translation: "Good afternoon. Have a wonderful time this afternoon" },
  { text: "午安！放慢脚步享受这个下午", language: "Chinese", pronunciation: "Wǔ ān! Fàngmàn jiǎobù xiǎngshòu zhège xiàwǔ", translation: "Good afternoon! Slow down and enjoy this afternoon" },
  { text: "Bon après-midi! Profitez du moment présent", language: "French", translation: "Good afternoon! Enjoy the present moment" },
  { text: "Buenas tardes, disfruta del camino", language: "Spanish", translation: "Good afternoon, enjoy the journey" },
  { text: "Guten Tag! Schätze die kleinen Dinge", language: "German", translation: "Good afternoon! Appreciate the little things" },
  { text: "Buon pomeriggio! Concediti un momento di calma", language: "Italian", translation: "Good afternoon! Take a moment of calm for yourself" },
  { text: "Добрый день! Остановитесь, чтобы насладиться моментом", language: "Russian", pronunciation: "Dobryy den'! Ostanovites', chtoby naslazhdatsya momentom", translation: "Good afternoon! Pause to enjoy the moment" },
  { text: "مساء الخير! استمتع بهذه اللحظة", language: "Arabic", pronunciation: "Masa' alkhayr! Istamta' bihadhihi allahtha", translation: "Good afternoon! Enjoy this moment" },
  { text: "नमस्कार! यह समय का आनंद लें", language: "Hindi", pronunciation: "Namaskar! Yeh samay ka anand len", translation: "Good afternoon! Enjoy this time" }
];

const getEveningGreetings = (): GreetingPhrase[] => [
  { text: "Good evening! Relax and reflect on the day's moments", language: "English" },
  { text: "こんばんは。穏やかな夜をお過ごしください", language: "Japanese", pronunciation: "Konbanwa. Odayakana yoru wo osugoshi kudasai", translation: "Good evening. Have a peaceful night" },
  { text: "晚上好！愿你拥有一个安静的夜晚", language: "Chinese", pronunciation: "Wǎnshàng hǎo! Yuàn nǐ yǒngyǒu yīgè ānjìng de yèwǎn", translation: "Good evening! Wishing you a quiet night" },
  { text: "Bonsoir! Détendez-vous et profitez de la soirée", language: "French", translation: "Good evening! Relax and enjoy the evening" },
  { text: "Buenas noches, relájate y disfruta", language: "Spanish", translation: "Good evening, relax and enjoy" },
  { text: "Guten Abend! Lass die Sorgen des Tages los", language: "German", translation: "Good evening! Let go of the day's worries" },
  { text: "Buona sera! Riposa bene questa sera", language: "Italian", translation: "Good evening! Rest well this evening" },
  { text: "Добрый вечер! Пусть эта ночь принесет покой", language: "Russian", pronunciation: "Dobryy vecher! Pust' eta noch' prineset pokoy", translation: "Good evening! May this night bring peace" },
  { text: "مساء الخير! تمتع بليلة هادئة", language: "Arabic", pronunciation: "Masa' alkhayr! Tamta' b-layla hadi'a", translation: "Good evening! Have a peaceful night" },
  { text: "शुभ संध्या! इस शाम को सुकून से बिताएं", language: "Hindi", pronunciation: "Shubh Sandhya! Is shaam ko sukoon se bitayen", translation: "Good evening! Spend this evening in peace" }
];


export default function Greeting() {
  const getTimeBasedGreeting = (): GreetingPhrase => {
    const hour = new Date().getHours();
    let greetings: GreetingPhrase[];
    
    if (hour < 12) {
      greetings = getMorningGreetings();
    } else if (hour < 18) {
      greetings = getAfternoonGreetings();
    } else {
      greetings = getEveningGreetings();
    }
    
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
  };

  const greeting = getTimeBasedGreeting();

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-light mb-3 tracking-wide animate-reveal overflow-hidden">
        <span className="inline-block animate-text-reveal">{greeting.text}</span>
      </h1>
      <div className="text-gray-400 space-y-1 overflow-hidden">
        <p className="text-sm tracking-wider animate-fade-up delay-300">
          <i>{greeting.language}</i>
        </p>
        {greeting.pronunciation && (
          <p className="text-xs opacity-75 animate-fade-up delay-400">
            [{greeting.pronunciation}]
          </p>
        )}
        {greeting.translation && greeting.language !== "English" && (
          <p className="text-xs opacity-75 animate-fade-up delay-500">
            "{greeting.translation}"
          </p>
        )}
      </div>
    </div>
  );
}