
// ===== SANITIZAR NOMBRE DE ARCHIVO =====

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-z0-9.-]/gi, '_') // Reemplazar caracteres especiales
    .replace(/_{2,}/g, '_')        // Evitar múltiples guiones bajos
    .toLowerCase();                // Convertir a minúsculas
}

// ===== DESCARGAR BLOB COMO ARCHIVO =====

export function downloadBlob(blob: Blob, fileName: string): void {
  try {
    // Crear URL temporal del blob
    const url = URL.createObjectURL(blob);

    // Crear elemento <a> temporal
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // Añadir al DOM, hacer click y remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Liberar memoria
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar archivo:', error);
  }
}