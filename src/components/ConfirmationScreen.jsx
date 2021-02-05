import React, { useEffect, useState } from "react";
import SquareKey from "./SquareKey";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const ConfirmationScreen = ({
  finishUp,
  cancel,
  stack,
  moveSequence,
  Reorder,
  possiblePlaces,
}) => {
  let places = {};
  possiblePlaces.forEach((item) => {
    places[item] = [];
  });
  console.log(places);
  stack.forEach(
    (item, dex) =>
      (places[moveSequence[dex]] = [
        ...(places[moveSequence[dex]] || []),
        { name: item.name, id: item.id, dex: dex },
      ])
  );

  const onDragEnd = (result) => {
    if (result.destination) {
      const fro = places[result.source.droppableId][result.source.index].dex;
      const to = (
        places[result.destination.droppableId][result.destination.index] || {
          dex: 1,
        }
      ).dex;

      let newStack = stack;

      newStack.splice(to, 0, newStack.splice(fro, 1)[0]);
      let newMoveSequence = moveSequence;
      newMoveSequence.splice(fro, 1);
      newMoveSequence.splice(to, 0, result.destination.droppableId);

      Reorder({ newStack: newStack, newMoveSequence: newMoveSequence });
    }
  };
  return (
    <div className="confirmScreenWrapper">
      <h3>{"All done! does this look right?"}</h3>
      <div className="flex justify-center confirm-list">
        <DragDropContext onDragEnd={onDragEnd}>
          {possiblePlaces.map((place, pdex) => (
            <Droppable droppableId={place} key={place}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="place-list"
                >
                  <h3 className="sticky top-0 bg-white ">{place}</h3>
                  <ul>
                    {places[place].map((file, fdex) => (
                      <Draggable
                        key={String(file.id)}
                        draggableId={String(file.id)}
                        index={fdex}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="file-list-item"
                          >
                            {file.name}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
      <div className="flex items-stretch justify-center">
        <SquareKey
          button={"del"}
          place={"cancel"}
          func={cancel}
          wide={true}
          dir={0}
        />
        <SquareKey
          button={"enter"}
          place={"confirm"}
          func={finishUp}
          wide={true}
          dir={0}
        />
      </div>
    </div>
  );
};

export default ConfirmationScreen;
