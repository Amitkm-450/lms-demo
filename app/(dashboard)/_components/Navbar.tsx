import NavbarRoutes from "@/components/navbar-routes";
import MobileSidebar from "./MobildeSidebar";

const Navbar = () => {
    return ( 
        <div className="p-4 border-b-2 h-full flex items-center bg-white shadow-sm">
            < MobileSidebar/>
            <NavbarRoutes />
        </div>
     );
}
 
export default Navbar;