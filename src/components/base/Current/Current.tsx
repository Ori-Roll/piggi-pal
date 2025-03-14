import PigiSvg from '@/assets/pigibank_JustPig.svg';
import AmountWithSign from '../AmountWithSign/AmountWithSign';

type CurrentProps<E extends boolean> = {
  current: number;
  sign: string;
  handleChange: E extends true
    ? (e: React.ChangeEvent<HTMLInputElement>) => void
    : undefined;
  edit?: E;
};

const Current = <E extends boolean>(props: CurrentProps<E>) => {
  const { current, sign, handleChange } = props;

  return <AmountWithSign amount={current} currencySign={sign} />;
};

export default Current;
