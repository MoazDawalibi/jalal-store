import { About } from './sections/About'
import { Categories } from './sections/Categories'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Featured } from './sections/Featured'
import { Footer } from './sections/Footer'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Products } from './sections/Products'
import { useScrollReveal } from './hooks/useScrollReveal'

export default function App() {
  useScrollReveal()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Categories />
        <Featured />
        <Products />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
