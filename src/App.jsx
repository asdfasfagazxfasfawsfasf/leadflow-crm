import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Columns3,
  Edit3,
  Globe2,
  Info,
  LayoutDashboard,
  Mail,
  Menu,
  MoreHorizontal,
  Phone,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Trash2,
  TrendingUp,
  UsersRound,
  X,
} from 'lucide-react'
import { serviceTranslations, translations } from './translations'
import './App.css'

const STATUSES = ['New', 'Contacted', 'Proposal', 'Won']

const initialLeads = [
  {
    id: 1,
    name: 'Olivia Martin',
    company: 'North & Pine Studio',
    email: 'olivia@northpine.co',
    phone: '+1 (415) 555-0182',
    service: 'Website redesign',
    status: 'New',
    value: 1500,
    createdAt: '2026-07-20',
    followUp: '2026-07-22',
    note: 'Asked for a modern website with an online booking flow.',
    color: '#6f63c2',
  },
  {
    id: 2,
    name: 'Noah Williams',
    company: 'Clearview Cleaning',
    email: 'noah@clearviewclean.com',
    phone: '+1 (312) 555-0147',
    service: 'Client portal',
    status: 'Contacted',
    value: 2800,
    createdAt: '2026-07-18',
    followUp: '2026-07-21',
    note: 'Needs one place to manage recurring clients and service requests.',
    color: '#3f8f86',
  },
  {
    id: 3,
    name: 'Emma Thompson',
    company: 'Bloom Beauty Bar',
    email: 'emma@bloombeauty.co',
    phone: '+44 20 7946 0813',
    service: 'Booking automation',
    status: 'Proposal',
    value: 950,
    createdAt: '2026-07-16',
    followUp: '2026-07-23',
    note: 'Proposal sent for a booking page and automatic reminders.',
    color: '#c96f78',
  },
  {
    id: 4,
    name: 'Liam Anderson',
    company: 'Anderson Home Care',
    email: 'liam@andersonhome.co',
    phone: '+1 (206) 555-0104',
    service: 'Operations dashboard',
    status: 'Won',
    value: 4200,
    createdAt: '2026-07-13',
    followUp: '2026-07-28',
    note: 'Project approved. Kickoff call is scheduled for next week.',
    color: '#b47e39',
  },
  {
    id: 5,
    name: 'Sophia Carter',
    company: 'Carter & Co. Legal',
    email: 'sophia@carterlegal.co',
    phone: '+44 20 7946 0231',
    service: 'Lead capture system',
    status: 'New',
    value: 1200,
    createdAt: '2026-07-19',
    followUp: '2026-07-22',
    note: 'Looking for a better intake form for new client enquiries.',
    color: '#527bbf',
  },
  {
    id: 6,
    name: 'Mason Clark',
    company: 'Peakside Renovations',
    email: 'mason@peakside.co',
    phone: '+1 (720) 555-0176',
    service: 'Custom CRM',
    status: 'Contacted',
    value: 3300,
    createdAt: '2026-07-15',
    followUp: '2026-07-24',
    note: 'Wants to track estimates, jobs and customer follow-ups.',
    color: '#6d8796',
  },
  {
    id: 7,
    name: 'Isabella Rossi',
    company: 'Rossi Language Studio',
    email: 'hello@rossilanguage.eu',
    phone: '+39 06 555 0192',
    service: 'Student dashboard',
    status: 'Proposal',
    value: 750,
    createdAt: '2026-07-12',
    followUp: '2026-07-25',
    note: 'Reviewing the proposal with her business partner.',
    color: '#966b94',
  },
  {
    id: 8,
    name: 'Ethan Walker',
    company: 'Walker Fitness',
    email: 'ethan@walkerfit.co',
    phone: '+1 (646) 555-0155',
    service: 'Member portal',
    status: 'Won',
    value: 1900,
    createdAt: '2026-07-10',
    followUp: '2026-07-29',
    note: 'Deposit received. Content collection is in progress.',
    color: '#428d67',
  },
]

const chartData = [
  { date: '2026-01-01', amount: 5100 },
  { date: '2026-02-01', amount: 7200 },
  { date: '2026-03-01', amount: 6100 },
  { date: '2026-04-01', amount: 9800 },
  { date: '2026-05-01', amount: 8400 },
  { date: '2026-06-01', amount: 12100 },
  { date: '2026-07-01', amount: 16600 },
]

const periodOptions = [
  { id: '3', length: 3, label: 'three' },
  { id: '6', length: 6, label: 'six' },
  { id: '7', length: 7, label: 'seven' },
]

const workspaceOptions = ['Acme Studio', 'Northstar Agency']

function formatCurrency(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(date, locale) {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

function translateService(service, language) {
  return language === 'ru' && serviceTranslations[service] ? serviceTranslations[service] : service
}

function newLeadMessage(count, language) {
  if (language === 'en') {
    return `${count} new lead${count === 1 ? '' : 's'} ${count === 1 ? 'is' : 'are'} waiting for a reply.`
  }

  const lastTwo = count % 100
  const lastOne = count % 10
  if (lastTwo >= 11 && lastTwo <= 14) return `${count} новых заявок ожидают ответа.`
  if (lastOne === 1) return `${count} новая заявка ожидает ответа.`
  if (lastOne >= 2 && lastOne <= 4) return `${count} новые заявки ожидают ответа.`
  return `${count} новых заявок ожидают ответа.`
}

function Avatar({ lead, size = 'medium' }) {
  const initials = lead.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <span
      className={`avatar avatar--${size}`}
      style={{ '--avatar-color': lead.color || '#4f766c' }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

function StatusBadge({ status, t }) {
  return <span className={`status status--${status.toLowerCase()}`}>{t.statuses[status]}</span>
}

function StatCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <article className="stat-card">
      <div className={`stat-card__icon stat-card__icon--${tone}`}>
        <Icon size={19} strokeWidth={2} />
      </div>
      <div className="stat-card__topline">
        <span>{label}</span>
        <span className="stat-card__change"><ArrowUpRight size={13} /> {detail}</span>
      </div>
      <strong>{value}</strong>
    </article>
  )
}

function EmptyState({ onAdd, t }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon"><Search size={22} /></div>
      <h3>{t.table.noLeads}</h3>
      <p>{t.table.noLeadsText}</p>
      <button className="button button--secondary" type="button" onClick={onAdd}>
        <Plus size={16} /> {t.common.addLead}
      </button>
    </div>
  )
}

function LeadsTable({ leads, onEdit, onAdd, t, language, compact = false }) {
  if (leads.length === 0) return <EmptyState onAdd={onAdd} t={t} />

  return (
    <div className={`lead-table-wrap ${compact ? 'lead-table-wrap--compact' : ''}`}>
      <table className="lead-table">
        <thead>
          <tr>
            <th>{t.table.contact}</th>
            <th>{t.table.service}</th>
            <th>{t.table.status}</th>
            <th>{t.table.followUp}</th>
            <th>{t.table.value}</th>
            <th aria-label={t.table.edit} />
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <button className="contact-cell" type="button" onClick={() => onEdit(lead)}>
                  <Avatar lead={lead} />
                  <span><strong>{lead.name}</strong><small>{lead.company}</small></span>
                </button>
              </td>
              <td data-label={t.table.service}>{translateService(lead.service, language)}</td>
              <td data-label={t.table.status}><StatusBadge status={lead.status} t={t} /></td>
              <td data-label={t.table.followUp}>{formatDate(lead.followUp, t.locale)}</td>
              <td data-label={t.table.value} className="lead-table__value">{formatCurrency(lead.value, t.locale)}</td>
              <td className="lead-table__action">
                <button className="icon-button" type="button" onClick={() => onEdit(lead)} aria-label={`${t.table.edit}: ${lead.name}`}>
                  <MoreHorizontal size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Dashboard({ leads, onEdit, onAdd, onNavigate, t, language }) {
  const [period, setPeriod] = useState('7')
  const [periodOpen, setPeriodOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const pipelineValue = leads.reduce((sum, lead) => sum + Number(lead.value), 0)
  const wonLeads = leads.filter((lead) => lead.status === 'Won')
  const wonValue = wonLeads.reduce((sum, lead) => sum + Number(lead.value), 0)
  const conversion = leads.length ? Math.round((wonLeads.length / leads.length) * 100) : 0
  const upcoming = [...leads]
    .filter((lead) => lead.status !== 'Won')
    .sort((a, b) => a.followUp.localeCompare(b.followUp))
    .slice(0, 3)
  const activePeriod = periodOptions.find((option) => option.id === period)
  const visibleChart = chartData.slice(-activePeriod.length)
  const maxAmount = Math.max(...visibleChart.map((item) => item.amount))
  const highlighted = selectedMonth && visibleChart.some((item) => item.date === selectedMonth.date)
    ? selectedMonth
    : null

  useEffect(() => {
    const closePeriodMenu = (event) => {
      if (!event.target.closest('.period-menu')) setPeriodOpen(false)
    }
    document.addEventListener('pointerdown', closePeriodMenu)
    return () => document.removeEventListener('pointerdown', closePeriodMenu)
  }, [])

  return (
    <>
      <section className="stats-grid" aria-label={t.dashboard.currentPipeline}>
        <StatCard icon={UsersRound} label={t.dashboard.totalLeads} value={leads.length} detail="12.5%" tone="violet" />
        <StatCard icon={CircleDollarSign} label={t.dashboard.pipelineValue} value={formatCurrency(pipelineValue, t.locale)} detail="8.2%" tone="teal" />
        <StatCard icon={Check} label={t.dashboard.revenueWon} value={formatCurrency(wonValue, t.locale)} detail="16.4%" tone="amber" />
        <StatCard icon={TrendingUp} label={t.dashboard.conversionRate} value={`${conversion}%`} detail="4.1%" tone="blue" />
      </section>

      <section className="dashboard-grid">
        <article className="panel revenue-panel">
          <div className="panel__header">
            <div><p className="panel__eyebrow">{t.dashboard.performance}</p><h2>{t.dashboard.pipelineGrowth}</h2></div>
            <div className="menu-anchor period-menu">
              <button className="period-button" type="button" onClick={() => setPeriodOpen((open) => !open)} aria-expanded={periodOpen}>
                {t.dashboard.periods[activePeriod.label]} <ChevronDown size={15} />
              </button>
              {periodOpen && (
                <div className="dropdown dropdown--period">
                  {periodOptions.map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      className={period === option.id ? 'dropdown__item dropdown__item--active' : 'dropdown__item'}
                      onClick={() => { setPeriod(option.id); setSelectedMonth(null); setPeriodOpen(false) }}
                    >
                      {t.dashboard.periods[option.label]}
                      {period === option.id && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="chart-summary">
            <div>
              <small>{highlighted ? new Intl.DateTimeFormat(t.locale, { month: 'long', year: 'numeric' }).format(new Date(highlighted.date)) : t.dashboard.currentPipeline}</small>
              <strong>{formatCurrency(highlighted?.amount ?? pipelineValue, t.locale)}</strong>
            </div>
            <span><TrendingUp size={14} /> 18.2% {t.dashboard.versusPeriod}</span>
          </div>
          <div className="bar-chart" aria-label={t.dashboard.pipelineGrowth}>
            {visibleChart.map((item) => {
              const label = new Intl.DateTimeFormat(t.locale, { month: 'short' }).format(new Date(item.date))
              const isActive = highlighted?.date === item.date || (!highlighted && item === visibleChart.at(-1))
              return (
                <div className="bar-chart__item" key={item.date}>
                  <div className="bar-chart__track">
                    <button
                      type="button"
                      className={`bar-chart__bar ${isActive ? 'bar-chart__bar--active' : ''}`}
                      style={{ height: `${Math.max(18, (item.amount / maxAmount) * 100)}%` }}
                      onClick={() => setSelectedMonth(item)}
                      aria-label={`${label}: ${formatCurrency(item.amount, t.locale)}`}
                    />
                  </div>
                  <span>{label}</span>
                </div>
              )
            })}
          </div>
        </article>

        <article className="panel followups-panel">
          <div className="panel__header">
            <div><p className="panel__eyebrow">{t.dashboard.nextActions}</p><h2>{t.dashboard.upcoming}</h2></div>
            <span className="count-pill">{upcoming.length}</span>
          </div>
          <div className="followup-list">
            {upcoming.map((lead) => (
              <button className="followup-item" type="button" key={lead.id} onClick={() => onEdit(lead)}>
                <span className="followup-item__date">
                  <strong>{new Date(`${lead.followUp}T12:00:00`).getDate()}</strong>
                  <small>{new Intl.DateTimeFormat(t.locale, { month: 'short' }).format(new Date(`${lead.followUp}T12:00:00`))}</small>
                </span>
                <span className="followup-item__person"><strong>{lead.name}</strong><small>{lead.company}</small></span>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
          <button className="text-button" type="button" onClick={() => onNavigate('leads')}>
            {t.dashboard.viewAll} <ArrowRight size={15} />
          </button>
        </article>
      </section>

      <section className="panel recent-panel">
        <div className="panel__header">
          <div><p className="panel__eyebrow">{t.dashboard.latestActivity}</p><h2>{t.dashboard.recentLeads}</h2></div>
          <button className="button button--secondary button--small" type="button" onClick={() => onNavigate('leads')}>
            {t.dashboard.viewAll} <ArrowRight size={15} />
          </button>
        </div>
        <LeadsTable leads={leads.slice(0, 5)} onEdit={onEdit} onAdd={onAdd} t={t} language={language} compact />
      </section>
    </>
  )
}

function LeadsView({ leads, allServices, statusFilter, setStatusFilter, filters, setFilters, onEdit, onAdd, t, language }) {
  const [filterOpen, setFilterOpen] = useState(false)
  const activeFilterCount = [filters.service !== 'All', filters.min !== '', filters.max !== '', filters.sort !== 'newest'].filter(Boolean).length

  function resetFilters() {
    setFilters({ service: 'All', min: '', max: '', sort: 'newest' })
    setStatusFilter('All')
  }

  return (
    <section className="panel leads-panel">
      <div className="leads-toolbar">
        <div className="filter-group" aria-label={t.table.status}>
          {['All', ...STATUSES].map((status) => (
            <button
              className={statusFilter === status ? 'filter-button filter-button--active' : 'filter-button'}
              type="button"
              key={status}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'All' ? t.common.all : t.statuses[status]}
            </button>
          ))}
        </div>
        <button className={filterOpen ? 'button button--secondary button--small button--selected' : 'button button--secondary button--small'} type="button" onClick={() => setFilterOpen((open) => !open)}>
          <SlidersHorizontal size={15} /> {t.filters.more}
          {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
        </button>
      </div>

      {filterOpen && (
        <div className="advanced-filters">
          <div className="advanced-filters__title"><SlidersHorizontal size={16} /><strong>{t.filters.title}</strong></div>
          <label>
            <span>{t.filters.service}</span>
            <select value={filters.service} onChange={(event) => setFilters((current) => ({ ...current, service: event.target.value }))}>
              <option value="All">{t.filters.anyService}</option>
              {allServices.map((service) => <option value={service} key={service}>{translateService(service, language)}</option>)}
            </select>
          </label>
          <label>
            <span>{t.filters.minValue}</span>
            <input type="number" min="0" value={filters.min} onChange={(event) => setFilters((current) => ({ ...current, min: event.target.value }))} placeholder="$0" />
          </label>
          <label>
            <span>{t.filters.maxValue}</span>
            <input type="number" min="0" value={filters.max} onChange={(event) => setFilters((current) => ({ ...current, max: event.target.value }))} placeholder="$10,000" />
          </label>
          <label>
            <span>{t.filters.sort}</span>
            <select value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}>
              <option value="newest">{t.filters.newest}</option>
              <option value="highest">{t.filters.highest}</option>
              <option value="lowest">{t.filters.lowest}</option>
            </select>
          </label>
          <div className="advanced-filters__actions">
            <button className="button button--ghost button--small" type="button" onClick={resetFilters}><RotateCcw size={14} /> {t.common.reset}</button>
            <button className="button button--primary button--small" type="button" onClick={() => setFilterOpen(false)}>{t.common.apply}</button>
          </div>
        </div>
      )}

      <LeadsTable leads={leads} onEdit={onEdit} onAdd={onAdd} t={t} language={language} />
    </section>
  )
}

function PipelineView({ leads, onEdit, onMove, t, language }) {
  const [draggingId, setDraggingId] = useState(null)

  return (
    <section className="pipeline-board" aria-label={t.nav.pipeline}>
      {STATUSES.map((status) => {
        const columnLeads = leads.filter((lead) => lead.status === status)
        const value = columnLeads.reduce((sum, lead) => sum + Number(lead.value), 0)

        return (
          <div
            className={`pipeline-column pipeline-column--${status.toLowerCase()}`}
            key={status}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => { if (draggingId) onMove(draggingId, status); setDraggingId(null) }}
          >
            <div className="pipeline-column__header">
              <div><span className="pipeline-dot" /><strong>{t.statuses[status]}</strong><span className="count-pill">{columnLeads.length}</span></div>
              <span>{formatCurrency(value, t.locale)}</span>
            </div>
            <div className="pipeline-column__cards">
              {columnLeads.map((lead) => (
                <article className="pipeline-card" key={lead.id} draggable onDragStart={() => setDraggingId(lead.id)} onDragEnd={() => setDraggingId(null)}>
                  <button className="pipeline-card__main" type="button" onClick={() => onEdit(lead)}>
                    <div className="pipeline-card__top"><Avatar lead={lead} size="small" /><span className="pipeline-card__company">{lead.company}</span><MoreHorizontal size={17} /></div>
                    <h3>{lead.name}</h3>
                    <p>{translateService(lead.service, language)}</p>
                    <div className="pipeline-card__meta"><strong>{formatCurrency(lead.value, t.locale)}</strong><span><CalendarDays size={13} /> {formatDate(lead.followUp, t.locale)}</span></div>
                  </button>
                  <div className="pipeline-card__move">
                    <label htmlFor={`status-${lead.id}`}>{t.pipeline.moveTo}</label>
                    <select id={`status-${lead.id}`} value={lead.status} onChange={(event) => onMove(lead.id, event.target.value)}>
                      {STATUSES.map((option) => <option value={option} key={option}>{t.statuses[option]}</option>)}
                    </select>
                  </div>
                </article>
              ))}
              {columnLeads.length === 0 && <div className="pipeline-empty">{t.pipeline.empty}</div>}
            </div>
          </div>
        )
      })}
    </section>
  )
}

function LeadModal({ lead, onClose, onSave, onDelete, t }) {
  const defaultFollowUp = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const [form, setForm] = useState(() => ({
    name: lead?.name || '', company: lead?.company || '', email: lead?.email || '', phone: lead?.phone || '',
    service: lead?.service || '', status: lead?.status || 'New', value: lead?.value || '',
    followUp: lead?.followUp || defaultFollowUp, note: lead?.note || '',
  }))

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function submitForm(event) {
    event.preventDefault()
    const colors = ['#6f63c2', '#3f8f86', '#c96f78', '#527bbf']
    onSave({ ...form, value: Number(form.value), createdAt: lead?.createdAt || new Date().toISOString().slice(0, 10), color: lead?.color || colors[Math.floor(Math.random() * colors.length)] })
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
        <div className="modal__header">
          <div><p className="panel__eyebrow">{lead ? t.modal.details : t.modal.newOpportunity}</p><h2 id="lead-modal-title">{lead ? t.modal.editLead : t.modal.addNew}</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label={t.common.close}><X size={19} /></button>
        </div>
        <form onSubmit={submitForm}>
          <div className="form-grid">
            <label><span>{t.modal.fullName}</span><input name="name" value={form.name} onChange={updateField} placeholder={t.modal.namePlaceholder} required autoFocus /></label>
            <label><span>{t.modal.company}</span><input name="company" value={form.company} onChange={updateField} placeholder={t.modal.companyPlaceholder} required /></label>
            <label><span>{t.modal.email}</span><input name="email" type="email" value={form.email} onChange={updateField} placeholder="name@company.com" required /></label>
            <label><span>{t.modal.phone}</span><input name="phone" value={form.phone} onChange={updateField} placeholder="+1 555 000 0000" /></label>
            <label><span>{t.modal.service}</span><input name="service" value={form.service} onChange={updateField} placeholder={t.modal.servicePlaceholder} required /></label>
            <label><span>{t.modal.dealValue}</span><div className="input-with-icon"><span>$</span><input name="value" type="number" min="0" value={form.value} onChange={updateField} placeholder="1500" required /></div></label>
            <label><span>{t.modal.status}</span><select name="status" value={form.status} onChange={updateField}>{STATUSES.map((status) => <option value={status} key={status}>{t.statuses[status]}</option>)}</select></label>
            <label><span>{t.modal.followUp}</span><input name="followUp" type="date" value={form.followUp} onChange={updateField} required /></label>
            <label className="form-grid__full"><span>{t.modal.notes}</span><textarea name="note" value={form.note} onChange={updateField} rows="4" placeholder={t.modal.notesPlaceholder} /></label>
          </div>
          {lead && <div className="contact-preview"><a href={`mailto:${lead.email}`}><Mail size={15} /> {lead.email}</a>{lead.phone && <a href={`tel:${lead.phone}`}><Phone size={15} /> {lead.phone}</a>}</div>}
          <div className="modal__footer">
            {lead ? <button className="button button--danger" type="button" onClick={() => onDelete(lead.id)}><Trash2 size={16} /> {t.modal.delete}</button> : <span />}
            <div><button className="button button--secondary" type="button" onClick={onClose}>{t.common.cancel}</button><button className="button button--primary" type="submit">{lead ? <Edit3 size={16} /> : <Plus size={16} />}{lead ? t.modal.save : t.common.addLead}</button></div>
          </div>
        </form>
      </div>
    </div>
  )
}

function AboutModal({ onClose, t }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="about-modal" role="dialog" aria-modal="true" aria-labelledby="about-title">
        <div className="about-modal__icon"><TrendingUp size={24} /></div>
        <button className="icon-button about-modal__close" type="button" onClick={onClose} aria-label={t.common.close}><X size={18} /></button>
        <p className="panel__eyebrow">{t.common.demo}</p>
        <h2 id="about-title">{t.profile.aboutTitle}</h2>
        <p>{t.profile.aboutText}</p>
        <div className="about-modal__badge"><span /> {t.profile.localData}</div>
        <button className="button button--primary" type="button" onClick={onClose}>{t.common.close}</button>
      </div>
    </div>
  )
}

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [filters, setFilters] = useState({ service: 'All', min: '', max: '', sort: 'newest' })
  const [modalLead, setModalLead] = useState(undefined)
  const [modalOpen, setModalOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [workspace, setWorkspace] = useState('Acme Studio')
  const [toast, setToast] = useState('')
  const [language, setLanguage] = useState(() => localStorage.getItem('leadflow-language') || 'en')
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'followup', unread: true },
    { id: 2, type: 'lead', unread: true },
  ])
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('leadflow-leads')
      return saved ? JSON.parse(saved) : initialLeads
    } catch {
      return initialLeads
    }
  })

  const t = translations[language]

  useEffect(() => {
    localStorage.setItem('leadflow-leads', JSON.stringify(leads))
  }, [leads])

  useEffect(() => {
    localStorage.setItem('leadflow-language', language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    const closeMenus = (event) => { if (!event.target.closest('.menu-anchor')) setOpenMenu(null) }
    const closeOnEscape = (event) => { if (event.key === 'Escape') setOpenMenu(null) }
    document.addEventListener('pointerdown', closeMenus)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeMenus)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const allServices = useMemo(() => [...new Set(leads.map((lead) => lead.service))].sort(), [leads])

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = leads.filter((lead) => {
      const matchesSearch = !query || [lead.name, lead.company, lead.email, lead.service]
        .some((value) => value.toLowerCase().includes(query))
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter
      const matchesService = filters.service === 'All' || lead.service === filters.service
      const matchesMin = filters.min === '' || Number(lead.value) >= Number(filters.min)
      const matchesMax = filters.max === '' || Number(lead.value) <= Number(filters.max)
      return matchesSearch && matchesStatus && matchesService && matchesMin && matchesMax
    })

    return filtered.sort((a, b) => {
      if (filters.sort === 'highest') return Number(b.value) - Number(a.value)
      if (filters.sort === 'lowest') return Number(a.value) - Number(b.value)
      return b.createdAt.localeCompare(a.createdAt)
    })
  }, [leads, search, statusFilter, filters])

  function showToast(message) {
    setToast('')
    window.setTimeout(() => setToast(message), 0)
  }

  function toggleMenu(menu) {
    setOpenMenu((current) => current === menu ? null : menu)
  }

  function navigate(view) {
    setActiveView(view)
    setSidebarOpen(false)
    setOpenMenu(null)
    if (view !== 'leads') setStatusFilter('All')
  }

  function openNewLead() {
    setModalLead(undefined)
    setModalOpen(true)
    setOpenMenu(null)
  }

  function openLead(lead) {
    setModalLead(lead)
    setModalOpen(true)
  }

  function saveLead(data) {
    if (modalLead) {
      setLeads((current) => current.map((lead) => lead.id === modalLead.id ? { ...lead, ...data } : lead))
      showToast(t.toast.updated)
    } else {
      setLeads((current) => [{ ...data, id: Date.now() }, ...current])
      showToast(t.toast.added)
    }
    setModalOpen(false)
  }

  function deleteLead(id) {
    if (window.confirm(t.modal.deleteConfirm)) {
      setLeads((current) => current.filter((lead) => lead.id !== id))
      setModalOpen(false)
      showToast(t.toast.deleted)
    }
  }

  function moveLead(id, status) {
    setLeads((current) => current.map((lead) => lead.id === id ? { ...lead, status } : lead))
    showToast(`${t.toast.moved} “${t.statuses[status]}”`)
  }

  function toggleLanguage() {
    const next = language === 'en' ? 'ru' : 'en'
    setLanguage(next)
    showToast(translations[next].toast.language)
  }

  function resetDemoData() {
    if (window.confirm(t.profile.resetConfirm)) {
      setLeads(initialLeads)
      setSearch('')
      setStatusFilter('All')
      setFilters({ service: 'All', min: '', max: '', sort: 'newest' })
      setOpenMenu(null)
      showToast(t.toast.reset)
    }
  }

  function markAllRead() {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })))
    showToast(t.toast.read)
  }

  const navItems = [
    { id: 'dashboard', label: t.nav.overview, icon: LayoutDashboard },
    { id: 'leads', label: t.nav.leads, icon: UsersRound },
    { id: 'pipeline', label: t.nav.pipeline, icon: Columns3 },
  ]
  const unreadCount = notifications.filter((item) => item.unread).length
  const todayLabel = new Intl.DateTimeFormat(t.locale, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const viewText = activeView === 'dashboard'
    ? { eyebrow: todayLabel, ...t.views.dashboard }
    : t.views[activeView]

  return (
    <div className="app-shell">
      <aside className={sidebarOpen ? 'sidebar sidebar--open' : 'sidebar'}>
        <div className="brand"><span className="brand__mark"><TrendingUp size={19} strokeWidth={2.4} /></span><span>LeadFlow</span></div>

        <div className="menu-anchor workspace-menu">
          <button className="workspace-switcher" type="button" onClick={() => toggleMenu('workspace')} aria-expanded={openMenu === 'workspace'}>
            <span className="workspace-switcher__icon"><BriefcaseBusiness size={16} /></span>
            <span><small>{t.nav.workspace}</small><strong>{workspace}</strong></span>
            <ChevronDown size={15} />
          </button>
          {openMenu === 'workspace' && (
            <div className="dropdown dropdown--dark">
              <p>{t.sidebar.chooseWorkspace}</p>
              {workspaceOptions.map((option) => (
                <button type="button" className={workspace === option ? 'dropdown__item dropdown__item--active' : 'dropdown__item'} key={option} onClick={() => { setWorkspace(option); setOpenMenu(null); showToast(option) }}>
                  <span className="workspace-option-mark">{option.slice(0, 2).toUpperCase()}</span>{option}{workspace === option && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <p>{t.nav.workspace}</p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button type="button" className={activeView === id ? 'nav-item nav-item--active' : 'nav-item'} key={id} onClick={() => navigate(id)}>
              <Icon size={18} /><span>{label}</span>{id === 'leads' && <em>{leads.length}</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <span><TrendingUp size={17} /></span><strong>{t.sidebar.promptTitle}</strong>
          <p>{newLeadMessage(leads.filter((lead) => lead.status === 'New').length, language)}</p>
          <button type="button" onClick={() => navigate('leads')}>{t.sidebar.review} <ArrowRight size={14} /></button>
        </div>

        <div className="menu-anchor profile-menu">
          <button className="profile-card" type="button" onClick={() => toggleMenu('profile')} aria-expanded={openMenu === 'profile'}>
            <span className="avatar avatar--profile">AS</span><span><strong>Alex Smith</strong><small>{t.sidebar.admin}</small></span><MoreHorizontal size={17} />
          </button>
          {openMenu === 'profile' && (
            <div className="dropdown dropdown--dark dropdown--up">
              <button className="dropdown__item" type="button" onClick={() => { setAboutOpen(true); setOpenMenu(null) }}><Info size={15} /> {t.profile.about}</button>
              <button className="dropdown__item dropdown__item--danger" type="button" onClick={resetDemoData}><RotateCcw size={15} /> {t.profile.resetData}</button>
            </div>
          )}
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-overlay" type="button" onClick={() => setSidebarOpen(false)} aria-label={t.common.close} />}

      <main className="main-content">
        <header className="topbar">
          <button className="menu-button" type="button" onClick={() => setSidebarOpen(true)} aria-label={t.nav.workspace}><Menu size={21} /></button>
          <div className="page-heading"><span>{viewText.eyebrow}</span><h1>{viewText.title}</h1><p>{viewText.subtitle}</p></div>
          <div className="topbar__actions">
            <label className="search-box"><Search size={17} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} onFocus={() => activeView === 'dashboard' && navigate('leads')} placeholder={t.common.search} aria-label={t.common.search} /><kbd>⌘ K</kbd></label>
            <button className="language-button" type="button" onClick={toggleLanguage} title={language === 'en' ? 'Русский' : 'English'}><Globe2 size={17} /><span>{language === 'en' ? 'EN' : 'RU'}</span></button>
            <div className="menu-anchor notification-menu">
              <button className="notification-button" type="button" onClick={() => toggleMenu('notifications')} aria-expanded={openMenu === 'notifications'} aria-label={t.notifications.title}>
                <Bell size={19} />{unreadCount > 0 && <span />}
              </button>
              {openMenu === 'notifications' && (
                <div className="dropdown dropdown--notifications">
                  <div className="dropdown__header"><strong>{t.notifications.title}</strong>{unreadCount > 0 && <button type="button" onClick={markAllRead}>{t.notifications.markRead}</button>}</div>
                  {notifications.map((item) => (
                    <button className={item.unread ? 'notification-item notification-item--unread' : 'notification-item'} type="button" key={item.id} onClick={() => { setNotifications((current) => current.map((note) => note.id === item.id ? { ...note, unread: false } : note)); navigate('leads') }}>
                      <span className="notification-item__icon">{item.type === 'followup' ? <CalendarDays size={15} /> : <UsersRound size={15} />}</span>
                      <span><strong>{item.type === 'followup' ? t.notifications.firstTitle : t.notifications.secondTitle}</strong><small>{item.type === 'followup' ? t.notifications.firstText : t.notifications.secondText}</small></span>
                      {item.unread && <i />}
                    </button>
                  ))}
                  {unreadCount === 0 && <p className="notifications-empty">{t.notifications.empty}</p>}
                </div>
              )}
            </div>
            <button className="button button--primary" type="button" onClick={openNewLead}><Plus size={17} /> <span>{t.common.addLead}</span></button>
          </div>
        </header>

        <div className="page-content">
          {activeView === 'dashboard' && <Dashboard leads={leads} onEdit={openLead} onAdd={openNewLead} onNavigate={navigate} t={t} language={language} />}
          {activeView === 'leads' && <LeadsView leads={filteredLeads} allServices={allServices} statusFilter={statusFilter} setStatusFilter={setStatusFilter} filters={filters} setFilters={setFilters} onEdit={openLead} onAdd={openNewLead} t={t} language={language} />}
          {activeView === 'pipeline' && <PipelineView leads={filteredLeads} onEdit={openLead} onMove={moveLead} t={t} language={language} />}
        </div>
      </main>

      {modalOpen && <LeadModal lead={modalLead} onClose={() => setModalOpen(false)} onSave={saveLead} onDelete={deleteLead} t={t} />}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} t={t} />}
      {toast && <div className="toast" role="status"><Check size={16} /> {toast}</div>}
    </div>
  )
}

export default App
