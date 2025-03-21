export function formatPrice(valor: number | string | null | undefined) {
  if (valor === null || valor === undefined) {
      return 'R$ 0,00'; 
  }

  const numericValue = typeof valor === 'string' ? parseFloat(valor) : valor;

  if (typeof numericValue !== 'number' || isNaN(numericValue)) {
      return 'R$ 0,00'; 
  }

  return `R$ ${numericValue.toFixed(2).replace('.', ',')}`;
}