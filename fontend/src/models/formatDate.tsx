import { formatDistanceStrict, intlFormatDistance  } from 'date-fns'

import { vi } from 'date-fns/locale'

const formatDate = (date: Date) =>{
    const day = formatDistanceStrict(Date.now(), date, { locale: vi, addSuffix: false })
    return day
}
export default formatDate

export const formatDatePost = (date: Date) =>{
    const day = intlFormatDistance(date, Date.now())
    return day
}
