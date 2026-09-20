import { NativeSelect } from "./components/quest/native-select";
import { themeNames, themes, type QuestTheme } from "./components/quest/theme";

export interface ThemePickerProps {
  themeName: QuestTheme;
  onThemeChange: (themeName: QuestTheme) => void;
}

function isQuestTheme(value: string): value is QuestTheme {
  return Object.hasOwn(themes, value);
}

export function ThemePicker({ themeName, onThemeChange }: ThemePickerProps) {
  return (
    <NativeSelect
      label="Theme"
      value={themeName}
      onChange={(event) => {
        const nextTheme = event.currentTarget.value;
        if (isQuestTheme(nextTheme)) onThemeChange(nextTheme);
      }}
    >
      {themeNames.map((name) => (
        <option key={name} value={name}>
          {themes[name].name}
        </option>
      ))}
    </NativeSelect>
  );
}
