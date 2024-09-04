import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      black: string;
      white: string;
      gray: string;
      lightGray: string;
      darkGray: string;
      success: string;
      error: string;
      focusShadow: string;
    };
    fontSizes: {
      xxsmall: string;
      xsmall: string;
      base: string;
      small: string;
      medium: string;
      large: string;
      xlarge: string;
      xxlarge: string;
    };
  }
}
