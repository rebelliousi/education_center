import { div } from "framer-motion/client"
import Navbar from "./components/Navbar"
import Hero from "./sections/HeroSection"
import Courses from "./sections/Courses"
import Activities from "./sections/Activities"
import Videos from "./sections/Videos"
import Teachers from "./sections/Teachers"
import Discounts from "./sections/Discount"



export const App=()=>{
  return(
    <div >
      <Navbar/>
      <Hero/>
      <Courses/>
           <div className="bg-gradient-to-b from-white via-blue-50 to-blue-100">
        <Activities/>
        <Videos/>
      </div>
      <Teachers/>
      <Discounts/>
    </div>
  )
}