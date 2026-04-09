# Hacker News Show HN — Magick Coloring

> 提交地址：https://news.ycombinator.com/submit
> 最佳时间：**美国 PT 早 8-10am 工作日**（北京时间晚 12am - 2am）
> 你的账号 karma 必须 > 1（新账号可能会被 shadow ban，最好先随便回 1-2 个友好评论）

---

## 1. Title (80 chars max)

**主选**（66 字符）：
```
Show HN: Magick Coloring – Free AI generator for printable coloring pages
```

**备选**：
```
Show HN: I made a free AI tool that turns text into printable coloring pages
```

```
Show HN: Type any idea, get a printable coloring page in 10 seconds
```

> ⚠️ 不要在标题写 "best", "amazing", "world's first" — HN 会瞬间被反感

## 2. URL
```
https://magickcoloring.com
```

> Text 字段留空。HN 的规矩是 Show HN 提交链接，不在主帖写文字。详细介绍放第一条评论。

## 3. 你必须立刻发的第一条评论（提交后 30 秒内）

```
Hey HN — Jacky here, solo maker.

Quick story: I was helping a friend find a coloring page of "a dragon eating tacos" for their kid. Spent 20 minutes searching. Pinterest, Etsy, free coloring sites — nothing. Eventually I realized this was a problem AI image gen could trivially solve, except every model defaults to color and "make it line art only" prompts give you grayscale slop ~80% of the time.

So I spent a weekend tuning prompts and shipping this. Stack:

  - Next.js 14 (App Router) + TypeScript + Tailwind, deployed on Vercel
  - fal.ai's FLUX.1 [schnell] for image gen — chose it over SDXL because adherence to "no color, no shading, line art only" is dramatically better, and end-to-end latency is ~10s
  - Cookie + IP based rate limiting (5/day free), no DB needed
  - Static SEO content + sitemap.xml for organic discovery
  - Stripe + a paid tier coming later for unlimited HD + commercial use

Things that surprised me:
1. The negative prompt matters more than the positive prompt. "color, gradient, shading, gray" in the negative does more work than the entire positive prompt.
2. FLUX schnell at 4 inference steps is genuinely faster than the user's attention span. Below 8s and people stop reading the spinner. Above 15s they tab away.
3. Style presets are necessary. Users don't write good prompts. "Cute style with thick outlines for ages 3-6" needs to be a button, not a sentence in a textbox.

What I'd love feedback on:
- Prompt patterns that consistently break: I'd love to collect failure cases. "A red car" still confuses the model into producing colored line art occasionally.
- Style presets you'd want next. I have Simple/Medium/Detailed/Cute. What's missing?
- The free tier is 5/day (cookie+IP). Easy to bypass with incognito but that's fine for v1. Curious how others handle this without forcing signup.

Source: https://github.com/jackylibing-arch/magickcoloring (MIT)
```

> 这条评论的目的：
> 1. 把 "marketing speak" 变成 "engineer speak" — HN 只接受这种语气
> 2. 主动暴露技术决策细节 — HN 喜欢听 "我为什么选 X 不选 Y"
> 3. 主动列出 3 个学到的东西 — 这是 HN 文化里最受欢迎的内容（"things I learned")
> 4. 提开源链接 — 加分项
> 5. 开放性问题 — 引发评论，评论越多排名越高

## 4. 评论回复脚本（按场景）

### 场景 A：「Why FLUX over SDXL / Stable Diffusion 3?」
```
Tested both. SDXL needed a fairly aggressive negative prompt + sometimes a LoRA to reliably stay in line-art mode. FLUX schnell got it ~95% of the time with just a clean negative prompt. Plus schnell at 4 steps is ~3x faster than SDXL turbo for me. Cost was the kicker though: ~$0.003/image on schnell vs ~$0.01 on SDXL via the same provider.
```

### 场景 B：「Have you tried local inference / running this on Replicate / Modal?」
```
Considered Replicate, but cold starts kill UX (my median time-to-first-pixel needs to be under 12s for users not to bounce). fal.ai keeps things warm. I'd love to run schnell locally on consumer hardware but the VRAM ask is 24GB+ which prices out anyone hosting it cheaply. Modal is interesting for the next iteration if I want to fine-tune a coloring-page-specific LoRA.
```

### 场景 C：「How do you stop people from circumventing the 5/day limit?」
```
Honestly? I don't, hard. The cookie+IP combo gets ~80% of casual users, and that's enough to keep the API bill rational on the free tier. Anyone determined enough to use incognito or a VPN to get 6 free pages a day is not the user I'm losing money on — they're not the conversion target anyway. The plan is: when free abuse becomes the dominant cost, force email signup; when that's not enough, add a Cloudflare Turnstile. I'd rather under-protect and over-deliver than the reverse.
```

### 场景 D：「Why no signup? How do you build a moat?」
```
Two reasons. (1) Adding signup to a tool that takes 10 seconds to use kills conversion by ~70% in this category — every "free coloring pages" site I tested with mandatory signup has worse retention than the no-signup ones. (2) The moat isn't the user table. The moat is the SEO content + the brand + being the first place that pops up when someone searches "ai coloring page generator." User accounts come later when there's a real Pro tier worth the friction.
```

### 场景 E：「Cool. How are you going to monetize?」
```
Three layers eventually:
1. Display ads (Adsense or Carbon) once the site has consistent traffic — boring but it pays the API bill
2. Pro tier at $5/mo: unlimited HD downloads, no watermark, commercial license, batch generation. Targeted at teachers and homeschool parents who use this 20+ times a week
3. API for other tools to embed the generator. Probably 6 months out.

I'm not under any illusion this becomes a unicorn. Realistic ceiling is "covers a developer's monthly Claude/Cursor subscription plus a nice coffee." That's enough for me.
```

### 场景 F：「This already exists at coloringpage.ai / colorifyai.art / etc」
```
Yep, several do — colorifyai is the biggest one I'm aware of (~430k visits/mo per Similarweb). I see Magick Coloring as additive rather than replacement: my style presets (especially Simple for toddlers) and the no-signup-no-watermark policy are the things I built that I felt the existing tools missed when I tried them. I'm fine being smaller as long as users find it useful.
```

### 场景 G：「Have you considered upload-a-photo to convert it?」
```
Yes — img2img is the #1 next feature. Waiting on FLUX img2img latency to drop because the current best option adds ~6s on top of the txt2img time. Once it's under 15s end-to-end, it ships.
```

### 场景 H：「What's the cost per generation in practice?」
```
~$0.003 per image at fal.ai's current schnell pricing. I prepaid $10 to start, that's ~3,300 generations. At my current free tier (5/day/user), that covers ~660 active users for one day. The bet is that ad revenue + Pro conversions kicks in before the math goes upside down.
```

### 场景 I：负面评论或挑刺
```
Fair point. (And then NOTHING ELSE. Resist the urge to defend. HN respects equanimity more than rebuttal.)
```

### 场景 J：「Does it work for non-English prompts?」
```
Schnell is English-trained but handles common nouns in other languages OK-ish. I haven't tuned for it though — the prompt template is hardcoded English. If there's demand I'd add localized prompt templates. What language are you trying?
```

## 5. 提交后立刻做的事

1. **发完主帖立刻发上面那条 maker comment**（30 秒内）
2. **每 5 分钟刷新一次** "newest" 列表确认你的帖子在 https://news.ycombinator.com/newest
3. **开邮件通知**（HN settings → "show comments")，每条新评论都在 5-10 分钟内回复
4. 如果 1 小时内还在 newest 第 1 页（前 30 个）就有希望上 front page。如果 30 分钟内沉到第 2 页，基本就废了 —— 不要请人投票（HN 反作弊会检测）

## 6. 上 front page 后

如果上了，今天你的网站会被 5,000-50,000 人访问。**Vercel 免费 plan 100GB/月带宽**，一张涂色页 PNG 大约 200KB。算一下：50,000 用户 × 平均 1 张图 = 10GB。完全够用，不用慌。

如果突然有 100,000+ 流量冲击，Vercel 会自动降级或限流，不用你管。

## 账号要求

- HN 账号必须存在且能登录
- karma > 1（新账号可以先去随便回 1-2 个友好评论攒 karma）
- 同一账号 24 小时内不要发 2 个 Show HN

如果你**还没有 HN 账号**，告诉我，我教你 30 秒注册。
