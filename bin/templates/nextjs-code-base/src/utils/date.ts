import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

type DateTimeType = string | number | dayjs.Dayjs | Date | null | undefined
type DateType = string | number | Date

export const dayjsUTC = dayjs.utc
export const formatLocalDate = (dateTime: DateTimeType) => dayjs(dateTime).format('DD/MM/YYYY')
export const formatUTCDate = (dateTime: DateTimeType) => dayjsUTC(dateTime).format('DD/MM/YYYY')
export const formatInputDate = (dateTime: DateTimeType) => dayjs(dateTime).format('YYYY/MM/DD')
export const formatInputMonth = (dateTime: DateTimeType) => dayjs(dateTime).format('YYYY/MM')
export const formatDate = (dateTime: DateTimeType) => dayjs(dateTime).format('YYYY-MM-DD')
export const formatDateExport = (dateTime: DateTimeType) => dayjs(dateTime).format('YYYYMMDD')
export const formatDateTime = (dateTime: DateTimeType) => dayjs(dateTime).format('YYYY/MM/DD HH:mm:ss')

export const getYear = (dateTime: DateType) => new Date(dateTime).getFullYear()
export const getMonth = (dateTime: DateType) => new Date(dateTime).getMonth()
export const getDate = (dateTime: DateType) => new Date(dateTime).getDate()
