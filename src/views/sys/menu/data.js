// const data = [
//   {
//     name: '1',
//     timeLine: 100,
//     children: [
//       {
//         name: '1-1',
//         timeLine: 20
//       },
//       {
//         name: '1-2',
//         timeLine: 60,
//         children: [
//           {
//             name: '1-2-1',
//             timeLine: 35
//           },
//           {
//             name: '1-2-2',
//             timeLine: 25
//           }
//         ]
//       }
//     ]
//   },
//   {
//     name: '2',
//     timeLine: 80,
//     children: [
//       {
//         name: '2-1',
//         timeLine: 30
//       },
//       {
//         name: '2-2',
//         timeLine: 50
//       },
//       {
//         name: '2-3',
//         timeLine: 60
//       }
//     ]
//   },
//   {
//     name: '3',
//     timeLine: 40
//   }
// ]

const data = [
  {
    id: 1,
    path: '/sys',
    name: 'sys_osdfae',
    title: '系统管理',
    icon: 'sysset2',
    type: 0,
    component: 'Layout',
    redirect: '/sys/menu',
    listorder: 99,
    children: [
      {
        id: 2,
        path: '/sys/menu',
        name: 'menu_333333',
        title: '菜单管理',
        icon: 'menu1',
        type: 1,
        component: 'sys/menu/index',
        redirect: '',
        listorder: 99,
        children: [
          {
            id: 5,
            path: '/sys/menu/add',
            name: 'add_333333',
            title: '添加',
            icon: '',
            type: 2,
            component: '',
            redirect: '',
            listorder: 99
          
          }
        ]
      },
      {
        id: 3,
        path: '/sys/user',
        name: 'user_666666',
        title: '用户管理',
        icon: 'user',
        type: 1,
        component: 'pdf/index',
        redirect: '',
        listorder: 99,
        children: []
      },
      {
        id: 4,
        path: '/sys/icon',
        name: 'icon_666666',
        title: '图标管理',
        icon: 'icon',
        type: 1,
        component: 'svg-icons/index',
        redirect: '',
        listorder: 99,
        children: []
      }

    ]
  },
  {
    id: 5,
    path: '/sysx',
    name: 'sysx_xxxx',
    title: '其他管理',
    icon: 'plane',
    type: 0,
    component: 'Layout',
    redirect: '',
    listorder: 99,
    children: []
  }

]
export default data

