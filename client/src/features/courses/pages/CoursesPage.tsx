import { useState } from 'react'

const lawSections = [
  {
    name: 'Civil Law',
    icon: '🏛',
    description: 'Private rights, civil disputes, property, contracts and remedies.',
    hint: 'Explore civil law subjects',
    submenu: ['CPC', 'Contract Act', 'Transfer of Property Act', 'Specific Relief Act', 'Limitation Act', 'Family Laws'],
  },
  {
    name: 'Criminal Law',
    icon: '🛡',
    description: 'Offences, criminal procedure, evidence and the justice system.',
    hint: 'Hover to view sub-laws',
    submenu: ['IPC / BNS', 'CrPC / BNSS', 'IEA / BSA', 'POCSO Act', 'NDPS Act', 'Prevention of Corruption Act'],
  },
  {
    name: 'Banking Law',
    icon: '🏦',
    description: 'Banking regulation, recovery, secured assets and financial institutions.',
    hint: 'Hover to view sub-laws',
    submenu: ['Banking Regulation Act', 'SARFAESI Act', 'RBI Act', 'Recovery of Debts Act', 'Negotiable Instruments Act', 'Insolvency & Bankruptcy Code'],
  },
  {
    name: 'Other Laws',
    icon: '📑',
    description: 'Special statutes and important legislation across legal practice areas.',
    hint: 'Hover to view sub-laws',
    submenu: ['Companies Act', 'SEBI Act & Regulations', 'Arbitration Act', 'IT Act', 'Consumer Protection Act', 'Environment Laws'],
  },
]

export function CoursesPage() {
  const [openCard, setOpenCard] = useState<number | null>(null)

  const handleCardToggle = (index: number) => {
    if (window.innerWidth <= 600) {
      setOpenCard((current) => (current === index ? null : index))
    }
  }

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardToggle(index)
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .LexQuora-page {
          background: #fffaf2;
          color: #171936;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        }

        .topbar {
          height: 82px;
          background: rgba(255, 255, 255, 0.82);
          border-bottom: 1px solid #eee6dc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(22px, 5vw, 76px);
          gap: 24px;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(12px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 220px;
        }

        .brand-mark {
          width: 48px;
          height: 48px;
          border-radius: 17px;
          background: #ffd54f;
          display: grid;
          place-items: center;
          font-size: 25px;
          box-shadow: 0 5px 15px #f5d66b55;
        }

        .brand-name {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .brand-name span {
          color: #f28b36;
        }

        .tagline {
          font-size: 10px;
          letter-spacing: 1px;
          color: #69677a;
          margin-top: 1px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav a {
          padding: 12px 16px;
          text-decoration: none;
          color: #3d3b54;
          font-size: 14px;
          border-radius: 14px;
        }

        .nav a.active,
        .nav a:hover {
          background: #fff3ca;
          color: #171936;
        }

        .search {
          width: min(270px, 24vw);
          border: 1px solid #eee6dc;
          background: #fff;
          border-radius: 14px;
          padding: 12px 15px;
          color: #888;
          font-size: 13px;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #5b5870;
        }

        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #9a7867;
          color: #fff;
          display: grid;
          place-items: center;
          font-weight: 700;
        }

        .wrap {
          max-width: 1240px;
          margin: 0 auto;
          padding: 42px 28px 70px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border: 1px solid #f5d77c;
          border-radius: 30px;
          color: #a87800;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.7px;
          background: #fffdf7;
        }

        .intro {
          margin: 16px 0 30px;
        }

        .intro h1 {
          font-size: clamp(28px, 3vw, 38px);
          letter-spacing: -1.5px;
          margin: 0 0 9px;
        }

        .intro p {
          margin: 0;
          color: #77758b;
          font-size: 15px;
          line-height: 1.65;
          max-width: 660px;
        }

        .layout {
          display: grid;
          grid-template-columns: 270px 1fr;
          gap: 28px;
          align-items: start;
        }

        .sidebar,
        .main-panel {
          background: #fff;
          border: 1px solid #eee6dc;
          border-radius: 24px;
          box-shadow: 0 12px 35px #57401a08;
        }

        .sidebar {
          padding: 24px;
          position: sticky;
          top: 104px;
          overflow: hidden;
        }

        .side-title {
          display: flex;
          align-items: center;
          gap: 13px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee6dc;
          font-size: 21px;
          font-weight: 750;
        }

        .side-icon,
        .law-icon {
          width: 46px;
          height: 46px;
          border-radius: 15px;
          background: #fff3ca;
          display: grid;
          place-items: center;
          font-size: 23px;
        }

        .side-list {
          padding-top: 9px;
        }

        .side-list a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 4px;
          border-bottom: 1px solid #f2ede7;
          color: #25233d;
          text-decoration: none;
          font-weight: 600;
        }

        .side-list a:hover {
          color: #6738e8;
        }

        .side-list small {
          color: #9a94a8;
          font-size: 18px;
        }

        .side-note {
          margin-top: 22px;
          padding: 15px;
          border-radius: 16px;
          background: linear-gradient(135deg, #fff8e7, #fff);
          font-size: 12px;
          color: #898092;
          line-height: 1.6;
        }

        .main-panel {
          padding: 26px;
        }

        .section-head {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 20px;
        }

        .section-head:before,
        .section-head:after {
          content: "";
          height: 1px;
          background: #e8dfd4;
          flex: 1;
        }

        .section-pill {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 24px;
          border: 1px solid #f4ca48;
          border-radius: 30px;
          background: linear-gradient(180deg, #fff9e8, #fff1c6);
          font-size: 23px;
          font-weight: 800;
        }

        .law-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .law-card {
          position: relative;
          border: 1px solid #eee6dc;
          border-radius: 19px;
          background: #fff;
          padding: 22px;
          min-height: 164px;
          overflow: visible;
          transition: 0.2s ease;
          outline: none;
          cursor: pointer;
          z-index: 1;
        }

        .law-card:hover,
        .law-card:focus-within,
        .law-card.open {
          z-index: 20;
          border-color: #c7b4ff;
          box-shadow: 0 12px 28px #6a42db12;
          transform: translateY(-2px);
        }

        .law-top {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .law-icon {
          background: #f3edff;
          color: #6738e8;
          font-size: 22px;
        }

        .law-card:nth-child(2) .law-icon {
          background: #f3f1f8;
          color: #625c7b;
        }

        .law-card:nth-child(3) .law-icon {
          background: #fff1e9;
          color: #e77939;
        }

        .law-card:nth-child(4) .law-icon {
          background: #eef8f0;
          color: #398b5c;
        }

        .law-name {
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -0.4px;
        }

        .law-desc {
          font-size: 13px;
          color: #77758b;
          margin: 12px 0 0 61px;
          line-height: 1.55;
        }

        .hover-hint {
          font-size: 11px;
          color: #a19bad;
          margin: 11px 0 0 61px;
        }

        .submenu {
          position: absolute;
          left: 18px;
          right: 18px;
          top: calc(100% + 12px);
          z-index: 50;
          background: #fff;
          border: 1px solid #e9defe;
          border-radius: 16px;
          padding: 9px;
          box-shadow: 0 18px 35px #29204420;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 7px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-6px);
          transition: 0.18s ease;
        }

        .law-card:hover .submenu,
        .law-card:focus-within .submenu,
        .law-card.open .submenu {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .submenu a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 12px;
          border-radius: 11px;
          text-decoration: none;
          color: #35314c;
          background: #faf8ff;
          font-size: 13px;
          font-weight: 650;
        }

        .submenu a:hover {
          background: #f3edff;
          color: #6738e8;
        }

        .submenu a span {
          color: #a69abf;
        }

        .other-strip {
          margin-top: 20px;
          border: 1px dashed #e8d9c7;
          border-radius: 17px;
          padding: 17px 19px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          background: #fffdf9;
        }

        .other-strip strong {
          font-size: 16px;
        }

        .other-strip p {
          margin: 4px 0 0;
          color: #77758b;
          font-size: 12px;
        }

        .other-link {
          white-space: nowrap;
          text-decoration: none;
          color: #5d35d8;
          font-weight: 700;
          font-size: 13px;
        }

        .tip {
          margin-top: 17px;
          color: #8e8998;
          font-size: 12px;
          text-align: center;
        }

        .mobile-hint {
          display: none;
        }

        @media (max-width: 900px) {
          .nav { display: none; }
          .layout { grid-template-columns: 1fr; }
          .sidebar { position: static; }
          .side-list { display: grid; grid-template-columns: repeat(2, 1fr); column-gap: 18px; }
          .search { width: 220px; }
          .main-panel { padding: 20px; }
        }

        @media (max-width: 600px) {
          .topbar {
            height: 70px;
            padding: 0 16px;
          }
          .brand { min-width: 0; }
          .brand-mark { width: 42px; height: 42px; }
          .brand-name { font-size: 20px; }
          .tagline { font-size: 8px; }
          .search { display: none; }
          .profile { display: none; }
          .wrap { padding: 28px 15px 48px; }
          .law-grid { grid-template-columns: 1fr; }
          .main-panel { padding: 16px; }
          .section-pill { font-size: 19px; padding: 9px 17px; }
          .law-card { min-height: 150px; }
          .submenu {
            grid-template-columns: 1fr;
            position: relative;
            left: auto;
            right: auto;
            top: auto;
            margin-top: 14px;
            display: none;
            opacity: 1;
            visibility: visible;
            transform: none;
          }
          .law-card.open .submenu { display: grid; }
          .mobile-hint { display: block; font-size: 11px; color: #9b94a5; margin-top: 6px; }
          .hover-hint { display: none; }
          .other-strip { align-items: flex-start; flex-direction: column; }
        }
      `}</style>

      <div className="LexQuora-page">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">⚖</div>
            <div>
              <div className="brand-name">Lex<span>Quora</span></div>
              <div className="tagline">LEARN WITHOUT LIMITS</div>
            </div>
          </div>

          <nav className="nav">
            <a href="#">Explore Courses</a>
            <a className="active" href="#laws">Laws</a>
            <a href="#">Instructors</a>
            <a href="#">Why LexQuora</a>
          </nav>

          <div className="search">⌕ &nbsp; Search laws, topics...</div>
          <div className="profile">
            <div className="avatar">N</div>
            ⌄
          </div>
        </header>

        <main className="wrap">
          <span className="eyebrow">⚖ &nbsp; LAW LIBRARY</span>

          <div className="intro">
            <h1>Explore Laws by Category</h1>
            <p>
              Choose a legal domain to explore its principal Acts, legislation, study material, case laws,
              MCQs and previous-year questions.
            </p>
          </div>

          <div className="layout">
            <aside className="sidebar">
              <div className="side-title">
                <div className="side-icon">📚</div>
                Base Acts
              </div>

              <div className="side-list">
                <a href="#">
                  Constitution of India <small>›</small>
                </a>
                <a href="#">
                  BNS <small>›</small>
                </a>
                <a href="#">
                  BNSS <small>›</small>
                </a>
                <a href="#">
                  BSA <small>›</small>
                </a>
              </div>

              <div className="side-note">
                Build your foundation with essential bare acts. Select an Act to access its sections, notes and
                practice questions.
              </div>
            </aside>

            <section className="main-panel" id="laws">
              <div className="section-head">
                <div className="section-pill">⚖ &nbsp; Laws</div>
              </div>

              <div className="law-grid">
                {lawSections.map((section, index) => (
                  <article
                    key={section.name}
                    className={`law-card ${openCard === index ? 'open' : ''}`}
                    tabIndex={0}
                    onClick={() => handleCardToggle(index)}
                    onKeyDown={(event) => handleCardKeyDown(event, index)}
                  >
                    <div className="law-top">
                      <div className="law-icon">{section.icon}</div>
                      <div className="law-name">{section.name}</div>
                    </div>

                    <p className="law-desc">{section.description}</p>
                    <div className="hover-hint">{section.hint}</div>

                    <div className="submenu">
                      {section.submenu.map((item) => (
                        <a href="#" key={item}>
                          {item} <span>›</span>
                        </a>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="other-strip">
                <div>
                  <strong>Find a specific Act?</strong>
                  <p>Use the search to quickly locate legislation, sections or topics.</p>
                </div>
                <a className="other-link" href="#">
                  Browse all Acts&nbsp; →
                </a>
              </div>

              <div className="tip">Move your cursor over a law category to reveal its sub-laws. On mobile, tap a category.</div>
              <div className="mobile-hint">Tip: Tap a category card to expand its sub-laws.</div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}
