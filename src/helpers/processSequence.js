/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import {
  __,
  allPass,
  andThen,
  curry, length,
  lensProp,
  modulo,
  not,
  over,
  pipe,
  prop,
  startsWith,
  tap,
  test,
  tryCatch,
  unless,
  view
} from "ramda";
import Api from "../tools/api";
import { flip, round, toNumber } from "lodash";

const api = new Api();

let context;

const bindContext = (obj) => (context = obj);

const VALUE_PROP = "value";
const valueLens = lensProp(VALUE_PROP);
const getValue = view(valueLens);
const getValueLength = pipe(getValue, length);

const writeFile = tap(({ value, writeLog }) => writeLog(value));

const LEN_MAX = 10;
const isLenNotOverMax = (obj) => getValueLength(obj) < LEN_MAX;

const LEN_MIN = 2;
const isLenNotBelowMin = (obj) => getValueLength(obj) > LEN_MIN;

const isPositive = pipe(getValue, startsWith("-"), not);

const isNumber = pipe(getValue, test(/^\d+(\.\d+)?$/));

const ERR_VALIDATION = "ValidationError";
const handleError = pipe(
  tap(({ handleError }) => handleError(ERR_VALIDATION)),
  () => {
    throw new Error("ValidationError");
  }
);

const validateValue = unless(
  allPass([isLenNotOverMax, isLenNotBelowMin, isPositive, isNumber]),
  handleError
);

let setValue = over(valueLens);

const parseVal = pipe(toNumber, round);
const convertToInt = setValue(parseVal);

const GET_PROP = "get";
const get = prop(GET_PROP, api);

const CONVERTER_URL = "https://api.tech/numbers/base";
const RESPONSE_DATA_PROP = "result";
const converter = get(CONVERTER_URL);
const binaryParams = {
  from: 10,
  to: 2,
};
const setBinaryParams = (number) => ({ ...binaryParams, number });

//супер костыль
const asyncSetValue = (val) => {
  context.value = val;
  return context;
};

const setData = pipe(prop(RESPONSE_DATA_PROP), asyncSetValue);
const toBinary = pipe(getValue, setBinaryParams, converter, andThen(setData));

const toLen = setValue(length);

const powOf2 = pipe(curry(Math.pow), flip)(2);
const toPow = setValue(powOf2);

const divBy3 = setValue(modulo(__, 3));

const ANIMAL_URL = "https://animals.tech/";
const requestAnimal = (param) => get(ANIMAL_URL + param, null);
const convertToAnimal = pipe(getValue, requestAnimal, andThen(setData));

const handleSuccess = tap(({ value, handleSuccess }) => handleSuccess(value));

const processSequence = tryCatch(
  pipe(
    bindContext,
    writeFile,
    validateValue,
    convertToInt,
    writeFile,
    toBinary,
    andThen(
      pipe(
        writeFile,
        toLen,
        writeFile,
        toPow,
        writeFile,
        divBy3,
        writeFile,
        convertToAnimal,
        andThen(pipe(writeFile, handleSuccess))
      )
    )
  ),
  console.log
);

export default processSequence;
