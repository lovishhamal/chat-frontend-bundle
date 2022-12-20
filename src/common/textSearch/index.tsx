import { AutoComplete, Input, SelectProps } from "antd";
import { useState } from "react";

const searchResult = (query: string) =>
  new Array(5)
    .join(".")
    .split(".")
    .map((_, idx) => {
      const category = `${query}${idx}`;
      return {
        value: category,
        label: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              Found {query} on{" "}
              <a
                href={`https://s.taobao.com/search?q=${query}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {category}
              </a>
            </span>
          </div>
        ),
      };
    });

const AutoCompleteSearch = ({ placeholder }: { placeholder?: string }) => {
  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (value: string) => {
    console.log("onSelect", value);
  };

  return (
    <AutoComplete
      dropdownMatchSelectWidth={252}
      style={{ width: 300 }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
    >
      <Input.Search size='large' placeholder={placeholder} enterButton />
    </AutoComplete>
  );
};

export default AutoCompleteSearch;
