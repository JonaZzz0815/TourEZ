import React, { useState } from 'react';
import './Procedure.css';
import ProcedureItem from './ProcedureItem';

const Procedure = React.forwardRef((props, ref) => {
  const [procedureItems, setProcedureItems] = useState([]);

  const addItem = (item) => {
    setProcedureItems([...procedureItems, item]);
  };

  const removeItem = (index) => {
    const updatedItems = [...procedureItems];
    updatedItems.splice(index, 1);
    setProcedureItems(updatedItems);
  };

  React.useImperativeHandle(ref, () => ({
    addItem,
  }));

  return (
    <div className="procedure">
      <h2>Itinerary</h2>
      {procedureItems.length === 0 ? (
        <p>No items added to the procedure yet.</p>
      ) : (
        <ol>
          {procedureItems.map((item, index) => (
            <ProcedureItem
              key={index}
              item={item}
              index={index}
              onRemove={removeItem}
            />
          ))}
        </ol>
      )}
    </div>
  );
});

export default Procedure;
