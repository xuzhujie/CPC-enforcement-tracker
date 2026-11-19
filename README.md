# CPC Enforcement Tracker

面向欧盟消费者保护案件的本地优先复核看板。当前数据是截至 `2026-11-19` 的欧委会公开页面快照，不是实时官方数据库，也不替代法律审查。

## 本地运行

```bash
npm install
npm run dev -- --host 127.0.0.1
```

生产预览：

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

## 验证命令

```bash
npm run data:check
npm test -- --run
npm run build
npm run acceptance
```

`npm run acceptance` 会检查生产输出、数据检查脚本、来源快照接线、对话框可访问性和移动断点。

## 数据维护流程

1. 重新核对 `src/data/sources.ts` 中的官方页面，保留直达 URL 和 `checkedAt`。
2. 在 `src/data/cases.ts` 更新案件证据、时间精度、协调行动、企业承诺和最终罚款；不要把“无记录”写成零金额。
3. 同步 `src/data/snapshot.ts` 的 `checkedAt`、`nextReviewDate` 和来源清单。
4. 每条案件保留 `review.owner`、`priority`、`lastReviewedAt`、`nextReviewDate` 和 `confidence`；没有确认的负责人使用“待分配”。
5. 运行 `npm run data:check`、完整测试、构建和 `npm run acceptance`，再在 `npm run preview` 上复核。

## 运营工作流

- Review Queue 按活跃状态、复核优先级和下次复核日期排序。
- Cases 表支持按企业、复核优先级、最近更新和下次复核排序。
- 案件抽屉显示负责人、优先级、数据状态和复核日期。
- Cases / Overview 可导出当前筛选结果为 CSV，便于人工复核或交接。

## 上线验收清单

- 在 320px、375px、768px 和桌面宽度检查筛选器、KPI、表格、抽屉和来源入口。
- 键盘检查：导航、主题按钮、表格行、排序按钮、导出按钮和详情抽屉焦点。
- 打开至少一条案件来源链接，确认仍然指向官方欧委会页面。
- 发布时使用 `dist/` 作为静态目录，并保持站点私有，直到团队确认访问范围。

## 主要来源

- [Market places and digital services](https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/market-places-and-digital-services_en)
- [Social media, online games and search engines](https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/social-media-online-games-and-search-engines_en)
- [Consumer frequent traps and scams](https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/coordinated-actions/consumer-frequent-traps-and-scams_en)
- [Sweeps](https://commission.europa.eu/topics/consumers/consumer-rights-and-complaints/enforcement-consumer-protection/sweeps_en)
