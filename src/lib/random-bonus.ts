export function getRandomWeightedBonus(): number {
  // Веса: чем меньше число, тем больше вес
  const weights = [100, 50, 20, 5, 1]; 
  const numbers = [1, 2, 3, 5, 10];

  // Суммируем все веса
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  // Генерируем случайное число в диапазоне [0, totalWeight)
  const random = Math.random() * totalWeight;

  // Находим число по весу
  let cumulativeWeight = 0;
  for (let i = 0; i < numbers.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return numbers[i];
    }
  }

  // Гарантируем возврат (на случай погрешностей вычислений)
  return numbers[numbers.length - 1];
}
