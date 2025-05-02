
import { getPayloadConfigFromPayload } from '../getPayloadConfig';

describe('getPayloadConfigFromPayload', () => {
  const mockConfig = {
    sales: { label: 'Sales', color: '#3e9847' },
    revenue: { label: 'Revenue', color: '#25612d' },
    expenses: { label: 'Expenses', color: '#8acd91' },
  };

  test('returns undefined when payload is not an object', () => {
    expect(getPayloadConfigFromPayload(mockConfig, null, 'sales')).toBeUndefined();
    expect(getPayloadConfigFromPayload(mockConfig, undefined, 'sales')).toBeUndefined();
    expect(getPayloadConfigFromPayload(mockConfig, 'string', 'sales')).toBeUndefined();
    expect(getPayloadConfigFromPayload(mockConfig, 123, 'sales')).toBeUndefined();
  });

  test('gets config directly from payload key', () => {
    const payload = { 
      dataKey: 'sales',
      name: 'Sales',
      value: 1000
    };
    
    const result = getPayloadConfigFromPayload(mockConfig, payload, 'dataKey');
    expect(result).toEqual(mockConfig.sales);
  });

  test('gets config from string value in payload at key', () => {
    const payload = { 
      customKey: 'revenue',
      name: 'Sales',
      value: 1000
    };
    
    const result = getPayloadConfigFromPayload(mockConfig, payload, 'customKey');
    expect(result).toEqual(mockConfig.revenue);
  });

  test('gets config from nested payload object', () => {
    const payload = { 
      payload: {
        type: 'expenses',
        value: 500
      },
      name: 'Expenses',
      value: 500
    };
    
    const result = getPayloadConfigFromPayload(mockConfig, payload, 'type');
    expect(result).toEqual(mockConfig.expenses);
  });

  test('returns undefined when config key does not exist', () => {
    const payload = { 
      dataKey: 'profit',
      name: 'Profit',
      value: 800
    };
    
    const result = getPayloadConfigFromPayload(mockConfig, payload, 'dataKey');
    expect(result).toBeUndefined();
  });

  test('falls back to key itself when value not found', () => {
    const payload = { 
      dataKey: 'unknown',
      name: 'Unknown',
      value: 100
    };
    
    // If 'sales' exists in config but payload doesn't have sales key/value
    const result = getPayloadConfigFromPayload(mockConfig, payload, 'sales');
    expect(result).toEqual(mockConfig.sales);
  });
});
