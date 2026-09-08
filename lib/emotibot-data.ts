export type ConversationState =
  | "GREETING"
  | "WAITING_FOR_FEELING"
  | "FREE_CHAT";

export interface FeelingResponse {
  feeling: string;
  keywords: string[];
  response: string;
}

export const FEELING_RESPONSES: FeelingResponse[] = [
  {
    feeling: "anxiety",
    keywords: ["anxious", "anxiety", "worried", "nervous", "panic"],
    response:
      '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." — Philippians 4:6-7\n\n"Cast all your anxiety on Him because He cares for you." — 1 Peter 5:7',
  },
  {
    feeling: "stress",
    keywords: ["stress", "stressed", "overwhelmed", "too much"],
    response:
      '"Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls." — Matthew 11:28-30\n\n"Cast your cares on the LORD and He will sustain you; He will never let the righteous be shaken." — Psalm 55:22',
  },
  {
    feeling: "loneliness",
    keywords: ["lonely", "loneliness", "alone", "isolated", "no one"],
    response:
      '"Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go." — Joshua 1:9\n\n"I will not leave you as orphans; I will come to you." — John 14:18\n\n"Never will I leave you; never will I forsake you." — Hebrews 13:5',
  },  
  {
    feeling: "fear",
    keywords: ["fear", "afraid", "scared", "terrified", "frightened"],
    response:
      '"So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand." — Isaiah 41:10\n\n"For God has not given us a spirit of fear, but of power and of love and of a sound mind." — 2 Timothy 1:7',
  },
  {
    feeling: "sad",
    keywords: ["sad", "sadness", "unhappy", "down", "crying", "cry", "sorrow"],
    response:
      '"The LORD is close to the brokenhearted and saves those who are crushed in spirit." — Psalm 34:18\n\n"Blessed are those who mourn, for they will be comforted." — Matthew 5:4\n\n"He heals the brokenhearted and binds up their wounds." — Psalm 147:3',
  },
  {
    feeling: "anger",
    keywords: ["angry", "anger", "mad", "furious", "irritated", "annoyed"],
    response:
      '"In your anger do not sin: Do not let the sun go down while you are still angry." — Ephesians 4:26\n\n"A gentle answer turns away wrath, but a harsh word stirs up anger." — Proverbs 15:1\n\n"Everyone should be quick to listen, slow to speak and slow to become angry." — James 1:19',
  },
  {
    feeling: "frustration",
    keywords: ["frustrated", "frustration", "stuck", "failing", "failed"],
    response:
      '"Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds, because you know that the testing of your faith produces perseverance." — James 1:2-3\n\n"I can do all this through Him who gives me strength." — Philippians 4:13',
  },
  {
    feeling: "confusion",
    keywords: ["confused", "confusion", "uncertain", "unsure", "lost", "dont know"],
    response:
      '"Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to Him, and He will make your paths straight." — Proverbs 3:5-6\n\n"If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you." — James 1:5',
  },
  {
    feeling: "insecurity",
    keywords: ["insecure", "insecurity", "not good enough", "ugly", "worthless", "unworthy"],
    response:
      '"I praise You because I am fearfully and wonderfully made; Your works are wonderful, I know that full well." — Psalm 139:14\n\n"For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do." — Ephesians 2:10',
  },
  {
    feeling: "burnout",
    keywords: ["burnout", "burned out", "exhausted", "drained", "tired", "depleted"],
    response:
      '"But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint." — Isaiah 40:31\n\n"My grace is sufficient for you, for my power is made perfect in weakness." — 2 Corinthians 12:9',
  },
  {
    feeling: "pressure",
    keywords: ["pressure", "pressured", "expectations", "expectation", "grade", "grades"],
    response:
      '"Set your minds on things above, not on earthly things." — Colossians 3:2\n\n"Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid." — John 14:27',
  },
  {
    feeling: "hopeless",
    keywords: ["hopeless", "hopelessness", "no hope", "give up", "giving up", "despair"],
    response:
      '"For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future." — Jeremiah 29:11\n\n"We have this hope as an anchor for the soul, firm and secure." — Hebrews 6:19',
  },
  {
    feeling: "excited",
    keywords: ["excited", "excitement", "happy", "grateful", "thankful", "blessed"],
    response:
      '"Rejoice in the Lord always. I will say it again: Rejoice!" — Philippians 4:4\n\n"This is the day that the LORD has made; let us rejoice and be glad in it." — Psalm 118:24\n\n"Every good and perfect gift is from above." — James 1:17',
  },
  {
    feeling: "happy",
    keywords: ["happy", "happiness", "joy", "joyful", "glad"],
    response:
      '"Rejoice in the Lord always. I will say it again: Rejoice!" — Philippians 4:4\n\n"A joyful heart is good medicine, but a crushed spirit dries up the bones." — Proverbs 17:22',
  },
  {
    feeling: "depressed",
    keywords: ["depressed", "depression", "sad all the time", "empty", "numb"],
    response:
      '"The LORD is close to the brokenhearted and saves those who are crushed in spirit." — Psalm 34:18\n\n"We are hard pressed on every side, but not crushed; perplexed, but not in despair." — 2 Corinthians 4:8\n\n"My grace is sufficient for you, for my power is made perfect in weakness." — 2 Corinthians 12:9',
  },
];

export const GREETING_MESSAGE =
  "👋 Hello, dear student! Welcome to EMOTIBOT.\n\nI'm here to listen and support you.\n\nHow are you feeling today?";

export const EMOTION_QUICK_REPLIES = [
  {
    title: "😟 Anxiety",
    payload: "FEELING_ANXIETY",
  },
  {
    title: "😫 Stress",
    payload: "FEELING_STRESS",
  },
  {
    title: "💔 Lonely",
    payload: "FEELING_LONELINESS",
  },
  {
    title: "😰 Fear",
    payload: "FEELING_FEAR",
  },
  {
    title: "😢 Sad",
    payload: "FEELING_SAD",
  },
  {
    title: "😠 Anger",
    payload: "FEELING_ANGER",
  },
  {
    title: "😤 Frustration",
    payload: "FEELING_FRUSTRATION",
  },
  {
    title: "🤔 Confusion",
    payload: "FEELING_CONFUSION",
  },
  {
    title: "😔 Insecurity",
    payload: "FEELING_INSECURITY",
  },
  {
    title: "🫠 Burnout",
    payload: "FEELING_BURNOUT",
  },
  {
    title: "🖤 Hopeless",
    payload: "FEELING_HOPELESS",
  },
  {
    title: "🫂 Depressed",
    payload: "FEELING_DEPRESSED",
  },
  {
    title: "💙 I'd like to talk about it",
    payload: "FEELING_OTHER",
  },
];

export const FEELING_EMPATHY_OPENINGS: Record<string, string> = {
  anxiety:
    "I hear how difficult this must be for you. It's okay to feel anxious — you're not alone in this.",
  stress:
    "I understand. Life can feel overwhelming at times, but you don't have to carry it all alone.",
  loneliness:
    "I'm sorry you're feeling this way. Please know that you are not alone — God is always with you.",
  fear:
    "I hear you. Fear can feel so heavy, but you don't have to face it alone. God is with you.",
  sad:
    "I'm here with you. It's okay to be sad — God is close to the brokenhearted.",
  anger:
    "I hear you. Thank you for trusting me with this. It's okay to feel angry.",
  frustration:
    "I hear you. That sounds really hard. Let's take a moment to breathe.",
  confusion:
    "It's okay to feel unsure. You don't have to have all the answers right now.",
  insecurity:
    "I hear you. Please remember — you are wonderfully made by a God who loves you deeply.",
  burnout:
    "That sounds really exhausting. Please be gentle with yourself — rest is a gift from God.",
  pressure:
    "I hear you. That's a lot to carry. Remember, God's grace is sufficient for you.",
  hopeless:
    "I'm here with you, and so is God. Even in the hardest moments, you are not alone.",
  excited:
    "That's wonderful! Joy is such a beautiful gift from God. Tell me more!",
  happy:
    "That's so good to hear! A joyful heart is good medicine. I'm happy for you!",
  depressed:
    "I hear you, and I care. You are not alone in this — God is near to the brokenhearted.",
};

export const QUICK_REPLY_PAYLOAD_TO_FEELING: Record<string, string> = {
  FEELING_ANXIETY: "anxiety",
  FEELING_STRESS: "stress",
  FEELING_LONELINESS: "loneliness",
  FEELING_FEAR: "fear",
  FEELING_SAD: "sad",
  FEELING_ANGER: "anger",
  FEELING_FRUSTRATION: "frustration",
  FEELING_CONFUSION: "confusion",
  FEELING_INSECURITY: "insecurity",
  FEELING_BURNOUT: "burnout",
  FEELING_PRESSURE: "pressure",
  FEELING_HOPELESS: "hopeless",
  FEELING_EXCITED: "excited",
  FEELING_HAPPY: "happy",
  FEELING_DEPRESSED: "depressed",
};

export const TALK_ABOUT_IT_RESPONSES = [
  "I'm here to listen. Please take your time and tell me what's been on your mind lately.",
  "Thank you for trusting me. What's been happening that's making you feel this way?",
  "I'm listening. Feel free to share whatever you're comfortable talking about.",
  "You don't have to fit your feelings into a category. Tell me what's been happening.",
];

export const GOODBYE_KEYWORDS = [
  "thank you",
  "thank u",
  "thanks",
  "i'm okay now",
  "i am okay now",
  "im okay",
  "i'm okay",
  "that's all",
  "thats all",
  "bye",
  "goodbye",
  "good bye",
  "i have to go",
  "gotta go",
  "thanks for listening",
  "thank you for listening",
  "take care",
];

export const CRISIS_KEYWORDS: string[] = [
  "suicide",
  "kill myself",
  "want to die",
  "end my life",
  "hurt myself",
  "self harm",
  "self-harm",
  "no reason to live",
];

export const CRISIS_RESPONSE: string =
  "I hear you, and I want you to know that you are not alone. Please reach out to someone who can help you right now. Talk to a school counselor, a trusted adult, or contact the Philippines National Center for Mental Health Crisis Hotline at 1553 or 0966-351-4518 / 0917-899-8727. If this is an emergency, please call 911 or go to the nearest hospital immediately. You matter, and there are people who care about you and want to help.";

export const MOTIVATIONAL_SONGS: string[] = [
  "Way Maker – Sinach",
  "Oceans (Where Feet May Fail) – Hillsong United",
  "What a Beautiful Name – Hillsong Worship",
  "Goodness of God – Bethel Music",
  "10,000 Reasons (Bless the Lord) – Matt Redman",
  "Great Are You Lord – All Sons & Daughters",
  "Do It Again – Elevation Worship",
  "Who You Say I Am – Hillsong Worship",
];
