
import React from "react";
import { useCalculator } from "@/contexts/calculator";
import TransportInputSection from "../../TransportInputSection";

const TransportTabContent: React.FC = () => {
  const {
    calculationInput,
    handleUpdateTransport,
    handleAddTransport,
    handleRemoveTransport,
    handleNextTab,
    handlePrevTab
  } = useCalculator();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-md md:text-lg font-medium flex items-center gap-2">
        <span>Transport Inputs</span>
      </div>
      
      {calculationInput.transport && calculationInput.transport.map((transportItem, index) => (
        <div key={`transport-${index}`} className="grid grid-cols-1 gap-3 items-end border border-gray-200 dark:border-gray-700 p-3 md:p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-1">
              Transport Type
            </label>
            <select
              value={transportItem.type}
              onChange={(e) => handleUpdateTransport(index, "type", e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            >
              <option value="truck">Truck</option>
              <option value="train">Train</option>
              <option value="ship">Ship</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                value={transportItem.distance || ""}
                onChange={(e) => handleUpdateTransport(index, "distance", e.target.value)}
                placeholder="Enter distance in km"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={transportItem.weight || ""}
                onChange={(e) => handleUpdateTransport(index, "weight", e.target.value)}
                placeholder="Enter weight in kg"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button"
              onClick={() => handleRemoveTransport(index)}
              className="text-xs inline-flex items-center justify-center whitespace-nowrap rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
        <button 
          type="button" 
          onClick={handleAddTransport}
          className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm px-4 py-2 rounded-md"
        >
          Add Transport
        </button>
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={handlePrevTab}
            className="w-full sm:w-auto border border-carbon-600 text-carbon-600 hover:bg-carbon-50 text-xs md:text-sm px-4 py-2 rounded-md"
          >
            Previous: Materials
          </button>
          <button 
            type="button" 
            onClick={handleNextTab}
            className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm px-4 py-2 rounded-md"
          >
            Next: Energy
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransportTabContent;
