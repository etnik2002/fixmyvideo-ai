import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Film,
  Settings, 
  LogOut,
  Shield,
  Users,
  BarChart3,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  
  return (
    <aside className="bg-fmv-carbon-darker h-full border-r border-fmv-carbon-light/20 overflow-y-auto no-scrollbar">
      <div className="py-4">
        {/* Mobile Logo */}
        <div className="px-4 pb-4 border-b border-fmv-carbon-light/20 md:hidden">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-red-500 mr-2" />
            <span className="text-white font-medium">Admin Panel</span>
          </div>
        </div>
        
        <nav className="mt-4 space-y-1 px-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-fmv-carbon text-red-500 border-l-2 border-red-500' 
                  : 'text-fmv-silk hover:bg-fmv-carbon hover:text-red-500'
              }`
            }
          >
            <Home size={18} className="mr-3" />
            Dashboard
          </NavLink>
          
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-fmv-carbon text-red-500 border-l-2 border-red-500' 
                  : 'text-fmv-silk hover:bg-fmv-carbon hover:text-red-500'
              }`
            }
          >
            <ShoppingBag size={18} className="mr-3" />
            Bestellungen
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-fmv-carbon text-red-500 border-l-2 border-red-500' 
                  : 'text-fmv-silk hover:bg-fmv-carbon hover:text-red-500'
              }`
            }
          >
            <Users size={18} className="mr-3" />
            Kunden
          </NavLink>
          
          <NavLink
            to="/admin/videos"
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-fmv-carbon text-red-500 border-l-2 border-red-500' 
                  : 'text-fmv-silk hover:bg-fmv-carbon hover:text-red-500'
              }`
            }
          >
            <Film size={18} className="mr-3" />
            Videos
          </NavLink>
          
          <NavLink
            to="/admin/analytics"
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-fmv-carbon text-red-500 border-l-2 border-red-500' 
                  : 'text-fmv-silk hover:bg-fmv-carbon hover:text-red-500'
              }`
            }
          >
            <BarChart3 size={18} className="mr-3" />
            Analysen
          </NavLink>
          
          <NavLink
            to="/admin/payments"
            className={({ isActive }) => 
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'bg-fmv-carbon text-red-500 border-l-2 border-red-500' 
                  : 'text-fmv-silk hover:bg-fmv-carbon hover:text-red-500'
              }`
            }
          >
            <CreditCard size={18} className="mr-3" />
            Zahlungen
          </NavLink>
          <div className="pt-4 mt-4 border-t border-fmv-carbon-light/20 px-4">
            <Link
              to="/dashboard"
              className="flex items-center justify-center py-2 px-4 bg-fmv-carbon-light/20 text-white rounded-md hover:bg-fmv-carbon-light/30 transition-colors"
            >
              <Settings size={16} className="mr-2" />
              Zum Dashboard
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

export default AdminSidebar;