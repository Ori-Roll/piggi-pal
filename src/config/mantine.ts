import { defaultColors } from '@/utils/colors';
import { createTheme, MantineTheme } from '@mantine/core';

import { MantineThemeOverride } from '@mantine/core';

const inputsDefaults = (theme: MantineTheme) => ({
  input: {
    borderRadius: theme.radius.md,
    borderWidth: '0.20rem',
  },
});

const mantineTheme: MantineThemeOverride = createTheme({
  components: {
    TextInput: {
      styles: inputsDefaults,
    },
    Textarea: {
      styles: inputsDefaults,
    },
    Select: {
      styles: inputsDefaults,
    },
    NumberInput: {
      styles: inputsDefaults,
    },
    DatePickerInput: {
      styles: inputsDefaults,
    },
    Modal: {
      styles: (theme: MantineTheme) => ({
        content: {
          borderRadius: theme.radius.xl,
          padding: '2rem',
        },
      }),
    },
  },
});

export default mantineTheme;
