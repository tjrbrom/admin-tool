import dayjs from 'dayjs';
import 'dayjs/locale/en';

export const formatDate = (date: string | number | Date): string => {
  return dayjs(date).format('dddd D, MMM YYYY - hh:mma');
};

export const formatPremium = (value: boolean): string => {
  return value ? 'has' : 'has not';
};

export const formatBanned = (value: boolean): string => {
  return value ? 'is' : 'is not';
};
