import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { userImage } from "../../assets/assets";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../redux/features/auth/authApi";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner.jsx";
import { baseApi } from "../../redux/api/baseApi";

export default function UserDropdown({ user, role }) {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutApi, { isLoading }] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // call backend logout endpoint
      const res = await logoutApi(role).unwrap();
      dispatch(baseApi.util.resetApiState());
      // clear local Redux state & localStorage
      dispatch(logoutAction());
      toast.success(res?.message || "Logged out successfully ");
      // redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed ");
      dispatch(baseApi.util.resetApiState());
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-8 w-8">
          <img src={userImage} alt="User" />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {user?.name}
        </span>
        <svg
          className={`stroke-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm ">
            {user?.name}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 ">
            {user?.email}
          </span>
        </div>

        <Link
          to={`/${role}/profile`}
          className="flex items-center gap-3 px-3 py-2 mt-3 text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 "
        >
          <UserCircle className="w-4.5 h-4.5" />
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 "
        >
          {isLoading ? <Spinner /> : <LogOut className="w-4.5 h-4.5" />}
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </Dropdown>
    </div>
  );
}
