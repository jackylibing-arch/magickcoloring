# 部署指南 — magickcoloring.com

> 跟着步骤做就行。每一步都很短。预计你的总操作时间：30 分钟。

---

## 准备好这些东西

- ✅ 域名 magickcoloring.com（已购买）
- [ ] GitHub 账号
- [ ] Vercel 账号（用 GitHub 登录最快）
- [ ] Cloudflare 账号（如果域名在别的注册商，先转入或改 NS）
- [ ] 硅基流动 SiliconFlow 账号 + API key
- [ ] Google 账号（用于 Search Console + Analytics + Adsense）

---

## 步骤 1：拿到 SiliconFlow API key（3 分钟，免费）

1. 打开 https://cloud.siliconflow.cn/ → 注册（手机号一键登录）
2. 进入 https://cloud.siliconflow.cn/account/ak
3. 点 "新建 API 密钥" → 命名 `magickcoloring` → 复制 sk- 开头的 key
4. **完成。不需要充值。**

> 💰 成本提示：我们用的是 `black-forest-labs/FLUX.1-schnell`，**SiliconFlow 上完全免费**（有速率限制，初期足够用）。后续流量大了再考虑充值（约 ¥0.0035/张）。
> 🇨🇳 国内直连，不用梯子。

---

## 步骤 2：把代码推到 GitHub（5 分钟）

1. 打开 https://github.com/new
2. Repository name: `magickcoloring`
3. 选 **Private**（保护代码不被复制）
4. 不要勾选 README/.gitignore（我已经创建了）
5. 点 Create repository
6. GitHub 会显示一段命令，找到 "…or push an existing repository from the command line"

然后告诉我 "GitHub 仓库地址是 xxx"，我会帮你执行 push 命令。或者你自己在终端里执行（cd 到 `/Users/libing/Documents/cc_test/ai-web-factory/magickcoloring`）：

```bash
git init
git add .
git commit -m "Initial: magickcoloring v1"
git branch -M main
git remote add origin https://github.com/你的用户名/magickcoloring.git
git push -u origin main
```

---

## 步骤 3：Vercel 部署（5 分钟）

1. 打开 https://vercel.com/ → 用 GitHub 登录
2. 点 "Add New…" → "Project"
3. 找到 `magickcoloring` 仓库 → 点 Import
4. **Framework Preset:** 自动识别为 Next.js（不用改）
5. **Root Directory:** `./`（不用改）
6. 展开 **Environment Variables**，添加这三个：

| Name | Value |
|---|---|
| `SILICONFLOW_KEY` | （步骤 1 拿到的 sk- 开头的 key） |
| `NEXT_PUBLIC_SITE_URL` | `https://magickcoloring.com` |
| `NEXT_PUBLIC_GA_ID` | 留空（第 6 步后再加） |

7. 点 **Deploy**
8. 等 1-2 分钟，看到 "Congratulations" → Vercel 给你一个临时域名（xxx.vercel.app），点开试一下生成器是否能用

> 🐛 如果生成器报错 "Server is not configured" → 说明 SILICONFLOW_KEY 没设对，回 Settings → Environment Variables 检查，改完点 Redeploy。

---

## 步骤 4：绑定域名（10 分钟）

### 4.1 在 Vercel 添加域名
1. 进入项目 → Settings → Domains
2. 输入 `magickcoloring.com` → Add
3. 再输入 `www.magickcoloring.com` → Add
4. Vercel 会显示一段 DNS 配置（A 记录或 CNAME），**截图发给我看一眼**确认

### 4.2 在 Cloudflare 配置 DNS
（前提：域名的 nameservers 已经指向 Cloudflare。如果域名买在 Namecheap/GoDaddy 等地方，需要先把 NS 改成 Cloudflare 给的两个地址。）

1. 进入 Cloudflare → 选中 magickcoloring.com → DNS → Records
2. 添加两条记录：

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `76.76.21.21` | DNS only（灰色云朵） |
| CNAME | `www` | `cname.vercel-dns.com` | DNS only（灰色云朵） |

> ⚠️ **必须是 DNS only（灰色云朵）**，不要打开 Cloudflare 代理（橙色云朵）。Vercel 会自己处理 CDN 和 SSL，叠 Cloudflare 代理会导致 SSL 报错。

3. 等 5-15 分钟，回 Vercel Domains 页面看到 ✅ Valid Configuration 就行
4. 打开 https://magickcoloring.com 测试

---

## 步骤 5：Google Search Console 提交（5 分钟）

1. 打开 https://search.google.com/search-console
2. 点 "Add property" → 选 "URL prefix" → 输入 `https://magickcoloring.com`
3. 验证方式选 "HTML tag"，复制那段 `<meta name="google-site-verification" content="xxx" />`
4. **把 content 的值发给我**，我会加到 layout.tsx 的 metadata 里，然后你 push 一下重新部署
5. 验证通过后，左侧菜单 → Sitemaps → 提交 `sitemap.xml`
6. 完成 ✅

---

## 步骤 6：Google Analytics（5 分钟，可选但建议）

1. 打开 https://analytics.google.com/ → Admin → Create Property
2. 名称：`Magick Coloring`，时区 UTC，货币 USD
3. 创建 Web 数据流 → URL 填 `https://magickcoloring.com`
4. 复制 **Measurement ID**（格式 `G-XXXXXXXXXX`）
5. 回 Vercel → Settings → Environment Variables
6. 添加 `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX`
7. Deployments → 最新一次 → 右上角 ⋮ → Redeploy

---

## 步骤 7：Adsense 申请（暂缓到日 UV > 100 时再做）

不要急着申请。Adsense 喜欢"已经有流量和内容"的站。我们计划：
- 现在：站上线，开始 SEO 收录
- 1-2 周后：日 UV > 50 时再申请
- 通过后：你把 client ID 给我，我加到环境变量，自动激活

---

## 你完成后告诉我

发我：
1. ✅ 部署后的 https://magickcoloring.com 截图
2. ✅ Search Console 验证通过截图（生成器能跑通就行，SiliconFlow 不需要充值）

然后我会立刻进入下一阶段（SOP 第四章）：写好所有冷启动文案（PH/HN/Reddit/Twitter/工具导航站），你按节奏发布。

---

## 如果某一步卡住了

直接把错误截图发我。最常见的两个坑：
- **DNS 没生效**：等 15 分钟。如果还没生效，检查 Cloudflare 那两条记录是不是 DNS only
- **生成器 500 错误**：99% 是 SILICONFLOW_KEY 配错（注意 sk- 开头，整个粘贴不要漏空格）
