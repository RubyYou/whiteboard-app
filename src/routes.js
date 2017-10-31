export default [
  {
      path: '/project/:projectId',
      component: require('./pages/project.vue')
  },
  {
      path: '/item/:itemId',
      component: require('./pages/item.vue')
  },
  {
      path: '/camera/',
      component: require('./pages/camera.vue')
  },
  {
      path: '/edit/:itemId',
      component: require('./pages/edit.vue')
  },
  {
      path: '/editProject/',
      component: require('./pages/editProject.vue')
  }
]