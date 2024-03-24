export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements array[i] and array[j]
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

export const getWordColor = (category: 1 | 2 | 3 | 4): string => {
  switch (category) {
    case 1:
      return "bg-yellow";
    case 2:
      return "bg-green";
    case 3:
      return "bg-blue";
    case 4:
      return "bg-purple";
    default:
      return "bg-black";
  }
};



export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
