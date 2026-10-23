import { useState } from 'react'
import './App.css'

const STORAGE_KEY = 'target-skills-stories'
const skillOptions = ['Leadership', 'Teamwork', 'Problem solving', 'Communication', 'Adaptability', 'Reliability']

const starterStories = [
  {
    id: 'starter-1',
    title: 'Keeping a busy line moving',
    description:
      'During a Saturday rush, I reorganized the prep station and showed a new teammate a faster way to restock. We got every order out on time without compromising quality.',
    situation: 'A Saturday rush made it difficult to keep orders moving.',
    action: 'I reorganized the prep station and showed a new teammate a faster way to restock.',
    result: 'We got every order out on time without compromising quality.',
    skills: ['Problem solving', 'Teamwork', 'Leadership'],
    date: 'Today',
    example: true,
  },
]

function readStories() {
  try {
    const savedStories = localStorage.getItem(STORAGE_KEY)
    if (!savedStories) return starterStories
    const parsedStories = JSON.parse(savedStories)
    if (!Array.isArray(parsedStories)) return starterStories
    return parsedStories.map((story) => ({
      ...story,
      skills: Array.isArray(story.skills) ? story.skills : [],
      description: story.description || [story.situation, story.action, story.result].filter(Boolean).join(' '),
    }))
  } catch {
    return starterStories
  }
}

function writeStories(stories) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories))
    return true
  } catch {
    return false
  }
}

function getResumeBullet(story) {
  const action = story.action || story.description || 'Applied hands-on experience'
  const result = story.result || 'to support a successful outcome'
  return `${action.replace(/[.!?]+$/, '')}, ${result.charAt(0).toLowerCase()}${result.slice(1).replace(/[.!?]+$/, '')}.`
}

function getSuggestedSkills(story) {
  const text = `${story.title} ${story.description} ${story.situation} ${story.action} ${story.result}`.toLowerCase()
  const keywordSkills = {
    Leadership: ['lead', 'showed', 'trained', 'organized', 'managed'],
    Teamwork: ['team', 'teammate', 'helped', 'together', 'collaborat'],
    'Problem solving': ['problem', 'reorganized', 'improv', 'solv', 'challenge', 'faster'],
    Communication: ['showed', 'explained', 'communicat', 'customer'],
    Adaptability: ['adapt', 'rush', 'change', 'new', 'flexib'],
    Reliability: ['on time', 'quality', 'consisten', 'depend'],
  }
  return skillOptions.filter((skill) => story.skills?.includes(skill) || keywordSkills[skill].some((word) => text.includes(word)))
}

function emptyForm() {
  return { title: '', situation: '', action: '', result: '', skills: [] }
}

function App() {
  const [stories, setStories] = useState(readStories)
  const [form, setForm] = useState(emptyForm)
  const [notice, setNotice] = useState('')
  const [storageError, setStorageError] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedStory, setSelectedStory] = useState(null)

  function persistStories(nextStories) {
    setStories(nextStories)
    if (!writeStories(nextStories)) setStorageError(true)
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function toggleSkill(skill) {
    setForm((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills.filter((item) => item !== skill)
        : [...current.skills, skill],
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const title = form.title.trim()
    const situation = form.situation.trim()
    const action = form.action.trim()
    const result = form.result.trim()
    if (!title || !situation || !action || !result) {
      setNotice('Complete the title and each part of the story before saving.')
      return
    }
    const story = {
      id: editingId || crypto.randomUUID(),
      title,
      situation,
      action,
      result,
      description: `${situation} ${action} ${result}`,
      skills: form.skills,
      date: editingId ? 'Updated just now' : 'Just now',
    }
    const nextStories = editingId
      ? stories.map((item) => item.id === editingId ? { ...item, ...story } : item)
      : [story, ...stories]
    persistStories(nextStories)
    setForm(emptyForm())
    setEditingId(null)
    setNotice(editingId ? 'Story updated on this device.' : 'Story saved to this device.')
  }

  function editStory(story) {
    setEditingId(story.id)
    setForm({
      title: story.title || '',
      situation: story.situation || story.description || '',
      action: story.action || '',
      result: story.result || '',
      skills: story.skills || [],
    })
    setNotice('')
    document.querySelector('#add-story')?.scrollIntoView({ behavior: 'smooth' })
  }

  function deleteStory(id) {
    const story = stories.find((item) => item.id === id)
    if (!story || !window.confirm(`Delete “${story.title}”? This cannot be undone.`)) return
    persistStories(stories.filter((item) => item.id !== id))
    if (selectedStory?.id === id) setSelectedStory(null)
    setNotice('Story deleted from this device.')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm())
    setNotice('')
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Target Skills home">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span>target skills</span>
        </a>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#why-it-matters">Why it matters</a>
          <a href="#your-stories">Your stories</a>
        </nav>
        <a className="header-cta" href="#add-story">Add a story <span aria-hidden="true">↗</span></a>
      </header>

      <main id="top">
        <section className="hero" id="why-it-matters">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Make your experience count</p>
            <h1>The skills you use every day are <em>career skills.</em></h1>
            <p className="hero-intro">Target Skills helps you capture the moments that show what you can do—and connect your blue-collar experience to your next opportunity.</p>
            <a className="text-link" href="#add-story">Start capturing <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-art" aria-label="Illustration of a person bringing hands-on experience to a new opportunity" role="img">
            <div className="sun" /><div className="arch arch-one" /><div className="arch arch-two" />
            <div className="person person-one"><span className="head" /><span className="body" /><span className="arm" /></div>
            <div className="person person-two"><span className="head" /><span className="body" /><span className="arm" /></div>
            <span className="spark spark-one">✦</span><span className="spark spark-two">✦</span>
          </div>
        </section>

        <section className="story-section" id="add-story">
          <div className="section-heading">
            <div><p className="eyebrow"><span /> Your experience, translated</p><h2>{editingId ? <>Update your <em>story.</em></> : <>Tell us about a time<br /><em>you made it work.</em></>}</h2></div>
            <p className="section-note">Big or small, the everyday moments where you solve problems, lead, adapt, and care are worth remembering.</p>
          </div>
          <form className="story-form" onSubmit={handleSubmit}>
            <label htmlFor="story-title">Give your story a title</label>
            <input id="story-title" name="title" type="text" placeholder="e.g. Keeping a busy line moving" value={form.title} onChange={updateField} maxLength={80} required />
            <div className="prompt-grid">
              <div><label htmlFor="story-situation">What was the situation?</label><textarea id="story-situation" name="situation" placeholder="What challenge or task were you facing?" value={form.situation} onChange={updateField} rows={3} maxLength={300} required /></div>
              <div><label htmlFor="story-action">What did you do?</label><textarea id="story-action" name="action" placeholder="What steps did you take?" value={form.action} onChange={updateField} rows={3} maxLength={300} required /></div>
              <div><label htmlFor="story-result">What was the result?</label><textarea id="story-result" name="result" placeholder="What improved or changed?" value={form.result} onChange={updateField} rows={3} maxLength={300} required /></div>
            </div>
            <fieldset className="skills-fieldset"><legend>Which skills did you use? <span>(optional)</span></legend><div className="skill-options">{skillOptions.map((skill) => <label className={`skill-option ${form.skills.includes(skill) ? 'selected' : ''}`} key={skill}><input type="checkbox" checked={form.skills.includes(skill)} onChange={() => toggleSkill(skill)} />{skill}</label>)}</div></fieldset>
            <div className="form-footer"><p className="privacy-note"><span aria-hidden="true">▣</span> Your stories stay on this device.</p><div className="form-actions">{editingId && <button type="button" className="secondary-button" onClick={cancelEdit}>Cancel</button>}<button type="submit">{editingId ? 'Update story' : 'Save story'} <span aria-hidden="true">↗</span></button></div></div>
            {notice && <p className="form-notice" role="status">{notice}</p>}
            {storageError && <p className="form-notice error" role="alert">This browser could not save your latest change. Export your stories before closing this page.</p>}
          </form>
        </section>

        <section className="stories-section" id="your-stories">
          <div className="stories-heading"><div><p className="eyebrow"><span /> Your collection</p><h2>Stories worth <em>remembering.</em></h2></div><span className="story-count">{stories.length} {stories.length === 1 ? 'story' : 'stories'}</span></div>
          {stories.length === 0 ? <div className="empty-state"><h3>Your collection is ready for its first story.</h3><p>Capture a moment where you solved a problem, helped someone, or kept things moving.</p><a className="header-cta" href="#add-story">Add your first story <span aria-hidden="true">↗</span></a></div> : <div className="story-grid">{stories.map((story, index) => <article className={`story-card ${index === 0 ? 'featured' : ''}`} key={story.id}><div className="card-topline"><span className="card-number">{String(index + 1).padStart(2, '0')}</span><span>{story.date}</span></div><h3>{story.title}</h3><p>{story.description}</p><div className="card-skills">{getSuggestedSkills(story).slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}</div><div className="card-actions"><button type="button" onClick={() => setSelectedStory(story)}>View details</button><button type="button" onClick={() => editStory(story)}>Edit</button><button type="button" className="delete-action" onClick={() => deleteStory(story.id)}>Delete</button></div></article>)}</div>}
        </section>
      </main>

      <footer className="site-footer"><a className="brand" href="#top" aria-label="Target Skills home"><span className="brand-mark" aria-hidden="true"><span /><span /><span /></span><span>target skills</span></a><p>Every job teaches you something.</p><span>© 2026 Target Skills</span></footer>
      {selectedStory && <div className="modal-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && setSelectedStory(null)}><section className="story-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" type="button" onClick={() => setSelectedStory(null)} aria-label="Close story details">×</button><p className="eyebrow"><span /> Story translation</p><h2 id="modal-title">{selectedStory.title}</h2><div className="detail-block"><strong>Situation</strong><p>{selectedStory.situation || selectedStory.description}</p><strong>Action</strong><p>{selectedStory.action || 'Not added yet.'}</p><strong>Result</strong><p>{selectedStory.result || 'Not added yet.'}</p></div><h3>Skills demonstrated</h3><div className="card-skills modal-skills">{getSuggestedSkills(selectedStory).map((skill) => <span key={skill}>{skill}</span>)}</div><h3>Resume-ready bullet</h3><p className="resume-bullet">{getResumeBullet(selectedStory)}</p><button type="button" onClick={() => navigator.clipboard?.writeText(getResumeBullet(selectedStory))}>Copy resume bullet</button></section></div>}
    </div>
  )
}

export default App
