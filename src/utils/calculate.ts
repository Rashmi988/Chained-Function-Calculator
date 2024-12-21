import {VALID_EQUATION_REGEX} from '../constants'

export const calculate = (tokens: (string | number)[]): number => {
  const precedence: Record<string, number> = {
    "^": 3,
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1,
  };

  const outputQueue: (string | number)[] = [];
  const operatorStack: string[] = [];

  for (const token of tokens) {
    if (typeof token === "number" || !isNaN(Number(token))) {
      outputQueue.push(Number(token));
    } else if (token in precedence) {
      while (
        operatorStack.length &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (
        operatorStack.length &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.pop();
    }
  }

  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop()!);
  }

  const stack: number[] = [];
  for (const token of outputQueue) {
    if (typeof token === "number") {
      stack.push(token);
    } else {
      const b = stack.pop()!;
      const a = stack.pop()!;
      switch (token) {
        case "+":
          stack.push(a + b);
          break;
        case "-":
          stack.push(a - b);
          break;
        case "*":
          stack.push(a * b);
          break;
        case "/":
          stack.push(a / b);
          break;
        case "^":
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new Error(`Unknown operator: ${token}`);
      }
    }
  }

  return stack[0];
};

 export const validateEquation = (equation: string): boolean =>
    VALID_EQUATION_REGEX.test(equation);


  export const evaluateEquation = (equation: string, input: number): number => {
    try {
      const tokens = equation.match(/[0-9.]+|[x+\-*/^()]/g);
      if (!tokens) throw new Error("Invalid equation");

      const parsed = tokens.map((token) => (token === "x" ? input : token));
      return calculate(parsed);
    } catch (error) {
      console.error("Error evaluating equation:", equation, error);
      return NaN;
    }
  };