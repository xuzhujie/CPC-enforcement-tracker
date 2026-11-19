import { practiceLabels } from '../lib/format'
import type { ThemeCount } from '../types'

type ThemeBarsProps = {
  items: ThemeCount[]
  onSelect?: (tag: ThemeCount['tag']) => void
}

export function ThemeBars({ items, onSelect }: ThemeBarsProps) {
  const max = Math.max(...items.map((item) => item.count), 1)

  return (
    <div className="theme-bars" aria-label="重点主题案件分布">
      {items.length === 0 ? (
        <p className="empty-copy">当前筛选没有主题记录。</p>
      ) : items.map((item) => {
        const content = (
          <>
            <div className="theme-bar__meta">
              <span>{practiceLabels[item.tag]}</span>
              <strong>{item.count}</strong>
            </div>
            <div className="theme-bar__track" aria-hidden="true">
              <span className="theme-bar__fill" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
          </>
        )
        return onSelect ? (
          <button
            type="button"
            className="theme-bar theme-bar--interactive"
            key={item.tag}
            onClick={() => onSelect(item.tag)}
            aria-label={`查看${practiceLabels[item.tag]}案件`}
          >
            {content}
          </button>
        ) : (
          <div className="theme-bar" key={item.tag}>{content}</div>
        )
      })}
    </div>
  )
}
