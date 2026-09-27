import './Header.scss'

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__container">
        <a className="site-header__brand" href="/" aria-label="ImageForge">
          <img
            className="site-header__logo"
            src="/imageforge-icon.png"
            alt="ImageForge Logo"
          />

          <span className="site-header__name">
            Image<span>Forge</span>
          </span>
        </a>

        <div className="site-header__credit">
          <span>Built with ❤️ </span>

          <span>
            {' '}
            <a
              className="site-header__creator"
              href="https://dedicateddesigner.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              DedicatedDesigner
            </a>
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header
