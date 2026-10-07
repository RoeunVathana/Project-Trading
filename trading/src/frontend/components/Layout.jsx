import { Outlet } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import ScrollReveal from './ScrollReveal/ScrollReveal'

const Layout = () => {
  return (
    <>
      <Navbar />
      <ScrollReveal>
        <Outlet />
      </ScrollReveal>
      <Footer />
    </>
  )
}

export default Layout
