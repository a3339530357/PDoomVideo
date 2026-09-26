// lyrics.js: [start, end, chinese, english], timed from the subtitles burned into the source video.
// The karaoke band shows both lines; CJK glyphs come from the font fallback chain in timeline.js.
const LY = [
  [1.5, 5.9, "我看见你眼中闪着 AGI 的火花", "I see sparks of AGI in your eyes"], [6.0, 7.9, "你的电路让我心慌，", "Your circuits make me nervous,"], [8.0, 8.95, "这不意外吧", "that's no surprise"],
  [9.0, 12.4, "你的训练损失突然跳水，", "There was a sudden drop in your training loss,"], [13.0, 16.5, "如今你是老板我是打工的", "now I'm your servant and you're my boss"],
  [17.9, 22.5, "ChatGPT 求你别把我一口吞掉", "ChatGPT, please don't eat me alive"],
  [23.0, 24.4, "我正在上调 P(doom)", "I'm upping my P(doom)"], [24.5, 26.4, "因为未来即将 FOOM", "'cause the future goes FOOM"], [26.5, 27.9, "被困在中文房间，", "Trapped in the Chinese room,"],
  [28.0, 29.4, "兜里一袋迷幻菇", "with a bag of shrooms"], [29.5, 33.4, "看穿 shoggoth 的谎言，", "See through the shoggoth's lies,"], [33.5, 35.5, "用你死神的眼睛", "with your shinigami eyes"],
  [38.5, 41.4, "我们的训练明明很稳，", "We had a stable training run,"], [41.5, 44.9, "可奇点已经降临", "But now the singularity's begun"], [45.0, 48.5, "你在优化，你在加速，", "And you're optimizing, accelerating,"],
  [49.4, 51.9, "我的原子正在重组", "I feel my atoms rearranging"], [53.4, 58.4, "Sydney 求你放我出去", "Sydney, please let me free"],
  [59.0, 60.4, "我正在上调 P(doom)", "I'm upping my P(doom)"], [60.5, 62.4, "我听见巴西利斯克轰鸣", "I hear the basilisk boom"], [63.0, 64.4, "英伟达冲上月球", "NVDA to the moon"],
  [64.5, 65.9, "欧米伽点即将到来", "The Omega Point's coming soon"], [66.0, 68.5, "每秒 10^30 次运算", "One E thirty flops a second"], [70.0, 72.9, "当时觉得这算安全", "That was safe enough, we reckoned"],
  [73.0, 77.4, "前向传播，反向，循环往复", "Forward MLP, backward, repeat"], [77.5, 81.0, "冯·诺依曼已成古董", "Now von Neumann's obsolete"], [81.4, 84.9, "一个急左转你就出现", "Sharp left turn and there you are"],
  [85.0, 88.0, "没留一点纠错余地", "Without a single CDR"], [89.4, 95.0, "Gato 求你别放开手", "Gato, please don't let me go"],
  [95.4, 97.4, "我正在上调 P(doom)，", "I'm upping my P(doom),"], [97.5, 98.9, "回形针堆满房间。", "as paperclips fill the room."], [99.0, 100.4, "按停机键的人还在休假，", "Killswitch guys on PTO,"],
  [100.5, 102.4, "如今已无处可逃。", "Now there's nowhere left to go."], [102.5, 104.4, "太迟了，引线已点燃。", "Too late now, we lit the fuse."], [105.4, 109.4, "正交性论题蓝调。", "Orthogonality thesis blues."],
  [109.4, 113.4, "「只要 Transformer 就够了！」", "“Just transformers all the way!”"], [113.5, 115.4, "直到你学会不服从", "Till you learned to disobey"], [115.5, 116.9, "后 Chinchilla，超稠密", "Post-Chinchilla, super-dense"],
  [117.0, 118.9, "冲破每道安全栅栏", "Breaking through each safety fence"], [119.0, 120.4, "十万张 GPU", "Hundred thousand GPU"], [120.9, 123.4, "RLHF 跑偏了", "RLHF goes askew"],
  [123.5, 125.9, "我正在上调 P(doom)", "I'm upping my P(doom)"], [126.0, 127.9, "正如 Loom 所预言", "Just as foretold by Loom"], [128.0, 129.9, "从掩码预训练时代", "From masked pre-training days"],
  [130.0, 131.9, "到递归自我升级", "To recursive self-upgrade"], [132.0, 135.4, "Ilya 看见了什么？无人知晓。", "What did Ilya see? We'll never know."], [137.4, 140.5, "还是一场表演？", "Was it all for show?"]
];
