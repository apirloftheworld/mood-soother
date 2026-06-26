export type EmotionKey = 'anxiety' | 'sad' | 'anger' | 'stress' | 'hurt';

export const emotionLabels: { key: EmotionKey; label: string; emoji: string }[] = [
  { key: 'anxiety', label: '焦虑', emoji: '😰' },
  { key: 'sad', label: '难过', emoji: '😢' },
  { key: 'anger', label: '生气', emoji: '😤' },
  { key: 'stress', label: '紧张', emoji: '😣' },
  { key: 'hurt', label: '委屈', emoji: '🥺' },
];

export const soothingMessages: Record<EmotionKey, string[]> = {
  anxiety: [
    '我听到了，焦虑是你身体在提醒你：这件事对你很重要。',
    '你不需要现在就解决所有问题，一步一步来就好。',
    '焦虑不是你的敌人，它是你太在意的证据。',
    '此刻的你很安全，深呼吸，你拥有应对的能力。',
    '担忧的事情多数不会发生，而你已经撑过了每次难关。',
    '你不必一个人扛着，我在这里陪你。',
    '把注意力拉回来，这一刻你只需要呼吸。',
  ],
  sad: [
    '难过是正常的，说明你在乎，说明你有感知这个世界的能力。',
    '这感觉一定很不容易，但我相信你会好起来的。',
    '你可以难过，不需要假装没事，给自己一点时间。',
    '眼泪不是软弱，是你认真感受过的证明。',
    '世界上有一个人正在经历相似的感受，你不孤单。',
    '今天的你已经很努力了，好好抱抱自己吧。',
  ],
  anger: [
    '愤怒背后往往是受伤或失望，你能感受到它已经很了不起了。',
    '你有权利生气，这情绪是真实的，也是合理的。',
    '先把这股气呼出去，你的感受值得被正视。',
    '生气说明你珍视自己的边界，这本身没有错。',
    '停下来感受一下，愤怒想告诉你的到底是什么？',
    '你可以愤怒，但不要让愤怒成为伤害自己的武器。',
  ],
  stress: [
    '你不需要面面俱到，你已经做得超出预期了。',
    '把眼前的压力切成一小块一小块，你只需要处理眼前的这一块。',
    '紧张是你的身体在为重要的事情做准备，而不是在背叛你。',
    '你曾经应对过比这更棘手的事，回想一下那次你是怎么走过来的。',
    '放松不需要完美，先从松开你的肩膀开始。',
    '给自己三分钟，什么都不做，就只是呼吸。',
  ],
  hurt: [
    '委屈是因为你的好意被忽略了，这当然让人难过。',
    '你的感受是有效的，别人的不理解不会让它消失。',
    '被误解或被不公平对待真的很不好受，我理解你。',
    '你不是小题大做，你只是有自己的感受，这完全合理。',
    '不需要立刻原谅，也不需要立刻释怀，给情绪一点空间。',
    '温柔地对待自己，就像你会温柔对待正在经历这一切的好朋友。',
  ],
};

/** Match a custom-input emotion string to the closest preset key */
export function matchEmotion(input: string): EmotionKey {
  const lower = input.trim().toLowerCase();
  const map: Record<string, EmotionKey> = {
    焦虑: 'anxiety', 焦躁: 'anxiety', 不安: 'anxiety', 担心: 'anxiety', 害怕: 'anxiety',
    难过: 'sad', 伤心: 'sad', 悲伤: 'sad', 失落: 'sad', 沮丧: 'sad', 想哭: 'sad',
    生气: 'anger', 愤怒: 'anger', 不爽: 'anger', 烦躁: 'anger',
    紧张: 'stress', 压力: 'stress', 紧绷: 'stress',
    委屈: 'hurt', 冤枉: 'hurt', 不公平: 'hurt',
  };
  return map[lower] ?? 'anxiety';
}

/** Pick a random message for a given emotion */
export function getRandomMessage(key: EmotionKey): string {
  const pool = soothingMessages[key];
  return pool[Math.floor(Math.random() * pool.length)];
}
