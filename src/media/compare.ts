import moment from 'moment';
import { getStats } from './stats';

export async function compare(
  goal: moment.Moment,
  recent: string,
  old: string
): Promise<string | null> {
  const recent_birthtime = moment((await getStats(recent)).birthtimeMs);
  const old_birthtime = moment((await getStats(old)).birthtimeMs);

  if (isBefore2000(old_birthtime)) {
    return recent;
  }

  if (isBefore2000(recent_birthtime)) {
    return old;
  }

  const recent_difference = Math.abs(goal.diff(recent_birthtime));
  const old_difference = Math.abs(goal.diff(old_birthtime));
  const closest = Math.min(recent_difference, old_difference);

  if (closest === recent_difference) {
    return recent;
  }

  if (closest === old_difference) {
    return old;
  }

  return null;
}

function isBefore2000(date: moment.Moment): boolean {
  return date.year() < 2000;
}
