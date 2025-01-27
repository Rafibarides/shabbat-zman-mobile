// Placeholder for time and date utility functions (e.g., converting to AM/PM, removing leading zeros, etc.). 

// Helper functions for time calculations
export const calculateAdjustedTime = (timeStr, offsetMinutes) => {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);

  const dateObj = new Date();
  dateObj.setHours(period === 'PM' ? hours + 12 : hours);
  dateObj.setMinutes(minutes + offsetMinutes);

  // Format without leading zeros for hours
  const formattedHour = dateObj.getHours() % 12 || 12; // Convert 0 to 12 for 12 AM
  const formattedMinutes = dateObj.getMinutes().toString().padStart(2, '0');
  const ampm = dateObj.getHours() >= 12 ? 'PM' : 'AM';

  return `${formattedHour}:${formattedMinutes} ${ampm}`;
};

export const getUpcomingShabbatDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday

  let fridayDate = new Date(today);
  
  if (dayOfWeek === 6) { // If Saturday, get yesterday
    fridayDate.setDate(today.getDate() - 1);
  } else if (dayOfWeek === 5) { // If Friday, use today
    // keep today's date
  } else { // Otherwise, get next Friday
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    fridayDate.setDate(today.getDate() + daysUntilFriday);
  }

  const saturdayDate = new Date(fridayDate);
  saturdayDate.setDate(fridayDate.getDate() + 1);

  return {
    friday: fridayDate.toISOString().split('T')[0],
    saturday: saturdayDate.toISOString().split('T')[0]
  };
}; 