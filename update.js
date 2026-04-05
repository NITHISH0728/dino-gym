const fs = require('fs');

let text = fs.readFileSync('styles.css', 'utf-8');

const vars_old = `  /* Black and White Palette */
  --primary-dark: #000000;
  --primary-deeper: #000000;
  --turf-green: #333333;
  --turf-light: #666666;
  --gold: #000000;
  --gold-light: #333333;
  --gold-dark: #000000;
  --gold-glow: rgba(0, 0, 0, 0.3);

  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-section: #F5F5F5;
  --bg-card: #FFFFFF;
  --bg-card-hover: #EEEEEE;
  --bg-elevated: #FFFFFF;

  /* Text — Dark for readability */
  --text-primary: #000000;
  --text-secondary: #333333;
  --text-muted: #666666;
  --text-gold: #000000;

  /* Glass */
  --glass: rgba(255, 255, 255, 0.6);
  --glass-border: rgba(0, 0, 0, 0.2);
  --glass-border-hover: rgba(0, 0, 0, 0.4);

  /* Shadows */
  --shadow-sm: 0 2px 15px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 24px 64px rgba(0, 0, 0, 0.12);
  --shadow-gold: 0 8px 30px rgba(0, 0, 0, 0.2);
  --shadow-float: 0 20px 60px rgba(0, 0, 0, 0.1);`;

const vars_new = `  /* Black and White Palette */
  --primary-dark: #000000;
  --primary-deeper: #000000;
  --turf-green: #ffffff;
  --turf-light: #cccccc;
  --gold: #ffffff;
  --gold-light: #cccccc;
  --gold-dark: #ffffff;
  --gold-glow: rgba(255, 255, 255, 0.3);

  /* Backgrounds */
  --bg-primary: #000000;
  --bg-section: #0a0a0a;
  --bg-card: #141414;
  --bg-card-hover: #1f1f1f;
  --bg-elevated: #111111;

  /* Text — Bright for readability */
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --text-muted: #999999;
  --text-gold: #ffffff;

  /* Glass */
  --glass: rgba(0, 0, 0, 0.6);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-border-hover: rgba(255, 255, 255, 0.4);

  /* Shadows */
  --shadow-sm: 0 2px 15px rgba(255, 255, 255, 0.06);
  --shadow-md: 0 8px 32px rgba(255, 255, 255, 0.08);
  --shadow-lg: 0 16px 48px rgba(255, 255, 255, 0.1);
  --shadow-xl: 0 24px 64px rgba(255, 255, 255, 0.12);
  --shadow-gold: 0 8px 30px rgba(255, 255, 255, 0.1);
  --shadow-float: 0 20px 60px rgba(255, 255, 255, 0.05);`;

text = text.replace(vars_old, vars_new);

const replacements = {
    'background: rgba(247, 245, 240, 0.92);': 'background: rgba(0, 0, 0, 0.92);',
    'background: linear-gradient(160deg, #FFFFFF 0%, #EDE8DC 40%, #E8E2D4 100%);': 'background: var(--bg-primary);',
    'background: linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%);': 'background: var(--bg-section);',
    'background: linear-gradient(180deg, #F5F5F5 0%, #E8E2D4 100%);': 'background: var(--bg-section);',
    'background: #FFFFFF;': 'background: var(--bg-card);',
    'background: #fff;': 'background: var(--bg-card);',
    'color: #000000;': 'color: var(--text-primary);',
    'color: #000;': 'color: var(--text-primary);',
    'color: #333333;': 'color: var(--text-secondary);',
    'color: #666666;': 'color: var(--text-muted);',
    'background: rgba(245, 240, 232, 0.03);': 'background: rgba(255, 255, 255, 0.03);',
    'background: rgba(245, 240, 232, 0.06);': 'background: rgba(255, 255, 255, 0.06);',
    'color: #fff;': 'color: var(--text-primary);',
    'color: #fff !important;': 'color: var(--text-primary) !important;'
};

for (const [oldStr, newStr] of Object.entries(replacements)) {
    text = text.split(oldStr).join(newStr);
}

text = text.split('color: var(--text-primary) !important;').join('color: #000 !important; /* on gold */');

text = text.replace(/(background: linear-gradient.*?(?:var\(--gold\)).*?;[^}]*?color: )var\(--text-primary\);/gs, '$1#000000;');

text = text.split(`preloader {
  position: fixed; inset: 0; z-index: 10000;
  background: var(--text-primary);`).join(`preloader {
  position: fixed; inset: 0; z-index: 10000;
  background: var(--bg-primary);`);

// the preloader fix
text = text.split('background: var(--text-primary);').join('background: #000000;');

fs.writeFileSync('styles.css', text);
console.log("Updated styles.css successfully.");
