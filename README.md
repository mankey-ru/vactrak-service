# vactrak-service

Job vacancy tracker service for personal needs.

## The goal
Nowadays many jobs immediately got many applicants and job sites provide only daily notification subscriptions (email, messengers etc), so you have to sit down and keep pressing F5. The purpose of this project is to make you notificated **immediately** after job was posted. It was made on top of the userscript to avoid problems with authentication, API requests blocking etc.

## Basic usage (client-side only)
1. Install [Tampermonkey](https://www.tampermonkey.net/) or any userscript extension for your browser.
1. Install [userscript for HeadHunter/Habr career](https://github.com/mankey-ru/userscripts/blob/main/dist/vactrak.user.js).
1. Open HeadHunter or Habr Career and search with your exact conditions
1. Add to search url params `&use_vactrak=yes&vactrak_search_key=YOUR_OPTIONAL_SEARCH_NAME`
    - `vactrak_search_key` is just a convenient label, use different keys for each search if you have several with different criteria. E.g. `node` and `vue`.

#### Result
It reloads the page each ~2m and makes **clickable system notifications** about new vacancies. 
Just keep the page(s) open. Plus, there are [some teqniques](https://www.google.com/search?q=firefox+prevent+tab+from+sleeping) to prevent tabs from being "slept" in case of lack of RAM.

## Full usage with server-side
- Deploy service on hosting of your choice. I should support Node.js 20+ and postgres.
- Set env variables (secrets or .env) for backend: [.env.example](https://github.com/mankey-ru/vactrak-service/blob/main/.env.example)
- In browser press Ctrl+Shift+I -> Console and set `localStorage.VACTRAK_URL='https://DOMAIN_WHERE_SERVICE_DEPLOYED.com'`

#### Result

The userscript will send new vacancies to the server side and **you will get immediate TG notifications**. Duplicate jobs will be ignored.

