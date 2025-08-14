import { ProjectLevel, ProjectLabel } from '@/shared/types/types';
import { createProject, ProjectCategory, ExtendedProjectInfo } from '../project-helpers';

/**
 * Средние проекты с использованием Redux и сложной логики
 */
export const MEDIUM_PROJECTS: Record<string, ExtendedProjectInfo> = {
  // Redux State Management
  [ProjectLabel.WeatherWithRedux]: createProject(
    'Weather (Redux)',
    'A simple weather app that displays current weather conditions and forecasts.',
    'weather',
    ProjectLevel.medium,
    ProjectCategory.REDUX
  ),
  
  [ProjectLabel.URLShortenerWithRedux]: createProject(
    'URL Shortener (Redux)',
    'Quickly shorten your long URLs with our easy-to-use URL shortener service.',
    'url-shortener',
    ProjectLevel.medium,
    ProjectCategory.REDUX
  ),
  
  [ProjectLabel.WikiSearcherWithRedux]: createProject(
    'Wiki Searcher',
    'Search for information using Wikipedia API.',
    'wiki-searcher',
    ProjectLevel.medium,
    ProjectCategory.REDUX
  ),

  // Advanced Security & Tools
  [ProjectLabel.PasswordGenerator]: createProject(
    'Password Generator',
    'A secure and customizable password generator tool.',
    'password-generator',
    ProjectLevel.medium,
    ProjectCategory.SECURITY
  ),

  // Complex Games
  [ProjectLabel.HangmanGame]: createProject(
    'Hangman',
    'Try to guess the word by choosing letters.',
    'hangman-game',
    ProjectLevel.medium,
    ProjectCategory.COMPLEX_GAMES
  ),
  
  [ProjectLabel.Quiz]: createProject(
    'Quiz',
    'Interactive quiz application with customizable settings.',
    'quiz',
    ProjectLevel.medium,
    ProjectCategory.COMPLEX_GAMES
  ),

  // Form Management
  [ProjectLabel.FeedbackForm]: createProject(
    'Feedback Form',
    'Interactive feedback form with customizable fields.',
    'feedback-form',
    ProjectLevel.medium,
    ProjectCategory.FORM_MGMT
  ),

  // Financial & Market Data
  [ProjectLabel.CryptoMarketTracker]: createProject(
    'Crypto Market Tracker',
    'Track real-time cryptocurrency market data.',
    'crypto-market-tracker',
    ProjectLevel.medium,
    ProjectCategory.FINANCIAL
  ),

  // Job & Career
  [ProjectLabel.JobsFilter]: createProject(
    'Jobs Filter',
    'Explore and filter job opportunities easily with our Jobs Filter App.',
    'jobs-filter',
    ProjectLevel.medium,
    ProjectCategory.DEV_TOOLS
  ),

  // Social Media & Microblogging
  [ProjectLabel.TwittyMicroposts]: createProject(
    'Twitty Microposts',
    'Modern microblogging platform for creating and sharing short posts.',
    'twitty-microposts',
    ProjectLevel.medium,
    ProjectCategory.SOCIAL
  ),

  // Discovery & Exploration
  [ProjectLabel.BreweryFinder]: createProject(
    'Brewery Finder',
    'Discover and explore a variety of breweries with our comprehensive brewery finder application.',
    'brewery-finder',
    ProjectLevel.medium,
    ProjectCategory.API_INTEGRATION
  ),
  
  [ProjectLabel.CountriesExplorer]: createProject(
    'Countries Explorer',
    'Explore detailed information about countries around the world with our fast and intuitive search application.',
    'countries-explorer',
    ProjectLevel.medium,
    ProjectCategory.API_INTEGRATION
  ),
  
  [ProjectLabel.TheMealExplorer]: createProject(
    'TheMeal Explorer',
    'Discover and explore a world of culinary delights with our extensive meal database.',
    'the-meal-explorer',
    ProjectLevel.medium,
    ProjectCategory.API_INTEGRATION
  ),
  
  [ProjectLabel.CocktailExplorer]: createProject(
    'Cocktail Explorer',
    'Discover and explore a world of cocktails with our extensive database.',
    'cocktail-explorer',
    ProjectLevel.medium,
    ProjectCategory.API_INTEGRATION
  ),

  // News & Information
  [ProjectLabel.HackerNewsSearch]: createProject(
    'HackerNews Search',
    'Find and explore the latest tech news and discussions.',
    'hacker-news-search',
    ProjectLevel.medium,
    ProjectCategory.API_INTEGRATION
  ),

  // Developer Tools
  [ProjectLabel.GitHubUserFinder]: createProject(
    'GitHub User Finder',
    'Explore GitHub profiles with our fast and intuitive user search application.',
    'github-user-finder',
    ProjectLevel.medium,
    ProjectCategory.DEV_TOOLS
  ),

  // Entertainment & Media
  [ProjectLabel.PopcornMovies]: createProject(
    'Popcorn Movies',
    'An interactive movie database application. Browse, search, and explore a vast collection of films.',
    'popcorn-movies',
    ProjectLevel.medium,
    ProjectCategory.ENTERTAINMENT
  ),

  // E-commerce & Shopping
  [ProjectLabel.ShoppingMarketCart]: createProject(
    'Shopping Market Cart',
    'An interactive e-commerce application with a fully functional shopping cart.',
    'shopping-market-cart',
    ProjectLevel.medium,
    ProjectCategory.ECOMMERCE
  ),
  
  [ProjectLabel.MobileStoreCart]: createProject(
    'Mobile Store Cart',
    'Easy shopping with real-time cart updates and seamless checkout process.',
    'mobile-store-cart',
    ProjectLevel.medium,
    ProjectCategory.ECOMMERCE
  ),

  // Library & Book Management
  [ProjectLabel.BookHub]: createProject(
    'Book Hub',
    'An interactive digital library application that allows users to search, explore, and manage their favorite books.',
    'book-hub',
    ProjectLevel.medium,
    ProjectCategory.LIBRARY_MGMT
  ),

  // Task & Project Management
  [ProjectLabel.TodoList]: createProject(
    'TodoList',
    'Organize your tasks efficiently with our comprehensive TodoList application.',
    'todo-list',
    ProjectLevel.medium,
    ProjectCategory.TASK_MGMT
  ),

  // Advanced Calculators
  [ProjectLabel.AgeCalculator_1]: createProject(
    'Age Calculator',
    'Calculate exact age in years, months, and days based on birth date.',
    'age-calculator',
    ProjectLevel.medium,
    ProjectCategory.ADVANCED_CALC
  ),
};

/**
 * Функция для получения всех средних проектов
 */
export function getMediumProjects(): Record<string, ExtendedProjectInfo> {
  return MEDIUM_PROJECTS;
}

/**
 * Функция для получения средних проектов по категории
 */
export function getMediumProjectsByCategory(category: ProjectCategory): Record<string, ExtendedProjectInfo> {
  return Object.entries(MEDIUM_PROJECTS).reduce((acc, [key, project]) => {
    if (project.category === category) {
      acc[key] = project;
    }
    return acc;
  }, {} as Record<string, ExtendedProjectInfo>);
} 