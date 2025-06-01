'use client';

/**
 * # Приложение Pokedex
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация и загрузка данных:**
 *    - При загрузке компонента, приложение инициализирует состояние для хранения данных о покемонах.
 *    - Выполняется асинхронный запрос к API PokeAPI для получения информации о первых 39 покемонах.
 *    - Полученные данные форматируются и сохраняются в состоянии приложения.
 *
 * 2. **Отображение списка покемонов:**
 *    - Список покемонов отображается в виде сетки карточек.
 *    - Каждая карточка содержит изображение покемона, его номер, имя и тип.
 *    - Цвет фона карточки соответствует типу покемона.
 *
 * 3. **Пагинация:**
 *    - Реализована пагинация для удобного просмотра большого количества покемонов.
 *    - Пользователь может переключаться между страницами, используя кнопки навигации.
 *
 * 4. **Детальная информация о покемоне:**
 *    - При клике на карточку покемона открывается модальное окно с дополнительной информацией.
 *    - Выполняется дополнительный запрос к API для получения детальных данных о выбранном покемоне.
 *    - В модальном окне отображается изображение покемона, его поколение, эффект и способность.
 *
 * 5. **Обработка ошибок:**
 *    - Реализована обработка ошибок при загрузке данных.
 *    - В случае ошибки пользователю отображается соответствующее сообщение.
 *
 * 6. **Адаптивный дизайн:**
 *    - Интерфейс адаптируется под различные размеры экрана, изменяя количество колонок в сетке покемонов.
 *
 * 7. **Доступность:**
 *    - Реализованы базовые принципы доступности, включая альтернативный текст для изображений и ARIA-атрибуты.
 *
 * Приложение предоставляет удобный интерфейс для просмотра информации о покемонах, сочетая в себе
 * функциональность API PokeAPI и современные практики разработки React-приложений.
 */

import { Card } from '@/components/ui/card';
import React, { JSX, useCallback, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Spinner } from '@/components/ui/spinner';
import {
  ButtonType,
  InitialPokemonState,
  Pokemon,
  PokemonApiResponse,
  PokemonCardData,
  PokemonData,
} from '@/app/projects/easy/pokedex/utils';

import { toast } from 'sonner';
import Image from 'next/image';
import { Badge, Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui';
import { usePagination } from '@/shared/hooks';

/**
 * Константы по умолчанию для приложения Pokedex
 * @type {PokemonData}
 */
const DEFAULT_DATA: PokemonData = {
  count: 40,
  color: {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5',
  },
  apiUrl: 'https://pokeapi.co/api/v2/pokemon',
  spritesUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon',
};

/**
 * Компонент страницы Pokedex
 * @returns {JSX.Element} Разметка страницы Pokedex
 */
export default function Page(): JSX.Element {
  /**
   * Состояние для хранения данных о покемонах и статуса загрузки
   */
  const [initialPokemonState, setInitialPokemonState] = useState<InitialPokemonState>({
    collection: [],
    selectedPokemon: null,
    isLoading: false,
    isError: null,
    isSuccess: false,
  });

  /**
   * Состояние для управления видимостью модального окна
   */
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  /**
   * Хук пагинации для управления отображением покемонов
   */
  const {
    currentPage,
    paginatedData,
    handlePaginationClick,
    handlePaginationNumberClick,
  } = usePagination<Pokemon>(initialPokemonState.collection, 10);

  /**
   * Форматирует данные покемона из API-ответа
   * @param {PokemonApiResponse} data - Данные покемона из API
   * @returns {Pokemon} Отформатированные данные покемона
   */
  const formatPokemonData = (data: PokemonApiResponse): Pokemon => ({
    id: data.id,
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    pokemonId: data.id.toString().padStart(3, '0'),
    type: data.types[0].type.name,
    color: DEFAULT_DATA.color[data.types[0].type.name] || DEFAULT_DATA.color.normal,
  });

  /**
   * Загружает данные о покемонах из API
   */
  const fetchPokemon = useCallback(async () => {
    setInitialPokemonState(prevState => ({
      ...prevState,
      isLoading: true,
    }));

    try {
      const pokemonPromises = Array.from({ length: DEFAULT_DATA.count - 1 }, (_, i) =>
        axios.get<PokemonApiResponse>(`${DEFAULT_DATA.apiUrl}/${i + 1}`),
      );
      const responses: AxiosResponse<PokemonApiResponse>[] = await Promise.all(pokemonPromises);
      const collection: Pokemon[] = responses.map(response => formatPokemonData(response.data));

      setInitialPokemonState(prevState => ({
        ...prevState,
        collection,
        isLoading: false,
        isSuccess: true,
      }));
    } catch (error) {
      console.error('Error fetching pokemons:', error);
      toast.error('Failed to fetch pokemons', { richColors: true });
      setInitialPokemonState(prevState => ({
        ...prevState,
        isLoading: false,
        isError: true,
      }));
    }
  }, []);

  /**
   * Обрабатывает клик по карточке покемона
   * @param {number} id - ID покемона
   */
  const handleCardClick = useCallback(async (id: number) => {
    try {
      const {
        data: {
          effect_entries,
          flavor_text_entries,
          names,
          generation: { name },
        },
      } = await axios.get<PokemonCardData>(`https://pokeapi.co/api/v2/ability/${id}`);
      setInitialPokemonState(prevState => ({
        ...prevState,
        selectedPokemon: { effect_entries, flavor_text_entries, names, name, pokemonId: id },
      }));
      setIsDialogOpen(true);
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Failed to fetch pokemon details.', { richColors: true });
      setInitialPokemonState(prevState => ({ ...prevState, selectedPokemon: null }));
    }
  }, [setInitialPokemonState]);

  /**
   * Создает кнопку для пагинации
   * @param {string} text - Текст кнопки
   * @param {ButtonType} type - Тип кнопки
   * @param {boolean} disabled - Флаг отключения кнопки
   * @returns {JSX.Element} Кнопка пагинации
   */
  const createButton = useCallback((text: string, type: ButtonType, disabled: boolean) => (
    <Button
      onClick={() => type === 'number' ? handlePaginationNumberClick(Number(text) - 1) : handlePaginationClick(type)}
      disabled={disabled}
    >
      {text}
    </Button>
  ), [handlePaginationClick, handlePaginationNumberClick]);

  /**
   * Эффект для загрузки покемонов при монтировании компонента
   */
  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  return (
    <Card className="max-w-5xl w-full mx-auto p-4 rounded">
      {/* Loading */}
      {initialPokemonState.isLoading && <Spinner />}

      {/* Error */}
      {initialPokemonState.isError && (
        <p className="text-center text-red-500">An error occurred while fetching pokemons.</p>
      )}

      {/* Success */}
      {initialPokemonState.isSuccess && (
        <>
          {paginatedData.length === 0 && (<p className="text-center">No pokemons found.</p>)}

          <ul className="gap-3 sm:grid-cols-2 grid md:grid-cols-3 lg:grid-cols-4">
            {paginatedData[currentPage]?.map(({ id, name, pokemonId, type, color }: Pokemon) => (
              <li key={id}>
                <Card className="p-0 gap-0 rounded-sm overflow-hidden dark:bg-accent">
                  <div className="flex justify-center items-center p-2" style={{ backgroundColor: color }}>
                    <Image priority={true} width={100} height={100} src={`${DEFAULT_DATA.spritesUrl}/${id}.png`}
                           alt={name} />
                  </div>
                  <div className="grid gap-2 place-items-center p-3" onClick={() => handleCardClick(id)}>
                    <Badge>#{pokemonId}</Badge>
                    <h3 className="font-bold uppercase">{name}</h3>
                    <div className="flex gap-1.5">
                      <Badge>Type</Badge>
                      <span>{type}</span>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>

          <nav aria-label="Pagination">
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {/* Кнопка "Предыдущая страница" */}
              <li>{createButton('Prev', 'prev', currentPage <= 0)}</li>
              {/* Кнопки с номерами страниц */}
              {[...Array(paginatedData.length)].map((_, index) => (
                <li key={index}>{createButton(String(index + 1), 'number', currentPage === index)}</li>
              ))}
              {/* Кнопка "Следующая страница" */}
              <li>{createButton('Next', 'next', currentPage >= paginatedData.length - 1)}</li>
            </ul>
          </nav>

          {isDialogOpen && initialPokemonState.selectedPokemon && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className='sr-only'>
                  <DialogTitle>{initialPokemonState.selectedPokemon?.names[7]?.name}</DialogTitle>
                </DialogHeader>
                <DialogDescription aria-description='Pokemon Description' className='sr-only'/>
                <h2 className='font-bold uppercase'>{initialPokemonState.selectedPokemon?.names[7]?.name}</h2>
                <Image
                  width={100}
                  height={100}
                  priority={true}
                  className="mx-auto"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${initialPokemonState.selectedPokemon?.pokemonId}.png`}
                  alt={initialPokemonState.selectedPokemon?.name || 'Pokemon'}
                />
                <p className="grid grid-cols-2">
                  <span className="p-2 border font-bold bg-gray-100 dark:bg-accent">Generation:</span>
                  <span className="p-2 border">{initialPokemonState.selectedPokemon?.name}</span>
                </p>
                <p className="grid grid-cols-2">
                  <span className="p-2 border font-bold bg-gray-100 dark:bg-accent">Effect:</span>
                  <span className="p-2 border">{initialPokemonState.selectedPokemon?.effect_entries[1]?.short_effect}</span>
                </p>
                <p className="grid grid-cols-2">
                  <span className="p-2 border font-bold bg-gray-100 dark:bg-accent">Ability:</span>
                  <span className="p-2 border">{initialPokemonState.selectedPokemon?.flavor_text_entries[0]?.flavor_text}</span>
                </p>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </Card>
  );
}