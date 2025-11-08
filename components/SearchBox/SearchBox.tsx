import css from "./SearchBox.module.css";
import type { ChangeEvent } from "react";

interface SearchBoxProps {
  value: string
  onChange: (query: string) => void;
}
const SearchBox = ({ value, onChange }: SearchBoxProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  return (
    <input
      value={value}
      onChange={handleChange}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
};

export default SearchBox;
