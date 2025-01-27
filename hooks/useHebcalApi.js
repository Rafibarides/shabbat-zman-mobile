import { useState, useEffect } from 'react';
import { getUpcomingShabbatDates } from '../utils/timeHelpers';

export default function useHebcalApi() {
  const [hebrewData, setHebrewData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHebrewDate() {
      try {
        setIsLoading(true);
        const today = new Date().toISOString().split('T')[0];
        // Get both Friday and Saturday for the upcoming Shabbat
        const { friday, saturday } = getUpcomingShabbatDates();

        // Debug logs
        console.log('Today:', today);
        console.log('Upcoming Shabbat Friday:', friday);
        console.log('Upcoming Shabbat Saturday:', saturday);

        // 1) Fetch current Hebrew date
        const dateResponse = await fetch(
          `https://www.hebcal.com/converter?cfg=json&date=${today}&g2h=1&strict=1`
        );
        if (!dateResponse.ok) throw new Error('Failed to fetch Hebrew date');
        const dateData = await dateResponse.json();

        // 2) Fetch today's events (for holidays)
        const todayEventsResponse = await fetch(
          `https://www.hebcal.com/hebcal?cfg=json&v=1&maj=on&min=on&mod=on&start=${today}&end=${today}`
        );
        if (!todayEventsResponse.ok) throw new Error('Failed to fetch today\'s events');
        const todayEventsData = await todayEventsResponse.json();

        // 3) Fetch upcoming Shabbat's parsha from Saturday
        //    Add diaspora=1 so we get the diaspora reading if needed
        const parshaResponse = await fetch(
          `https://www.hebcal.com/hebcal?cfg=json&v=1&start=${saturday}&end=${saturday}&s=on&lg=h&diaspora=1`
        );
        if (!parshaResponse.ok) throw new Error('Failed to fetch parsha');
        const parshaData = await parshaResponse.json();

        console.log('Parsha API response:', parshaData);

        // 4) Find the parsha in the Saturday items
        const parsha = parshaData.items.find(
          (item) =>
            item.category === 'parashat' ||
            (item.category === 'reading' && item.title.includes('Parashat'))
        );

        console.log('Found parsha:', parsha);

        setHebrewData({
          hebrew: dateData.hebrew,
          events: todayEventsData.items,
          parsha: parsha,
          holidays: todayEventsData.items.filter(
            (item) =>
              item.category === 'holiday' ||
              item.category === 'roshchodesh' ||
              item.category === 'moed'
          )
        });
      } catch (err) {
        console.error('Hebcal API Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHebrewDate();
  }, []);

  return { hebrewData, error, isLoading };
}