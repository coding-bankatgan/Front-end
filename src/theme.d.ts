import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      point: string;
      black: string;
      white: string;
      gray: string;
      clearGray: string;
      brightGray: string;
      lightGray: string;
      darkGray: string;
      success: string;
      error: string;
      heart: string;
      focusShadowOrange: string;
      focusShadowGray: string;
    };
    fontSizes: {
      xxsmall: string;
      xsmall: string;
      base: string;
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
  }
}
