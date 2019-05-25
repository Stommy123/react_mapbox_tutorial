import React from "react";

const LayerList = ({ layers = [], visibleLayers, toggleLayer }) => (
  <div id="layer-list">
    <h1>Click to toggle a layer!</h1>
    {layers.map(layer => {
      const buttonType = visibleLayers.includes(layer) ? "btn-info" : "btn-secondary";
      return (
        <button className={`layer-button btn ${buttonType} pull-sm-right`} onClick={toggleLayer(layer)}>
          {layer}
        </button>
      );
    })}
  </div>
);

export default LayerList;
