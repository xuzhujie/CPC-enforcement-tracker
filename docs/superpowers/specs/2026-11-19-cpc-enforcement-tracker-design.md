# CPC Enforcement Tracker & 看板设计

日期：2026-11-19  
范围：欧盟消费者保护，优先覆盖 App、电商/平台与订阅业务  
状态：待用户确认后进入实施计划

## Intent

做一个面向合规、法务与产品团队的内部情报看板，快速回答三件事：

1. 哪些公开 CPC 案件正在推进，影响哪些数字业务模式。
2. 哪些案件涉及暗黑模式、续订/取消、误导折扣、评价或广告。
3. 案件目前属于跨国协调行动、企业承诺/整改，还是已经有单独记录的最终罚款。

看板的核心不是复述新闻，而是把公开来源拆成可筛选、可追踪、可复核的记录。欧委会页面中的调查、承诺和处罚结果不混在一起；如果当前公开来源没有录入最终罚款，界面明确显示“暂无公开罚款记录”，不以 0 代替。

## Goals

- 用欧委会公开协调行动页面和相关公开 CPC 页面作为第一版来源。
- 用统一案件模型支持 App、订阅、电商/平台、支付和广告相关案件。
- 将 `协调行动`、`企业承诺`、`最终罚款` 建成互相独立的结果对象，并允许同一案件同时具备多个对象。
- 首屏先给出案件规模、活跃状态、风险主题和需要复核的记录；筛选后所有指标、图表和列表使用同一案件子集。
- 点击案件进入详情抽屉，能看到参与机构、主题、时间线、企业承诺/未承诺事项、罚款状态与原始来源。
- 明确来源时间、证据摘要和数据覆盖边界，避免把来源页面的“调查中”误读成已被最终认定违法。

## Non-goals

- 第一版不做自动抓取、自动法律结论或预测罚款金额。
- 不把欧委会协调行动与 DSA/DMA/GDPR 调查自动合并；如来源明确说明两者互补，则在关联说明中保留，但仍作为独立监管轨迹。
- 不把新闻报道、投诉数量或行为研究比例当作案件罚款或执法结果。
- 不做登录、多人编辑、权限管理和后端持久化；第一版是可运行的本地单页原型，数据通过独立 JSON 模块维护。

## User and default workflow

主要用户是需要做 EU digital consumer-law 预审的合规/法务人员，次要用户是产品、增长和运营负责人。

默认打开“Overview”视图：先看到活跃协调行动、已记录承诺、已记录最终罚款这三类互不替代的指标；随后看到风险主题分布和案件工作列表。用户可以用业务模式、案件状态、风险主题和年份筛选；点击表格行查看详情；从详情打开来源页面。

## Approaches considered

### A. 本地 React + Vite 情报工作台（选定）

在空目录里用 React + Vite 构建一个有真实交互的单页看板，使用本地、带 provenance 的公开来源快照。优点是可以尽快形成清晰的案件模型与审阅体验，数据结构以后可直接替换为 API/数据库；缺点是第一版不自动更新。

### B. 托管 Data dashboard

直接使用 Data dashboard starter、 reviewed snapshot 和托管发布流程。优点是刷新、导出和共享能力更强；缺点是对当前空项目来说框架成本高，且第一版最需要先验证的是案件关系和审阅路径而不是共享基础设施。

### C. 完整采集与数据库管线

建设爬取、变更检测、数据库、后台编辑与审计日志。优点是长期运营能力最强；缺点是会把第一版重点从“能否快速识别风险和结果类型”转移到采集与运维，超出当前请求。

选择 A，并保留可迁移到 B/C 的数据边界：案件字段与来源字段分离，结果类型不依赖 UI 文案。

## Information architecture

### App shell

- 左侧窄导航：`Overview`、`Cases`、`Themes`、`Sources`。
- 主区顶部：页面标题、数据更新时间、来源链接和“清除筛选”。
- 视觉方向：深墨绿/炭黑文本、浅灰背景、珊瑚红作为风险强调、青绿色作为承诺/已改进语义；使用开放布局、细边框和紧凑但可读的表格，不做营销式 hero。
- 字体：系统无衬线字体栈，标题高对比，表格与控制项使用明确的 12–14px UI 文字，确保信息密度适合内部工具。

### Overview

1. **KPI row**：
   - 活跃协调行动数：`action.type = coordinated_action` 且 `status` 为 ongoing/investigating。
   - 企业承诺记录数：至少存在一条 `commitment` 结果对象。
   - 已记录最终罚款数：至少存在一条 `final_penalty` 且 `disclosure = disclosed`；未披露不计入。
2. **Review queue**：显示高优先级案件，按“仍在推进 + 命中重点主题 + 最近来源更新”排序，提供进入详情的动作。
3. **Theme distribution**：按主题展示案件数，保留 `dark_patterns`、`subscription_renewal_cancellation`、`misleading_discounts`、`reviews_ratings`、`advertising` 五个重点主题，并允许显示辅助主题。
4. **Outcome split**：用明确标签区分 `协调行动`、`企业承诺`、`最终罚款`；不以一个“执法案件总数”替代三类语义。
5. **Source health**：显示来源快照日期、记录数和“罚款披露范围”，帮助使用者理解数据不是实时官方数据库。

### Cases

主表支持搜索、排序和筛选。每行显示：企业/平台、业务模式、重点主题、当前状态、最近更新时间、参与机构、结果标签（行动/承诺/罚款）和来源数。表格是主工作区，不改成只展示汇总卡片。

详情抽屉显示：

- 案件摘要与来源原文链接。
- 时间线：首次行动、通知/对话、承诺、监测、关闭或罚款记录；缺失日期显示“未披露”。
- `coordinatedActions[]`：协调方、牵头机构、参与国家/机构、行动状态。
- `commitments[]`：企业承诺、实施期限、监测状态、未接受/仍待解决事项。
- `finalPenalties[]`：是否披露、金额、币种、决定日期、决定机构、来源；空值不渲染成 0。
- 主题与证据摘要；说明“来源表述为调查/评估/承诺”而不是自行下最终违法结论。

### Themes

主题视图把案件按重点风险主题聚合，点击主题后回到 Cases，并保留过滤条件。首版优先支持：

- 暗黑模式：隐藏信息、强制游戏化、压力销售、虚假倒计时/稀缺性、界面干扰。
- 续订与取消：自动续订、免费试用转付费、取消路径、重复付款提示。
- 误导折扣：虚假折扣、个性化折扣、未按 prior price 计算。
- 评价：虚假/不真实评价、评价排序与平均评分披露。
- 广告：隐藏广告、广告标识、个性化/行为定向与儿童相关的激进广告。

### Sources

来源页列出来源标题、URL、类型、抓取/核对日期和覆盖范围。第一版保留以下官方入口：

- 欧委会 Market places and digital services：
  https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/market-places-and-digital-services_en
- 欧委会 Social media, online games and search engines：
  https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/social-media-online-games-and-search-engines_en
- 欧委会 Consumer frequent traps and scams：
  https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/consumer-frequent-traps-and-scams_en
- 欧委会 Sweeps：
  https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/sweeps_en

## Data contract

第一版数据文件独立于 UI，最少包含以下结构：

```ts
type CaseRecord = {
  id: string
  // One public CPC action track, not one company-wide profile.
  company: string
  aliases?: string[]
  businessModels: Array<'app' | 'ecommerce' | 'marketplace' | 'subscription' | 'payments' | 'advertising'>
  jurisdictions: string[]
  leadAuthority?: string
  practiceTags: Array<
    | 'dark_patterns'
    | 'subscription_renewal_cancellation'
    | 'misleading_discounts'
    | 'reviews_ratings'
    | 'advertising'
    | 'pressure_selling'
    | 'hidden_information'
    | 'geo_blocking'
  >
  status: 'investigating' | 'ongoing' | 'commitment_monitoring' | 'closed' | 'enforcement_possible' | 'unknown'
  dates: { firstAction?: string; lastUpdate?: string; commitment?: string; finalDecision?: string }
  coordinatedActions?: Array<{
    summary: string
    status: 'investigating' | 'ongoing' | 'closed' | 'unknown'
    coordinator?: string
  }>
  commitments?: Array<{
    summary: string
    implementationDate?: string
    monitoring?: string
    unresolved?: string
  }>
  finalPenalties?: Array<{
    disclosure: 'disclosed' | 'not_disclosed'
    amount?: number
    currency?: string
    decidedBy?: string
    decisionDate?: string
  }
  evidence: Array<{
    summary: string
    sourceId: string
    sourceUrl: string
    sourceType: 'official_page' | 'official_pdf'
    checkedAt: string
  }>
  timeline: Array<{
    date?: string
    type: 'action' | 'notification' | 'dialogue' | 'commitment' | 'monitoring' | 'closure' | 'penalty'
    summary: string
    sourceId: string
  }>
}
```

数据语义约束：

- 一条 `CaseRecord` 代表一个公开的 CPC 协调行动/执法轨迹；同一家公司存在不同监管法源或不同行动轨迹时拆成多条记录，避免按公司去重吞掉事实。
- `coordinatedActions[]`、`commitments[]` 和 `finalPenalties[]` 互相独立；一个案件可以同时存在行动、承诺和罚款记录，也可以有多次承诺或多笔国家层面罚款。
- `finalPenalty.disclosure = not_disclosed` 与 `amount = undefined` 必须同时成立；不得用 `0` 表示未知。没有任何 `finalPenalties[]` 只表示当前审核来源集合中没有录入罚款记录，UI 另显示“暂无公开罚款记录”。
- `status` 表示来源当前状态，不代表看板作者的法律判断。
- `status = investigating` 或 `ongoing`，或任一 `coordinatedActions[].status` 为 investigating/ongoing，才计入“活跃协调行动”。
- 指标默认按 `CaseRecord` 计数；主题分布按案件-主题关系计数（同一案件在每个主题最多计一次）；罚款指标按 `finalPenalties[]` 中披露的记录计数；年份筛选优先使用 `dates.lastUpdate`，缺失时回退 `dates.firstAction`。
- `disclosure = not_disclosed` 只在官方来源明确提及最终罚款/处罚但没有金额或细节时使用；来源只描述调查或承诺而未提及罚款时，不创建该对象。
- 记录只写来源明确支持的内容；来源页面没有的参与国家、金额、期限或决定日期保持缺失。时间线条目可以从现有来源事实派生，但每条都必须保留来源 ID。
- 以官方页面为一手来源，首版快照在 UI 中显示“公开来源快照，需人工复核”；不声称实时同步。

Builder review 后的实施决定：

- 初始来源范围为四个欧委会入口页及这些页面直接链接的欧委会官方 PDF；不为了填充罚款列而扩展到未经引用的二手报道或国家页面。
- 参与机构使用 `leadAuthority`、`jurisdictions` 和时间线/证据摘要承载；若未来需要逐机构角色，再增加 `participants[]`，首版不虚构缺失信息。
- 结果面板的三个数字故意使用不同分母，并在标签/tooltip 中说清楚，避免把“案件数”“承诺数”“罚款记录数”混为一个总数。

## Seeded public-source coverage

第一版以公开页面可核实的案件为样例，至少覆盖：SHEIN、Apple、Temu、Vinted、viagogo、PayPal、Shopify、Amazon Prime、Tinder，以及 recurring-payment 相关的 Mastercard/Visa/American Express；广告主题补充 Social media, online games and search engines 页面中的 Meta/TikTok 相关记录。案件详情会把来源中的“调查中”“已承诺”“监测中”与罚款字段分别保存。

## Visual and interaction system

- 页面背景为冷灰白，内容区使用白色开放面板；风险/待复核用珊瑚红，承诺/已改进用青绿色，未知/未披露用灰色。
- 表格行 hover、选中和键盘 focus 有清晰边界；抽屉从右侧打开并在移动端变为全屏详情。
- 筛选控件支持多选和“全部”；搜索同时匹配公司、摘要、主题和来源标题。
- 图表使用 CSS/SVG 原生绘制，保证不依赖未安装的图表包；图表均提供文本替代表达。
- 不添加伪造徽标、装饰性指标、未被来源支持的罚款金额或“风险评分”。

## Responsive behavior

- 桌面端：左侧导航 + 主表/详情抽屉，表格保留足够列宽。
- 平板端：导航收窄，KPI 与主题区换行，表格允许横向滚动。
- 移动端：导航改为顶部控制，KPI 堆叠，案件表转换为可读的列表行；详情抽屉变全屏。

## Verification and handoff

- `npm run build` 必须通过。
- 使用浏览器验证首屏、筛选、搜索、主题跳转、详情抽屉、来源链接和移动布局。
- 至少验证一个同时含协调行动与企业承诺的案件，以及一个没有 `finalPenalties[]` 的案件，确认三类结果不会合并或伪造；另用最小测试数据验证 `disclosure = not_disclosed` 的显示路径，但不在没有官方依据时把它加入默认快照。
- 核对默认视图与本设计一致：先看指标和工作队列，再看主题和案件明细。
- 交付时说明来源快照日期、已覆盖/未覆盖内容以及尚未自动化的刷新边界。

## Open implementation calls

- 使用 React + Vite + 原生 CSS/TypeScript；不引入后端或重型组件库。
- 首版不做路由切换的真实页面加载，侧栏视图用本地状态切换，确保原型可演示且结构可扩展。
- 使用简单 SVG 图标，不引入未确认的图标字体；所有图标有 aria-label 或旁路文本。
- 以英文字母顺序和来源更新时间作为稳定排序基础，避免因随机性造成审阅难以复现。
