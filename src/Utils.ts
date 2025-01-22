import dayjs from 'dayjs';
import 'dayjs/locale/en';

export const formatDate = (date: string | number | Date): string => {
  return dayjs(date).format('dddd D, MMM YYYY - hh:mma');
};
