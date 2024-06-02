// Configuration for the line series used for trends
export const volumeSeriesConfig = {
  color: '#26a69a',
  priceFormat: {
    type: 'volume',
  },
  priceScaleId: '',
  scaleMargins: {
    top: 0.7,
    bottom: 0,
  },
};

export const candleSeriesConfig = {
  scaleMargins: {
    top: 0.2,
    bottom: 0.3,
  },
  format: {
    type: "price",
    precision: 4,
    minMove: 0.001,
  },
};

export const vmaSeriesConfig = {
  color: '#EBA500',
  lineWidth: 2,
  lineType: 2,
  priceFormat: {
    type: 'volume',
  },
  priceScaleId: '',
  scaleMargins: {
    top: 0.7,
    bottom: 0,
  },

}
