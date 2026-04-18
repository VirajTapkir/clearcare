export default function Header({ onLogoClick, userProfile }) {
  return (
    <header className="header">
      <div className="header-inner">
        <button className="logo-btn" onClick={onLogoClick}>
          <span className="logo-icon">+</span>
          <span className="logo-text">ClearCare</span>
        </button>
        <nav className="header-nav">
          {userProfile && userProfile.carrier ? (
            <div className="header-profile">
              <span
                className="header-profile-logo"
                style={{ background: userProfile.carrier.color }}
                title={userProfile.carrier.name}
              >
                {userProfile.carrier.logoText}
              </span>
              <span className="header-tagline">
                {userProfile.plan?.name || userProfile.carrier.name}
              </span>
            </div>
          ) : (
            <span className="header-tagline">Care clarity for international students</span>
          )}
        </nav>
      </div>
    </header>
  );
}
