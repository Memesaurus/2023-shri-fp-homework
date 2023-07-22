import React from "react";
import cn from "classnames";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import styles from "./styles.module.css";
import processSequence from "../../helpers/processSequence";

const getLogClassName = (status) =>
  cn(
    {
      [styles.logStatusSuccess]: status === "success",
      [styles.logStatusError]: status === "error",
    },
    styles.log
  );

const getCurrentTime = () => new Date().toLocaleTimeString("ru-Ru");

const Log = ({ text, status, time }) => {
  return (
    <div>
      <span className={styles.logTime}>{time}</span>

      <span className={getLogClassName(status)}>{text}</span>
    </div>
  );
};

class ChainPlayground extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textFieldValue: "",
      logs: [],
    };
  }

  handleTextChange = ({ target }) => {
    this.setState({ textFieldValue: target.value });
  };

  writeLog = (value) => {
    const { logs } = this.state;
    logs.push({ text: value, time: getCurrentTime() });

    this.setState({ logs });
  };

  handleSuccess = (value) => {
    const { logs } = this.state;
    logs.push({ text: value, status: "success", time: getCurrentTime() });

    this.setState({ logs });
  };

  handleError = (value) => {
    const { logs } = this.state;
    logs.push({ text: value, status: "error", time: getCurrentTime() });

    this.setState({ logs });
  };

  handleRunButtonClick = () => {
    processSequence({
      value: this.state.textFieldValue,
      writeLog: this.writeLog,
      handleSuccess: this.handleSuccess,
      handleError: this.handleError,
    });
  };

  clearLog = () => {
    this.setState({ logs: [] });
  };

  render() {
    const { logs, textFieldValue } = this.state;
    return (
      <div>
        <ol className={styles.description}>
          <li>
            Берем строку N. Пишем изначальную строку в <i>writeLog</i>.
          </li>
          <li>
            Строка валидируется по следующим правилам:
            <ul>
              <li>кол-во символов в числе должно быть меньше 10.</li>
              <li>кол-во символов в числе должно быть больше 2.</li>
              <li>число должно быть положительным</li>
              <li>
                символы в строке только [0-9] и точка т.е. <b>число</b> в 10-ной
                системе счисления (возможно с плавающей запятой)
              </li>
            </ul>
            В случае ошибки валидации вызвать <i>handleError</i> с
            'ValidationError' строкой в качестве аргумента
          </li>
          <li>
            Привести строку к числу, округлить к ближайшему целому с точностью
            до единицы, <i>записать в writeLog</i>.
          </li>
          <li>
            C помощью API /numbers/base перевести из 10-й системы счисления в
            двоичную, результат <i>записать в writeLog</i>
          </li>
          <li>
            Взять кол-во символов в полученном от API числе{" "}
            <i>записать в writeLog</i>
          </li>
          <li>
            Возвести в квадрат с помощью Javascript <i>записать в writeLog</i>
          </li>
          <li>
            Взять остаток от деления на 3, <i>записать в writeLog</i>
          </li>
          <li>
            C помощью API /animals.tech/id/name получить случайное животное
            используя полученный остаток в качестве id
          </li>
          <li>
            Завершить цепочку вызовом <i>handleSuccess</i> в который в качестве
            аргумента положить результат полученный на предыдущем шаге
          </li>
        </ol>

        <pre>
          {`____________________________________
Перевод из одной системы счисления в другую:

GET / https://api.tech/numbers/base
params:
– number [Int] – число
– from [Int] – из какой системы счисления
– to [Int] – в какую систему счисления`}
        </pre>

        <pre>
          {`____________________________________
Получить животное по ID

GET / https://animals.tech/{id}`}
        </pre>

        <div className={styles.initSection}>
          <TextField
            id="standard-basic"
            label="Число N"
            onChange={this.handleTextChange}
            value={textFieldValue}
          />

          <div className={styles.initButton}>
            <Button
              onClick={this.handleRunButtonClick}
              variant="contained"
              color="primary"
              size="small"
            >
              ➤
            </Button>
          </div>

          <div className={styles.initButton}>
            <Button
              onClick={this.clearLog}
              variant="contained"
              color="secondary"
              size="small"
            >
              ✕
            </Button>
          </div>
        </div>

        {logs.map(({ text, status, time }, i) => (
          <Log key={i} text={text} time={time} status={status} />
        ))}
      </div>
    );
  }
}

export default ChainPlayground;
