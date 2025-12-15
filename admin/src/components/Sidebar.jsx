import { useUser } from "@clerk/clerk-react";
import { ShoppingBagIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { NAVIGATION } from "./Navbar";
const Sidebar = () => {
    const location  = useLocation();
    const { user } = useUser();
    const isActive = location.pathname;
  return (
    <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
            <div className="p-4 w-full">
            <div className="flex items-center gap-3">
                <div className="size-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
                    <ShoppingBagIcon className="text-primary-content size-6" />
                </div>
                <span className="text-xl font-bold is-drawer-close:hidden"> Admin</span>
            </div>
        </div>
        {/* sidebar content */}
        <ul className="menu w-full grow flex flex-col gap-2">
            {
                NAVIGATION.map(item => {
                    
                    return (
                        <li key={item.path}>
                            <Link to={item.path} className={`is-drawer-close:tooltip-right
                                ${isActive === item.path ? "bg-primary text-primary-content": ""}
                                `}>
                                    {item.icon}
                                    <span className="is-drawer-close:hidden">{item.name}</span>
                            </Link>
                        </li>
                    )
                })
            }
        </ul>
        <div className="p-4 w-full">
            <div className="flex item-center gap-3">
                <div className="avatar shrink-0">
                    <img src={user?.imageUrl} alt={user?.name} className="size-10 rounded-full"/>
                </div>
                <div className="flex-1 min-w-0 is-drawer-close:hidden">
                    <p className="text-sm font-semibold truncate">
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs opacity-60 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Sidebar