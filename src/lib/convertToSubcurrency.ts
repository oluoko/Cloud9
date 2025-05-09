export default function convertToSubcurrency(amout: number, factor = 100) {
  return Math.round(amout * factor);
}
