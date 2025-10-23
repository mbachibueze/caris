/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

import { RiCalendarScheduleLine } from "react-icons/ri";
import Link from "next/link";
import {
  BsCalendar2Check,
  BsFillHeartPulseFill,
  BsHospital,
  BsPeople,
} from "react-icons/bs";
import { MdOutlineStar } from "react-icons/md";

interface HeroProps {
  subHead?: string;
  head: string;
  head2: string;
  description: string;
  imageSrc?: string;
  btn: string;
}

export const Hero: React.FC<HeroProps> = ({
  head,
  head2,
  description,
  btn,
}) => {
  return (
    <div className=" lg:h-[99vh]  md:py-24 py-14  relative transition-all duration-1000">
      <div className="lg:grid lg:grid-cols-2 gap-2 flex flex-col  justify-between items-center  w-[90%]  m-auto m text-[#0d1321]  ">
        <div className=" flex flex-col gap-3">
          <h5 className="text-lg font-medium text-[#327cff]">
            Healthy <span className="text-black">Living, Made</span> Easy
          </h5>
          <div className="flex flex-col gap-2">
            <h1 className="capitalize font-medium lg:text-7xl md:text-7xl sm:text-6xl text-4xl  ">
              {head} <span className="text-[#327cff]">{head2}</span>{" "}
            </h1>

            <p className="lg:text-lg w-[100%] md:text-xl sm:text-lg  leading-relaxed lg:w-[90%] font-medium">
              {description}
            </p>
          </div>

          <Link href="../signIn">
            <button className="bg-[#1b5af5] text-white p-2 w-fit px-8 rounded-full cursor-pointer flex items-center gap-2 font-medium mb-3">
              <RiCalendarScheduleLine size={25} /> {btn}
            </button>
          </Link>

          <div className="flex flex-col gap-2">
            <hr className="text-gray-500" />
            <div className="grid grid-cols-3 gap-3 [&_h1]:font-bold [&_p]:text-xs ">
              <div>
                <h1>2k+</h1>
                <p>Vaccinations</p>
              </div>
              <div>
                <h1>95%</h1>
                <p>Positive Feedbacks</p>
              </div>
              <div>
                <h1>5+</h1>
                <p>Years of Experience</p>
              </div>
            </div>
          </div>
        </div>

        <div className=" grid place-items-center">
          <Image
            src="/home.svg"
            alt="blob"
            width={400}
            height={300}
            loading="lazy"
            className="sm:w-[60%] w-[80%]"
          />
        </div>
      </div>
    </div>
  );
};

export const Special = () => {
  return (
    <div className="my-15 md:w-[90%] w-[95%] mx-auto grid place-items-center ">
      <div className="grid lg:grid-cols-2 items-center gap-15 w-full">
        <div className=" w-fit h-[100%] mx-auto md:p-5 p-8">
          <div className="border-dashed border border-[#1b5af5] rounded-2xl h-[100%] relative">
            <Image
              src="/kid.jpg"
              alt="kid"
              width={300}
              height={300}
              loading="lazy"
              className="rounded-2xl ml-5 mt-5 h-[100%] w-[100%] border-white border shadow-2xl"
            />
          </div>
        </div>
        <div>
          <div className=" flex flex-col gap-2 py-5 p-3 text-center md:text-left items-center sm:items-start">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-center">About us</h3>
              <h1 className="capitalize font-bold md:text-5xl text-3xl">
                What makes us special{" "}
              </h1>
              <p className="text-gray-600 font-medium md:text-base text-sm">
                At Caris+, we are passionate revolutionizing healthcare by
                bridging the gap between patients and top healthcare
                professionals
              </p>
            </div>

            <div className="mt-8 mx-">
              <ul className="font-medium flex flex-col gap-3 [&_span]:bg-blue-700 [&_span]:w-6 [&_span]:h-6 [&_span]:rounded-full [&_li]:flex [&_li]:items-center [&_li]:gap-2 ">
                <li>
                  <span></span> Patient-Centered Care
                </li>
                <li>
                  <span></span> Experienced Medical Professionals
                </li>
                <li>
                  <span></span> 24/7 Medical Emergency
                </li>
                <li>
                  <span></span> Equipped Facilities
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Service = () => {
  return (
    <section className="w-[90%]  mx-auto  my-15 py-5 flex flex-col gap-10">
      <div className="text-center">
        <h3 className="uppercase font-semibold text-lg text-[#1b5af5] ">
          services
        </h3>
        <h1 className="capitalize font-bold text-5xl">what we offer</h1>
        <p className="text-gray-600">
          At Caris+, we offer a range of services designed to make healthcare
          accessible, convenient, and patient-centered. Here's how we can help
          you:
        </p>
      </div>

      {/* Serivces */}
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5 [&_main]:cursor-pointer  [&_main]:border-white [&_main]:p-5 [&_main]:py-10 [&_main]:w-fit [&_main]:flex [&_main]:flex-col [&_main]:items-center [&_main]:text-center [&_main]:gap-2  [&_div]:p-5 [&_div]:rounded-full [&h1]:font-semibold [&_h1]:text-lg ">
        <main className="cardShadow">
          <div className="bg-[#bfdbfe]">
            <BsCalendar2Check size={40} color="#2563eb" />
          </div>
          <h1>Vaccination Scheduling</h1>
          <p>
            Easily book and manage vaccination appointments for your child with
            certified healthcare professionals.
          </p>
        </main>

        <main className="cardShadow">
          <div className="bg-[#d1fae5]">
            <BsPeople size={40} color="#10b981" />
          </div>
          <h1>Paediatric Consultation</h1>
          <p>
            Connect instantly with paediatric specialists for expert advice on
            your child’s health and development.
          </p>
        </main>

        <main className="cardShadow">
          <div className="bg-[#fef3c7]">
            <BsFillHeartPulseFill size={40} color="#f59e0b" />
          </div>
          <h1>Immunisation Tracking</h1>
          <p>
            Track your child’s vaccination history and receive reminders for
            upcoming doses.
          </p>
        </main>

        {/* <main className="cardShadow">
          <div className="bg-[#ede9fe]" >
            <BsCapsule  size={40} color="#8b5cf6" />
          </div>
          <h1>Pharmacy Access</h1>
          <p>Order prescribed medications and vaccines from verified pharmacies with quick doorstep delivery.</p>
        </main> */}

        <main className="cardShadow">
          <div className="bg-[#fee2e2]">
            <BsHospital size={40} color="#ef4444" />
          </div>
          <h1>Clinic Locator</h1>
          <p>
            Find nearby hospitals and vaccination centres with available
            paediatricians for in-person appointments.
          </p>
        </main>

        {/* <main className="cardShadow">
          <div className="bg-[#fbcfe8]" >
            <BsFillHeartPulseFill size={40} color="#ec4899" />
          </div>
          <h1>Health Education</h1>
          <p>Access verified articles and guides to stay informed about vaccination schedules, safety, and benefits.</p>
        </main> */}
      </div>
    </section>
  );
};

interface doctors {
  name: string;
  specialty: string;
  imageSrc: string;
}

export const DoctorCard: React.FC<doctors> = ({
  name,
  specialty,
  imageSrc,
}) => {
  return (
    <article className="text-center flex flex-col gap-2">
      <div className="bg-[#59a1ff] rounded-2xl grid place-items-center shadow-lg border border-white">
        <Image
          src={imageSrc}
          alt={`Doctor ${name}`}
          width={200}
          height={300}
          loading="lazy"
        />
      </div>
      <div className="text-center flex flex-col items-center [&_p]:text-gray-600  [&_p]:text-sm">
        <h2 className="capitalize font-semibold text-xl">Doctor {name}</h2>
        <p className="capitalize">{specialty}</p>
        <p className="flex items-center gap-2 ">
          <MdOutlineStar /> 4.5 (900 Reviews)
        </p>
      </div>
    </article>
  );
};

export const Doctors = () => {
  const doctorList = [
    {
      name: "Dr Ethan Walker",
      specialty: "Cardiologist",
      imageSrc: "/doctor.svg",
    },
    {
      name: "Sophia Carter",
      specialty: "Paediatrician",
      imageSrc: "/doctor5.svg",
    },
    {
      name: "James Okafor",
      specialty: "Immunologist",
      imageSrc: "/doctor.svg",
    },
    {
      name: "Ava Johnson",
      specialty: "Family Physician",
      imageSrc: "/doctor5.svg",
    },
  ];

  return (
    <section className="lg:w-[90vw] w-[95%] mx-auto  my-15 ">
      <main className="flex flex-col gap-10">
        <div className="text-center ">
          <h3 className="uppercase font-semibold text-lg text-[#1b5af5] ">
            doctors
          </h3>
          <h1 className="capitalize font-bold text-5xl">
            Meet our professional doctors
          </h1>
        </div>
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-5 w-[85%] mx-auto">
          {doctorList.map((doc, index) => (
            <DoctorCard
              key={index}
              name={doc.name}
              specialty={doc.specialty}
              imageSrc={doc.imageSrc}
            />
          ))}
        </div>
      </main>
    </section>
  );
};

export const CTA = () => {
  return (
    <div className="w-[90%] mx-auto bg-[#bcdaff] text-center my-15 rounded-lg p-10 py-20 flex flex-col gap-5 items-center">
      <h1 className="font-bold lg:text-6xl md:text-5xl text-3xl">
        Protect your{" "}
        <span className="text-[#327cff]">child’s future — one vaccine</span> at
        a time.
      </h1>
      <p className="md:text-xl ">
        Join thousands of parents who trust our platform to connect with
        certified doctors and schedule vaccinations easily. Stay on track, stay
        protected.
      </p>
      <Link href="../signIn">
        <button className="bg-[#1b5af5] text-white  p-4 px-10 w-fit text-center rounded-lg font-medium cursor-pointer">
          Get Started Today
        </button>
      </Link>
    </div>
  );
};
