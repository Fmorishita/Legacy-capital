/** Quita los asteriscos de énfasis ("*Pacífico.*") para atributos, metadatos y JSON-LD. */
export const plain = (text: string) => text.replace(/\*/g, "");
