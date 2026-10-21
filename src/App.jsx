import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'target-skills-stories'

const starterStories = [
  {
    id: 'starter-1',
    title: 'Keeping a busy line moving',
    description:
      'During a Saturday rush, I reorganized the prep station and showed a new teammate a faster way to restock. We got every order out on time without compromising quality.',
    date: 'Today',
  },
]

function App() {
  const [stories, setStories] = useState(() => {
    try {
      const savedStories = localStorage.getItem(STORAGE_KEY)
      return savedStories ? JSON.parse(savedStories) : starterStories
    } catch {
      return starterStories
    }
  })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories))
  }, [stories])

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle || !trimmedDescription) {
      setNotice('Add a title and a short description to save your story.')
      return
    }

    const newStory = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      description: trimmedDescription,
      date: 'Just now',
    }

    setStories((currentStories) => [newStory, ...currentStories])
    setTitle('')
    setDescription('')
    setNotice('Story saved to this device.')
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Target Skills home">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>target skills</span>
        </a>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#why-it-matters">Why it matters</a>
          <a href="#your-stories">Your stories</a>
        </nav>
        <a className="header-cta" href="#add-story">
          Add a story <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section className="hero" id="why-it-matters">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Make your experience count</p>
            <h1>The skills you use every day are <em>career skills.</em></h1>
            <p className="hero-intro">
              Target Skills helps you capture the moments that show what you can do—
              and connect your blue-collar experience to your next opportunity.
            </p>
            <a className="text-link" href="#add-story">
              Start capturing <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-art" aria-label="Illustration of a person bringing hands-on experience to a new opportunity" role="img">
            <div className="sun" />
            <div className="arch arch-one" />
            <div className="arch arch-two" />
            <div className="person person-one"><span className="head" /><span className="body" /><span className="arm" /></div>
            <div className="person person-two"><span className="head" /><span className="body" /><span className="arm" /></div>
            <span className="spark spark-one">✦</span>
            <span className="spark spark-two">✦</span>
          </div>
        </section>

        <section className="story-section" id="add-story">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span /> Your experience, translated</p>
              <h2>Tell us about a time<br /><em>you made it work.</em></h2>
            </div>
            <p className="section-note">
              Big or small, the everyday moments where you solve problems, lead,
              adapt, and care are worth remembering.
            </p>
          </div>

          <form className="story-form" onSubmit={handleSubmit}>
            <label htmlFor="story-title">Give your story a title</label>
            <input
              id="story-title"
              type="text"
              placeholder="e.g. Keeping a busy line moving"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
            />
            <label htmlFor="story-description">What happened?</label>
            <textarea
              id="story-description"
              placeholder="Describe the situation, what you did, and how it turned out..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              maxLength={500}
            />
            <div className="form-footer">
              <p className="privacy-note"><span aria-hidden="true">▣</span> Your stories stay on this device.</p>
              <button type="submit">Save story <span aria-hidden="true">↗</span></button>
            </div>
            {notice && <p className="form-notice" role="status">{notice}</p>}
          </form>
        </section>

        <section className="stories-section" id="your-stories">
          <div className="stories-heading">
            <div>
              <p className="eyebrow"><span /> Your collection</p>
              <h2>Stories worth <em>remembering.</em></h2>
            </div>
            <span className="story-count">{stories.length} {stories.length === 1 ? 'story' : 'stories'}</span>
          </div>
          <div className="story-grid">
            {stories.map((story, index) => (
              <article className={`story-card ${index === 0 ? 'featured' : ''}`} key={story.id}>
                <div className="card-topline">
                  <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
                  <span>{story.date}</span>
                </div>
                <h3>{story.title}</h3>
                <p>{story.description}</p>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand" href="/" aria-label="Target Skills home">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span>target skills</span>
        </a>
        <p>Every job teaches you something.</p>
        <span>© 2026 Target Skills</span>
      </footer>
    </div>
  )
}

export default App
