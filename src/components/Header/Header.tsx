import './Header.scss'

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__container">
        <a href="/" className="site-header__brand">
          <span className="site-header__logo">IF</span>

          <span className="site-header__name">
            ImageForge
          </span>
        </a>

        <div className="site-header__tagline">
          Bulk Image Converter
        </div>
      </div>
    </header>
  )
}

export default Header