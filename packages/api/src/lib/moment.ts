import moment from "moment-timezone";
import "moment/locale/fr";
import { ServerError } from "./error/ServerError";

/**
 * @description Use this with empty param for just set TZ on Europe/Paris by default
 * @param inp Input
 * @param format Format
 * @param language By default "fr"
 * forgiving parsing, see the [parsing guide](https://momentjs.com/guides/#/parsing/).
 */
function getMoment(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string): ReturnType<typeof moment> {
  moment.locale("fr");
  moment.tz.setDefault("Europe/Paris");

  const initiatedMoment = moment(inp, format, language, true)
  if (initiatedMoment.isValid()) {
    return initiatedMoment;
  }
  
  throw new ServerError(initiatedMoment.toString(), 500, "MomentError", { momentInput: inp });
}

export { getMoment };
