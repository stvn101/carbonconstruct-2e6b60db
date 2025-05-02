
export const getPayloadConfig = (
  payloadItem: any,
  config: Record<string, any>
) => {
  const key = payloadItem.dataKey;
  const value = payloadItem.value;
  const itemConfig = config[key];
  
  return {
    key,
    value,
    label: itemConfig?.label || payloadItem.name || payloadItem.value,
    color: payloadItem.color
  };
};

export const getPayloadConfigFromPayload = (
  config: Record<string, any>,
  payload: any,
  key: string
) => {
  const itemConfig = key ? config[key] : null;
  return itemConfig;
};
