import type { IWalletAddress } from "@/apis/wallet-address";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { capitalizeFirstLetter, formatAddress } from "@/utils";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { MoreHorizontal } from "lucide-react";

interface WalletAddressActionsProps {
  t: TFunction;
  onEdit?: (wallet: IWalletAddress) => void;
  onDelete?: (wallet: IWalletAddress) => void;
}

export const createColumns = ({
  t,
  onEdit,
  onDelete,
}: WalletAddressActionsProps): ColumnDef<IWalletAddress>[] => [
  {
    accessorKey: "label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("table.headers.label")} />
    ),
    cell: ({ row }) => {
      const _row = row.original;
      const label = _row.label;
      return <div className="font-medium">{label}</div>;
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("table.headers.address")}
      />
    ),
    cell: ({ row }) => {
      const _row = row.original;
      const address = _row.address;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-medium">{formatAddress(address)}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{address}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "blockchain",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("table.headers.blockchain")}
      />
    ),
    cell: ({ row }) => {
      const _row = row.original;
      const blockchain = _row.blockchain;
      return (
        <div className="font-medium">{capitalizeFirstLetter(blockchain)}</div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("table.headers.actions")}
      />
    ),
    cell: ({ row }) => {
      const _row = row.original;
      const address = _row.address;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("table.headers.actions")}</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(address)}
            >
              {t("table.actions.copy")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit?.(_row)}>
              {t("table.actions.edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(_row)}
              className="text-destructive"
            >
              {t("table.actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];
