const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/change-password',
  historyPurchase: '/user/history-purchase',
  login: '/login',
  register: '/register',
  logout: '/logout',
  refreshToken: '/refresh-access-token',
  productDetail: ':nameId',
  cart: '/cart'
} as const

export default path
