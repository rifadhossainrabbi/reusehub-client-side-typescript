export const getNavLinks = (role?: string) => {
  const commonLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Gadgets', path: '/explore' },
  ];

  const adminLinks = [
    ...commonLinks,
    { name: 'Manage Users', path: '/admin/users' },
    { name: 'Manage Products', path: '/admin/products' },
  ];

  const userLinks = [
    ...commonLinks,
    { name: 'Add Product', path: '/product/add' },
    { name: 'My Favorites', path: '/my-favorites' },
  ];

  const publicLinks = [...commonLinks];

  const finalLinks =
    role === 'admin' ? adminLinks : role === 'user' ? userLinks : publicLinks;

  // সবশেষে About যোগ করা হলো
  return [...finalLinks, { name: 'About', path: '/about' }];
};
