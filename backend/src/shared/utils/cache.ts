import  expeditious from 'express-expeditious';

const cacheoptions: expeditious.ExpeditiousOptions = {
    namespace: 'expresscache',
    defaultTtl: 1000 * 60 * 10,
  };

export const cache = expeditious(cacheoptions);
