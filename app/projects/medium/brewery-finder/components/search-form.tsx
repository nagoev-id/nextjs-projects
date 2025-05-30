'use client';

import { JSX, useCallback } from 'react';
import { useAppDispatch } from '@/app/projects/medium/brewery-finder/app';
import {
  setBreweryList,
  useGetQuery,
  useLazySearchByCountryQuery,
  useLazySearchByValueQuery,
} from '@/app/projects/medium/brewery-finder/features';
import { useForm } from 'react-hook-form';
import {
  formCountrySchema,
  FormCountrySchema,
  formSearchSchema,
  FormSearchSchema,
} from '@/app/projects/medium/brewery-finder/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput, FormSelect } from '@/components/layout';
import { Button, Form } from '@/components/ui';
import { toast } from 'sonner';

/**
 * Компонент формы поиска пивоварен.
 * @description Предоставляет интерфейс для поиска пивоварен по запросу и стране.
 * Использует RTK Query для выполнения запросов и Redux для управления состоянием.
 * @returns {JSX.Element} Отрендеренная форма поиска.
 */
const SearchForm = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [searchBreweryByValue, { isLoading: isSearchLoading }] = useLazySearchByValueQuery();
  const [searchBreweryByCountry, { isLoading: isCountryLoading }] = useLazySearchByCountryQuery();
  const { refetch: refetchRandomBrewery } = useGetQuery();

  /**
   * Инициализация формы поиска по запросу.
   * @type {<FormSearchSchema>}
   */
  const searchForm = useForm<FormSearchSchema>({
    resolver: zodResolver(formSearchSchema),
    defaultValues: { search: '' },
    mode: 'onChange',
  });

  /**
   * Инициализация формы поиска по стране.
   * @type {<FormCountrySchema>}
   */
  const countryForm = useForm<FormCountrySchema>({
    resolver: zodResolver(formCountrySchema),
    defaultValues: { country: 'All' },
    mode: 'onChange',
  });

  /**
   * Обработчик отправки формы поиска по запросу.
   * @param {FormSearchSchema} values - Значения формы.
   */
  const onSearchSubmit = useCallback(async (values: FormSearchSchema) => {
    try {
      const response = await searchBreweryByValue(values.search).unwrap();
      dispatch(setBreweryList(response));
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Failed to search for breweries', { richColors: true });
    } finally {
      searchForm.reset();
      countryForm.resetField('country');
    }
  }, [countryForm, dispatch, searchBreweryByValue, searchForm]);

  /**
   * Обработчик отправки формы поиска по стране.
   * @param {FormCountrySchema} values - Значения формы.
   */
  const onCountrySubmit = useCallback(async (values: FormCountrySchema) => {
    try {
      if (values.country === 'All') {
        const response = await refetchRandomBrewery().unwrap();
        dispatch(setBreweryList(response));
        return;
      }
      const response = await searchBreweryByCountry(values.country).unwrap();
      dispatch(setBreweryList(response));
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('Failed to search for breweries by country', { richColors: true });
    } finally {
      searchForm.reset();
      countryForm.reset();
    }
  }, [countryForm, dispatch, refetchRandomBrewery, searchBreweryByCountry, searchForm]);

  return (
    <div className="grid gap-2">
      <h2 className="font-bold text-lg">Filters:</h2>
      {/* Форма поиска по запросу */}
      <Form {...searchForm}>
        <form onSubmit={searchForm.handleSubmit(onSearchSubmit)} className="grid gap-2.5">
          <FormInput
            form={searchForm}
            name="search"
            label="Search by query"
            placeholder="Search for a query..."
          />
          <Button disabled={isSearchLoading || isCountryLoading} className="max-w-max" type="submit">
            {isSearchLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </Form>
      {/* Форма поиска по стране */}
      <Form {...countryForm}>
        <form onSubmit={countryForm.handleSubmit(onCountrySubmit)} className="grid gap-2.5">
          <FormSelect
            form={countryForm}
            name="country"
            options={[
              { label: 'All', value: 'All' },
              { label: 'Austria', value: 'Austria' },
              { label: 'England', value: 'England' },
              { label: 'France', value: 'France' },
              { label: 'Isle of Man', value: 'Isle of Man' },
              { label: 'Ireland', value: 'Ireland' },
              { label: 'Poland', value: 'Poland' },
              { label: 'Portugal', value: 'Portugal' },
              { label: 'Scotland', value: 'Scotland' },
              { label: 'Singapore', value: 'Singapore' },
              { label: 'South Korea', value: 'South Korea' },
              { label: 'United States', value: 'United States' },
            ]}
            label="Search by country:"
            placeholder="Select a country..."
            selectProps={{
              className: 'w-full',
            }}
          />
          <Button disabled={isSearchLoading || isCountryLoading} className="max-w-max" type="submit">
            {isCountryLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SearchForm;