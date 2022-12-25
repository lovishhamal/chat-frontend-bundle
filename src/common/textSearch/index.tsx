import { AutoComplete, Input, SelectProps, Spin } from "antd";
import { useState } from "react";

const searchResult = (loading: boolean, query?: any) => {
  return loading
    ? [
        {
          value: "spin",
          label: (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spin />
            </div>
          ),
        },
      ]
    : query?.length
    ? new Array(query?.length)
        .join(".")
        .split(".")
        .map((_, idx) => {
          return {
            value: query[idx]._id,
            label: (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Found {query[idx]?.userName} </span>
              </div>
            ),
          };
        })
    : new Array(query?.length)
        .join(".")
        .split(".")
        .map((_, idx) => {
          return {
            value: "user not ffound",
            label: (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>User not found</span>
              </div>
            ),
          };
        });
};

const AutoCompleteSearch = ({
  placeholder,
  setValue,
}: {
  placeholder?: string;
  setValue: any;
}) => {
  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);

  const handleSearch = async (value: string) => {
    if (value.length === 3) {
      setOptions(searchResult(true));
    }
  };

  const onSelect = (value: string) => {
    setValue(value);
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
