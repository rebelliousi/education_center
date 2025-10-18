import { div } from "framer-motion/client"
import Navbar from "./components/Navbar"
import Hero from "./sections/HeroSection"

export const App=()=>{
  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-w hite to-blue-50">
      <Navbar/>
      <Hero/>

    </div>
  )
}