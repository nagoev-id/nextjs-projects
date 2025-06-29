import { ListOfProjects, ProjectLabel, ProjectLevel } from '@/shared/types/types';
import { Metadata } from 'next';

/**
 * @constant
 * @type {Metadata}
 * @description Метаданные проекта, используемые для SEO и описания приложения
 * @property {string} title - Заголовок проекта
 * @property {string} description - Краткое описание проекта
 * @property {string[]} keywords - Ключевые слова для SEO
 * @property {Object[]} authors - Информация об авторах проекта
 * @property {string} authors[].name - Имя автора
 * @property {string} authors[].url - URL профиля автора
 */
export const PROJECTS_METADATA: Metadata = {
  title: 'Next.js Starter Template',
  description: 'A Next.js starter template with a minimalistic design and a clean code structure.',
  keywords: ['Next.js', 'React'],
  authors: [{ name: 'Alim Nagoev', url: 'https://github.com/nagoev-alim' }],
};

/**
 * @constant
 * @type {ListOfProjects}
 * @description Список всех проектов, сгруппированных по уровню сложности и типу
 */
export const PROJECTS_LIST: ListOfProjects = {
  // Easy projects
  [ProjectLabel.Counter]: {
    title: 'Counter',
    description: 'A simple and interactive counter application.',
    href: 'easy/counter',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.ColorGenerator]: {
    title: 'Color Generator',
    description: 'A simple color generator tool that creates random HEX colors.',
    href: 'easy/color-generator',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.Timer]: {
    title: 'Timer',
    description: 'An interactive timer application that allows users to set and track custom timers.',
    href: 'easy/timer',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.DarkTheme]: {
    title: 'Dark Theme',
    description: 'Experience our app with customizable dark and light themes for optimal viewing comfort.',
    href: 'easy/dark-theme',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.CharacterCounter]: {
    title: 'Character Counter',
    description: 'A simple character counter application.',
    href: 'easy/character-counter',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.FlashCards]: {
    title: 'Flash Cards',
    description: 'Interactive Flash Cards for React learning.',
    href: 'easy/flash-cards',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.CompanyStatistics]: {
    title: 'Company Statistics',
    description: 'Our company statistics showing successful projects, working hours, and happy clients.',
    href: 'easy/company-statistics',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.NumberFacts]: {
    title: 'Number Facts',
    description: 'Discover interesting facts about numbers.',
    href: 'easy/number-facts',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.TextExpander]: {
    title: 'Text Expander',
    description: 'Interactive expandable text component showcasing space travel content.',
    href: 'easy/text-expander',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.StopWatch]: {
    title: 'StopWatch',
    description: 'A simple stopwatch application that allows you to start, pause, and reset time.',
    href: 'easy/stopwatch',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.Countdown]: {
    title: 'Countdown',
    description: 'Interactive countdown timer application.',
    href: 'easy/countdown',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.UserSearch]: {
    title: 'User Search',
    description: 'A dynamic user search application with real-time filtering capabilities.',
    href: 'easy/user-search',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.KeyEventListener]: {
    title: 'Key Event Listener',
    description: 'A simple keyboard event listener that displays pressed key information.',
    href: 'easy/key-event-listener',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.AlarmClock]: {
    title: 'Alarm Clock',
    description: 'An interactive alarm clock application with customizable settings and real-time display.',
    href: 'easy/alarm-clock',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.RandomUserGenerator]: {
    title: 'Random User Generator',
    description: 'Generate random user data with interactive category selection.',
    href: 'easy/random-user-generator',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.APISearchTool]: {
    title: 'API Search Tool',
    description: 'Search and explore various APIs across different categories.',
    href: 'easy/api-search-tool',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.DateCounter]: {
    title: 'Date Counter',
    description: 'Interactive date counter application.',
    href: 'easy/date-counter',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.DynamicTabs]: {
    title: 'Dynamic Tabs',
    description: 'Interactive tab component with vertical and horizontal layouts.',
    href: 'easy/dynamic-tabs',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.AccordionComponent]: {
    title: 'Accordion Component',
    description: 'Interactive accordion component with customizable behavior.',
    href: 'easy/accordion-component',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.UnitConversionTool]: {
    title: 'Unit Conversion Tool',
    description: 'A versatile type converter for weight, temperature, and more. Convert between different units of measurement quickly and easily.',
    href: 'easy/unit-conversion-tool',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.AccountVerification]: {
    title: 'Account Verification',
    description: 'Verify your account by entering the six-digit code.',
    href: 'easy/account-verification',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.DropdownUI]: {
    title: 'Dropdown UI',
    description: 'Interactive dropdown component with various options.',
    href: 'easy/dropdown-ui',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.TheFacts]: {
    title: 'The Facts',
    description: 'Discover random interesting tidbits across various topics.',
    href: 'easy/the-facts',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.CookieConsent]: {
    title: 'Cookie Consent',
    description: 'This website uses cookies to enhance your browsing experience. Manage your cookie preferences.',
    href: 'easy/cookie-consent',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.ModalWindow]: {
    title: 'Modal Window',
    description: 'Interactive modal window component with overlay and content.',
    href: 'easy/modal-window',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.GuessTheNumber]: {
    title: 'Guess the Number',
    description: 'Play the exciting \'Guess the Number\' game. Try to guess a number between 1 and 10 in as few attempts as possible.',
    href: 'easy/guess-the-number',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.GuessTheNumberCLI]: {
    title: 'Guess the Number CLI',
    description: 'Play the exciting \'Guess the Number\' game. Try to guess a number between 0 and 100 in as few attempts as possible.',
    href: 'easy/guess-the-number-cli',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.Weather]: {
    title: 'Weather',
    description: 'A simple weather app that displays current weather conditions and forecasts.',
    href: 'easy/weather',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.URLShortener]: {
    title: 'URL Shortener',
    description: 'Quickly shorten your long URLs with our easy-to-use URL shortener service.',
    href: 'easy/url-shortener',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.ExpenseTracker]: {
    title: 'Expense Tracker',
    description: 'Track your expenses and income with this simple Expense Tracker app.',
    href: 'easy/expense-tracker',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.CurrencyConverter]: {
    title: 'Currency Converter',
    description: 'A currency converter application that allows users to convert between different currencies and view exchange rates.',
    href: 'easy/currency-converter',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.SaveTextAsFile]: {
    title: 'Save Text As File',
    description: 'Save your text as various file types.',
    href: 'easy/save-text-file',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.TagInputBox]: {
    title: 'Tag Input Box',
    description: 'A simple and interactive tag management system.',
    href: 'easy/tag-input-box',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.WikiSearcher]: {
    title: 'Wiki Searcher',
    description: 'Search for information using Wikipedia API.',
    href: 'easy/wiki-searcher',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.OnlineTranslator]: {
    title: 'Online Translator',
    description: 'Translate text between multiple languages with ease.',
    href: 'easy/online-translator',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.LoanCalculator]: {
    title: 'Loan Calculator',
    description: 'Calculate your loan payments with our easy-to-use Loan Calculator.',
    href: 'easy/loan-calculator',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.ColorFinder]: {
    title: 'Color Finder',
    description: 'An interactive color finder application that allows users to select and get information about colors.',
    href: 'easy/color-finder',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.TTS]: {
    title: 'Text To Speech Converter',
    description: 'Convert text to speech with customizable voices.',
    href: 'easy/tts',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.ToastNotification]: {
    title: 'Toast Notification',
    description: 'Toast Notification App - Manage and display custom notifications.',
    href: 'easy/toast-notification',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.RockPaperScissors]: {
    title: 'Rock Paper Scissors Game',
    description: 'Play Rock, Paper, Scissors against the computer. Best of 3 attempts!',
    href: 'easy/rock-paper-scissors',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.QRCodeScanner]: {
    title: 'QR Code Scanner',
    description: 'QR Code Scanner: Easily scan and process QR codes online.',
    href: 'easy/qr-code-scanner',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.QRCodeGenerator]: {
    title: 'QR Code Generator',
    description: 'Generate QR codes easily with customizable size and content.',
    href: 'easy/qr-code-generator',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.ProductFilter]: {
    title: 'Product Filter',
    description: 'Interactive product filtering application.',
    href: 'easy/product-filter',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.ProductsTab]: {
    title: 'Products Tab',
    description: 'Interactive product tabs filtering application.',
    href: 'easy/products-tab',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.QuoteGenerator]: {
    title: 'Quote Generator',
    description: 'Generate random quotes from various sources.',
    href: 'easy/quote-generator',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.Calculator]: {
    title: 'Calculator',
    description: 'A simple and efficient calculator app built with React.',
    href: 'easy/calculator',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.BreathingRelaxation]: {
    title: 'Breathing Relaxation',
    description: 'A relaxation app that guides you through breathing exercises.',
    href: 'easy/breathing-relaxation',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.WordScramble]: {
    title: 'Word Scramble',
    description: 'A word scramble game where you unscramble words against the clock.',
    href: 'easy/word-scramble',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.WorkoutTracker]: {
    title: 'Workout Tracker',
    description: 'Track and manage your workouts with this simple and effective workout tracker.',
    href: 'easy/workout-tracker',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.RollDice]: {
    title: 'Roll Dice',
    description: 'A dice rolling game where two players compete to reach 100 points.',
    href: 'easy/roll-dice',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.DataTableSort]: {
    title: 'Table Sort',
    description: 'Interactive data table with advanced sorting and filtering capabilities.',
    href: 'easy/data-table-sort',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.UserTableSort]: {
    title: 'User Table Sort',
    description: 'Interactive data table with advanced sorting and filtering capabilities.',
    href: 'easy/user-table-sort',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.EatAndSplit]: {
    title: 'Eat And Split',
    description: 'A user-friendly app for managing shared expenses among friends.',
    href: 'easy/eat-and-split',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.FarAway]: {
    title: 'Far Away',
    description: 'An interactive packing list app for travelers.',
    href: 'easy/far-away',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.GitHubUsersList]: {
    title: 'GitHub Users List',
    description: 'A web application that displays a paginated list of GitHub users.',
    href: 'easy/github-users-list',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.ZipCode]: {
    title: 'ZipCode',
    description: 'Find location details using zip codes from various countries.',
    href: 'easy/zipcode',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.IPAddressTracker]: {
    title: 'IP Address Tracker',
    description: 'Track and locate IP addresses with our user-friendly IP Address Tracker.',
    href: 'easy/ip-address-tracker',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.ImageResizer]: {
    title: 'Image Resizer',
    description: 'An interactive web application for resizing and downloading images.',
    href: 'easy/image-resizer',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.ImageEditor]: {
    title: 'Image Editor',
    description: 'Image editor with filters, rotation, and flip features.',
    href: 'easy/image-editor',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.TypingSpeedTest]: {
    title: 'Typing Speed Test',
    description: 'Test your typing speed and accuracy with this interactive typing speed test.',
    href: 'easy/typing-speed-test',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.TypewriterEffect]: {
    title: 'Typewriter Effect',
    description: 'A typewriter effect demonstration showcasing dynamic text animation.',
    href: 'easy/typewriter-effect',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.PriceRangeSlider]: {
    title: 'Price Range Slider',
    description: 'Interactive price slider for selecting a price range.',
    href: 'easy/price-range-slider',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.Pokedex]: {
    title: 'Pokedex App',
    description: 'Explore the world of Pokémon with our interactive Pokedex app.',
    href: 'easy/pokedex',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.MemoryMatchingGame]: {
    title: 'Memory Matching',
    description: 'An engaging memory game where you match pairs of cards to challenge and improve your memory skills.',
    href: 'easy/memory-matching-game',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.PasswordStrengthChecker]: {
    title: 'Password Strength Checker',
    description: 'An interactive tool that evaluates password security in real-time.',
    href: 'easy/password-strength-checker',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.StateCapitalLookup]: {
    title: 'State Capital Lookup',
    description: 'Look up the capital city for any U.S. state with this interactive tool.',
    href: 'easy/state-capital-lookup',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.MovieSeatBooking]: {
    title: 'Movie Seat Booking',
    description: 'Book your movie seats online with our interactive seat booking application.',
    href: 'easy/movie-seat-booking',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.WaterTracker]: {
    title: 'Water Tracker',
    description: 'Track your daily water intake and stay hydrated with reminders and progress visualization.',
    href: 'easy/drink-water-tracker',
    level: ProjectLevel.easy,
  },
  [ProjectLabel.AgeCalculator_0]: {
    title: 'Age Calculator',
    description: 'Calculate exact age in years, months, and days based on birth date.',
    href: 'easy/age-calculator',
    level: ProjectLevel.easy,
  },

  // Medium projects
  [ProjectLabel.WeatherWithRedux]: {
    title: 'Weather (Redux)',
    description: 'A simple weather app that displays current weather conditions and forecasts.',
    href: 'medium/weather',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.URLShortenerWithRedux]: {
    title: 'URL Shortener (Redux)',
    description: 'Quickly shorten your long URLs with our easy-to-use URL shortener service.',
    href: 'medium/url-shortener',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.WikiSearcherWithRedux]: {
    title: 'Wiki Searcher',
    description: 'Search for information using Wikipedia API.',
    href: 'medium/wiki-searcher',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.PasswordGenerator]: {
    title: 'Password Generator',
    description: 'A secure and customizable password generator tool.',
    href: 'medium/password-generator',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.HangmanGame]: {
    title: 'Hangman',
    description: 'Try to guess the word by choosing letters.',
    href: 'medium/hangman-game',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.FeedbackForm]: {
    title: 'Feedback Form',
    description: 'Interactive feedback form with customizable fields.',
    href: 'medium/feedback-form',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.Quiz]: {
    title: 'Quiz',
    description: 'Interactive quiz application with customizable settings.',
    href: 'medium/quiz',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.CryptoMarketTracker]: {
    title: 'Crypto Market Tracker',
    description: 'Track real-time cryptocurrency market data.',
    href: 'medium/crypto-market-tracker',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.JobsFilter]: {
    title: 'Jobs Filter',
    description: 'Explore and filter job opportunities easily with our Jobs Filter App.',
    href: 'medium/jobs-filter',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.TwittyMicroposts]: {
    title: 'Twitty Microposts',
    description: 'Modern microblogging platform for creating and sharing short posts.',
    href: 'medium/twitty-microposts',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.BreweryFinder]: {
    title: 'Brewery Finder',
    description: 'Discover and explore a variety of breweries with our comprehensive brewery finder application.',
    href: 'medium/brewery-finder',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.HackerNewsSearch]: {
    title: 'HackerNews Search',
    description: 'Find and explore the latest tech news and discussions.',
    href: 'medium/hacker-news-search',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.CountriesExplorer]: {
    title: 'Countries Explorer',
    description: 'Explore detailed information about countries around the world with our fast and intuitive search application.',
    href: 'medium/countries-explorer',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.GitHubUserFinder]: {
    title: 'GitHub User Finder',
    description: 'Explore GitHub profiles with our fast and intuitive user search application.',
    href: 'medium/github-user-finder',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.TheMealExplorer]: {
    title: 'TheMeal Explorer',
    description: 'Discover and explore a world of culinary delights with our extensive meal database.',
    href: 'medium/the-meal-explorer',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.CocktailExplorer]: {
    title: 'Cocktail Explorer',
    description: 'Discover and explore a world of cocktails with our extensive database.',
    href: 'medium/cocktail-explorer',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.PopcornMovies]: {
    title: 'Popcorn Movies',
    description: 'An interactive movie database application. Browse, search, and explore a vast collection of films.',
    href: 'medium/popcorn-movies',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.ShoppingMarketCart]: {
    title: 'Shopping Market Cart',
    description: 'An interactive e-commerce application with a fully functional shopping cart.',
    href: 'medium/shopping-market-cart',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.BookHub]: {
    title: 'Book Hub',
    description: 'An interactive digital library application that allows users to search, explore, and manage their favorite books.',
    href: 'medium/book-hub',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.TodoList]: {
    title: 'TodoList',
    description: 'Organize your tasks efficiently with our comprehensive TodoList application.',
    href: 'medium/todo-list',
    level: ProjectLevel.medium,
  },
  [ProjectLabel.MobileStoreCart]: {
    title: 'Mobile Store Cart',
    description: 'Easy shopping with real-time cart updates and seamless checkout process.',
    href: 'medium/mobile-store-cart',
    level: ProjectLevel.medium,
  },

  // Hard projects
  // [ProjectLabel.TodoList_H]: {
  //   title: 'TodoList_H',
  //   description: 'Organize your tasks efficiently with our comprehensive TodoList application.',
  //   href: 'hard/todo-list',
  //   level: ProjectLevel.hard,
  // },
  // [ProjectLabel.PhotoGallery_0]: {
  //   title: 'Photo Gallery',
  //   description: 'A photo gallery application for organizing, viewing, and managing your images with advanced filtering and search capabilities.',
  //   href: 'hard/photo-gallery',
  //   level: ProjectLevel.hard,
  // },
  // [ProjectLabel.Chat_0]: {
  //   title: 'Chat',
  //   description: '',
  //   href: 'hard/chat',
  //   level: ProjectLevel.hard,
  // },
  // [ProjectLabel.PetsTinder_0]: {
  //   title: 'Pets Tinder',
  //   description: '',
  //   href: 'hard/pets-tinder',
  //   level: ProjectLevel.hard,
  // },
  // [ProjectLabel.HabitTracker_0]: {
  //   title: 'Habit Tracker',
  //   description: '',
  //   href: 'hard/habit-tracker',
  //   level: ProjectLevel.hard,
  // },
  // [ProjectLabel.AgeCalculator_0]: {
  //   title: 'Age Calculator',
  //   description: '',
  //   href: 'hard/age-calculator',
  //   level: ProjectLevel.hard,
  // },
};