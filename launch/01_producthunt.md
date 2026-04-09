# Product Hunt Launch — Magick Coloring

> 提交地址：https://www.producthunt.com/posts/new
> 最佳提交时间：**美国 PT 时区 12:01am 周二或周三**（北京时间周二/周三下午 4:01pm）
>
> 等等！如果你看的是 00_PLAYBOOK.md，里面让你"明天 00:01"发是简化版。**正确答案是周二/周三下午 4:01pm 北京时间**，那个时间窗口能拿到接下来 24 小时的全部美国白天流量。如果今天不是周一/周二晚，把 PH 推迟到下一个周二。

---

## 1. Name（产品名）
```
Magick Coloring
```

## 2. Tagline (60 chars max)
```
Free AI coloring page generator — type any idea, print it
```
（59 字符 ✅）

**备选**：
```
Type anything. Get a printable coloring page in 10 seconds.
```
（58 字符 ✅）

```
Free AI coloring pages for kids, teachers, and adults
```
（53 字符 ✅）

## 3. Description (260 chars max)
```
My friend's kid asked for a "dragon eating tacos" coloring page. Pinterest failed me. So I built this: type any idea, get a printable black-and-white line drawing in ~10 seconds. Free. No signup. 5 pages a day, no watermark. Works for toddlers, kids, and adults.
```
（259 字符 ✅）

## 4. Topics (选 3 个)
- Education
- Design Tools
- Artificial Intelligence

## 5. Links
- **Website:** https://magickcoloring.com
- **Pricing:** Free
- **Twitter:** （留空 or 你的 Twitter）
- **GitHub:** https://github.com/jackylibing-arch/magickcoloring

## 6. Media (上传 4-6 张图)

按这个顺序排：

| # | 内容 | 文件 |
|---|---|---|
| 1 | **网站首页全屏截图**（带 Hero "Free AI Coloring Page Generator"） | hero.png |
| 2 | **生成的恐龙图**（你之前测试出来的那张） | example-dino.png |
| 3 | 重新生成一张：`a unicorn standing under a rainbow`（Simple） | example-unicorn.png |
| 4 | 重新生成一张：`an owl with detailed feathers and patterned wings`（Detailed） | example-owl.png |
| 5 | 4 个 style 选项的对比图（如果有时间用 Figma/Canva 拼一下，没时间就跳过） | styles.png |

## 7. First Comment（你登录后必须立刻发，作为 Maker）

```
Hey Product Hunt 👋

I'm Jacky, the maker behind Magick Coloring.

The story: a few months back, my friend's 6-year-old asked for a coloring page of "a dragon eating tacos." I spent twenty minutes searching Pinterest. Twenty. Minutes. There was no dragon-eating-tacos. I gave up and printed a regular dragon, which she colored grumpily.

That was the moment I realized something obvious: every AI image generator can produce literally anything in seconds — but they all output COLOR images, which is the opposite of what a coloring page is. So I spent a weekend tuning prompts and building Magick Coloring.

What it does:
• Type anything, get a printable B&W line drawing in ~10 sec
• 4 style presets: Simple (toddlers) → Medium (kids) → Detailed (adults) → Cute/Kawaii
• Print-ready, kid-safe, 5 free per day, no signup

What it isn't:
• Not a coloring book replacement (those are still better for the car)
• Not a substitute for crayons + paper (please don't replace that with a screen)
• Not magic — sometimes the AI gets weird and you regenerate

It's free forever for personal & classroom use. I'll add a $5/mo Pro tier later for unlimited HD downloads + bulk generation, mostly to cover the API bill.

Honest asks:
1. Try a weird prompt and tell me what broke. Genuinely useful for me.
2. If you're a teacher or parent, what's the ONE feature you wish coloring pages had? I'll prioritize the top one.
3. Roast my prompt engineering — what subjects come out best/worst?

Thanks for reading 🧡
```

## 8. 提交后立刻做这两件事

### A. 发推 + tag PH
你的 Twitter 第 2 条推文（在 04_twitter.md 里）发布，**带上 PH 链接**。

### B. 守在评论区
PH 第一个小时的评论数对排名有 30%+ 的权重。**前 60 分钟内你必须回复每一条评论**。预备的回复脚本看下面。

---

## 评论回复脚本（按问题类型）

### 类型 1：「How does it compare to X / 跟 XX 比有什么不同？」
> Great question! The main differences:
> - Most existing coloring page sites are static libraries — you search for what they have. We generate exactly what you ask for, including weird requests (dragon eating tacos was a real one).
> - We're tuned specifically for coloring book aesthetics (thick clean outlines, no shading, no color), not generic AI art that you have to convert.
> - 100% free for personal use, no signup. No "free trial" trap.
>
> The trade-off: we don't have the brand recognition or curated quality of a paid library. We're optimizing for "infinite variety" instead.

### 类型 2：「What model are you using?」
> FLUX.1 [schnell] via fal.ai — it's the fastest model out there right now (~10s end-to-end). I tried Stable Diffusion XL first but the prompt adherence on "no color, line art only" was much worse. Schnell is the sweet spot of speed + adherence + cost (~$0.003/image).

### 类型 3：「Will you stay free?」
> Yes for personal & classroom use, forever. The Pro tier I'm planning is for power users — unlimited HD, batch generation, no watermark, commercial license. Anyone using it casually will never hit the free limits.

### 类型 4：「The line art looks great / Loved it!」
> Thank you 🧡 Means a lot. If you have a moment, an upvote would genuinely help me hit the front page today. And if you find a prompt that breaks it, please tell me — those are gold for tuning.

### 类型 5：「Have you tried X for distribution?」
> I haven't! Adding it to my list — thanks. If you have any other suggestions for getting this in front of teachers / homeschool parents, I'm all ears. (My target audience is half "parents on a Saturday morning" and half "teachers planning Monday's lesson.")

### 类型 6：「How do you handle abuse / NSFW prompts?」
> Two layers: a basic banned-word filter on my end (drugs, weapons, NSFW vocab), plus fal.ai's built-in safety checker. Not perfect — open to suggestions if you're a safety-tech person. Since the output is black-and-white line art only, the abuse surface is much smaller than a normal image gen.

### 类型 7：「Can you add [specific feature] like upload-a-photo-to-coloring-page?」
> Photo-to-coloring is on my list — that's the second most requested feature. I'm waiting for FLUX img2img latency to improve before shipping it. Will tag you when it's live if you want.

### 类型 8：负面评论
> Fair criticism. I'll think about it. (Then leave it. Don't argue. The audience reads tone, not arguments.)

## Hunter 邀请（可选）

如果你认识 PH 上有粉丝的 hunter，发消息请他 hunt 你的产品。没有的话直接自己提交也完全可以。
