import fs from 'fs';
import Handlebars from 'handlebars';

export const template = (layout: any, data: any): string => {
  const rawHtml = fs
    .readFileSync(`${__dirname}/../views/${layout}.hbs`)
    .toString();

  const templateEngine = Handlebars.compile(rawHtml);

  return templateEngine(data);
};
