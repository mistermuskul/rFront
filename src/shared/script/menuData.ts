export const menuData = [
    {
        name: 'Dashboard',
        path: '/admin',
        icon: 'dashboard',
    },
    {
        name: 'System',
        path: '/admin',
        icon: 'settings',
        children: [
            {
                name: 'Users',
                path: '/admin/users',
                icon: 'people',
            },
            {
                name: 'GreenHouse',
                path: '/admin/greenhouse',
                icon: 'home',
            }
        ],
    },
    
];