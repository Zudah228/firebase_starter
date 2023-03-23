import * as dateFns from "date-fns";
import * as dateFnsLocale from "date-fns/locale";

export const supportLocale = "ja" as const;
export type SupportLocale = typeof supportLocale;

const matchLocale: Record<typeof supportLocale, dateFns.Locale> = {
  ja: dateFnsLocale.ja,
};

/**
 * 日付の比較
 */
class DateFormat {
  static setLocale = (locale: SupportLocale): void => {
    dateFns.setDefaultOptions({ locale: matchLocale[locale], weekStartsOn: 1 });
  };

  static format = (date: Date, format: string, locale?: SupportLocale): string => {
    const options = locale === undefined ? undefined : { locale: matchLocale[locale] };

    return dateFns.format(date, format, options);
  };
}

export const dateFormat = DateFormat;
