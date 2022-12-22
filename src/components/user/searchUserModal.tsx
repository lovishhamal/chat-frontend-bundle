import React, { useState } from "react";
import { AutoCompleteSearch } from "../../common";

const SearchUserModal = () => {
  const [value, setValue] = useState("");
  return (
    <div>
      {value ? (
        <h1>User found</h1>
      ) : (
        <AutoCompleteSearch
          placeholder='Type at least 3 letters'
          setValue={setValue}
        />
      )}
    </div>
  );
};

export default SearchUserModal;
