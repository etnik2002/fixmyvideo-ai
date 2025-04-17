import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Film,
  Settings, 
  LogOut,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardSidebar: React.FC = () => {
  const { logout, isAdmin } = useAuth();
  
  return (
    <aside className="bg-fmv-carbon-darker h-full border-r border-fmv-carbon-light/20 overflow-y-auto no-scrollbar">
      <div className="py-4">
        {/* Mobile Logo */}
        <div className="px-4 pb-4 border-b border-fmv-carbon-light/20 md:hidden">
          <Link to="/" className="block">
            <img 
              src="https://i.imgur.com/woSig5t.png" 
              alt="FixMyVideo Logo" 
              className="h-10" 
            />
          </Link>
        </div>
        
        <nav className="mt-4 space-y-1 px-2">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-fmv-carbon text-fmv-orange border-l-2 border-fmv-orange' 
                  : 'text-fmv-silk hover:bg-fmv-carbon hover:text-fmv-orange'
              }`
            }
          >
            <Home size={18} className="mr-3" />
            Dashboard
          </NavLink>
          
          <NavLink
            to="/dashboard/orders"
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-fmv-carbon text-fmv-orange border-l-2 border-fmv-orange' 
                  : 'text-fmv-silk hover:bg-fmv-carbon hover:text-fmv-orange'
              }`
            }
          >
            <ShoppingBag size={18} className="mr-3" />
            Bestellungen
          </NavLink>
          
          <NavLink
            to="/dashboard/videos"
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-fmv-carbon text-fmv-orange border-l-2 border-fmv-orange' 
                  : 'text-fmv-silk hover:bg-fmv-carbon hover:text-fmv-orange'
              }`
            }
          >
            <Film size={18} className="mr-3" />
            Meine Videos
          </NavLink>

          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-fmv-carbon text-fmv-orange border-l-2 border-fmv-orange' 
                  : 'text-fmv-silk hover:bg-fmv-carbon hover:text-fmv-orange'
              }`
            }
          >
            <Settings size={18} className="mr-3" />
            Einstellungen
          </NavLink>

          <div className="pt-4 mt-4 border-t border-fmv-carbon-light/20 px-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center justify-center py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors mb-3"
              >
                <Shield size={16} className="mr-2" />
                Admin-Bereich
              </Link>
            )}
            <Link
              to="/bestellen"
              className="flex items-center justify-center py-2 px-4 bg-fmv-orange text-white rounded-md hover:bg-fmv-orange-light transition-colors"
            >
              <Film size={16} className="mr-2" />
              Neues Video
            </Link>
          </div>
          
          <div className="hidden md:block mt-6">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-fmv-carbon rounded-md transition-colors"
            >
              <LogOut size={18} className="mr-3" />
              Abmelden
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;