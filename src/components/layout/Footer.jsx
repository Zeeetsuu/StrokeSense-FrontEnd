import { useLocation } from 'react-router-dom'

export default function Footer() {
  const { pathname } = useLocation()

  if (pathname === '/') {
    return (
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-muted">
        <p className="font-medium text-text">StrokeSense</p>
        <p className="mt-1">Team ID CC26-PSU036</p>
      </footer>
    )
  }

  return (
    <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-muted">
      StrokeSense · CC26-PSU036
    </footer>
  )
}
