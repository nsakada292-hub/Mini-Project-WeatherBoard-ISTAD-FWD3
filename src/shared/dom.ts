// Tiny helpers so every page script grabs elements the same way.

// Finds an element by its id and tells TypeScript what kind it is.
// Example: byId<HTMLImageElement>("detail-icon")
export function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (element === null) {
    throw new Error(`Missing element with id "${id}"`);
  }
  return element as T;
}

// Shows an element that was hidden with the "hidden" class.
export function show(element: HTMLElement): void {
  element.classList.remove("hidden");
}

// Hides an element by adding the "hidden" class.
export function hide(element: HTMLElement): void {
  element.classList.add("hidden");
}
