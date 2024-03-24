'use client';

import { useCallback, useState } from 'react';
import ControlButton from './_components/buttons';
import Grid from './_components/game/grid';

import Popup from './_components/popup';

import useGameLogic from './_hooks/use-game-logic';
import usePopup from './_hooks/use-popup';
import { SubmitResult, Word } from './_types';

export default function Home() {
  const [popupState, showPopup] = usePopup();
  const {
    gameWords,
    selectedWords,
    clearedCategories,
    mistakesRemaining,
    isWon,
    isLost,
    selectWord,
    shuffleWords,
    deselectAllWords,
    getSubmitResult,
    handleWin,
    handleLoss,
  } = useGameLogic();

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);

    const result: SubmitResult = getSubmitResult();

    switch (result.result) {
      case 'loss':
        handleLoss();
        showPopup('Better luck next time!');
        break;
      case 'win':
        handleWin();
        showPopup('You win!');
        break;
      case 'incorrect':
        showPopup('Incorrect');
        break;
    }
    setSubmitted(false);
  };

  const onClickCell = useCallback(
    (word: Word) => {
      selectWord(word);
    },
    [selectWord]
  );

  const renderControlButtons = () => {
    const playAgainButton = (
      <ControlButton
        text="Play Again"
        onClick={() => {
          window.location.reload();
        }}
      />
    );

    const inProgressButtons = (
      <div className="flex gap-2 mb-12">
        <ControlButton text="Shuffle" onClick={shuffleWords} unclickable={submitted} />
        <ControlButton text="Deselect All" onClick={deselectAllWords} unclickable={selectedWords.length === 0 || submitted} />
        <ControlButton text="Submit" unclickable={selectedWords.length !== 4 || submitted} onClick={handleSubmit} />
      </div>
    );

    if (isWon || isLost) {
      return playAgainButton;
    } else {
      return inProgressButtons;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-1/3 mx-auto mt-8">
        <h1 className="text-black text-4xl font-semibold my-4 ml-4">Connections</h1>
        <hr className="mb-4 md:mb-4 w-full"></hr>
        <h1 className="text-black mb-4">Create four groups of four!</h1>

        <div className="relative w-full mt-10">
          <Popup show={popupState.show} message={popupState.message} />
          <Grid words={gameWords} selectedWords={selectedWords} onClick={onClickCell} clearedCategories={clearedCategories} />
        </div>
        <h2 className="text-black my-4 md:my-8 mx-8">Mistakes Remaining: {mistakesRemaining > 0 ? Array(mistakesRemaining).fill('•') : ''}</h2>
        {renderControlButtons()}
      </div>
    </>
  );
}
