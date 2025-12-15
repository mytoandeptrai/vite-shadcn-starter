import MultiSelectPicker from "@/components/ui/multi-select-picker";
import { HStack } from "@/components/utilities";
import { DebouncedInput } from "@/modules/demo-table/components/debounced-input";
import { useTableFilterContainer } from "../../hooks";

const TableFilterContainer = () => {
  const {
    t,
    options,
    searchValue,
    selectedBlockChain,
    onSearchValueChange,
    onBlockChainValueChange,
  } = useTableFilterContainer();

  return (
    <div className="mt-4">
      <HStack spacing={12}>
        <DebouncedInput
          placeholder={t("placeholder.search")}
          value={searchValue ?? ""}
          onChange={(val) => {
            onSearchValueChange?.(String(val));
          }}
          className="w-60 md:w-80 h-10!"
        />

        <MultiSelectPicker
          title={t("labels.blockchain")}
          options={options.blockChain}
          multiple
          value={selectedBlockChain}
          onChange={(value) => {
            onBlockChainValueChange(value);
          }}
        />
      </HStack>
    </div>
  );
};

export default TableFilterContainer;
