import { NavMain } from '@/components/nav-main';
import { NavMid } from '@/components/nav-mid';
import { NavUser } from '@/components/nav-user';
import { NavUsers } from '@/components/nav-users';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Activity, Box, Key, LayoutGrid, UserCheck, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const midNavItems: NavItem[] = [
    {
        title: 'Assets',
        href: '/assets',
        icon: Box,
    },
    {
        title: 'Clients',
        href: '/clients',
        icon: UserCheck,
    },
    // {
    //     title: 'Categories',
    //     href: '/categories',
    //     icon: Box,
    // },
    // {
    //     title: 'Brands',
    //     href: '/brands',
    //     icon: Box,
    // },
];

const usersNavItems: NavItem[] = [
    {
        title: 'User Management',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Roles and Permissions',
        href: '/roles',
        icon: Key,
    },
    {
        title: 'Log Activity',
        href: '/log-activity',
        icon: Activity,
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const isAdmin = auth.roles?.includes('admin');

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMid items={midNavItems} />
                {isAdmin && <NavUsers items={usersNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
