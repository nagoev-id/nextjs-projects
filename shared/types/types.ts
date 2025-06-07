/**
 * @enum {string}
 * @description Перечисление уровней сложности проекта
 */
export enum ProjectLevel {
  easy = 'easy',
  medium = 'medium',
  hard = 'hard',
}

/**
 * @typedef {Object} ProjectInfo
 * @description Тип, описывающий информацию о проекте
 * @property {string} title - Заголовок проекта
 * @property {string} description - Описание проекта
 * @property {string} href - Ссылка на проект
 * @property {ProjectLevel} level - Уровень сложности проекта
 */
export type ProjectInfo = {
  title: string;
  description: string;
  href: string;
  level: ProjectLevel;
}

/**
 * @enum {string}
 * @description Перечисление меток проектов
 * @example
 */
export enum ProjectLabel {
  Counter = 'Counter',
  ColorGenerator = 'ColorGenerator',
  Timer = 'Timer',
  DarkTheme = 'DarkTheme',
  CharacterCounter = 'CharacterCounter',
  FlashCards = 'FlashCards',
  CompanyStatistics = 'CompanyStatistics',
  NumberFacts = 'NumberFacts',
  TextExpander = 'TextExpander',
  StopWatch = 'StopWatch',
  Countdown = 'Countdown',
  UserSearch = 'UserSearch',
  KeyEventListener = 'KeyEventListener',
  AlarmClock = 'AlarmClock',
  RandomUserGenerator = 'RandomUserGenerator',
  APISearchTool = 'APISearchTool',
  DateCounter = 'DateCounter',
  DynamicTabs = 'DynamicTabs',
  AccordionComponent = 'AccordionComponent',
  UnitConversionTool = 'UnitConversionTool',
  AccountVerification = 'AccountVerification',
  DropdownUI = 'DropdownUI',
  TheFacts = 'TheFacts',
  CookieConsent = 'CookieConsent',
  ModalWindow = 'ModalWindow',
  GuessTheNumber = 'GuessTheNumber',
  GuessTheNumberCLI = 'GuessTheNumberCLI',
  Weather = 'Weather',
  WeatherWithRedux = 'Weather (Redux)',
  URLShortener = 'URLShortener',
  URLShortenerWithRedux = 'URLShortener (Redux)',
  ExpenseTracker = 'ExpenseTracker',
  CurrencyConverter = 'CurrencyConverter',
  SaveTextAsFile = 'SaveTextAsFile',
  TagInputBox = 'TagInputBox',
  WikiSearcher = 'WikiSearcher',
  WikiSearcherWithRedux = 'WikiSearcher (Redux)',
  OnlineTranslator = 'OnlineTranslator',
  LoanCalculator = 'LoanCalculator',
  ColorFinder = 'ColorFinder',
  PasswordGenerator = 'PasswordGenerator',
  TTS = 'TTS',
  ToastNotification = 'ToastNotification',
  RockPaperScissors = 'RockPaperScissors',
  QRCodeScanner = 'QRCodeScanner',
  QRCodeGenerator = 'QRCodeGenerator',
  ProductFilter = 'ProductFilter',
  ProductsTab = 'ProductsTab',
  QuoteGenerator = 'QuoteGenerator',
  Calculator = 'Calculator',
  BreathingRelaxation = 'BreathingRelaxation',
  HangmanGame = 'HangmanGame',
  FeedbackForm = 'FeedbackForm',
  Quiz = 'Quiz',
  WordScramble = 'WordScramble',
  WorkoutTracker = 'WorkoutTracker',
  RollDice = 'RollDice',
  DataTableSort = 'DataTableSort',
  EatAndSplit = 'EatAndSplit',
  FarAway = 'FarAway',
  GitHubUsersList = 'GitHubUsersList',
  UserTableSort = 'UserTableSort',
  CryptoMarketTracker = 'CryptoMarketTracker',
  ZipCode = 'ZipCode',
  IPAddressTracker = 'IPAddressTracker',
  ImageResizer = 'ImageResizer',
  ImageEditor = 'ImageEditor',
  TypingSpeedTest = 'TypingSpeedTest',
  TypewriterEffect = 'TypewriterEffect',
  PriceRangeSlider = 'PriceRangeSlider',
  Pokedex = 'Pokedex',
  MemoryMatchingGame = 'MemoryMatchingGame',
  PasswordStrengthChecker = 'PasswordStrengthChecker',
  JobsFilter = 'JobsFilter',
  TwittyMicroposts = 'TwittyMicroposts',
  BreweryFinder = 'BreweryFinder',
  HackerNewsSearch = 'HackerNewsSearch',
  CountriesExplorer = 'CountriesExplorer',
  GitHubUserFinder = 'GitHubUserFinder',
  TheMealExplorer = 'TheMealExplorer',
  CocktailExplorer = 'CocktailExplorer',
  PopcornMovies = 'PopcornMovies',
  ShoppingMarketCart = 'ShoppingMarketCart',
  BookHub = 'BookHub',
  TodoList = 'TodoList',
  MobileStoreCart = 'MobileStoreCart',
  StateCapitalLookup = 'StateCapitalLookup',
  MovieSeatBooking = 'MovieSeatBooking',
}

/**
 * @typedef {Object.<ProjectLabel, ProjectInfo>} ListOfProjects
 * @description Тип, представляющий список проектов, где ключ - метка проекта, а значение - информация о проекте
 */
export type ListOfProjects = Record<ProjectLabel, ProjectInfo>;


