import { outcomeDescriptions, outcomeLabels } from '../lib/format'
import type { OutcomeCount, OutcomeType } from '../types'

type OutcomeSplitProps = {
  items: OutcomeCount[]
}

const outcomeOrder: OutcomeType[] = ['coordinated_action', 'commitment', 'final_penalty']

export function OutcomeSplit({ items }: OutcomeSplitProps) {
  return (
    <div className="outcome-split" aria-label="执法结果类型分布">
      {outcomeOrder.map((type) => {
        const item = items.find((candidate) => candidate.type === type)
        return (
          <div className={`outcome-item outcome-item--${type}`} key={type}>
            <div className="outcome-item__number">{item?.count ?? 0}</div>
            <div>
              <p className="outcome-item__label">{outcomeLabels[type]}</p>
              <p className="outcome-item__description">{outcomeDescriptions[type]}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
