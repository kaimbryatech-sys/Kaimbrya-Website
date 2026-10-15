import Link from "next/link";
import { config, platformLinks, solutionLinks } from "@/content/site";
import { LogoMark } from "./icons";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href="/" className="wordmark" style={{ color: "#fff" }} prefetch={false}><LogoMark /><span>Kaimbrya</span></Link>
            <p style={{ marginTop: 14, maxWidth: 320 }}>Community management, reimagined. Made in Jamaica for the way Jamaican communities work.</p>
          </div>
          <nav aria-labelledby="f-platform">
            <h2 id="f-platform">Platform</h2>
            <ul>{platformLinks.map((l) => <li key={l.href}><a href={l.href}>{l.title}</a></li>)}</ul>
          </nav>
          <nav aria-labelledby="f-solutions">
            <h2 id="f-solutions">Solutions</h2>
            <ul>{solutionLinks.map((l) => <li key={l.href}><a href={l.href}>{l.title}</a></li>)}</ul>
          </nav>
          <nav aria-labelledby="f-start">
            <h2 id="f-start">Get started</h2>
            <ul>
              <li><Link href="/demo/" prefetch={false}>Book a demo</Link></li>
              {config.appSignInUrl ? <li><a href={config.appSignInUrl}>Sign in</a></li> : null}
            </ul>
          </nav>
        </div>
        <div className="footer-base">
          <span>© 2026 Kaimbrya</span>
          <span>App screens show fictional demonstration data.</span>
        </div>
      </div>
    </footer>
  );
}
