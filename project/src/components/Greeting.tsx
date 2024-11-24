import React from 'react';

interface GreetingPhrase {
  text: string;
  language: string;
  pronunciation?: string;
  translation?: string;
}

const getMorningGreetings = (): GreetingPhrase[] => [
  { text: "Good morning, let's make today amazing", language: "English" },
  { text: "おはようございます", language: "Japanese", pronunciation: "Ohayou gozaimasu", translation: "Good morning" },
  { text: "早安，愿你有美好的一天", language: "Chinese", pronunciation: "Zǎo ān, yuàn nǐ yǒu měihǎo de yītiān", translation: "Good morning, have a wonderful day" },
  { text: "Bonjour et belle journée", language: "French", translation: "Good morning and have a beautiful day" },
  { text: "Buenos días, que tengas un día maravilloso", language: "Spanish", translation: "Good morning, have a wonderful day" }
];

const getAfternoonGreetings = (): GreetingPhrase[] => [
  { text: "Hope your afternoon is going wonderfully", language: "English" },
  { text: "こんにちは", language: "Japanese", pronunciation: "Konnichiwa", translation: "Good afternoon" },
  { text: "午安，愿你下午愉快", language: "Chinese", pronunciation: "Wǔ ān, yuàn nǐ xiàwǔ yúkuài", translation: "Good afternoon, have a pleasant afternoon" },
  { text: "Bon après-midi", language: "French", translation: "Good afternoon" },
  { text: "Buenas tardes, que disfrutes la tarde", language: "Spanish", translation: "Good afternoon, enjoy your afternoon" }
];

const getEveningGreetings = (): GreetingPhrase[] => [
  { text: "Good evening, time to unwind and relax", language: "English" },
  { text: "こんばんは", language: "Japanese", pronunciation: "Konbanwa", translation: "Good evening" },
  { text: "晚上好，祝你有个轻松的夜晚", language: "Chinese", pronunciation: "Wǎnshàng hǎo, zhù nǐ yǒu gè qīngsōng de yèwǎn", translation: "Good evening, wish you a relaxing night" },
  { text: "Bonsoir, passez une douce soirée", language: "French", translation: "Good evening, have a pleasant evening" },
  { text: "Buenas noches, que tengas una noche tranquila", language: "Spanish", translation: "Good evening, have a peaceful night" }
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
      <h1 className="text-4xl font-light mb-3 tracking-wide animate-fade-in">
        {greeting.text}
      </h1>
      <div className="text-gray-400 space-y-1">
        <p className="text-sm tracking-wider">
          <i>{greeting.language}</i>
        </p>
        {greeting.pronunciation && (
          <p className="text-xs opacity-75">[{greeting.pronunciation}]</p>
        )}
        {greeting.translation && greeting.language !== "English" && (
          <p className="text-xs opacity-75">"{greeting.translation}"</p>
        )}
      </div>
    </div>
  );
}