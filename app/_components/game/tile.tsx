"use client";

import { Word } from "@/app/_types";

type CellProps = {
  cellValue: Word;
  onClick: (word: Word) => void;
  /* animateGuess: boolean;
  animateWrongGuess: boolean; */
};

export default function Cell(props: CellProps) {
  const bgColor = props.cellValue.selected ? "bg-gray" : "bg-tan";
  const textColor = props.cellValue.selected ? "text-white" : "text-black";

  const handleClick = () => {
    props.onClick(props.cellValue);
  };

  /* const guessAnimation = props.animateGuess ? "transform -translate-y-2" : "";
  const wrongGuessAnimation = props.animateWrongGuess
    ? "animate-horizontal-shake"
    : ""; */

  return (
    <button
      className={`${bgColor} py-6 rounded-md break-all px-1 transition ease-in-out`}
      onClick={handleClick}
    >
      <h2 className={`${textColor} text-xs md:text-lg text-center font-bold`}>
        {props.cellValue.word.toUpperCase()}
      </h2>
    </button>
  );
}
