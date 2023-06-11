export default [
  {
    method: 'GET',
    path: '/all',
    handler: 'myController.index',
    config: {
      policies: []
    }
  }
];
