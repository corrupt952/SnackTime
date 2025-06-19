// Chrome API Mock for Storybook
export const mockChrome = {
  storage: {
    sync: {
      get: (keys?: string | string[] | null) => {
        const mockData = {
          settings: {
            colorScheme: 'dark',
            notificationType: 'alarm',
            alarmSound: 'Simple',
            volume: 0.1,
          },
          history: JSON.stringify([
            {
              duration: { value: 300 },
              createdAt: new Date().toISOString(),
            },
            {
              duration: { value: 600 },
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ]),
        };
        
        if (!keys) return Promise.resolve(mockData);
        if (typeof keys === 'string') {
          return Promise.resolve({ [keys]: mockData[keys as keyof typeof mockData] });
        }
        if (Array.isArray(keys)) {
          const result: Record<string, any> = {};
          keys.forEach(key => {
            result[key] = mockData[key as keyof typeof mockData];
          });
          return Promise.resolve(result);
        }
        return Promise.resolve({});
      },
      set: (items: Record<string, any>) => {
        console.log('Chrome storage set:', items);
        return Promise.resolve();
      },
    },
  },
  tabs: {
    query: (queryInfo: any) => {
      return Promise.resolve([
        {
          id: 1,
          url: 'https://example.com',
          title: 'Example Page',
          active: true,
        },
      ]);
    },
    sendMessage: (tabId: number, message: any) => {
      console.log('Chrome tabs sendMessage:', { tabId, message });
      return Promise.resolve();
    },
  },
  runtime: {
    onMessage: {
      addListener: (callback: any) => {
        console.log('Chrome runtime onMessage listener added');
      },
    },
  },
};

// Global Chrome mock setup
declare global {
  interface Window {
    chrome: typeof mockChrome;
  }
}

if (typeof window !== 'undefined') {
  window.chrome = mockChrome;
}

if (typeof global !== 'undefined') {
  (global as any).chrome = mockChrome;
}