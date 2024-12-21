import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import Card from "./components/Card";
import Input from "./components/Input";
import { FunctionNode } from "./models";
import { validateEquation, evaluateEquation } from "./utils/calculate";
import Dropdown from "./components/Dropdown";
import { DEFAULT_STATE, DROPDOWN_OPTIONS, cardRefsDefault } from "./constants";

const App: React.FC = () => {
  const [nodes, setNodes] = useState<FunctionNode[]>(DEFAULT_STATE);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLInputElement>(null);
  const cardRefs = useRef<
    {
      inputLabel: HTMLSpanElement | null;
      outputLabel: HTMLSpanElement | null;
    }[]
  >(cardRefsDefault);

  const [initialValue, setInitialValue] = useState<number>(2);
  const [finalOutput, setFinalOutput] = useState<number | null>(null);

  const calculateOutput = () => {
    let currentNodeId: string | null = "1";
    let currentValue = initialValue;

    while (currentNodeId) {
      const currentNode = nodes.find((node) => node.id === currentNodeId);
      if (!currentNode) break;

      currentValue = evaluateEquation(currentNode.equation, currentValue);
      currentNodeId = currentNode.nextFunctionId;
    }

    setFinalOutput(currentValue);
  };

  const updateEquation = (id: string, equation: string) => {
    if (validateEquation(equation)) {
      setNodes((prevNodes) =>
        prevNodes.map((node) => (node.id === id ? { ...node, equation } : node))
      );
    } else {
      alert(
        "Invalid equation. Please use only numbers, x, and basic operators (+, -, *, /, ^)."
      );
    }
  };

  const drawConnections = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Ensure canvas dimensions match the container
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const inputBox = inputRef.current?.getBoundingClientRect();

        const outputBox = outputRef.current?.getBoundingClientRect();

        const cardRects = cardRefs.current.map((card) => ({
          input: card.inputLabel?.getBoundingClientRect(),
          output: card.outputLabel?.getBoundingClientRect(),
        }));

        ctx.strokeStyle = "blue";
        ctx.fillStyle = "rgba(66, 133, 244, 0.6)";
        ctx.lineWidth = 0;

        // Draw connection from initial input to Function 1 input
        if (inputBox && cardRects[0]?.input) {
          drawRoundedConnection(
            ctx,
            inputBox.right,
            inputBox.top,
            cardRects[0].input.left,
            cardRects[0].input.top
          );
        }

        // Draw connections between function cards
        for (let i = 0; i < cardRects.length - 1; i++) {
          const inputRect = +DEFAULT_STATE[i].id - 1;
          const outputRect = +(DEFAULT_STATE[i].nextFunctionId as string) - 1;
          if (cardRects[inputRect]?.output && cardRects[outputRect]?.input) {
            drawRoundedConnection(
              ctx,
              (cardRects[inputRect]?.output?.right as number) - 10,
              cardRects[inputRect]?.output?.top as number, 
              cardRects[outputRect]?.input?.left as number,
              cardRects[outputRect]?.input?.top as number
            );
          }
        }

        const outputRectObj = DEFAULT_STATE.find(
          (item) => item.nextFunctionId === null
        );
        const inputRectObj = DEFAULT_STATE.find(
          (item) => item.nextFunctionId === outputRectObj?.id
        );

        const finalCardIndex = outputRectObj?.id ? +outputRectObj.id - 1 : -1;
        const finalcardInputInput = inputRectObj?.id ? +inputRectObj?.id - 1 : -1;

        // Draw connection from last function output to final output
        if (cardRects[finalCardIndex]?.output && outputBox) {
          drawRoundedConnection(
            ctx,
            (cardRects[finalCardIndex]?.output?.right as number) - 10,
            (cardRects[finalCardIndex]?.output?.top as number),
            outputBox.left,
            outputBox.top
          );

          drawRoundedConnection(
            ctx,
            (cardRects[finalcardInputInput]?.output?.right as number) - 10,
            (cardRects[finalcardInputInput]?.output?.top as number),
            (cardRects[finalCardIndex]?.input?.left as number),
            (cardRects[finalCardIndex]?.input?.top as number)
          );
        }
      }
    }
  };

  const drawRoundedConnection = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    const controlX1 = startX + (endX - startX) * 0.5;
    const controlY1 = startY;
    const controlX2 = endX - (endX - startX) * 0.5;
    const controlY2 = endY;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);

    // Draw the rounded tube effect
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(66, 133, 244, 0.6)";
    ctx.stroke();

    ctx.closePath();
  };

  useEffect(() => {
    calculateOutput();
  }, [nodes, initialValue]);

  useEffect(() => {
    drawConnections();
  }, []);

  return (
    <div className="app-container">
      <h1>Function Flow Diagram</h1>

      <canvas ref={canvasRef} className="connection-canvas"></canvas>

      <div className="node-grid">
        <div className="top-row">
          <div className="input-container">
            <div className="pill orange-pill">Initial Value of x</div>
            <div className="relative">
              <Input
                value={initialValue}
                onChange={(e) => setInitialValue(Number(e))}
                className="input-box orange-border"
                label=""
                type="text"
              />
              <span className="dot dot-orange" ref={inputRef} />
            </div>
          </div>

          {nodes.slice(0, 3).map((node, index) => (
            <Card key={node.id} title={`Function ${node.id}`}>
              <Input
                type="text"
                value={node.equation}
                onChange={(val) => updateEquation(node.id, val)}
                placeholder="Enter equation"
                label="Equation"
              />

              <Dropdown
                label="Next Function"
                options={DROPDOWN_OPTIONS}
                value={node.nextFunctionId || "-1"}
                disabled
              />

              <div className="card-labels">
                <span className="label-input relative">
                  <span
                    className="dot"
                    ref={(el) => (cardRefs.current[index].inputLabel = el)}
                  />
                  {"input"}
                </span>
                <span className="label-output relative">
                  <span
                    className="dot"
                    ref={(el) => (cardRefs.current[index].outputLabel = el)}
                  />
                  output
                </span>
              </div>
            </Card>
          ))}

          <div className="output-section">
            <div className="input-container">
              <div className="pill green-pill">Final Output</div>
              <div className="relative">
                <span className="dot dot-green" ref={outputRef} />
                <input
                  type="text"
                  value={finalOutput ?? ""}
                  readOnly
                  className="input-box green-border"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-row">
          {nodes.slice(3).map((node, index) => (
            <Card key={node.id} title={`Function ${node.id}`}>
              <Input
                type="text"
                value={node.equation}
                onChange={(val) => updateEquation(node.id, val)}
                placeholder="Enter equation"
                label="Equation"
              />

              <Dropdown
                label="Next Function"
                options={DROPDOWN_OPTIONS}
                value={node.nextFunctionId || "-1"}
                disabled
              />

              <div className="card-labels">
                <span className="label-input relative">
                  <span
                    className="dot"
                    ref={(el) => (cardRefs.current[index + 3].inputLabel = el)}
                  />
                  input
                </span>
                <span className="label-output relative">
                  output
                  <span
                    className="dot"
                    ref={(el) => (cardRefs.current[index + 3].outputLabel = el)}
                  />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
