import './App.css'
import { ChangeEvent, useMemo, useState } from 'react'

type Assumptions = {
  monthlyLeads: number
  closeRate: number
  averageDealValue: number
  conversionLift: number
  projectedDuration: number
}

type Metric = {
  label: string
  value: string
  hint?: string
}

const DEFAULTS: Assumptions = {
  monthlyLeads: 120,
  closeRate: 18,
  averageDealValue: 2400,
  conversionLift: 20,
  projectedDuration: 6,
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const number = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
})

const percent = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
})

function clamp(value: number, min = 0, max = Number.POSITIVE_INFINITY) {
  return Math.min(Math.max(value, min), max)
}

function parseNumber(value: string) {
  if (value.trim() === '') return 0
  const normalized = value.replace(/[^\\d.-]/g, '')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatFieldValue(value: number, mode: 'integer' | 'decimal') {
  if (!Number.isFinite(value)) return '0'
  return mode === 'integer' ? String(Math.round(value)) : String(value)
}

function App() {
  const [inputs, setInputs] = useState<Assumptions>(DEFAULTS)

  const updateField =
    (key: keyof Assumptions, max?: number) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const parsed = parseNumber(event.target.value)
      const nextValue = clamp(parsed, 0, max)
      setInputs((current) => ({
        ...current,
        [key]: nextValue,
      }))
    }

  const calculations = useMemo(() => {
    const monthlyLeads = clamp(inputs.monthlyLeads)
    const closeRate = clamp(inputs.closeRate, 0, 100)
    const averageDealValue = clamp(inputs.averageDealValue)
    const conversionLift = clamp(inputs.conversionLift, 0, 500)
    const projectedDuration = clamp(inputs.projectedDuration)

    const currentCustomers = monthlyLeads * (closeRate / 100)
    const improvedCloseRate = closeRate * (1 + conversionLift / 100)
    const improvedCustomers = monthlyLeads * (improvedCloseRate / 100)
    const additionalCustomersPerMonth = improvedCustomers - currentCustomers
    const monthlyRevenueLift = additionalCustomersPerMonth * averageDealValue
    const projectedRevenueLift = monthlyRevenueLift * projectedDuration
    const suggestedQuote = projectedRevenueLift * 0.1
    const roi =
      suggestedQuote > 0
        ? ((projectedRevenueLift - suggestedQuote) / suggestedQuote) * 100
        : 0

    return {
      currentCustomers,
      improvedCloseRate,
      improvedCustomers,
      additionalCustomersPerMonth,
      monthlyRevenueLift,
      projectedRevenueLift,
      suggestedQuote,
      roi,
    }
  }, [inputs])

  const summaryMetrics: Metric[] = [
    {
      label: 'Monthly revenue lift',
      value: currency.format(calculations.monthlyRevenueLift),
      hint: 'Additional revenue per month',
    },
    {
      label: 'Projected lift',
      value: currency.format(calculations.projectedRevenueLift),
      hint: `Across ${number.format(inputs.projectedDuration)} month${inputs.projectedDuration === 1 ? '' : 's'}`,
    },
    {
      label: 'Suggested quote',
      value: currency.format(calculations.suggestedQuote),
      hint: 'Modeled at 10% of projected lift',
    },
  ]

  const detailMetrics: Metric[] = [
    {
      label: 'Current customers / month',
      value: number.format(calculations.currentCustomers),
    },
    {
      label: 'Improved close rate',
      value: `${percent.format(calculations.improvedCloseRate)}%`,
    },
    {
      label: 'Improved customers / month',
      value: number.format(calculations.improvedCustomers),
    },
    {
      label: 'Additional customers / month',
      value: number.format(calculations.additionalCustomersPerMonth),
    },
    {
      label: 'Estimated ROI',
      value: `${percent.format(calculations.roi)}%`,
    },
  ]

  return (
    <div className="app-shell">
      <div className="background-orb orb-a" aria-hidden="true" />
      <div className="background-orb orb-b" aria-hidden="true" />

      <header className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Minimal Calc</span>
          <h1>Conversion lift calculator</h1>
          <p>
            Model what an improvement in close rate could be worth before you write the proposal.
          </p>
        </div>

        <section className="glass-panel summary-panel" aria-label="Key results">
          {summaryMetrics.map((metric) => (
            <article key={metric.label} className="summary-item">
              <span className="summary-label">{metric.label}</span>
              <strong className="summary-value">{metric.value}</strong>
              {metric.hint ? <span className="summary-hint">{metric.hint}</span> : null}
            </article>
          ))}
        </section>
      </header>

      <main className="main-grid">
        <section className="glass-panel content-panel" aria-labelledby="inputs-title">
          <div className="section-head">
            <div>
              <span className="section-kicker">Inputs</span>
              <h2 id="inputs-title">Live assumptions</h2>
            </div>

            <button type="button" className="reset-button" onClick={() => setInputs(DEFAULTS)}>
              Reset
            </button>
          </div>

          <div className="field-list">
            <label className="field-row">
              <span className="field-copy">
                <span className="field-label">Monthly leads</span>
                <span className="field-help">
                  Qualified opportunities entering the funnel each month.
                </span>
              </span>

              <div className="input-shell">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={formatFieldValue(inputs.monthlyLeads, 'integer')}
                  onChange={updateField('monthlyLeads')}
                />
              </div>
            </label>

            <label className="field-row">
              <span className="field-copy">
                <span className="field-label">Close rate</span>
                <span className="field-help">Current percentage of leads that become customers.</span>
              </span>

              <div className="input-shell with-suffix">
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  step={0.1}
                  value={formatFieldValue(inputs.closeRate, 'decimal')}
                  onChange={updateField('closeRate', 100)}
                />
                <span className="input-affix">%</span>
              </div>
            </label>

            <label className="field-row">
              <span className="field-copy">
                <span className="field-label">Average deal value</span>
                <span className="field-help">Average revenue generated by each closed customer.</span>
              </span>

              <div className="input-shell with-prefix">
                <span className="input-affix">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={100}
                  value={formatFieldValue(inputs.averageDealValue, 'integer')}
                  onChange={updateField('averageDealValue')}
                />
              </div>
            </label>

            <label className="field-row">
              <span className="field-copy">
                <span className="field-label">Conversion lift</span>
                <span className="field-help">
                  Expected relative improvement in close rate after the change.
                </span>
              </span>

              <div className="input-shell with-suffix">
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={500}
                  step={1}
                  value={formatFieldValue(inputs.conversionLift, 'decimal')}
                  onChange={updateField('conversionLift', 500)}
                />
                <span className="input-affix">%</span>
              </div>
            </label>

            <label className="field-row">
              <span className="field-copy">
                <span className="field-label">Projected duration</span>
                <span className="field-help">Number of months included in the projection.</span>
              </span>

              <div className="input-shell with-suffix">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={formatFieldValue(inputs.projectedDuration, 'integer')}
                  onChange={updateField('projectedDuration')}
                />
                <span className="input-affix">mo</span>
              </div>
            </label>
          </div>
        </section>

        <section className="glass-panel content-panel" aria-labelledby="results-title">
          <div className="section-head">
            <div>
              <span className="section-kicker">Outputs</span>
              <h2 id="results-title">Calculated impact</h2>
            </div>
          </div>

          <div className="results-grid">
            {detailMetrics.map((metric) => (
              <article key={metric.label} className="result-card">
                <span className="result-label">{metric.label}</span>
                <strong className="result-value">{metric.value}</strong>
              </article>
            ))}
          </div>

          <div className="explanation">
            <p>
              Suggested quote is estimated as 10% of projected revenue lift. If your pricing model is
              different, adjust that assumption in the code.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
