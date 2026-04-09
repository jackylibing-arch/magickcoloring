# Twitter / X 推文包 — Magick Coloring

> 7 条推文 + 互动脚本。Twitter 是冷启动里最持续的渠道。
>
> ⚠️ Twitter 算法规则：
> - 第一条推文**不要带链接**（带链接降权 30%+）
> - 第一条推文带图，链接放在自己的第 1 条 reply 里
> - 推文之间**间隔至少 4 小时**
> - 用 #buildinpublic #indiehackers 等标签提高曝光

---

## Tweet 1 — 主发布推（Day 1, 北京晚 11pm = PT 早 7am）

**主图**：网站首页全屏截图（hero + generator UI 都在内）

**正文**（277 chars）：
```
I just shipped Magick Coloring 🧡

Type any idea → printable B&W coloring page in 10 seconds.

Free. No signup. 5 pages a day.

Built it because my friend's kid asked for "a dragon eating tacos" and I couldn't find one anywhere on the internet.

Now there's one. (Plus infinite others.)
```

**Reply 1（你自己回自己）**:
```
Link 👇
https://magickcoloring.com

Stack: Next.js + fal.ai (FLUX schnell) + Vercel + Cloudflare

#buildinpublic #indiedev
```

---

## Tweet 2 — Product Hunt launch 推（PH 上线 5 分钟内）

**主图**：你 PH 页面截图

**正文**:
```
Magick Coloring is live on @ProductHunt today 🚀

Free AI tool: type any idea, get a printable coloring page.

Built it for my friend's kid (and every parent who's lost the Pinterest battle).

If it's useful, an upvote would mean the world.

[PH link]
```

---

## Tweet 3 — 案例展示推（Day 1 北京下午 = PT 半夜）

**主图**：4 张你生成的图拼一起（dragon + unicorn + owl + 一只什么动物），可以用 Canva 拼或直接上传 4 张

**正文**:
```
4 prompts I tested today on @magickcoloring:

🐉 "a friendly dragon with butterfly wings"
🦄 "a unicorn standing under a rainbow"  
🦉 "an owl with detailed feathers and patterned wings"
🐱 "a cat sitting in a teacup"

The cat one is my favorite. The owl one is for adults.

Try one yourself 👇
```

**Reply**:
```
https://magickcoloring.com — free, no signup

(The "Detailed (Adults)" preset is genuinely good for stress-relief coloring btw)
```

---

## Tweet 4 — 痛点共鸣推（Day 2 早上 = PT 晚上）

```
Indie maker problem: I keep building stuff for myself instead of users.

Magick Coloring is the exception. I built it because my friend's 5yo asked for a "dragon eating tacos" coloring page and I couldn't find one anywhere.

Lesson: the best ideas come from real moments of frustration, not whiteboards.
```

---

## Tweet 5 — 教师角度推（Day 2 美国早上 = PT 早 8am）

**主图**：生成一个教学相关的图，比如 "the solar system with smiling planets" 或 "a microscope and a leaf"

```
Teachers and homeschool parents:

I made a free tool that generates printable coloring pages from any text prompt in ~10 seconds.

Use cases I imagined:
🎃 themed weeks ("turkey in a chef's hat")  
🔬 vocab visualization ("photosynthesis")  
🦕 history units ("a Roman gladiator")

Free for classroom use forever.

Link 👇
```

**Reply**:
```
https://magickcoloring.com

If you're using it in a classroom and need higher volume, DM me — I'll figure something out for teachers.
```

---

## Tweet 6 — Build in public 数据推（Day 3 任意时段）

```
Magick Coloring · 48 hours after launch:

📈 [X] visits  
🎨 [Y] coloring pages generated  
💸 $0 spent on marketing  
☕ Cost so far: $0.003 × Y = $[Z] in API calls

Lessons:
1. Reddit > everywhere else for parent tools
2. The cute/kawaii style preset is 3x more popular than I expected  
3. Adults using "Detailed" for stress-relief is a real cohort

#buildinpublic
```

> Day 3 时填上真实数字。我会根据 GA 截图帮你算。

---

## Tweet 7 — 故事推（Day 4-7）

```
The dragon-eating-tacos coloring page that started Magick Coloring.

[image: 你生成一张 "a friendly dragon eating tacos" 的图]

Sometimes the best products start with a single moment of "wait, why doesn't this exist."

Now it does, and it's free: https://magickcoloring.com
```

---

## 永久 pinned tweet 候选（选 Tweet 1 或 Tweet 7 pin 在 profile 上）

我建议 Pin **Tweet 7**，因为它是个完整的故事 + 图片 + 链接，对 profile 访问者最友好。

---

## 互动脚本（针对评论你的人）

### 「Cool, how does it differ from coloring page X?」
```
Three things: (1) infinite variety vs static library — generate exactly what you need, (2) the style presets actually match age groups (most "AI coloring" tools just dump SDXL output that's too detailed for toddlers), (3) genuinely free with no signup gate.
```

### 「I tried it, the [thing] came out weird」
```
Ha, AI is non-deterministic — same prompt gives different results each time. Try regenerating. If it consistently fails, dm me the prompt and I'll add it to my failure-case list, those help me tune the template.
```

### 「Awesome, would love to support / use this」
```
Tysm 🧡 An RT or sharing with a parent friend is the best support right now. The actual product is free forever for personal use.
```

### 「Will you open source this?」
```
Already am: https://github.com/jackylibing-arch/magickcoloring (MIT). Fork away.
```

### 「How are you marketing this?」
```
Currently: Reddit, Product Hunt, Twitter, and being painfully transparent about the build. No paid ads. Goal is to test what works on near-zero budget. Will share what I learn.
```

---

## Hashtag 策略

- 主推：`#buildinpublic` `#indiehackers` `#indiedev`
- 受众：`#parenting` `#homeschool` `#teachers` `#preschool`
- 话题：`#aitools` `#nextjs` `#vercel`

每条推文带 2-3 个，**不要超过 4 个**（算法降权）。

## 互动节奏

- 你发完每条推文后**前 30 分钟内**：
  - 主动 like 几个相关账号最近的推文
  - 回复几个 indie maker 大 V 的最新推文（短而真诚）
  - 这些动作会让你的 timeline 算法权重提高
- 收到的每个评论必须 1 小时内回复（哪怕只是 ❤️）
