import moment from "moment-timezone";
import "moment/locale/fr";
/**
 * @description Use this with empty param for just set TZ on Europe/Paris by default
 * @param inp Input
 * @param format Format
 * @param language By default "fr"
 * forgiving parsing, see the [parsing guide](https://momentjs.com/guides/#/parsing/).
 */
declare function getMoment(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string): ReturnType<typeof moment>;
export { getMoment };
//# sourceMappingURL=moment.d.ts.map