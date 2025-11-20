import {IQuote} from "../../api";

// подход в котором мы расчитываем значения по мере поступления квот.
// пришла квота пересчитали значения
// в этом подходе нам не нужно хранить список квот
// нам достаточно только сохранить последнюю квоту
// минус такого подхода что мы не можем рассчитать значения для массива квот
// хотя можем но это не удобно
// но тоді нам доведеться зберігати список квот
// та в такому випадку це невілює всі плюси цього підходу

// const quotes_array: IQuote[] = [];
// resetState();
//
// for(let i = 0; i < quotes_array.length; i++) {
//   receiveQuote(quotes_array[i]);
//   calculate();
// }

// А в чому така велика різниця між підходом oneByOne

// Ось наприклад підхід oneByOne
// resetState();
//
// for(let i = 0; i < quotes_array.length; i++) {
//   receiveQuote(quotes_array[i]);
// }
// calculate();

// В підході oneByOne цикл знаходиться всередині метода calculate
// через це у цьому підході неможливо розтягнути розрахунки у часі
// та чи це взагалі потрібно?

// ще одна різниця між підходами полягає в тому що в одному підході
// змінні знаходяться всередині функції калкулейт а в іншому зовні
// через це один підхід чистий (ніяких сайд ефектів), а інший брудний
// точніше функція calculate в одному підході чиста, а в іншому брудна
// передача одних і тих самих аргументів повертає різні значення
// це вважаеться брудною функцією. саме така ф-ція в підході accumulate

// ще в мене є враження що я займаюсь якоюсь фігнею.
// Я намагаюсь оптимізувати те що я навіть не знаю як буде використано
// Теоретично ці розрахунку можуть використовуватися на трейдингових біржах
// Хоча я не можу уявити для чого на трейдинговій біржі відображати
// кількість парних та непарних значень
// Я уявлюю графік на якому потрібно відобразити історію квот
// Зазвичай на таких графіках відображают історію за якийсь період
// Півгодини, година, 2 години і т.д.
// Я скільки не бачив таких графіків, але я не бачив щоб на них було десь показано
// мінімальне та максимальне значення
// зазвичай ти наводишься на мишкою на найнижчу квоту і таким чином дізнаєшься найнижче значення
// Зайшов на графік від tradingview побачив там є можливість побачити історію за увесь час
// Коли увімкнув там знизу на шкалі був 1977 рік
// Доречі я там не побачив ніде максимальне та мінімальне значення
// Коротше я відмовляюсь оптимізувати те що я навіть не знаю де буде використано
// оптимізувати потрібно тільки тоді коли це критично
// перед виконанням тестового завдання можно було спитати
// де ці розрахунки взагалі потрібні

let sum = 0;
let quotesCount = 0;
let avg = 0;
let minValue:number = +Infinity;
let maxValue: number = -Infinity;
let evenValues = 0;
let oddValues = 0;
let modeMap: Record<number, number> = {};
let maxCount = 0;
let mode = 0;
let temp = 0;
let standardDeviation:null | number = null;
let lastQuote: null| IQuote = null

export const receiveQuote = (incomingQuote: IQuote) => {
  lastQuote = incomingQuote;
}

export const calculate = () => {
  if(!lastQuote) {
    throw new Error("no quote to calculate");
  }
  return calculateQuote(lastQuote);
}

const calculateQuote = (incomingQuote: IQuote) => {
  quotesCount++;
  sum += incomingQuote.value;

  avg = sum / quotesCount;

  if (incomingQuote.value < minValue) {
    minValue = incomingQuote.value;
  }

  if (incomingQuote.value > maxValue) {
    maxValue = incomingQuote.value;
  }

  if (incomingQuote.value % 2 === 0) {
    evenValues++;
  }

  if (incomingQuote.value % 2 !== 0) {
    oddValues++;
  }

  let count = modeMap[incomingQuote.value] || 0;
  modeMap[incomingQuote.value] = ++count;

  if (count > maxCount) {
    mode = incomingQuote.value;
    maxCount = count;
  }

  const diff = incomingQuote.value - avg;

  temp += diff * diff;

  if (quotesCount > 1) {
    standardDeviation = Math.sqrt(temp / (quotesCount - 1));
  }

  return {
    minValue: minValue,
    maxValue: maxValue,
    mode: mode,
    avg: avg,
    standardDeviation: standardDeviation,
    modeCount: maxCount,
    evenValuesCount: evenValues,
    oddValuesCount: oddValues,
    quotesCount: quotesCount,
  }
}

export const resetState = () => {
  sum = 0;
  quotesCount = 0;
  avg = 0;
  minValue = +Infinity;
  maxValue = -Infinity;
  evenValues = 0;
  oddValues = 0;
  mode = 0;
  maxCount = 0;
  modeMap = {};
  sum = 0;
  avg = 0;
  quotesCount = 0;
  temp = 0;
}
