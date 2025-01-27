import { useState, useEffect } from 'react';
import { getUpcomingShabbatDates } from '../utils/timeHelpers';
// If you have a thin wrapper for fetch, uncomment and import it
// import fetchData from '../utils/fetchData';

// Placeholder hook for WeatherAPI calls. Will fetch sunrise/sunset times, 3-day forecast, etc. 
export default function useWeatherApi({ latitude, longitude, city }) {
  const [data, setData] = useState(null);
  const [astronomy, setAstronomy] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = 'a693943efa754abb860163744241803'; 

  useEffect(() => {
    async function fetchWeather() {
      // We ignore if no coords or city is provided
      if ((!latitude || !longitude) && !city) return;

      setIsLoading(true);
      setError(null);
      try {
        let locationQuery = city
          ? `q=${encodeURIComponent(city)}`
          : `q=${latitude},${longitude}`;

        // 1) Forecast call: get 3 days of forecast
        let forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&${locationQuery}&days=3`;
        let forecastResp = await fetch(forecastUrl);
        if (!forecastResp.ok) {
          throw new Error('Forecast fetch failed');
        }
        let forecastData = await forecastResp.json();
        setData(forecastData);

        // 2) Astronomy calls — remove the old "2024-01-05" line and replace with real upcoming Friday/Saturday:
        const { friday, saturday } = getUpcomingShabbatDates();

        // Fetch astronomy for Friday
        let astroUrlFriday = `https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&${locationQuery}&dt=${friday}`;
        let astroRespFriday = await fetch(astroUrlFriday);
        if (!astroRespFriday.ok) {
          throw new Error('Astronomy fetch (Friday) failed');
        }
        let astroDataFriday = await astroRespFriday.json();

        // Fetch astronomy for Saturday
        let astroUrlSat = `https://api.weatherapi.com/v1/astronomy.json?key=${API_KEY}&${locationQuery}&dt=${saturday}`;
        let astroRespSat = await fetch(astroUrlSat);
        if (!astroRespSat.ok) {
          throw new Error('Astronomy fetch (Saturday) failed');
        }
        let astroDataSat = await astroRespSat.json();

        // Inside the try block, before setting astronomy:
        console.log('Friday astronomy raw:', astroDataFriday.astronomy.astro);
        console.log('Saturday astronomy raw:', astroDataSat.astronomy.astro);

        setAstronomy({
          friday: astroDataFriday.astronomy.astro,
          saturday: astroDataSat.astronomy.astro,
        });
      } catch (err) {
        setError(`Error fetching weather: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWeather();
  }, [latitude, longitude, city]);

  return { data, astronomy, error, isLoading };
} 