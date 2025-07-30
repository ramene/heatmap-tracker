## Adding a New Language

Follow these steps to add a new language to the app:

1. **Create a new language file**  
   In the `src/localization/locales/` folder, create a new file named `{LG}.json`, where `{LG}` is the language code (e.g., `fr` for French, `es` for Spanish).

2. **Copy English content**  
   Copy the content from `en.json` into your new `{LG}.json` file.

3. **Translate the content**  
   Replace the English strings in `{LG}.json` with translations in the desired language.

4. **Import the new language file**  
   Open `src/localization/i18n.ts` and import your new `{LG}.json` file.

5. **Update the `resources` object**  
   In `src/localization/i18n.ts`, extend the `resources` object to include the new language.

6. **Update the list of the languages**  
   Add the new language entry to `src/localization/languages.json`.
