import {Images} from '@config';

const FlightData = [
  {
    id: '1',
    from: {
      name: 'สหรัฐอเมริกา',
      value: 'USA',
      image: Images.airline1,
      hour: '05:00',
    },
    to: {
      name: 'สิงคโปร์',
      value: 'SIN',
      image: Images.airline2,
      hour: '18:00',
    },
    totalHour: 13.5,
    brand: 'Emirates Air',
    image: Images.airline3,
    type: 'ประหยัด',
    price: '13,499 บาท',
    route: 'ตรง',
  },
  {
    id: '2',
    from: {
      name: 'สิงคโปร์',
      value: 'SIN',
      image: Images.airline2,
      hour: '06:00',
    },
    to: {
      name: 'สหรัฐอเมริกา',
      value: 'USA',
      image: Images.airline1,
      hour: '19:00',
    },
    totalHour: 18.5,
    brand: 'Singapore Air',
    image: Images.airline2,
    type: 'ธุรกิจ',
    price: '17,999 บาท',
    route: 'ตรง',
  },
  {
    id: '3',
    from: {
      name: 'สิงคโปร์',
      value: 'SIN',
      image: Images.airline2,
      hour: '07:00',
    },
    to: {
      name: 'สหรัฐอเมริกา',
      value: 'USA',
      image: Images.airline1,
      hour: '20:30',
    },
    totalHour: 18.5,
    brand: 'สหรัฐอเมริกา',
    image: Images.airline1,
    type: 'ธุรกิจ',
    price: '17,999 บาท',
    route: 'ตรง',
  },
  {
    id: '4',
    from: {
      name: 'สิงคโปร์',
      value: 'SIN',
      image: Images.airline2,
      hour: '08:00',
    },
    to: {
      name: 'สหรัฐอเมริกา',
      value: 'USA',
      image: Images.airline1,
      hour: '21:30',
    },
    totalHour: 18.5,
    brand: 'Singapore Air',
    image: Images.airline2,
    type: 'ธุรกิจ',
    price: '20,999 บาท',
    route: 'ตรง',
  },
];

export {FlightData};
