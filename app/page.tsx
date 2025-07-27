import Header from './components/Header'
import Hero from './components/Hero'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      
      {/* Coming Soon Section */}
      <section className="py-20 px-[5%]">
        <div className="text-center mb-12">
          <h3 className="text-lg mb-4 text-gray">A Pakistani Brand...</h3>
          <h2 className="text-3xl font-primary font-medium">Coming Soon</h2>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}