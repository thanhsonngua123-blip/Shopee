import config from '@/constants/config'
import HttpStatusCode from '@/constants/httpStatusCode.enum'
import axios, { AxiosError } from 'axios'

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<formError>(error: unknown): error is AxiosError<formError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace('.', ',')
}

export const rateSale = (price: number, priceBeforeDiscount: number) => {
  return Math.round(((priceBeforeDiscount - price) / priceBeforeDiscount) * 100)
}

const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i.${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i.')
  return arr[arr.length - 1]
}

const userImage = 'https://down-vn.img.susercontent.com/file/5657717387ea44467bca92a1dcbaf8d6_tn'

export const getAvatarURL = (avatarName?: string) => {
  if (!avatarName) return userImage
  if (avatarName.startsWith('http')) return avatarName
  return `${config.baseURL}images/${avatarName}`
}
