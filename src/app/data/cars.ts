export type Car = {
  id: number;
  brand: string;
  model: string;
  year: number;
  priceAMD: number;
  fuel: string;
  transmission: string;
  body: string;
  color: string;
  engine: string;
  seats: number;
  image: string;
  available: number;
};
 
export const cars: Car[] = [
  {
    id: 1,
    brand: "Mercedes-Benz",
    model: "S 500 4MATIC",
    year: 2023,
    priceAMD: 52000,
    fuel: "Бензин",
    transmission: "Автомат",
    body: "Седан",
    color: "Черный",
    engine: "3.0L",
    seats: 5,
    image:
      "/cars/mercedes.jpeg",
    available: 0,
    },
  {
    id: 2,
    brand: "BMW",
    model: "X7 xDrive40i",
    year: 2024,
    priceAMD: 64000,
    fuel: "Бензин",
    transmission: "Автомат",
    body: "SUV",
    color: "Графит",
    engine: "3.0L",
    seats: 7,
    image:
      "/cars/bmw.jpeg",
    available: 1,
  },
  {
    id: 3,
    brand: "Range Rover",
    model: "Sport P400",
    year: 2023,
    priceAMD: 70000,
    fuel: "Гибрид",
    transmission: "Автомат",
    body: "SUV",
    color: "Белый",
    engine: "3.0L",
    seats: 5,
    image:
      "/cars/range-rover-sport.jpeg",
    available: 1,
  },
  {
    id: 4,
    brand: "Porsche",
    model: "Panamera 4",
    year: 2022,
    priceAMD: 76000,
    fuel: "Бензин",
    transmission: "PDK",
    body: "Лифтбек",
    color: "Серый",
    engine: "2.9L",
    seats: 4,
    image:
    "/cars/porche.jpeg",
    available: 1,
  },
  {
    id: 5,
    brand: "Toyota",
    model: "Land Cruiser 300",
    year: 2024,
    priceAMD: 58000,
    fuel: "Дизель",
    transmission: "Автомат",
    body: "SUV",
    color: "Черный",
    engine: "3.3L",
    seats: 7,
    image:
      "/cars/land-crouser.jpeg",
    available: 1,
  },
  {
    id: 6,
    brand: "Audi",
    model: "A8 L",
    year: 2023,
    priceAMD: 50000,
    fuel: "Бензин",
    transmission: "Автомат",
    body: "Седан",
    color: "Синий",
    engine: "3.0L",
    seats: 5,
    image:
      "/cars/audi.jpeg",
    available: 1,
  },
];

export const filters = ["Все", "Седан", "SUV", "Лифтбек"];

export const formatter = new Intl.NumberFormat("ru-RU");
