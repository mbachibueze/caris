"use client";

import React from "react";
import NavigationBar from "@/components/ui/mainNavBar";
import {
  CTA,
  Doctors,
  Hero,
  Service,
  Special,
} from "@/components/ui/homePageComponents";
import Footer from "@/components/ui/footer";
import ScrollToTop from "@/components/ui/scrollToTop";

export default function Home() {
  return (
    <div>
      <ScrollToTop />
      <NavigationBar />

      {/* Hero section */}
      <section id="home">
        <Hero
          head="get easy access to"
          head2="medical services"
          description="Sustaining a healthy life has been made easier. Connect with top healthcare professionals across various specialties and easily schedule appointments online."
          btn="Book an Appointment"
          imageSrc="/service-top-img-5.webp"
        />
      </section>

      {/* About */}
      <section id="special">
        <Special />
      </section>

      {/* Services */}
      <section id="services">
        <Service />
      </section>

      {/* <section className="w-[80%] m-auto">
        <div className="p-5 bg-gray-200 rounded-lg flex flex-col gap-3 my-10">
          <h3 className="font-bold text-[#6819fa] ">Hello Adeola</h3>
          <p>An appointment has been schedule for your child: </p>
          <div className="border border-l-4 p-3 bg-gray-300 rounded-lg border-blue-700">
            <strong>Tobi</strong>
            <p>
              <strong>Vaccine:</strong> Polio{" "}
            </p>
            <p>
              <strong>Date:</strong> November 28, 2025{" "}
            </p>
            <p>
              <strong>Time:</strong> 10:00 AM{" "}
            </p>
            <p>
              <strong>Doctor:</strong> Dr. John Smith{" "}
            </p>
          </div>
          <p>
            Thank you for using <strong>CareTrack</strong>
          </p>
          <hr className="border-t border-gray-300" />
          <p className="text-xs">This is an automated message. Do not reply</p>
        </div>
      </section> */}

      {/* Doctors */}
      <section id="doctors">
        <Doctors />
      </section>

      {/* Call to Action */}
      <section id="about">
        <CTA />
      </section>

      <Footer />
    </div>
  );
}
