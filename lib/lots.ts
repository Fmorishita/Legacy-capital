// Clúster 1 de Punta Pacífico. Fuente: sembrado oficial del desarrollador (actualización 14-09-2026)
// y lista de precios (29-06-2026) para modelo y m² de terreno.
// x / y = posición del número de lote sobre /public/img/sembrado.jpg, en porcentaje.
// Para actualizar disponibilidad basta con cambiar `status` ("disponible" | "apartada" | "vendida").

export type LotStatus = "disponible" | "apartada" | "vendida";
export type LotView = "premium" | "preferente" | "estandar";
export type Lot = {
  n: number;
  model: "2R" | "3R";
  land: number;
  view: LotView;
  status: LotStatus;
  x: number;
  y: number;
};

export const lots: Lot[] = [
  { n: 1, model: "2R", land: 182.00, view: "estandar", status: "disponible", x: 87.69, y: 27.88 },
  { n: 2, model: "2R", land: 183.56, view: "estandar", status: "disponible", x: 83.51, y: 28.21 },
  { n: 3, model: "2R", land: 183.56, view: "estandar", status: "disponible", x: 79.33, y: 28.54 },
  { n: 4, model: "2R", land: 183.56, view: "estandar", status: "disponible", x: 75.0, y: 28.54 },
  { n: 5, model: "2R", land: 183.56, view: "estandar", status: "disponible", x: 71.04, y: 28.54 },
  { n: 6, model: "2R", land: 183.56, view: "estandar", status: "disponible", x: 66.79, y: 27.88 },
  { n: 7, model: "2R", land: 183.56, view: "estandar", status: "disponible", x: 62.84, y: 27.44 },
  { n: 8, model: "2R", land: 183.56, view: "estandar", status: "disponible", x: 58.73, y: 26.23 },
  { n: 9, model: "2R", land: 183.56, view: "estandar", status: "vendida", x: 54.78, y: 25.69 },
  { n: 10, model: "3R", land: 299.83, view: "estandar", status: "vendida", x: 38.13, y: 30.85 },
  { n: 11, model: "3R", land: 330.38, view: "preferente", status: "disponible", x: 40.45, y: 40.94 },
  { n: 12, model: "3R", land: 271.11, view: "estandar", status: "vendida", x: 46.49, y: 45.66 },
  { n: 13, model: "3R", land: 183.34, view: "estandar", status: "disponible", x: 51.12, y: 46.98 },
  { n: 14, model: "3R", land: 183.34, view: "estandar", status: "disponible", x: 55.22, y: 47.75 },
  { n: 15, model: "2R", land: 183.34, view: "estandar", status: "vendida", x: 62.54, y: 49.07 },
  { n: 16, model: "2R", land: 183.34, view: "estandar", status: "disponible", x: 66.72, y: 49.07 },
  { n: 17, model: "2R", land: 183.34, view: "estandar", status: "disponible", x: 70.67, y: 49.07 },
  { n: 18, model: "2R", land: 183.34, view: "estandar", status: "disponible", x: 74.85, y: 49.07 },
  { n: 19, model: "3R", land: 183.20, view: "estandar", status: "disponible", x: 74.85, y: 65.31 },
  { n: 20, model: "3R", land: 183.20, view: "estandar", status: "disponible", x: 70.97, y: 65.31 },
  { n: 21, model: "3R", land: 183.20, view: "estandar", status: "disponible", x: 66.79, y: 65.09 },
  { n: 22, model: "3R", land: 183.20, view: "estandar", status: "disponible", x: 62.84, y: 64.87 },
  { n: 23, model: "3R", land: 183.20, view: "preferente", status: "disponible", x: 55.15, y: 64.11 },
  { n: 24, model: "3R", land: 183.20, view: "preferente", status: "disponible", x: 51.12, y: 63.78 },
  { n: 25, model: "3R", land: 183.20, view: "preferente", status: "disponible", x: 46.94, y: 63.01 },
  { n: 26, model: "3R", land: 183.20, view: "preferente", status: "disponible", x: 42.99, y: 61.69 },
  { n: 27, model: "3R", land: 265.50, view: "estandar", status: "vendida", x: 37.91, y: 59.93 },
  { n: 28, model: "3R", land: 296.22, view: "estandar", status: "vendida", x: 32.84, y: 54.34 },
  { n: 29, model: "3R", land: 182.56, view: "preferente", status: "disponible", x: 30.3, y: 46.1 },
  { n: 30, model: "3R", land: 180.00, view: "preferente", status: "disponible", x: 29.1, y: 38.53 },
  { n: 31, model: "3R", land: 180.00, view: "preferente", status: "disponible", x: 28.06, y: 31.39 },
  { n: 32, model: "3R", land: 183.12, view: "estandar", status: "vendida", x: 26.87, y: 23.82 },
  { n: 33, model: "3R", land: 240.78, view: "estandar", status: "vendida", x: 11.94, y: 6.81 },
  { n: 34, model: "3R", land: 218.58, view: "estandar", status: "vendida", x: 7.99, y: 8.56 },
  { n: 35, model: "3R", land: 180.00, view: "premium", status: "disponible", x: 15.0, y: 35.35 },
  { n: 36, model: "3R", land: 180.00, view: "premium", status: "disponible", x: 16.34, y: 42.37 },
  { n: 37, model: "3R", land: 180.00, view: "premium", status: "disponible", x: 17.16, y: 49.95 },
  { n: 38, model: "3R", land: 211.34, view: "premium", status: "disponible", x: 18.66, y: 57.85 },
  { n: 39, model: "3R", land: 226.40, view: "premium", status: "disponible", x: 21.19, y: 65.86 },
  { n: 40, model: "3R", land: 227.17, view: "premium", status: "disponible", x: 24.7, y: 72.89 },
  { n: 41, model: "3R", land: 226.03, view: "premium", status: "disponible", x: 29.03, y: 77.83 },
  { n: 42, model: "3R", land: 204.16, view: "premium", status: "disponible", x: 33.88, y: 80.79 },
  { n: 43, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 38.21, y: 82.88 },
  { n: 44, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 42.16, y: 83.86 },
  { n: 45, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 46.19, y: 85.4 },
  { n: 46, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 50.22, y: 86.5 },
  { n: 47, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 54.55, y: 87.38 },
  { n: 48, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 58.58, y: 88.14 },
  { n: 49, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 62.76, y: 88.36 },
  { n: 50, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 66.72, y: 88.47 },
  { n: 51, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 70.97, y: 89.13 },
  { n: 52, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 75.22, y: 89.13 },
  { n: 53, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 79.33, y: 89.13 },
  { n: 54, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 83.43, y: 89.13 },
  { n: 55, model: "3R", land: 183.02, view: "premium", status: "disponible", x: 87.69, y: 89.13 },
];

export const clusterSize = lots.length;
export const totalHomes = 120;
export const availableCount = lots.filter((l) => l.status === "disponible").length;
