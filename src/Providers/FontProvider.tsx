import { Poppins } from 'next/font/google';

const font = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

type FontProviderProps = {
  children: React.ReactNode;
};

const FontProvider = (props: FontProviderProps) => {
  const { children } = props;

  return <main className={font.className}>{children}</main>;
};

export default FontProvider;
