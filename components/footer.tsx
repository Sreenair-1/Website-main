import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <div className="mb-4 text-lg font-semibold tracking-tight">
              IndusOpa<span className="text-primary">.</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Operations and supply chain consulting for teams that want clearer decisions and better execution.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/diagnostics" className="text-muted-foreground transition-colors hover:text-foreground">
                  Diagnostics
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-muted-foreground transition-colors hover:text-foreground">
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-muted-foreground transition-colors hover:text-foreground">
                  Solutions
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-muted-foreground transition-colors hover:text-foreground">
                  Consulting
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-muted-foreground transition-colors hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} IndusOpa Consulting. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.29 20h7.97l-.92-4.3h2.68l.04-.46h-2.56l.45-2.11h2.02l.04-.46H15.3l.45-2.11h2.02l.04-.46h-2.56l.92-4.3h-7.97l-.92 4.3H7.85l-.04.46h2.56l-.45 2.11H8.9l-.04.46h2.56l-.45 2.11H9.35l-.04.46h2.56l-.92 4.3z" />
              </svg>
            </a>
            <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.487 1.348C1.114 1.348.5 2.017.5 2.883v14.234c0 .866.614 1.535 1.987 1.535h14.026c1.373 0 1.987-.669 1.987-1.535V2.883c0-.866-.614-1.535-1.987-1.535H2.487zm1.244 15.667h-2.48V7.116h2.48v10.899zm-1.24-12.37c-.794 0-1.288-.52-1.288-1.173 0-.652.494-1.173 1.288-1.173.794 0 1.288.521 1.288 1.173 0 .652-.494 1.173-1.288 1.173zm13.003 12.37h-2.48v-5.303c0-1.323-.474-2.225-1.667-2.225-.909 0-1.449.61-1.687 1.198-.087.211-.109.505-.109.8v5.53h-2.48s.033-8.984 0-9.899h2.48v1.403c.438-.675 1.221-1.634 2.973-1.634 2.171 0 3.79 1.415 3.79 4.459v5.671z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
