// i18n.js (or similar file)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Importa traducciones
import menubarEs from './locales/es/menubar.json';
import holidaysEs from './locales/es/holidays.json';
import eventsEs from './locales/es/events.json';
import entityeventsEs from './locales/es/entityevents.json';
import holidaysviewEs from './locales/es/holidaysview.json';
import winterafternoonsEs from './locales/es/winterafternoons.json';
import contactsEs from './locales/es/contacts.json';

import menubarEu from './locales/eu/menubar.json';
import holidaysEu from './locales/eu/holidays.json'
import eventsEu from './locales/eu/events.json';
import entityeventsEu from './locales/eu/entityevents.json';
import holidaysviewEu from './locales/eu/holidaysview.json';
import winterafternoonsEu from './locales/eu/winterafternoons.json';
import contactsEu from './locales/eu/contacts.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        menubar: menubarEs,
        holidays: holidaysEs,
        events: eventsEs,
        entityevents: entityeventsEs,
        holidaysview: holidaysviewEs,
        winterafternoons: winterafternoonsEs,
        contacts: contactsEs,
      },
      eu: {
        menubar: menubarEu,
        holidays: holidaysEu,
        events: eventsEu,
        entityevents: entityeventsEu,
        holidaysview: holidaysviewEu,
        winterafternoons: winterafternoonsEu,
        contacts: contactsEu,
      },
    },
    lng: 'es', // idioma por defecto
    fallbackLng: 'es',
    ns: ['menubar', 'holidays', 'events', 'entityevents', 'holidaysview', 'winterafternoons', 'contacts'], // namespaces
    defaultNS: 'menubar',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;