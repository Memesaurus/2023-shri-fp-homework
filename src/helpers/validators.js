/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  allPass,
  anyPass,
  equals,
  filter,
  flip,
  groupWith,
  includes,
  pipe,
  prop,
  propEq,
  reject,
  sort,
  values,
} from "ramda";
import { COLORS, SHAPES } from "../constants";
import { size } from "lodash";

const propFlipped = flip(propEq);

const isShapeWhite = propFlipped(COLORS.WHITE);
const isShapeGreen = propFlipped(COLORS.GREEN);
const isShapeRed = propFlipped(COLORS.RED);
const isShapeBlue = propFlipped(COLORS.BLUE);
const isShapeOrange = propFlipped(COLORS.ORANGE);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isShapeRed(SHAPES.STAR),
  isShapeGreen(SHAPES.SQUARE),
  isShapeWhite(SHAPES.CIRCLE),
  isShapeWhite(SHAPES.TRIANGLE),
]);

const filterColor = (predicate) => filter(predicate);
const getColor = (predicate) => pipe(filterColor(predicate));
const countColor = (predicate) => pipe(getColor(predicate), size);

const countGreen = countColor(equals(COLORS.GREEN));

const GREEN_THRESHOLD = 2;
const isGreenEnough = (n) => n >= GREEN_THRESHOLD;

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(countGreen, isGreenEnough);

const countRed = countColor(equals(COLORS.RED));
const countBlue = countColor(equals(COLORS.BLUE));

const isBlueEqRed = (list) =>
  countBlue(list) !== 0 && equals(countBlue(list), countRed(list));
// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = isBlueEqRed;

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  isShapeBlue(SHAPES.CIRCLE),
  isShapeRed(SHAPES.STAR),
  isShapeOrange(SHAPES.SQUARE),
]);

const sortClrs = sort((a, b) => a.localeCompare(b));
const filterWhite = reject(includes(COLORS.WHITE));
const grpByColor = pipe(sortClrs, groupWith(equals), filterWhite);

const SAME_COLOR_THRESHOLD = 3;
const isThresholdPassed = (arr) => {
  for (const color of arr) {
    if (color.length >= SAME_COLOR_THRESHOLD) {
      return true;
    }
  }
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = pipe(values, grpByColor, isThresholdPassed);

const SAME_GREEN_VALUE = 2;
const isGreenExact = pipe(countGreen, equals(SAME_GREEN_VALUE));

const isRedNotZero = (n) => n > 0;
const isOneShapeRed = pipe(countRed, isRedNotZero);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  isShapeGreen(SHAPES.TRIANGLE),
  isGreenExact,
  isOneShapeRed,
]);

const countOrange = countColor(equals(COLORS.ORANGE));
const SHAPES_COUNT = 4;

// 7. Все фигуры оранжевые.
export const validateFieldN7 = pipe(countOrange, equals(SHAPES_COUNT));

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = anyPass([
  isShapeOrange(SHAPES.STAR),
  isShapeBlue(SHAPES.STAR),
  isShapeGreen(SHAPES.STAR),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = pipe(countGreen, equals(SHAPES_COUNT));

const getTriangle = prop(SHAPES.TRIANGLE);
const getSquare = prop(SHAPES.SQUARE);
const isTriangleEqSquare = (obj) =>
  getTriangle(obj) !== COLORS.WHITE && equals(getTriangle(obj), getSquare(obj));

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = isTriangleEqSquare;
