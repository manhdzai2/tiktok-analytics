import { ThemeProvider } from "@/context/ThemeContext"
import { I18nProvider } from "@/context/I18nContext"
import { Dashboard } from "@/components/Dashboard"

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Dashboard />
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App