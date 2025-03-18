import chroma from 'chroma-js';

export const getTextColorForBackground = (backgroundColor: string) => {
  const contrastWithWhite = chroma.contrast(backgroundColor, 'white');
  const contrastWithBlack = chroma.contrast(backgroundColor, 'black');

  return contrastWithBlack < contrastWithWhite * 5 ? 'white' : 'black';
};

export const defaultColors = {
  primaryColor: '#289ffa',
  secondaryColor: '#3b6fff',
  accentColor: '#ed1a4f',
};
