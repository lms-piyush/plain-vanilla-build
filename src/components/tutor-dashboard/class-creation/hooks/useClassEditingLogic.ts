
import { useClassDataLoader } from "../ClassDataLoader";

export const useClassEditingLogic = () => {
  const { loadClassData } = useClassDataLoader();

  return {
    loadClassData
  };
};
