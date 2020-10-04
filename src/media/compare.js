const { getStats } = require("./stats");

export async function compare(goal, recent, old) {
  const recent_birthtime = moment((await getStats(recent)).birthtimeMs);
  const old_birthtime = moment((await getStats(old)).birthtimeMs);

  if (isBefore2000(old_birthtime)) {
    return recent;
  }

  if (isBefore2000(recent_birthtime)) {
    return old;
  }

  const recent_difference = Math.abs(goal.difference(recent_birthtime));
  const old_difference = Math.abs(goal.difference(old_birthtime));
  const closest = Math.min(recent_difference, old_difference);

  if (closest === recent_difference) {
    return recent;
  }

  if (closest === old_difference) {
    return old;
  }

  return null;
}

function isBefore2000(date) {
  return date.year() < 2000;
}
