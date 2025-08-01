import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function UserDropdown({ logout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setOpen(!open);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout(); // Clear user data and tokens
    setOpen(false); // Close dropdown
    navigate('/'); // Navigate to Landing page
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 hover:bg-gray-100 rounded-full"
        aria-label="User menu"
      >
        <User className="w-5 h-5 text-gray-600" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <Link
            to="/profile"
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-b border-gray-100"
            onClick={() => setOpen(false)}
          >
            Profile Information
          </Link>
          <Link
            to="/order-history"
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-b border-gray-100"
            onClick={() => setOpen(false)}
          >
            Order History
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
