import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import ScrollReveal from './ScrollReveal/ScrollReveal'

const Layout = () => {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <div className="page-transition" key={`${location.pathname}${location.search}`}>
        <ScrollReveal>
          <Outlet />
        </ScrollReveal>
      </div>
      <Footer />
    </>
  )
}

export default Layout
