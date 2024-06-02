import {
  updateSeriesData, updateSeriesOptions,
  getQueryParams,
  calculateVMA
} from '../utils/utils.js';

import { fetchCandleData, getHistoryCandles } from '../api/dataService.js';

var trendSeries = [];

var lastCandle;
var fetchedCandles;
export const initializeChartWithData = async (chart, series, sym = 'BTC/USDT', tf = '1h') => {
  try {

    const { symbol, timeframe } = await getQueryParams();

    const qsymbol = symbol || sym;
    const qtimeframe = timeframe || tf;

    if (!qsymbol || !qtimeframe) {
      console.error('None symbol or timeframe set in query. \n Initializing BTCUSDT/1h chart');
    }

    //Get data required to fill the chart
    const candles = await fetchCandleData(qsymbol, qtimeframe);
    // const { extremum, wave, trends } = await fetchAllLineData(qsymbol, qtimeframe);

    const dataSources = {
      candles: candles,
      // extrema: extremum,
      // waves: wave,
      // trends: trends,
    };


    for (const [name, data] of Object.entries(dataSources)) {
      if (!data) {
        console.error('Failed to fetch data from source ' + name);
        // return;
      }

      if (name === 'candles') {
        fetchedCandles = data
        lastCandle = data[data.length - 1];
        const volData = data.map(({ time, volume }) => ({ time: time, value: volume }));
        // calculate Volume moving average with length 200
        const VMA200 = calculateVMA(volData, 200);
        // calculate Volume moving average with length 5

        const VMA5 = calculateVMA(volData, 5);

        series.volume_series.priceScale().applyOptions({
          scaleMargins: {
            top: 0.7,
            bottom: 0,
          },
        })

        updateSeriesData(series.candles_series, data)
        updateSeriesData(series.volume_series, volData)
        updateSeriesData(series.vma_200, VMA200)
        updateSeriesData(series.vma_5, VMA5)
        updateSeriesOptions(series.vma_200, { color: '#2D1FF0' })
        updateSeriesOptions(series.vma_5, { color: '#F49212' })

      }

      chart.applyOptions({
        watermark: {
          visible: true,
          fontSize: 52,
          horzAlign: 'center',
          vertAlign: 'top',
          color: 'rgba(255, 255, 255, 0.7)',
          text: `${qsymbol}:${qtimeframe}`,
        },
      });
    }


  } catch (error) {
    console.error('Error initializing chart with data:', error);
  }
}

export async function loadHistoryToChart(series, symbol, timeframe) {
  const existingCandles = await getHistoryCandles(symbol, timeframe);
  const fetchedCandles = await fetchCandleData(symbol, timeframe) || [];

  const mergedCandles = [...existingCandles
    .filter(candle => candle.time < fetchedCandles[0].time),
  ...fetchedCandles];
  //console.log(mergedCandles.length)
  const volumes = mergedCandles.map(({ time, volume }) => ({ time, value: volume }));

  updateSeriesData(series.historycandles_series, mergedCandles)
  updateSeriesData(series.historyvolume_series, volumes)

}
