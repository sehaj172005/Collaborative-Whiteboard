import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import Menu from "./Menu";
import rough from "roughjs/bin/rough";
import { tooltype, actions } from "../constants";
import { nanoid } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { setElement, updateElements } from "../Whiteboard/whiteboardSlice";
import { createElement } from "../Whiteboard/utils/createElement";
import { updateElement } from "../Whiteboard/utils/updateElements";
import { DrawElements } from "../Whiteboard/utils/drawElements";
import { AdjustCoordinates } from "../Whiteboard/utils/AdjustCordinates";
import { getElementPosition } from "./utils/getElementPosition";
import { GetCursortype } from "./utils/Getcursortype";
import { Getelementcoordinates } from "./utils/Getelementcoordinates";
import {
  CurrentStateEmit,
  Socketconnfunction,
  Emitupdatefuction,
} from "../socketconn/socketconn";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "../toast/toast";
import selectionIcon from "../resources/icons/selection.jpg";

function Whiteboard() {
  const [action, setAction] = useState(null);
  const [selectedEl, setSelectedElement] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const canvasRef = useRef();
  const textAreaRef = useRef();

  const selectedToolType = useSelector((state) => state.whiteboardSlice.tool);
  const elements = useSelector((state) => state.whiteboardSlice.elements);

  const dispatch = useDispatch();

  const { roomId } = useParams();
  const navigate = useNavigate();

  // 🔁 REDRAW ELEMENTS ON EVERY UPDATE
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    const roughCanvas = rough.canvas(canvas);
    DrawElements({
      roughCanvas,
      ctx,
      elements,
      textArea: textAreaRef.current,
      selectedEl,
    });
  }, [elements, selectedEl]);

  // 🔁 MAKE CANVAS RESPONSIVE
  useEffect(() => {
    const canvas = canvasRef.current;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const roughCanvas = rough.canvas(canvas);
      DrawElements({
        roughCanvas,
        ctx,
        elements,
        textArea: textAreaRef.current,
        selectedEl,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [elements, selectedEl]);

  // ✅ Autofocus for text
  useEffect(() => {
    if (action === actions.WRITING && textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current.focus();
      }, 0);
    }
  }, [action, selectedEl]);

  useEffect(() => {
    // Redirect to new room if no :roomId in URL
    if (!roomId) {
      const newRoom = nanoid(6);
      navigate(`/whiteboard/${newRoom}`);
    } else {
      // Connect socket and join room
      Socketconnfunction(roomId);
    }
  }, [roomId]);

  // ✅ Change cursor for rubber
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.cursor =
      selectedToolType === tooltype.RUBBER ? "cell" : "default";
  }, [selectedToolType]);

  function mouseDownHandler(event) {
    const { clientX, clientY } = event;
    if (action === actions.WRITING) return;

    const start = { x1: clientX, y1: clientY, x2: clientX, y2: clientY };

    if (
      [tooltype.RECTANGLE, tooltype.LINE, tooltype.ELLIPSE].includes(
        selectedToolType
      )
    ) {
      setAction(actions.DRAWING);
      const element = createElement({
        ...start,
        id: nanoid(),
        type: selectedToolType,
      });
      dispatch(updateElements(element));
      setSelectedElement(element);
    } else if (selectedToolType === tooltype.TEXT) {
      setAction(actions.WRITING);
      const element = createElement({
        ...start,
        id: nanoid(),
        type: selectedToolType,
        text: "",
      });
      dispatch(updateElements(element));
      setSelectedElement(element);
    }

    if (selectedToolType === tooltype.SELECTION) {
      const element = getElementPosition(clientX, clientY, elements);
      if (element && element.position === "INSIDE") {
        setAction(actions.MOVING);
        const offSetx = clientX - element.x1;
        const offSety = clientY - element.y1;
        setSelectedElement({ ...element, offSetx, offSety });
      } else if (element) {
        setAction(actions.RESIZING);
        setSelectedElement(element);
      }
    }
  }

  function mouseUpHandler(e) {
    const { clientX, clientY } = e;

    if (
      selectedEl &&
      (action === actions.DRAWING || action === actions.RESIZING)
    ) {
      const index = elements.findIndex((el) => el.id === selectedEl.id);

      if ([tooltype.RECTANGLE, tooltype.LINE].includes(elements[index].type)) {
        AdjustCoordinates(elements, dispatch, index);
      }
    }

    setAction(null);
    setSelectedElement(null);
  }

  function mouseMoveHandler(event) {
    const { clientX, clientY } = event;

    if (action === actions.DRAWING && selectedEl) {
      const index = elements.findIndex((el) => el.id === selectedEl.id);
      if (index !== -1) {
        updateElement(
          {
            x1: elements[index].x1,
            y1: elements[index].y1,
            x2: clientX,
            y2: clientY,
            type: elements[index].type,
            index,
            id: elements[index].id,
          },
          elements,
          dispatch
        );
      }
    }

    if (selectedToolType === tooltype.SELECTION) {
      const element = getElementPosition(clientX, clientY, elements);
      event.target.style.cursor = element
        ? GetCursortype(element.position)
        : "default";

      if (action === actions.MOVING && selectedEl) {
        const index = elements.findIndex((el) => el.id === selectedEl.id);
        if (index !== -1) {
          const { offSetx, offSety, x1, y1, x2, y2 } = selectedEl;
          const width = x2 - x1;
          const height = y2 - y1;
          const newX1 = clientX - offSetx;
          const newY1 = clientY - offSety;

          updateElement(
            {
              x1: newX1,
              y1: newY1,
              x2: newX1 + width,
              y2: newY1 + height,
              type: selectedEl.type,
              index,
              id: selectedEl.id,
            },
            elements,
            dispatch
          );
        }
      }

      if (action === actions.RESIZING && selectedEl?.type !== tooltype.TEXT) {
        const index = elements.findIndex((el) => el.id === selectedEl.id);
        if (index !== -1) {
          const { x1, y1, x2, y2 } = Getelementcoordinates(
            selectedEl,
            clientX,
            clientY
          );
          updateElement(
            {
              x1,
              y1,
              x2,
              y2,
              type: elements[index].type,
              index,
              id: selectedEl.id,
            },
            elements,
            dispatch
          );
        }
      }
    }
  }

  function handleBlurEvent(e) {
    const text = e.target.value;

    if (text.trim() === "") {
      dispatch(setElement(elements.filter((el) => el.id !== selectedEl?.id)));
      return;
    }

    const index = elements.findIndex((el) => el.id === selectedEl?.id);
    if (index !== -1) {
      updateElement(
        {
          x1: selectedEl.x1,
          y1: selectedEl.y1,
          type: selectedEl.type,
          index,
          id: selectedEl.id,
          text,
        },
        elements,
        dispatch
      );
    }

    setAction(null);
    setSelectedElement(null);
  }

  function mouseClickHandler(event) {
    const { clientX, clientY } = event;

    if (selectedToolType === tooltype.RUBBER) {
      const element = getElementPosition(clientX, clientY, elements);
      if (element?.position === "INSIDE") {
        const newElements = elements.filter((el) => el.id !== element.id);
        dispatch(setElement(newElements));
        CurrentStateEmit(newElements);
      }
    }
  }

  return (
    <>
      <div className="whiteboard-topbar">
        <div className="whiteboard-menu-flex">
          <Menu
            showShareToast={(msg) => {
              setToastMessage(msg);
              setTimeout(() => setToastMessage(""), 3000);
            }}
          />

          {toastMessage && <Toast message={toastMessage} />}

          <div className="whiteboard-instructions">
            <span>
              <img
                src={selectionIcon}
                alt="Selection"
                className="inline-instruction-icon"
              />
              Click the selection tool to move or resize items.
            </span>
            <span>
              To collaborate, click Share and send the link to your friends.
            </span>
          </div>
        </div>
      </div>

      {action === actions.WRITING && selectedEl && (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlurEvent}
          style={{
            position: "absolute",
            top: selectedEl.y1 - 3,
            left: selectedEl.x1,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
            zIndex: 1000,
          }}
        />
      )}

      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onMouseMove={mouseMoveHandler}
        onClick={mouseClickHandler}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </>
  );
}

export default Whiteboard;
