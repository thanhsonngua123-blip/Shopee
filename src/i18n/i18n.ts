import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_EN from '../locales/en/home.json'
import PRODUCT_EN from '../locales/en/product.json'
import AUTH_EN from '../locales/en/auth.json'
import CART_EN from '../locales/en/cart.json'
import USER_EN from '../locales/en/user.json'
import ERROR_EN from '../locales/en/error.json'
import HOME_VI from '../locales/vi/home.json'
import PRODUCT_VI from '../locales/vi/product.json'
import AUTH_VI from '../locales/vi/auth.json'
import CART_VI from '../locales/vi/cart.json'
import USER_VI from '../locales/vi/user.json'
import ERROR_VI from '../locales/vi/error.json'
export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const

export const resources = {
  en: {
    home: HOME_EN,
    product: PRODUCT_EN,
    auth: AUTH_EN,
    cart: CART_EN,
    user: USER_EN,
    error: ERROR_EN
  },
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI,
    auth: AUTH_VI,
    cart: CART_VI,
    user: USER_VI,
    error: ERROR_VI
  }
}

export const defaultNS = 'home'

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  ns: ['home', 'product', 'common'],
  defaultNS,
  fallbackLng: 'vi',
  interpolation: {
    escapeValue: false
  }
})
