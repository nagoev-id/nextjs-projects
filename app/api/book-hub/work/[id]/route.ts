import { NextResponse } from 'next/server';

/**
 * Обработчик GET-запросов для проксирования запросов на получение информации о книге
 * 
 * @param request - Объект запроса
 * @param params - Параметры маршрута, включая id книги
 * @returns NextResponse с данными от OpenLibrary
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'ID books are not specified' }, { status: 400 });
    }
    
    // Проксирование запроса к OpenLibrary
    const url = `https://openlibrary.org/works/${id}.json`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: `API Openlibry error: ${response.status}` },
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