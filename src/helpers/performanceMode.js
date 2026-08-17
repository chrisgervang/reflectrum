export const resolvePerformanceMode = ({
  config = globalThis.REFLECTRUM_CONFIG,
  search = globalThis.location?.search,
} = {}) => {
  if (config?.performanceMode === 'low' || config?.performanceMode === 'normal') {
    return config.performanceMode;
  }

  return new URLSearchParams(search || '').get('performance') === 'low' ? 'low' : 'normal';
};
