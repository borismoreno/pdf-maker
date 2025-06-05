export function getCurrentLocalDate(pastYear?: boolean): { startDate: Date, endDate: Date } {
    var date = new Date('2024-01-01');
    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    var dt = new Date(now_utc);

    let utcDate = new Date(dt.toLocaleString('en-US', { timeZone: "UTC" }));
    let tzDate = new Date(dt.toLocaleString('en-US', { timeZone: "America/New_York" }));
    let offset1 = utcDate.getTime() - tzDate.getTime();
    dt.setTime(dt.getTime() - offset1);
    const startOfMonth = new Date(dt);
    startOfMonth.setDate(1);
    if (pastYear) startOfMonth.setFullYear(startOfMonth.getFullYear() - 1);
    const endOfMonth = dt;
    endOfMonth.setHours(23, 59, 59, 999);
    endOfMonth.setDate(1);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    return { startDate: startOfMonth, endDate: endOfMonth };
}