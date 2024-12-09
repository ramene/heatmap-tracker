import i18n from "./localization/i18n";
import HeatmapTracker from "./main";
import { App, PluginSettingTab, setIcon, Setting } from "obsidian";
import languages from "./localization/languages.json";

export default class HeatmapTrackerSettingsTab extends PluginSettingTab {
  plugin: HeatmapTracker;

  constructor(app: App, plugin: HeatmapTracker) {
    super(app, plugin);
    this.plugin = plugin;
  }

  private async addColorMap(color: { key: string, value: string }) {
    const isValid = { key: true, value: true, };

    if (!color.key) isValid.key = false;

    const validatedArray = this.validateColorInput(color.value);

    if (!validatedArray) isValid.value = false;

    if (isValid.key && isValid.value) {
      this.plugin.settings.colors[color.key] = validatedArray as string[];

      await this.plugin.saveSettings();

      this.display();
    }

    return isValid;
  }

  private async deleteColorMap(key: keyof typeof this.plugin.settings.colors) {
    delete this.plugin.settings.colors[key];

    await this.plugin.saveSettings();

    this.display();
  }

  private displayColorSettings() {
    const { containerEl } = this;

    containerEl.createEl("h3", { text: i18n.t('settings.colors'), });
    this.displayColorHelp(containerEl);

    for (const [key, colors,] of Object.entries(this.plugin.settings.colors)) {
      const colorEntryContainer = containerEl.createDiv({
        cls: "heatmap-tracker-settings-colors__container",
      });

      const colorDataContainer = colorEntryContainer.createDiv({
        cls: "heatmap-tracker-settings-colors__data-container",
      });

      colorDataContainer.createEl("h4", { text: key });

      const colorRow = colorDataContainer.createDiv({ cls: "heatmap-tracker-settings-colors__row", });

      const colorsContainer = colorRow.createDiv({ cls: "heatmap-tracker-settings-colors__color-container", });

      for (const color of colors) {
        colorsContainer.createEl("div", {
          cls: "heatmap-tracker-settings-colors__color-box",
          attr: {
            style: `background-color: ${color}`,
          },
        });

        colorsContainer.createEl("pre", {
          cls: "heatmap-tracker-settings-colors__color-name",
          text: color,
        });
      }

      if (key !== "default") {
        const deleteColorButton = colorEntryContainer.createEl("button", {
          cls: "mod-warning heatmap-tracker-settings-colors__delete",
        });

        setIcon(deleteColorButton, "trash");

        deleteColorButton.addEventListener("click", () => this.deleteColorMap(key));
      }
    }

    this.displayColorInput(containerEl);
  }

  private displayColorInput(parent: HTMLElement) {
    const inputContainer = parent.createDiv({ cls: "heatmap-tracker-settings-colors__new-color-input-container", });

    const colorNameInput = inputContainer.createEl("input", {
      cls: "heatmap-tracker-settings-colors__new-color-input-name",
      attr: { placeholder: i18n.t('settings.colorName'), type: "text", },
    });

    const colorValueInput = inputContainer.createEl("input", {
      cls: "heatmap-tracker-settings-colors__new-color-input-value",
      attr: { placeholder: i18n.t('settings.colorsArray'), type: "text", },
    });

    const addColorButton = inputContainer.createEl("button", {
      cls: "mod-cta heatmap-tracker-settings-colors__new-color-button",
    });

    setIcon(addColorButton, "plus");

    addColorButton.addEventListener("click", async () => {
      const isValid = await this.addColorMap({
        key: colorNameInput.value,
        value: colorValueInput.value,
      });

      this.reportInputValidity(colorNameInput, isValid.key, i18n.t('settings.pleaseEnterColorName'));
      this.reportInputValidity(colorValueInput, isValid.value, i18n.t('settings.colorIsNotValidJSON'));
    });
  }

  private displayColorHelp(parent: HTMLElement) {
    parent.createEl("p", {
      text: i18n.t('settings.addListOfColors'),
    });
    parent.createEl("p", {
      text: i18n.t('settings.colorsUsageNote'),
    });
  }

  private reportInputValidity(input: HTMLInputElement, isValid: boolean, msg: string) {
    if (!isValid) {
      input.classList.add("has-error");
      input.setCustomValidity(msg);
    } else input.setCustomValidity("");

    input.reportValidity();
  }

  private validateColorInput(value: string) {
    const colorRegex = /^(#[0-9a-f]{3,6}|rgba?\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*(,\s*\d+(\.\d+)?%?)?\s*\))$/i;

    try {
      const data: string[] = JSON.parse(value);

      if (!Array.isArray(data)) return false;

      return data.every(color => colorRegex.test(color)) ? data : false;
    } catch (e) {
      return false;
    }
  }

  private displayWeekStartDaySettings() {
    const { containerEl, } = this;
    new Setting(containerEl)
      .setName(i18n.t('settings.weekStartDay'))
      .setDesc(i18n.t('settings.weekStartDayDescription'))
      .addDropdown(dropdown =>
        dropdown
          .addOptions({
            0: i18n.t('weekdaysLong.Sunday'),
            1: i18n.t('weekdaysLong.Monday'),
            2: i18n.t('weekdaysLong.Tuesday'),
            3: i18n.t('weekdaysLong.Wednesday'),
            4: i18n.t('weekdaysLong.Thursday'),
            5: i18n.t('weekdaysLong.Friday'),
            6: i18n.t('weekdaysLong.Saturday'),
          })
          .setValue(this.plugin.settings.weekStartDay.toString())
          .onChange(async (value) => {
            this.plugin.settings.weekStartDay = Number(value);
            await this.plugin.saveSettings();
          })
      );
  }

  private displayLanguageSettings() {
    new Setting(this.containerEl)
      .setName(i18n.t("settings.language"))
      .setDesc(i18n.t("settings.chooseYourPreferredLanguage"))
      .addDropdown((dropdown) => {
        dropdown
          .addOptions(languages)
          .setValue(this.plugin.settings.language)
          .onChange(async (value) => {
            i18n.changeLanguage(value);
            this.plugin.settings.language = value;
            await this.plugin.saveSettings();
            this.display(); // Refresh the settings page
          });
      });
  }

  private displaySeparateMonthsSettings() {
    const { containerEl } = this;
    new Setting(containerEl)
      .setName(i18n.t('settings.separateMonths'))
      .setDesc(i18n.t('settings.separateMonthsDescription'))
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.separateMonths)
        .onChange(async (value) => {
          this.plugin.settings.separateMonths = value;
          await this.plugin.saveSettings();
        }));
  }

  display() {
    const { containerEl } = this;

    containerEl.empty();

    this.displayLanguageSettings();

    this.displayWeekStartDaySettings();

    this.displaySeparateMonthsSettings();

    this.displayColorSettings();
  }
}
