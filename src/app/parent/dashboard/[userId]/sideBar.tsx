import Sidebar from "@/components/ui/sideBar";
import { MdDashboard, MdPerson } from "react-icons/md";
import { GrSchedule } from "react-icons/gr";
import { HiChartBarSquare } from "react-icons/hi2";
import { CiSettings } from "react-icons/ci";

const ParentSidebar = ({ userId }: { userId: string }) => {
  const links = [
    {
      href: `/parent/dashboard/${userId}`,
      label: "Dashboard",
      icon: <MdDashboard size={20} />,
    },
    {
      href: `/parent/dashboard/${userId}/children`,
      label: "My Children",
      icon: <MdPerson size={20} />,
    },
    {
      href: `/parent/dashboard/${userId}/schedule`,
      label: "Vaccination Schedule",
      icon: <GrSchedule size={18} />,
    },
    {
      href: `/parent/dashboard/${userId}/history`,
      label: "Vaccination History",
      icon: <HiChartBarSquare size={20} />,
    },
    {
      href: `/parent/dashboard/${userId}/settings`,
      label: "Settings",
      icon: <CiSettings size={20} />,
    },
  ];

  return <Sidebar links={links} title="Caris+" />;
};

export default ParentSidebar;
