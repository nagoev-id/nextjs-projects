'use client';

/**
 * # Приложение "Eat and Split"
 *
 * ## Принцип работы:
 *
 * 1. **Инициализация данных**:
 *    - При загрузке компонента инициализируется список друзей из mock-данных.
 *    - Устанавливаются начальные состояния для выбранного друга, отображения формы добавления друга и данных счета.
 *
 * 2. **Управление списком друзей**:
 *    - Пользователь может просматривать список друзей с их текущим балансом.
 *    - Есть возможность добавить нового друга, заполнив форму с именем и URL изображения.
 *    - При добавлении нового друга, он добавляется в список с начальным балансом 0.
 *
 * 3. **Выбор друга для разделения счета**:
 *    - Пользователь может выбрать друга из списка для разделения счета.
 *    - При выборе друга отображается форма разделения счета.
 *
 * 4. **Разделение счета**:
 *    - В форме разделения счета пользователь вводит общую сумму счета и свою часть расходов.
 *    - Автоматически рассчитывается часть расходов друга.
 *    - Пользователь выбирает, кто оплачивает счет (он сам или друг).
 *    - При подтверждении разделения счета, баланс выбранного друга обновляется.
 *
 * 5. **Обновление баланса**:
 *    - После разделения счета, баланс друга обновляется в зависимости от того, кто оплачивал счет.
 *    - Если платил пользователь, к балансу друга добавляется его часть расходов.
 *    - Если платил друг, от баланса друга вычитается часть расходов пользователя.
 *
 * 6. **Отображение балансов**:
 *    - В списке друзей отображается текущий баланс для каждого друга.
 *    - Положительный баланс означает, что друг должен пользователю.
 *    - Отрицательный баланс означает, что пользователь должен другу.
 *    - Нулевой баланс означает, что расчеты равны.
 *
 * 7. **Управление состоянием приложения**:
 *    - Все изменения (добавление друга, выбор друга, разделение счета) немедленно отражаются в интерфейсе.
 *    - После каждого разделения счета, форма сбрасывается, и выбор друга снимается.
 *
 * Приложение предоставляет удобный интерфейс для отслеживания общих расходов с друзьями и
 * помогает легко разделять счета, автоматически обновляя балансы.
 */

import { Card } from '@/components/ui/card';
import React, { ChangeEvent, FormEvent, JSX, useState } from 'react';
import Image from 'next/image';
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

/**
 * Тип, представляющий друга в приложении.
 * @typedef {Object} Friend
 * @property {number|string} id - Уникальный идентификатор друга.
 * @property {string} name - Имя друга.
 * @property {string} image - URL изображения друга.
 * @property {number} balance - Текущий баланс с другом (положительный - друг должен, отрицательный - вы должны).
 */
type Friend = {
  id: number | string;
  name: string;
  image: string;
  balance: number;
}

/**
 * Начальные данные для списка друзей.
 * @type {Friend[]}
 */
const MOCK_DATA: Friend[] = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

/**
 * Основной компонент страницы "Eat and Split".
 * @returns {JSX.Element} Элемент страницы "Eat and Split".
 */
const EatAndSplitPage = (): JSX.Element => {
  const [friends, setFriends] = useState<Friend[]>(MOCK_DATA);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showAddFriend, setShowAddFriend] = useState<boolean>(false);

  const [formData, setFormData] = useState<{ name: string; image: string }>({
    name: '',
    image: 'https://i.pravatar.cc/48',
  });

  const [bill, setBill] = useState<string>('');
  const [paidByUser, setPaidByUser] = useState<string>('');
  const [whoIsPaying, setWhoIsPaying] = useState<string>('user');

  /**
   * Рассчитывает сумму, которую должен заплатить друг.
   * @type {number|string}
   */
  const payingByFriend: number | string = bill && paidByUser
    ? Math.max(0, Number(bill) - Number(paidByUser))
    : '';

  /**
   * Обрабатывает добавление нового друга.
   * @param {FormEvent<HTMLFormElement>} event - Событие отправки формы.
   */
  const handleAddFriend = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!formData.name || !formData.image) {
      return;
    }

    const id = crypto.randomUUID();
    const newFriend: Friend = {
      name: formData.name,
      image: `${formData.image}?u=${id}`,
      balance: 0,
      id,
    };

    setFriends(prev => [...prev, newFriend]);
    setFormData({ name: '', image: 'https://i.pravatar.cc/48' });
    setShowAddFriend(false);
  };

  /**
   * Обрабатывает выбор друга из списка.
   * @param {Friend} friend - Выбранный друг.
   */
  const handleSelectFriend = (friend: Friend): void => {
    setSelectedFriend(prev => prev?.id === friend.id ? null : friend);
    setShowAddFriend(false);

    if (selectedFriend?.id !== friend.id) {
      setBill('');
      setPaidByUser('');
      setWhoIsPaying('user');
    }
  };

  /**
   * Обрабатывает изменения в форме добавления друга.
   * @param {ChangeEvent<HTMLInputElement>} event - Событие изменения input.
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = event.target as HTMLInputElement;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  /**
   * Обрабатывает изменение суммы счета.
   * @param {ChangeEvent<HTMLInputElement>} event - Событие изменения input.
   */
  const handleBillChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBill(event.target.value);
  };

  /**
   * Обрабатывает изменение суммы, оплаченной пользователем.
   * @param {ChangeEvent<HTMLInputElement>} event - Событие изменения input.
   */
  const handlePaidByUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setPaidByUser(value > Number(bill) ? paidByUser : event.target.value);
  };

  /**
   * Обрабатывает изменение выбора плательщика.
   * @param {string} value - Выбранное значение (user или friend).
   */
  const handleWhoIsPayingChange = (value: string) => {
    setWhoIsPaying(value);
  };

  /**
   * Обрабатывает разделение счета.
   * @param {FormEvent<HTMLFormElement>} event - Событие отправки формы.
   */
  const handleSplitBill = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!bill || !paidByUser || !selectedFriend) return;

    const billAmount = Number(bill);
    const userExpense = Number(paidByUser);
    const friendExpense = billAmount - userExpense;

    const balanceChange = whoIsPaying === 'user'
      ? friendExpense  // Friend owes user
      : -userExpense;  // User owes friend

    setFriends(prev => prev.map(friend =>
      friend.id === selectedFriend.id
        ? { ...friend, balance: friend.balance + balanceChange }
        : friend,
    ));

    setSelectedFriend(null);
    setBill('');
    setPaidByUser('');
    setWhoIsPaying('user');
  };
  return (
    <Card className="max-w-8xl grid items-start lg:grid-cols-2 gap-4 w-full mx-auto shadow-none border-none rounded">
      <div className="grid gap-3">

        {/* Friend Selection */}
        <ul className="grid gap-2 sm:grid-cols-2">
          {friends.map(({ id, name, image, balance }) => (
            <li key={id}>
              <Card className={`gap-1 p-3 ${selectedFriend?.id === id ? 'bg-red-100 dark:bg-accent' : ''}`}>
                <Image width="100" height="100" src={image} alt={name} className="rounded-full border-2" />
                <h3 className="font-bold uppercase">{name}</h3>
                {balance < 0 && <p className="text-red-500">You owe {name} {Math.abs(balance)}€</p>}
                {balance > 0 && <p className="text-green-500">{name} owes you {Math.abs(balance)}€</p>}
                {balance === 0 && <p>You and {name} are even</p>}
                <Button className="max-w-max" onClick={() => handleSelectFriend({ id, name, image, balance })}>
                  {selectedFriend?.id === id ? 'Close' : 'Select'}
                </Button>
              </Card>
            </li>
          ))}
        </ul>

        {/* Add Friend Form */}
        {showAddFriend && (
          <Card className="gap-1 p-3">
            <form className="grid gap-2" onSubmit={handleAddFriend}>
              <Label htmlFor="name">Add a new friend</Label>
              <Input type="text" value={formData.name} name="name" id="name" onChange={handleChange} />
              <Label htmlFor="image">Image URL</Label>
              <Input type="text" value={formData.image} name="image" id="image" onChange={handleChange} />
              <Button className="max-w-max" type="submit">Add friend</Button>
            </form>
          </Card>
        )}

        {/* Toggle Add Friend Button */}
        <Button
          variant={showAddFriend ? 'destructive' : 'default'}
          className="max-w-max"
          onClick={() => setShowAddFriend(v => !v)}
        >
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>


      {selectedFriend && (
        <Card className="gap-1 p-3">
          <form className="grid gap-2 items-start" onSubmit={handleSplitBill}>
            <p className="font-bold">Split a bill with {selectedFriend.name}</p>
            <Label htmlFor="bill">💰Bill value</Label>
            <Input type="number" value={bill} id="bill" onChange={handleBillChange} />
            <Label htmlFor="paidByUser">🙎🏻‍Your expense</Label>
            <Input type="number" value={paidByUser} id="paidByUser" onChange={handlePaidByUserChange} />
            <Label htmlFor="payingByFriend">👬{selectedFriend.name}'s expense</Label>
            <Input type="text" disabled value={payingByFriend} id="payingByFriend" />
            <Label htmlFor="name">🤑 Who is paying the bill?</Label>
            <Select value={whoIsPaying} onValueChange={handleWhoIsPayingChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select who is paying" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">You</SelectItem>
                <SelectItem value="friend">{selectedFriend.name}</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit">Split Bill</Button>
          </form>

        </Card>
      )}
    </Card>
  );
};

export default EatAndSplitPage;