import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div className="bg-[#1739b6]">
      <div className="  w-[90%] mx-auto text-white  pt-15  pb-1 ">
        <div className="grid lg:grid-cols-3 gap-10 grid-cols-1 justify-between mb-5">
          <div className="flex flex-col gap-2">
            <div className="font-bold text-2xl   flex items-center gap-2 mb-2">
              <Image
                src="whiteLogo.svg"
                alt="CareTrack Logo"
                width={20}
                height={20}
              />
              CareTrack
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              VaccinateEase bridges the gap between parents and healthcare
              professionals, making child immunisation simple, timely, and
              reliable. We help families connect with trusted doctors, schedule
              vaccination appointments, and keep accurate health records — all
              in one place. Our mission is to ensure every child receives
              essential vaccines safely and on time while empowering parents
              with reminders, access to expert guidance, and digital health
              tracking. Because every child deserves a healthy start.
            </p>

            <h2 className="font-semibold text-lg">
              Subscribe to Our Newsletter
            </h2>

            <div
              className="flex  items-center gap-2
              w-fit p-1 rounded-full text-gray-800 bg-white sm:text-base text-sm"
            >
              <input
                type="text"
                placeholder="Enter email"
                className="outline-none p-2 px-4 rounded-full w-[90%] lg:w-full"
              />
              <button
                className="bg-[#1739b6] rounded-full px-6 text-white p-2 cursor-pointer border  
              "
              >
                Subscribe
              </button>
            </div>
          </div>

          <div className=" lg:col-span-2 gap-1 flex lg:justify-around justify-between  ">
            <div className="flex flex-col gap-2">
              <h5 className="font-semibold">Services</h5>
              <ul className="space-y-2 text-gray-300 lg:text-lg sm:text-base text-xs">
                <li>Vaccination Scheduling</li>
                <li>Paediatric Consultation</li>
                <li>Immunisation Reminders</li>
                <li>Health Record Tracking</li>
                <li>Doctor Chat</li>
                <li>Family Health Management</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h5 className="font-semibold">Company</h5>
              <ul className="space-y-2 text-gray-300  lg:text-lg sm:text-base text-xs">
                <li>About Us</li>
                <li>Our Mission</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Press & Media</li>
                <li>Contact Us</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h5 className="font-semibold">Contact Us</h5>
              <ul className="space-y-2 text-gray-300 lg:text-lg sm:text-base text-xs">
                <li>support@caris.com</li>
                <li>info@caris.com</li>
                <li>+1 (234) 987-6783 </li>
                <li>+1 (415) 213-4132</li>
              </ul>
            </div>
          </div>
        </div>

        <hr />

        <p className="text-gray-400  text-xs  text-center leading-loose py-2">
          Copyright © 2025{" "}
          <span className="text-white cursor-pointer hover:text-[#c5832b] ">
            Caris+ Technologies
          </span>{" "}
          All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
