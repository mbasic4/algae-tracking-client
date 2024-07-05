import { useState } from 'react';

const useToggle = (initialState: boolean = false): [boolean, () => void] => {
  const [isToggled, setToggled] = useState(initialState);

  const toggle = () => {
    setToggled(!isToggled);
  };

  return [isToggled, toggle];
};

export default useToggle;
