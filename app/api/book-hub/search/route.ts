import { NextResponse } from 'next/server';

/**
 * Обработчик GET-запросов для проксирования поиска книг на OpenLibrary
 * 
 * @param request - Объект запроса
 * @returns NextResponse с данными от OpenLibrary
 */
export async function GET(request: Request) {
  try {
    // Получение строки запроса из URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'The search query is not specified' }, { status: 400 });
    }
    
    // Проксирование запроса к OpenLibrary
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `Error API OpenLibrary: ${response.status}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error when proxying the request to Openlibrary:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 