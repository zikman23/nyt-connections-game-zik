export default function ControlButton(props: {
  text: string;
  onClick: () => void;
  unclickable?: boolean;
  isSubmitButton?: boolean; // New prop to identify the submit button
}) {
  const click = props.unclickable ? 'pointer-events-none' : '';
  let buttonStyles = '';

  if (props.unclickable) {
    buttonStyles = 'text-[#7f7f7f] border-[#7f7f7f]';
  } else if (props.isSubmitButton) {
    buttonStyles = 'bg-black text-white border-white';
  } else {
    buttonStyles = 'text-black border-black';
  }

  return (
    <button className={`${buttonStyles} border rounded-full font-medium py-3 px-4 text-l ${click}`} onClick={props.onClick}>
      {props.text}
    </button>
  );
}
