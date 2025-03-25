import { defaultColors } from '@/utils/colors';
import { createTheme, MantineTheme, Menu, MenuDropdown } from '@mantine/core';

import { MantineThemeOverride } from '@mantine/core';

const inputsDefaults = (theme: MantineTheme) => ({
  input: {
    borderRadius: theme.radius.xl,
    borderWidth: '0.20rem',
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
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
      styles: (theme: MantineTheme) => ({
        input: {
          borderRadius: theme.radius.lg,
          borderWidth: '0.20rem',
        },
      }),
    },
    MenuDropdown: {
      styles: (theme: MantineTheme) => ({
        ...inputsDefaults(theme),
        dropdown: {
          border: `1px solid ${theme.colors.gray[4]}`,
          boxShadow: theme.shadows.md,
          borderRadius: theme.radius.xl,
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
          padding: '1.4rem',
        },
      }),
    },
    Menu: {
      styles: (theme: MantineTheme) => ({
        root: {
          ...inputsDefaults(theme).input,
        },
        item: {
          // Customize Menu item style, like padding, background color on hover, etc.
          borderRadius: theme.radius.xl,
          marginBottom: theme.spacing.xs,
          '&:hover': {
            backgroundColor: theme.colors.blue[4],
          },
        },
        dropdown: {
          // Customize the dropdown of the Menu, like border radius, background color, etc.
          borderRadius: theme.radius.xl,
          padding: theme.spacing.xs,
          // backgroundColor: theme.colors.dark[7],
        },
      }),
    },
    AppShell: {
      styles: (theme: MantineTheme) => ({
        header: {
          borderBottom: `none`,
        },
      }),
    },
    // Menu: {
    //   styles: (theme: MantineTheme) => ({
    //     body: {
    //       border: `1px solid ${theme.colors.gray[4]}`,
    //       boxShadow: theme.shadows.md,
    //       borderRadius: theme.radius.xl,
    //     },
    //     MenuDropdown: {
    //       dropdown: {
    //         border: `1px solid ${theme.colors.gray[4]}`,
    //         boxShadow: theme.shadows.md,
    //         borderRadius: theme.radius.xl,
    //       },
    //       body: {
    //         border: `1px solid ${theme.colors.gray[4]}`,
    //         boxShadow: theme.shadows.md,
    //         borderRadius: theme.radius.xl,
    //       },
    //       border: `1px solid ${theme.colors.gray[4]}`,
    //       boxShadow: theme.shadows.md,
    //       borderRadius: theme.radius.xl,
    //     },
    //     Menu: {
    //       dropdown: {
    //         border: `1px solid ${theme.colors.gray[4]}`,
    //         boxShadow: theme.shadows.md,
    //         borderRadius: theme.radius.xl,
    //       },
    //       body: {
    //         border: `1px solid ${theme.colors.gray[4]}`,
    //         boxShadow: theme.shadows.md,
    //         borderRadius: theme.radius.xl,
    //       },
    //     },
    //     item: {
    //       '&:hover': {
    //         backgroundColor: theme.colors.gray[0],
    //       },
    //     },
    //   }),
    // },
  },
});

export default mantineTheme;
