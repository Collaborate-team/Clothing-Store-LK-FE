'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  LogOut,
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { getTopLevelStats } from '@/app/api/api-service';

const sidebarLinks = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
    subLinks: [
      { title: 'All Products', href: '/admin/products' },
      { title: 'Add Product', href: '/admin/products/add' },
      { title: 'Inventory', href: '/admin/products/inventory' },
    ]
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
    subLinks: [
      { title: 'All Customers', href: '/admin/customers' },
      { title: 'Order History', href: '/admin/customers/history' },
    ]
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
];

const AdminSidebar = ({ adminUser = 'Admin' }: { adminUser?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [lowStockCount, setLowStockCount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getTopLevelStats();
        
        let count = 0;
        if (Array.isArray(stats.lowStock)) {
          count = stats.lowStock.length;
        } else if (typeof stats.lowStock === 'number') {
          count = stats.lowStock;
        } else if (stats.lowStockProducts !== undefined) {
          count = stats.lowStockProducts;
        }
        
        setLowStockCount(count);
      } catch (error) {
        console.error('Error fetching low stock stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  return (
    <div className="w-64 bg-white border-r border-black/5 h-screen sticky top-0 flex flex-col pt-8">
      {/* Brand Logo */}
      <div className="px-8 mb-10">
        <Link href="/admin/dashboard" className="flex flex-col">
          <span className="text-xl font-bold tracking-[0.2em] text-black">ADMIN</span>
          <span className="text-[10px] tracking-[0.3em] text-[#c8b99a] uppercase font-bold -mt-1">{adminUser} Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {sidebarLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <div key={link.title} className="space-y-1">
              <Link
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-sm transition-all duration-300 group ${
                  isActive 
                    ? 'bg-black text-white shadow-lg shadow-black/10' 
                    : 'text-black/60 hover:text-black hover:bg-black/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-[11px] font-bold uppercase tracking-widest">{link.title}</span>
                </div>
                {!link.subLinks && isActive && <ChevronRight size={14} className="animate-pulse" />}
              </Link>

              {/* Sub-links for Products */}
              {link.subLinks && isActive && (
                <div className="pl-11 py-1 space-y-1 border-l ml-6 border-black/5 mt-1">
                  {link.subLinks.map((sub) => (
                    <Link
                      key={sub.title}
                      href={sub.href}
                      className={`block py-1.5 text-[10px] uppercase tracking-widest transition-colors ${
                        pathname === sub.href ? 'text-[#c8b99a] font-bold' : 'text-black/40 hover:text-black'
                      }`}
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Quick Status / Warnings */}
      <div className="px-6 py-6 border-t border-black/5">
        {!isLoading && lowStockCount > 0 && (
          <div className="bg-red-50 p-3 rounded-sm border border-red-100 mb-4 animate-pulse">
               <div className="flex items-center gap-2 text-red-600 mb-1">
                   <AlertCircle size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-tight">Low Stock Alert</span>
               </div>
               <p className="text-[9px] text-red-800 leading-normal font-medium">
                   {lowStockCount} {lowStockCount === 1 ? 'item is' : 'items are'} running out of stock. Update immediately.
               </p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-4 mb-4 text-black/20">
            <Loader2 size={16} className="animate-spin" />
          </div>
        )}

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 border border-red-600/20 text-red-600 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all duration-500 cursor-pointer rounded-sm"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;