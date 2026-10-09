/**
 * Formats a duration in seconds as '12 s', '3 min 20 s' or '1 h 5 min' (labels come from i18n).
 */
export const formatDuration = (seconds, t) => {
  const total = Math.max(0, Math.round(seconds || 0));
  if (total < 60) return t('time.seconds', { s: total });
  if (total < 3600) {
    const minutes = Math.floor(total / 60);
    const rest = total % 60;
    return rest === 0
      ? t('time.minutes', { m: minutes })
      : t('time.minutesSeconds', { m: minutes, s: rest });
  }
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return minutes === 0
    ? t('time.hours', { h: hours })
    : t('time.hoursMinutes', { h: hours, m: minutes });
};
