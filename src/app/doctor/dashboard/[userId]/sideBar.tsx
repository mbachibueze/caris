import Sidebar from "@/components/ui/sideBar";
import { MdDashboard, MdPerson } from "react-icons/md";
import { GrSchedule } from "react-icons/gr";
import { HiChartBarSquare } from "react-icons/hi2";
import { CiSettings } from "react-icons/ci";

const DoctorSidebar = ({ userId }: { userId: string }) => {
  const links = [
    {
      href: `/doctor/dashboard/${userId}`,
      label: "Dashboard",
      icon: <MdDashboard size={20} />,
    },
    {
      href: `/doctor/dashboard/${userId}/children`,
      label: "Children",
      icon: <MdPerson size={20} />,
    },
    {
      href: `/doctor/dashboard/${userId}/schedule`,
      label: "Appointments",
      icon: <GrSchedule size={18} />,
    },
    {
      href: `/doctor/dashboard/${userId}/history`,
      label: "History",
      icon: <HiChartBarSquare size={20} />,
    },
    {
      href: `/doctor/dashboard/${userId}/settings`,
      label: "Settings",
      icon: <CiSettings size={20} />,
    },
  ];

  return <Sidebar links={links} />;
};

export default DoctorSidebar;
