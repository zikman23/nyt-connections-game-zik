import { useEffect, useMemo, useRef, useState } from 'react';
import { categories } from '../word-set';
import { Category, SubmitResult, Word } from '../_types';
import { delay, shuffleArray } from '../_utils';

export default function useGameLogic() {
  // Initial state for gameWords is set from localStorage or by shuffling
  const [gameWords, setGameWords] = useState<Word[]>(() => {
    const savedWords = localStorage.getItem('gameWords');
    return savedWords
      ? JSON.parse(savedWords)
      : shuffleArray(categories.flatMap((category) => category.items.map((word) => ({ word: word, level: category.level }))));
  });

  const selectedWords = useMemo(() => gameWords.filter((item) => item.selected), [gameWords]);

  // Initial state for clearedCategories is set from localStorage or as an empty array
  const [clearedCategories, setClearedCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('clearedCategories');
    return savedCategories ? JSON.parse(savedCategories) : [];
  });

  // Initial state for mistakesRemaining is set from localStorage or as the default value
  const [mistakesRemaining, setMistakesRemaning] = useState(() => {
    const savedMistakes = localStorage.getItem('mistakesRemaining');
    return savedMistakes ? parseInt(savedMistakes, 10) : 4;
  });

  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);

  const guessHistoryRef = useRef<Word[][]>([]);

  useEffect(() => {
    // Update localStorage when game state changes
    localStorage.setItem('gameWords', JSON.stringify(gameWords));
    console.log('Saved gameWords to localStorage:', gameWords);
    localStorage.setItem('clearedCategories', JSON.stringify(clearedCategories));
    console.log('Saved clearedCategories to localStorage:', clearedCategories);
    localStorage.setItem('mistakesRemaining', mistakesRemaining.toString());
    console.log('Saved mistakesRemaining to localStorage:', mistakesRemaining);
  }, [gameWords, clearedCategories, mistakesRemaining]); // Depend on game state variables

  const selectWord = (word: Word): void => {
    const newGameWords = gameWords.map((item) => {
      // Only allow word to be selected if there are less than 4 selected words
      if (word.word === item.word) {
        return {
          ...item,
          selected: selectedWords.length < 4 ? !item.selected : false,
        };
      } else {
        return item;
      }
    });

    setGameWords(newGameWords);
  };

  const shuffleWords = () => {
    setGameWords([...shuffleArray(gameWords)]);
  };

  const deselectAllWords = () => {
    setGameWords(
      gameWords.map((item) => {
        return { ...item, selected: false };
      })
    );
  };

  const getSubmitResult = (): SubmitResult => {
    guessHistoryRef.current.push(selectedWords);

    const likenessCounts = categories.map((category) => {
      return selectedWords.filter((item) => category.items.includes(item.word)).length;
    });

    const maxLikeness = Math.max(...likenessCounts);
    const maxIndex = likenessCounts.indexOf(maxLikeness);

    if (maxLikeness === 4) {
      return getCorrectResult(categories[maxIndex]);
    } else {
      return getIncorrectResult(maxLikeness);
    }
  };

  const getCorrectResult = (category: Category): SubmitResult => {
    setClearedCategories([...clearedCategories, category]);
    setGameWords(gameWords.filter((item) => !category.items.includes(item.word)));

    if (clearedCategories.length === 3) {
      return { result: 'win' };
    } else {
      return { result: 'correct' };
    }
  };

  const getIncorrectResult = (maxLikeness: number): SubmitResult => {
    setMistakesRemaning(mistakesRemaining - 1);

    if (mistakesRemaining === 1) {
      return { result: 'loss' };
    } else {
      return { result: 'incorrect' };
    }
  };

  const handleLoss = async () => {
    const remainingCategories = categories.filter((category) => !clearedCategories.includes(category));

    deselectAllWords();

    for (const category of remainingCategories) {
      await delay(1000);
      setClearedCategories((prevClearedCategories) => [...prevClearedCategories, category]);
      setGameWords((prevGameWords) => prevGameWords.filter((item) => !category.items.includes(item.word)));
    }

    await delay(1000);
    setIsLost(true);
    localStorage.clear();
  };

  const handleWin = async () => {
    await delay(1000);
    setIsWon(true);
    localStorage.clear();
  };

  return {
    gameWords,
    selectedWords,
    clearedCategories,
    mistakesRemaining,
    isWon,
    isLost,
    guessHistoryRef,
    selectWord,
    shuffleWords,
    deselectAllWords,
    getSubmitResult,
    handleLoss,
    handleWin,
  };
}
