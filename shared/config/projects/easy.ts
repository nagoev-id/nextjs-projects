import { ProjectLabel, ProjectLevel } from '@/shared/types/types';
import { createProject, ExtendedProjectInfo, ProjectCategory } from '../project-helpers';

/**
 * Легкие проекты, организованные по категориям
 */
export const EASY_PROJECTS: Record<string, ExtendedProjectInfo> = {
  // Basic UI Components & Interactions
  [ProjectLabel.Counter]: createProject(
    'Counter',
    'A simple and interactive counter application.',
    'counter',
    ProjectLevel.easy,
    ProjectCategory.UI_COMPONENTS,
  ),

  [ProjectLabel.AccordionComponent]: createProject(
    'Accordion Component',
    'Interactive accordion component with customizable behavior.',
    'accordion-component',
    ProjectLevel.easy,
    ProjectCategory.UI_COMPONENTS,
  ),

  [ProjectLabel.DynamicTabs]: createProject(
    'Dynamic Tabs',
    'Interactive tab component with vertical and horizontal layouts.',
    'dynamic-tabs',
    ProjectLevel.easy,
    ProjectCategory.UI_COMPONENTS,
  ),

  [ProjectLabel.DropdownUI]: createProject(
    'Dropdown UI',
    'Interactive dropdown component with various options.',
    'dropdown-ui',
    ProjectLevel.easy,
    ProjectCategory.UI_COMPONENTS,
  ),

  [ProjectLabel.ModalWindow]: createProject(
    'Modal Window',
    'Interactive modal window component with overlay and content.',
    'modal-window',
    ProjectLevel.easy,
    ProjectCategory.UI_COMPONENTS,
  ),

  [ProjectLabel.ToastNotification]: createProject(
    'Toast Notification',
    'Toast Notification App - Manage and display custom notifications.',
    'toast-notification',
    ProjectLevel.easy,
    ProjectCategory.UI_COMPONENTS,
  ),

  // Theme & Design
  [ProjectLabel.DarkTheme]: createProject(
    'Dark Theme',
    'Experience our app with customizable dark and light themes for optimal viewing comfort.',
    'dark-theme',
    ProjectLevel.easy,
    ProjectCategory.THEME_DESIGN,
  ),

  [ProjectLabel.ColorGenerator]: createProject(
    'Color Generator',
    'A simple color generator tool that creates random HEX colors.',
    'color-generator',
    ProjectLevel.easy,
    ProjectCategory.THEME_DESIGN,
  ),

  [ProjectLabel.ColorFinder]: createProject(
    'Color Finder',
    'An interactive color finder application that allows users to select and get information about colors.',
    'color-finder',
    ProjectLevel.easy,
    ProjectCategory.THEME_DESIGN,
  ),

  // Text & Character Tools
  [ProjectLabel.CharacterCounter]: createProject(
    'Character Counter',
    'A simple character counter application.',
    'character-counter',
    ProjectLevel.easy,
    ProjectCategory.TEXT_TOOLS,
  ),

  [ProjectLabel.TextExpander]: createProject(
    'Text Expander',
    'Interactive expandable text component showcasing space travel content.',
    'text-expander',
    ProjectLevel.easy,
    ProjectCategory.TEXT_TOOLS,
  ),

  [ProjectLabel.TypewriterEffect]: createProject(
    'Typewriter Effect',
    'A typewriter effect demonstration showcasing dynamic text animation.',
    'typewriter-effect',
    ProjectLevel.easy,
    ProjectCategory.TEXT_TOOLS,
  ),

  [ProjectLabel.SaveTextAsFile]: createProject(
    'Save Text As File',
    'Save your text as various file types.',
    'save-text-file',
    ProjectLevel.easy,
    ProjectCategory.TEXT_TOOLS,
  ),

  [ProjectLabel.TTS]: createProject(
    'Text To Speech Converter',
    'Convert text to speech with customizable voices.',
    'tts',
    ProjectLevel.easy,
    ProjectCategory.TEXT_TOOLS,
  ),

  // Time & Date Tools
  [ProjectLabel.Timer]: createProject(
    'Timer',
    'An interactive timer application that allows users to set and track custom timers.',
    'timer',
    ProjectLevel.easy,
    ProjectCategory.TIME_DATE,
  ),

  [ProjectLabel.StopWatch]: createProject(
    'StopWatch',
    'A simple stopwatch application that allows you to start, pause, and reset time.',
    'stopwatch',
    ProjectLevel.easy,
    ProjectCategory.TIME_DATE,
  ),

  [ProjectLabel.Countdown]: createProject(
    'Countdown',
    'Interactive countdown timer application.',
    'countdown',
    ProjectLevel.easy,
    ProjectCategory.TIME_DATE,
  ),

  [ProjectLabel.EventCountdown]: createProject(
    'Event Countdown',
    '',
    'event-countdown',
    ProjectLevel.easy,
    ProjectCategory.TIME_DATE,
  ),

  [ProjectLabel.AlarmClock]: createProject(
    'Alarm Clock',
    'An interactive alarm clock application with customizable settings and real-time display.',
    'alarm-clock',
    ProjectLevel.easy,
    ProjectCategory.TIME_DATE,
  ),

  [ProjectLabel.DateCounter]: createProject(
    'Date Counter',
    'Interactive date counter application.',
    'date-counter',
    ProjectLevel.easy,
    ProjectCategory.TIME_DATE,
  ),

  [ProjectLabel.AgeCalculator_0]: createProject(
    'Age Calculator',
    'Calculate exact age in years, months, and days based on birth date.',
    'age-calculator',
    ProjectLevel.easy,
    ProjectCategory.TIME_DATE,
  ),

  // Calculators & Converters
  [ProjectLabel.Calculator]: createProject(
    'Calculator',
    'A simple and efficient calculator app built with React.',
    'calculator',
    ProjectLevel.easy,
    ProjectCategory.CALCULATORS,
  ),

  [ProjectLabel.UnitConversionTool]: createProject(
    'Unit Conversion Tool',
    'A versatile type converter for weight, temperature, and more. Convert between different units of measurement quickly and easily.',
    'unit-conversion-tool',
    ProjectLevel.easy,
    ProjectCategory.CALCULATORS,
  ),

  [ProjectLabel.CurrencyConverter]: createProject(
    'Currency Converter',
    'A currency converter application that allows users to convert between different currencies and view exchange rates.',
    'currency-converter',
    ProjectLevel.easy,
    ProjectCategory.CALCULATORS,
  ),

  [ProjectLabel.LoanCalculator]: createProject(
    'Loan Calculator',
    'Calculate your loan payments with our easy-to-use Loan Calculator.',
    'loan-calculator',
    ProjectLevel.easy,
    ProjectCategory.CALCULATORS,
  ),

  // Games & Entertainment
  [ProjectLabel.GuessTheNumber]: createProject(
    'Guess the Number',
    'Play the exciting \'Guess the Number\' game. Try to guess a number between 1 and 10 in as few attempts as possible.',
    'guess-the-number',
    ProjectLevel.easy,
    ProjectCategory.GAMES,
  ),

  [ProjectLabel.GuessTheNumberCLI]: createProject(
    'Guess the Number CLI',
    'Play the exciting \'Guess the Number\' game. Try to guess a number between 0 and 100 in as few attempts as possible.',
    'guess-the-number-cli',
    ProjectLevel.easy,
    ProjectCategory.GAMES,
  ),

  [ProjectLabel.RockPaperScissors]: createProject(
    'Rock Paper Scissors Game',
    'Play Rock, Paper, Scissors against the computer. Best of 3 attempts!',
    'rock-paper-scissors',
    ProjectLevel.easy,
    ProjectCategory.GAMES,
  ),

  [ProjectLabel.RollDice]: createProject(
    'Roll Dice',
    'A dice rolling game where two players compete to reach 100 points.',
    'roll-dice',
    ProjectLevel.easy,
    ProjectCategory.GAMES,
  ),

  [ProjectLabel.MemoryMatchingGame]: createProject(
    'Memory Matching',
    'An engaging memory game where you match pairs of cards to challenge and improve your memory skills.',
    'memory-matching-game',
    ProjectLevel.easy,
    ProjectCategory.GAMES,
  ),

  [ProjectLabel.WordScramble]: createProject(
    'Word Scramble',
    'A word scramble game where you unscramble words against the clock.',
    'word-scramble',
    ProjectLevel.easy,
    ProjectCategory.GAMES,
  ),

  [ProjectLabel.TypingSpeedTest]: createProject(
    'Typing Speed Test',
    'Test your typing speed and accuracy with this interactive typing speed test.',
    'typing-speed-test',
    ProjectLevel.easy,
    ProjectCategory.GAMES,
  ),

  // Остальные категории можно добавить по аналогии...
  // Для краткости оставлю несколько примеров из каждой категории

  // Personal Management
  [ProjectLabel.ExpenseTracker]: createProject(
    'Expense Tracker',
    'Track your expenses and income with this simple Expense Tracker app.',
    'expense-tracker',
    ProjectLevel.easy,
    ProjectCategory.PERSONAL_MGMT,
  ),

  [ProjectLabel.WaterTracker]: createProject(
    'Water Tracker',
    'Track your daily water intake and stay hydrated with reminders and progress visualization.',
    'drink-water-tracker',
    ProjectLevel.easy,
    ProjectCategory.PERSONAL_MGMT,
  ),

  // Utilities & Tools
  [ProjectLabel.URLShortener]: createProject(
    'URL Shortener',
    'Quickly shorten your long URLs with our easy-to-use URL shortener service.',
    'url-shortener',
    ProjectLevel.easy,
    ProjectCategory.UTILITIES,
  ),

  [ProjectLabel.QRCodeGenerator]: createProject(
    'QR Code Generator',
    'Generate QR codes easily with customizable size and content.',
    'qr-code-generator',
    ProjectLevel.easy,
    ProjectCategory.QR_FILES,
  ),

  [ProjectLabel.NumberToWordConverter]: createProject(
    'Number To Word Converter',
    'Convert numbers to words with our easy-to-use Number To Word Converter.',
    'number-to-word-converter',
    ProjectLevel.easy,
    ProjectCategory.TEXT_TOOLS,
  ),
};

/**
 * Функция для получения всех легких проектов
 */
export function getEasyProjects(): Record<string, ExtendedProjectInfo> {
  return EASY_PROJECTS;
}

/**
 * Функция для получения легких проектов по категории
 */
export function getEasyProjectsByCategory(category: ProjectCategory): Record<string, ExtendedProjectInfo> {
  return Object.entries(EASY_PROJECTS).reduce((acc, [key, project]) => {
    if (project.category === category) {
      acc[key] = project;
    }
    return acc;
  }, {} as Record<string, ExtendedProjectInfo>);
} 