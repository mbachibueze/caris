'use client';


import React from "react";
import NavigationBar from "@/components/ui/mainNavBar";
import { CTA, Doctors, Hero, Service, Special } from "@/components/ui/cards";
import Footer from "@/components/ui/footer";
import ScrollToTop from "@/components/ui/scrollToTop";

export default function Home() {


  return (
    <div>
      <ScrollToTop/>
      <NavigationBar />

      <section id="home">
        <Hero
          head="get easy access to"
          head2="medical services"
          description="Sustaining a healthy life has been made easier. Connect with top healthcare professionals across various specialties and easily schedule appointments online."
          btn="Book an Appointment"
          imageSrc="/service-top-img-5.webp"
        />
      </section>

      <section id="special">
        <Special />
      </section>

      <section id="services">
        <Service />
      </section>

      <section id="doctors">
        <Doctors />
      </section>

      <section id="about">
        <CTA />
      </section>

      <Footer/>
    </div>
  );
}
