
// Add proper type definition for the TransactionEvent interface
interface TransactionEvent extends Event {
  transaction?: IDBTransaction;
}

// For category operations, ensure ExtendedMaterialData has category:
const processMaterialCategories = (materials: ExtendedMaterialData[]) => {
  const categoriesMap: Record<string, number> = {};
  
  materials.forEach(material => {
    const category = material.category || 'Uncategorized';
    categoriesMap[category] = (categoriesMap[category] || 0) + 1;
  });
  
  return categoriesMap;
};

// Update the handleTransactionComplete function
const handleTransactionComplete = (event: TransactionEvent) => {
  if (event.transaction) {
    // Now TypeScript knows event.transaction exists
  }
};
