import clsx from "clsx";
import Link from "next/link";
import { IconType } from "react-icons";

interface DesktopItemProps {
  href: string;
  label: string;
  icon: IconType;
  isActive?: boolean;
  onClick?: () => void;
}

const DesktopItem = ({ href, label, icon: Icon, isActive, onClick: action }: DesktopItemProps) => {
  return (
    <li onClick={() => action && action()} key={label}>
      <Link
        href={href}
        className={clsx(
          `group 
          flex 
          gap-x-3 
          rounded-md 
          p-3 
          text-sm 
          leading-6 
          font-semibold 
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
    </li>
  );
};

export default DesktopItem;
