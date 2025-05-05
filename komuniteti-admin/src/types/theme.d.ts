declare module '../theme' {
  interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    white: string;
    black: string;
    grey: string;
    lightGrey: string;
    darkGrey: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      hint: string;
    };
    outline?: string;
  }

  interface ThemeSpacing {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  }

  interface ThemeBorderRadius {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    round: number;
  }

  interface ThemeShadow {
    shadowColor: string;
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  }

  interface ThemeShadows {
    sm: ThemeShadow;
    md: ThemeShadow;
    lg: ThemeShadow;
  }

  interface ThemeTypographyStyle {
    fontSize: number;
    fontWeight: 'normal' | 'bold' | '600';
    textTransform?: 'uppercase';
    letterSpacing?: number;
  }

  interface ThemeTypography {
    h1: ThemeTypographyStyle;
    h2: ThemeTypographyStyle;
    h3: ThemeTypographyStyle;
    h4: ThemeTypographyStyle;
    subtitle1: ThemeTypographyStyle;
    subtitle2: ThemeTypographyStyle;
    body1: ThemeTypographyStyle;
    body2: ThemeTypographyStyle;
    button: ThemeTypographyStyle;
    caption: ThemeTypographyStyle;
    overline: ThemeTypographyStyle;
  }

  interface Theme {
    colors: ThemeColors;
    spacing: ThemeSpacing;
    borderRadius: ThemeBorderRadius;
    shadows: ThemeShadows;
    typography: ThemeTypography;
  }

  export const theme: Theme;
} 