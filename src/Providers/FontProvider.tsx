import { Titan_One } from 'next/font/google';

const font = Titan_One({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
});

type FontProviderProps = {
  children: React.ReactNode;
};

const FontProvider = (props: FontProviderProps) => {
  const { children } = props;

  return <main className={font.className}>{children}</main>;
};

export default FontProvider;
