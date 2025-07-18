/**
* Define los tipos de búsqueda de rango de fechas permitidos.
* - `currentMonth`: Primer y último día del mes actual.
* - `previousMonth`: Primer y último día del mes anterior.
* - `currentYear`: Primer día del año actual y último día del mes actual.
* - `previousYear`: Primer y último día del año anterior.
*/
export type SearchType = 'currentMonth' | 'previousMonth' | 'currentYear' | 'previousYear';
export function getCurrentLocalDate(pastYear?: boolean): { startDate: Date, endDate: Date } {
    // var date = new Date();
    // var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    //     date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

    // var dt = new Date(now_utc);
    // console.log('now_utc', dt);

    // let utcDate = new Date(date.toLocaleString());
    // // let utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
    // const tzDate = new Date(new Date().toLocaleString('en-US', { timeZone: "America/New_York" }));
    // console.log('time dates', utcDate, tzDate);
    // let offset1 = utcDate.getTime() - tzDate.getTime();
    // dt.setTime(dt.getTime() - offset1);
    // const startOfMonth = new Date(dt);
    // startOfMonth.setDate(1);
    // if (pastYear) startOfMonth.setFullYear(startOfMonth.getFullYear() - 1);
    // const endOfMonth = dt;
    // endOfMonth.setHours(23, 59, 59, 999);
    // endOfMonth.setDate(1);
    // endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    const now = new Date();
    const timeZone = 'America/Bogota';

    // Usamos Intl.DateTimeFormat para obtener las partes de la fecha (año y mes)
    // que corresponden a la zona horaria de Bogotá en este instante.
    const yearFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone });
    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'numeric', timeZone });

    const year = parseInt(yearFormatter.format(now), 10);
    const month = parseInt(monthFormatter.format(now), 10);

    // El mes en el constructor de Date es 0-indexado (0=Enero, 11=Diciembre),
    // por lo que restamos 1 al mes obtenido de Intl (que es 1-indexado).
    const firstDay = new Date(Date.UTC(year, month - 1, 1));


    // Para obtener el último día, vamos al primer día del mes siguiente y restamos un día.
    // Esto maneja correctamente meses de diferente duración y años bisiestos.
    const lastDay = new Date(Date.UTC(year, month, 0));

    if (pastYear) {
        firstDay.setFullYear(firstDay.getFullYear() - 1);
        lastDay.setFullYear(lastDay.getFullYear() - 1);
    }

    return {
        startDate: firstDay,
        endDate: lastDay,
    };

    // return { startDate: startOfMonth, endDate: endOfMonth };
}

/**
 * Obtiene un rango de fechas (primer y último día) basado en un tipo de búsqueda,
 * considerando siempre la zona horaria de America/Bogota.
 *
 * @param searchType El tipo de búsqueda a realizar.
 * @returns Un objeto con `firstDay` y `lastDay` como objetos Date.
 */
export function getDateBounds(searchType: SearchType): { firstDay: Date; lastDay: Date } {
    const now = new Date();
    const timeZone = 'America/Bogota';

    // Obtener el año y mes actuales en la zona horaria de Bogotá.
    const yearFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone });
    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'numeric', timeZone });

    let year = parseInt(yearFormatter.format(now), 10);
    // El mes de Intl es 1-indexado (1=Enero, 12=Diciembre).
    let month = parseInt(monthFormatter.format(now), 10);

    let firstDay: Date;
    let lastDay: Date;

    // El mes para el constructor de Date es 0-indexado (0=Enero, 11=Diciembre).
    const monthIndex = month - 1;

    switch (searchType) {
        case 'currentMonth':
            firstDay = new Date(Date.UTC(year, monthIndex, 1));
            lastDay = new Date(Date.UTC(year, month, 0));
            break;

        case 'previousMonth':
            // Ir al día 0 del mes actual nos da el último día del mes anterior.
            // const lastDayOfPrevMonth = new Date(Date.UTC(year, monthIndex, 0));
            // const prevMonthYear = lastDayOfPrevMonth.getUTCFullYear();
            // const prevMonthIndex = lastDayOfPrevMonth.getUTCMonth();

            // firstDay = new Date(Date.UTC(prevMonthYear, prevMonthIndex, 1));
            // lastDay = lastDayOfPrevMonth;
            firstDay = new Date(Date.UTC(year, monthIndex - 1, 1));
            lastDay = new Date(Date.UTC(year, monthIndex, 0));

            break;

        case 'currentYear':
            firstDay = new Date(Date.UTC(year, 0, 1)); // 1 de Enero del año actual
            lastDay = new Date(Date.UTC(year, month, 0)); // Último día del mes actual
            break;

        case 'previousYear':
            const previousYear = year - 1;
            firstDay = new Date(Date.UTC(previousYear, 0, 1)); // 1 de Enero del año anterior
            lastDay = new Date(Date.UTC(previousYear, 11, 31)); // 31 de Diciembre del año anterior
            break;
    }

    return { firstDay, lastDay };
}
