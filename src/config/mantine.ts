import { defaultColors } from '@/utils/colors';
import { createTheme, MantineTheme, MenuDropdown } from '@mantine/core';

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
    MenuDropdown: {
      styles: (theme: MantineTheme) => ({
        ...inputsDefaults(theme),
        dropdown: {
          border: `1px solid ${theme.colors.gray[4]}`,
          boxShadow: theme.shadows.md,
        },
        item: {
          '&:hover': {
            backgroundColor: theme.colors.gray[0],
          },
        },
      }),
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
