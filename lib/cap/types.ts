// Tipos compartidos entre servidor y cliente. No contienen respuestas correctas.

export type ModState = "bloqueado" | "disponible" | "en_curso" | "completado";
export type Letra = "a" | "b" | "c" | "d";
export type Opciones = Record<Letra, string>;

export type ModuloResumen = {
  id: string;
  orden: number;
  numero: string | null;
  titulo: string;
  subtitulo: string | null;
  imagen: string | null;
  tiempo: string | null;
  es_anexo: boolean;
  total: number;
  leidas: number;
  estado: ModState;
  completado_at: string | null;
  quiz_requerido: boolean;
  quiz_aprobado: boolean;
  tareas_total: number;
  tareas_enviadas: number;
};

export type Dashboard = {
  modulos: ModuloResumen[];
  completados: number;
  total: number;
  certificado: string | null;
};

export type Seccion = { id: string; num: string; titulo: string };

export type EstadoEntrega = "en_revision" | "aprobado" | "corregir";

export type Entrega = {
  texto: string | null;
  estado: EstadoEntrega;
  comentario: string | null;
  enviado_at: string;
  revisado_at: string | null;
  archivo: { id: string; nombre: string; tamano: number } | null;
};

export type Tarea = {
  id: string;
  titulo: string;
  instrucciones: string;
  seccion: string | null;
  entrega: Entrega | null;
};

export type QuizInfo = {
  requerido: boolean;
  aprobado: boolean;
  preguntas: number;
  mejor: { porcentaje: number; aprobado: boolean; fecha: string } | null;
  intentos_usados: number | null;
  intentos_max: number | null;
};

export type ModuloDetalle = {
  id: string;
  numero: string | null;
  titulo: string;
  subtitulo: string | null;
  imagen: string | null;
  tiempo: string | null;
  objetivos: string[];
  secciones: Seccion[];
  html: string;
  es_anexo: boolean;
  estado: ModState;
  leidas: string[];
  quiz: QuizInfo;
  tareas: Tarea[];
};

export type PreguntaQuiz = { id: number; texto: string; opciones: Opciones };

export type QuizStart = { intento: string; tipo: "quiz" | "examen"; preguntas: PreguntaQuiz[] };

export type QuizResult = {
  correctas: number;
  total: number;
  porcentaje: number;
  aprobado: boolean;
  tipo: "quiz" | "examen";
  intentos_restantes: number | null;
  falladas: { id: number; texto: string; opciones: Opciones; tu_respuesta: Letra | null; correcta: Letra | null }[];
};

export type Requisitos = {
  modulos_faltantes: string[];
  examen_aprobado: boolean;
  tareas_pendientes: { id: string; titulo: string; estado: EstadoEntrega | "sin_enviar" }[];
};

export type Certificado =
  | { elegible: false; requisitos: Requisitos }
  | { elegible: true; folio: string; nombre: string; emitido_at: string };

export type ActionResult<T = undefined> = { ok: true; data?: T; message?: string } | { ok: false; error: string };

// ---------------------------------------------------------------- Administración

export type UsuarioAdmin = {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  rol: "asesor" | "admin";
  estado: "pendiente" | "activo" | "suspendido";
  creado_at: string;
  ultimo_acceso: string | null;
  codigo: string | null;
  intentos_extra: number;
  completados: number;
  quizzes_aprobados: number;
  examen_intentos: number;
  examen_mejor: number | null;
  examen_aprobado: boolean;
  tareas_revision: number;
  tareas_aprobadas: number;
  certificado: string | null;
};

export type AdminOverview = {
  config: { modo_registro: "codigo" | "aprobacion" | "ambos"; intentos_examen: number };
  total_modulos: number;
  pendientes_revision: number;
  borradores: number;
  usuarios: UsuarioAdmin[];
};

export type Codigo = {
  codigo: string;
  usos_max: number;
  usos: number;
  expira_at: string | null;
  activo: boolean;
  nota: string | null;
  creado_at: string;
};

export type EntregaAdmin = {
  id: string;
  estado: EstadoEntrega;
  texto: string | null;
  comentario: string | null;
  enviado_at: string;
  revisado_at: string | null;
  tarea: { id: string; titulo: string; modulo: string };
  usuario: { id: string; nombre: string; correo: string };
  archivo: { id: string; nombre: string; tamano: number } | null;
};

export type PreguntaAdmin = {
  id: number;
  modulo: string;
  texto: string;
  opciones: Opciones;
  correcta: Letra;
  origen: "examen" | "generada";
  estado: "aprobada" | "borrador" | "descartada";
  n_examen: number | null;
  seccion: string | null;
};

export type AdminUserDetail = {
  usuario: Pick<UsuarioAdmin, "id" | "nombre" | "correo" | "telefono" | "rol" | "estado" | "creado_at" | "ultimo_acceso" | "intentos_extra">;
  modulos: ModuloResumen[];
  intentos: { modulo: string; tipo: "quiz" | "examen"; porcentaje: number; correctas: number; total: number; aprobado: boolean; fecha: string }[];
  elegibilidad: Requisitos;
  certificado: string | null;
};
