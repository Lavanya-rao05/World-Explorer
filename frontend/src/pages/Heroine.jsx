import React from 'react'
import Hero from "./Herosection"
import ActionCard from '../components/ActionCard'
import Footer from '../components/Footer'
import Nav from './Navbar';


const Heroine = () => {
  return (
    <div>
      <Nav/>
      <Hero/>
      <ActionCard/>
      <Footer/>
    </div>
  )
}

export default Heroine
