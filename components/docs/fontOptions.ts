export interface FontOption {
  name: string;
  value: string;
  category: 'Serif / Legal' | 'Sans-Serif' | 'Monospace' | 'Display';
}

export const FONT_OPTIONS: FontOption[] = [
  // Legal, Parliamentary & Classical Serifs
  { name: 'Times New Roman', value: '"Times New Roman", Times, Georgia, serif', category: 'Serif / Legal' },
  { name: 'Georgia', value: 'Georgia, serif', category: 'Serif / Legal' },
  { name: 'Garamond', value: 'Garamond, "EB Garamond", serif', category: 'Serif / Legal' },
  { name: 'Palatino', value: '"Palatino Linotype", Palatino, "Book Antiqua", serif', category: 'Serif / Legal' },
  { name: 'Book Antiqua', value: '"Book Antiqua", Palatino, serif', category: 'Serif / Legal' },
  { name: 'Cambria', value: 'Cambria, Georgia, serif', category: 'Serif / Legal' },
  { name: 'Baskerville', value: 'Baskerville, "Baskerville Old Face", serif', category: 'Serif / Legal' },
  { name: 'Didot', value: 'Didot, "Bodoni MT", serif', category: 'Serif / Legal' },
  { name: 'Merriweather', value: 'Merriweather, serif', category: 'Serif / Legal' },
  { name: 'Playfair Display', value: '"Playfair Display", var(--font-playfair), Georgia, serif', category: 'Serif / Legal' },
  { name: 'Cinzel', value: 'Cinzel, Georgia, serif', category: 'Serif / Legal' },

  // Ubiquitous & Clean Modern Sans-Serifs
  { name: 'Arial', value: 'Arial, Helvetica, sans-serif', category: 'Sans-Serif' },
  { name: 'Helvetica', value: '"Helvetica Neue", Helvetica, Arial, sans-serif', category: 'Sans-Serif' },
  { name: 'Calibri', value: 'Calibri, Candara, Segoe, "Segoe UI", sans-serif', category: 'Sans-Serif' },
  { name: 'Verdana', value: 'Verdana, Geneva, sans-serif', category: 'Sans-Serif' },
  { name: 'Trebuchet MS', value: '"Trebuchet MS", "Lucida Grande", sans-serif', category: 'Sans-Serif' },
  { name: 'Tahoma', value: 'Tahoma, Verdana, Segoe, sans-serif', category: 'Sans-Serif' },
  { name: 'Inter', value: 'Inter, var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', category: 'Sans-Serif' },
  { name: 'Roboto', value: 'Roboto, "Helvetica Neue", Arial, sans-serif', category: 'Sans-Serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif', category: 'Sans-Serif' },
  { name: 'Lato', value: 'Lato, sans-serif', category: 'Sans-Serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif', category: 'Sans-Serif' },
  { name: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif', category: 'Sans-Serif' },
  { name: 'Outfit', value: 'Outfit, sans-serif', category: 'Sans-Serif' },

  // Monospaced & Statutory Codification
  { name: 'Courier New', value: '"Courier New", Courier, monospace', category: 'Monospace' },
  { name: 'Consolas', value: 'Consolas, Monaco, monospace', category: 'Monospace' },
  { name: 'JetBrains Mono', value: '"JetBrains Mono", var(--font-jetbrains-mono), monospace', category: 'Monospace' },
  { name: 'Fira Code', value: '"Fira Code", monospace', category: 'Monospace' },
  { name: 'Lucida Console', value: '"Lucida Console", Monaco, monospace', category: 'Monospace' },

  // Display & Expressive
  { name: 'Impact', value: 'Impact, Charcoal, sans-serif', category: 'Display' },
  { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive, sans-serif', category: 'Display' },
];
