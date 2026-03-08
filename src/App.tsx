import { useMemo, useState } from 'react'
import './App.css'

type CalculatorInputs = {
  monthlyLeads: number
  closeRate: number
  averageDealValue: number
  conversionLift: number
  projectedDuration: number
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const defaultInputs: CalculatorInputs = {
  monthlyLeads: 120,
  closeRate: 22,
  averageDealValue: 3800,
  conversionLift: 18,
  projectedDuration: 12,
}

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(defaultInputs)

  const results = useMemo(() => {
    const currentCustomers = inputs.monthlyLeads * (inputs.closeRate / 100)
    const improvedCloseRate = Math.min(inputs.closeRate + inputs.conversionLift, 95)
    const improvedCustomers = inputs.monthlyLeads * (improvedCloseRate / 100)
    const additionalCustomersPerMonth = Math.max(improvedCustomers - currentCustomers, 0)
    const monthlyRevenueLift = additionalCustomersPerMonth * inputs.averageDealValue
    const projectedRevenueLift = monthlyRevenueLift * inputs.projectedDuration
    const suggestedQuote = Math.max(3500, projectedRevenueLift * 0.12)
    const roi = suggestedQuote > 0 ? ((projectedRevenueLift - suggestedQuote) / suggestedQuote) * 100 : 0

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

  const updateInput = <K extends keyof CalculatorInputs>(key: K, value: number) => {
    setInputs((current) => ({
      ...current,
      [key]: value,
    }))
  }

  return (
    <div className="app-shell">
      <div className="background-glow background-glow--left" />
      <div className="background-glow background-glow--right" />

      <header className="hero">
        <div className="hero-copy">
          <span className="eyebrow">White-label ROI calculator</span>
          <h1>Turn a few assumptions into a credible growth story.</h1>
          <p className="hero-text">
            Minimal Calc helps agencies, consultants, and service businesses model revenue upside,
            pricing, and ROI in real time during discovery, qualification, and proposal calls.
          </p>

          <div className="hero-points">
            <div className="hero-point">
              <strong>Live during calls</strong>
              <span>Adjust inputs instantly and let the numbers support your pitch.</span>
            </div>
            <div className="hero-point">
              <strong>Outcome-led pricing</strong>
              <span>Frame your quote as a fraction of projected upside instead of hours.</span>
            </div>
            <div className="hero-point">
              <strong>Simple to trust</strong>
              <span>Use a transparent model built from leads, close rate, and deal value.</span>
            </div>
          </div>
        </div>

        <aside className="hero-card">
          <span className="hero-card-label">Snapshot</span>
          <h2>{currency.format(results.projectedRevenueLift)}</h2>
          <p>Projected revenue opportunity across the engagement window</p>

          <div className="metric-grid">
            <div className="metric-card">
              <span>Monthly uplift</span>
              <strong>{currency.format(results.monthlyRevenueLift)}</strong>
            </div>
            <div className="metric-card">
              <span>Suggested quote</span>
              <strong>{currency.format(results.suggestedQuote)}</strong>
            </div>
            <div className="metric-card">
              <span>Additional customers</span>
              <strong>{results.additionalCustomersPerMonth.toFixed(1)} / mo</strong>
            </div>
            <div className="metric-card">
              <span>ROI</span>
              <strong>{results.roi.toFixed(0)}%</strong>
            </div>
          </div>
        </aside>
      </header>

      <main className="content-grid">
        <section className="panel panel--inputs">
          <div className="panel-heading">
            <span className="section-kicker">Assumptions</span>
            <h3>Edit the model live</h3>
            <p>
              Tune each lever below to match the client or opportunity. Every output on the page
              updates instantly.
            </p>
          </div>

          <div className="input-list">
            <label className="input-row">
              <div className="input-header">
                <span>Monthly leads</span>
                <strong>{inputs.monthlyLeads}</strong>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="5"
                value={inputs.monthlyLeads}
                onChange={(event) => updateInput('monthlyLeads', Number(event.target.value))}
              />
            </label>

            <label className="input-row">
              <div className="input-header">
                <span>Current close rate</span>
                <strong>{inputs.closeRate}%</strong>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={inputs.closeRate}
                onChange={(event) => updateInput('closeRate', Number(event.target.value))}
              />
            </label>

            <label className="input-row">
              <div className="input-header">
                <span>Average deal value</span>
                <strong>{currency.format(inputs.averageDealValue)}</strong>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={inputs.averageDealValue}
                onChange={(event) => updateInput('averageDealValue', Number(event.target.value))}
              />
            </label>

            <label className="input-row">
              <div className="input-header">
                <span>Projected conversion lift</span>
                <strong>+{inputs.conversionLift}%</strong>
              </div>
              <input
                type="range"
                min="2"
                max="40"
                step="1"
                value={inputs.conversionLift}
                onChange={(event) => updateInput('conversionLift', Number(event.target.value))}
              />
            </label>

            <label className="input-row">
              <div className="input-header">
                <span>Projection window</span>
                <strong>{inputs.projectedDuration} months</strong>
              </div>
              <input
                type="range"
                min="3"
                max="24"
                step="1"
                value={inputs.projectedDuration}
                onChange={(event) => updateInput('projectedDuration', Number(event.target.value))}
              />
            </label>
          </div>

          <div className="calculator-note">
            Use this model to make assumptions explicit, pressure-test upside, and land on a fee
            that feels commercially grounded.
          </div>
        </section>

        <section className="panel panel--results">
          <div className="panel-heading">
            <span className="section-kicker">Business impact</span>
            <h3>From conversion lift to revenue</h3>
            <p>
              The model compares current performance with an improved close rate and turns the
              difference into revenue potential.
            </p>
          </div>

          <div className="results-stack">
            <div className="result-card result-card--accent">
              <span>Current customers per month</span>
              <strong>{results.currentCustomers.toFixed(1)}</strong>
              <p>
                {inputs.monthlyLeads} leads x {inputs.closeRate}% close rate
              </p>
            </div>

            <div className="result-card">
              <span>Projected close rate</span>
              <strong>{results.improvedCloseRate.toFixed(0)}%</strong>
              <p>Current close rate plus the expected conversion lift</p>
            </div>

            <div className="result-card">
              <span>Projected customers per month</span>
              <strong>{results.improvedCustomers.toFixed(1)}</strong>
              <p>
                {inputs.monthlyLeads} leads x {results.improvedCloseRate.toFixed(0)}% improved close rate
              </p>
            </div>

            <div className="result-card">
              <span>New revenue per month</span>
              <strong>{currency.format(results.monthlyRevenueLift)}</strong>
              <p>
                {results.additionalCustomersPerMonth.toFixed(1)} more customers x {currency.format(inputs.averageDealValue)}
              </p>
            </div>
          </div>
        </section>

        <section className="panel panel--quote">
          <div className="panel-heading">
            <span className="section-kicker">Pricing guidance</span>
            <h3>Anchor your fee to the upside</h3>
            <p>
              A value-based quote becomes easier to defend when it is framed as a small share of the
              projected gain.
            </p>
          </div>

          <div className="quote-card">
            <span className="quote-label">Suggested implementation quote</span>
            <h2>{currency.format(results.suggestedQuote)}</h2>
            <p>
              Based on roughly 12% of projected revenue lift, with a minimum floor for smaller
              engagements.
            </p>
          </div>

          <div className="quote-notes">
            <div className="note">
              <strong>Engagement upside</strong>
              <p>{currency.format(results.projectedRevenueLift)} across {inputs.projectedDuration} months.</p>
            </div>
            <div className="note">
              <strong>Sales positioning</strong>
              <p>Lead with business impact first, then present the fee as a fraction of expected return.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-panel">
        <div>
          <span className="section-kicker">Minimal Calc</span>
          <h3>A clean ROI conversation starter for modern service teams.</h3>
        </div>
        <a className="footer-cta" href="https://github.com/dttdrv/minimal-calc" target="_blank" rel="noreferrer">
          View repository
        </a>
      </footer>
    </div>
  )
}

export default App
