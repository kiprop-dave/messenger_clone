import clsx from "clsx";
import Link from "next/link";
import { IconType } from "react-icons";

interface MobileItemProps {
  label: string;
  icon: IconType;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

const MobileItem = ({ label, icon: Icon, href, isActive, onClick: action }: MobileItemProps) => {
  return (
    <Link
      href={href}
      onClick={() => action && action()}
      className={clsx(
        `
          group 
          flex 
          gap-x-3 
          text-sm 
          leading-6 
          font-semibold 
          w-full 
          justify-center 
          p-4 
          text-gray-500 
          hover:text-black 
          hover:bg-gray-100
        `,
        isActive && "bg-gray-100 text-black"
      )}
    >
      <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </Link>
  );
};

export default MobileItem;
