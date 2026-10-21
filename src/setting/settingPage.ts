// Settings page: saves the temperature unit in localStorage.
import { byId, show } from "../shared/dom.js";
import { getUnit, setUnit } from "../shared/settings.js";
import { initThemeToggle } from "../shared/theme.js";
import type { Unit } from "../types/unit.js";

function startSettingsPage(): void {
  const status = byId("save-unit-status");
  const radios = document.querySelectorAll<HTMLInputElement>('input[name="unit"]');

  // Check the radio button that matches the saved unit.
  const savedUnit = getUnit();
  radios.forEach((radio) => {
    radio.checked = radio.value === savedUnit;
  });

  // The Save button writes the choice to localStorage.
  byId("save-unit-button").addEventListener("click", () => {
    const checked = document.querySelector<HTMLInputElement>('input[name="unit"]:checked');
    if (checked === null) {
      return; // no radio is selected (should not happen)
    }
    const chosen: Unit = checked.value === "imperial" ? "imperial" : "metric";
    setUnit(chosen);
    show(status);
  });
}

// The dark / light switch lives in the header of every page.
initThemeToggle();

startSettingsPage();
