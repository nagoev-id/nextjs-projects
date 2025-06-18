export const CONFIG = {
  SUPABASE: {
    URL: process.env.SUPABASE_URL || 'https://ogjydfzajmoyvxzzmhka.supabase.co',
    ANON_KEY: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nanlkZnpham1veXZ4enptaGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTEzNzgsImV4cCI6MjA2NTY2NzM3OH0.N9bj_l_KBmU837qplCLZs0mVETFDH0PHUwaujMBmIu8',
    AUTH: {
      persistSession: true,
      storageKey: 'chat-auth-token',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
  VALIDATION: {
    SIGN_UP: {
      EMAIL: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 255,
        PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        MESSAGES: {
          REQUIRED: 'Email is required',
          INVALID: 'Please enter a valid email address',
          MIN_LENGTH: 'Email must be at least 6 characters long',
          MAX_LENGTH: 'Email must not exceed 255 characters',
          PROHIBITED_CHARACTERS: 'Email contains prohibited characters',
          DOMAIN_INVALID: 'Email domain is invalid',
        },
        PROHIBITED_CHARACTERS: /[()<>[\]:;@\\,/" ]/,
      },
      PASSWORD: {
        MIN_LENGTH: 6,
        MAX_LENGTH: 255,
        PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        MESSAGES: {
          REQUIRED: 'Password is required',
          MIN_LENGTH: 'Password must be at least 6 characters long',
          MAX_LENGTH: 'Password must not exceed 255 characters',
          WEAK: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
          NOT_MATCH: 'Passwords do not match',
        },
      },
      SIGN_IN: {
        EMAIL: {
          MIN_LENGTH: 6,
          MAX_LENGTH: 255,
          PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          MESSAGES: {
            REQUIRED: 'Email is required',
            INVALID: 'Please enter a valid email address',
            MIN_LENGTH: 'Email must be at least 6 characters long',
            MAX_LENGTH: 'Email must not exceed 255 characters',
            PROHIBITED_CHARACTERS: 'Email contains prohibited characters',
            DOMAIN_INVALID: 'Email domain is invalid',
          },
          PROHIBITED_CHARACTERS: /[()<>[\]:;@\\,/" ]/,
        },
        PASSWORD: {
          MIN_LENGTH: 6,
          MAX_LENGTH: 255,
          PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
          MESSAGES: {
            REQUIRED: 'Password is required',
            MIN_LENGTH: 'Password must be at least 6 characters long',
            MAX_LENGTH: 'Password must not exceed 255 characters',
            WEAK: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            NOT_MATCH: 'Passwords do not match',
          },
        },
      },
    },
  },
  STATE_MANAGEMENT: {
    FEATURES: {
      API: {
        AUTH: {
          ERROR_MESSAGES: {
            INVALID_CREDENTIALS_IN: 'Invalid login credentials',
            INVALID_CREDENTIALS: 'Invalid email or password',
            EMAIL_NOT_CONFIRMED_IN: 'Email not confirmed',
            EMAIL_NOT_CONFIRMED: 'Please confirm your email before logging in',
            SESSION_EXPIRED_IN: 'Refresh Token',
            SESSION_EXPIRED: 'Your session has expired. Please log in again.',
            DEFAULT: 'An authentication error occurred',
          },
        },
      },
      SLICES: {
        AUTH: {},
      },
    },
  },
  COMPONENTS: {
    AUTH: {
      FORM: {
        LABELS: {
          HEADER: (isAuth: boolean = true) => isAuth ? 'Sign In' : 'Create Account',
          SUB_HEADER: (isAuth: boolean = true) => isAuth ? 'Enter your credentials to access your account' : 'Create an account to get started',
          SUBMIT_BUTTON: (isAuth: boolean = true) => isAuth ? 'Sign In' : 'Create Account',
          FIELDS: [
            {
              name: 'email',
              label: 'Email',
              placeholder: 'Enter your email address',
              type: 'email',
              isAuth: false,
            },
            {
              name: 'password',
              label: 'Password',
              placeholder: 'Enter your password',
              type: 'password',
              isAuth: false,
            },
            {
              name: 'confirmPassword',
              label: 'Confirm Password',
              placeholder: 'Confirm your password',
              type: 'password',
              isAuth: true,
            },
          ],
          QUESTION: (isAuth: boolean = true) => isAuth ? 'Don\'t have an account?' : 'Already have an account?',
          LINK: (isAuth: boolean = true) => isAuth ? 'Sign Up' : 'Sign In',
        },
        SUBMIT_SUCCESS: (isAuth: boolean = true) => isAuth ? 'Successfully signed in!' : 'Account successfully created! Please check your email to confirm your account.',
        SUBMIT_ERROR: (isAuth: boolean = true) => isAuth ? 'Failed to sign in' : 'Failed to create account',
      },
    },
  },
};