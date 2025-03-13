import chroma from 'chroma-js';

export const getTextColorForBackground = (backgroundColor: string) => {
  const contrastWithWhite = chroma.contrast(backgroundColor, 'white');
  const contrastWithBlack = chroma.contrast(backgroundColor, 'black');

  return contrastWithBlack < contrastWithWhite * 5 ? 'white' : 'black';
};
