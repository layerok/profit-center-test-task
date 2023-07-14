import { TableRecord } from "../../types";
import { BaseModal } from "../../components/BaseModal";
import { ReactComponent as CloseSvg } from "../../assets/close.svg";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "../../components/Table";
import { data } from "../../data";
import { useNavigate } from "react-router-dom";

const columns: ColumnDef<TableRecord>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Created at",
    accessorKey: "created_at",
  },
  {
    id: "actions",
    accessorKey: "id",
  },
];

export const StatsRoute = () => {
  const navigate = useNavigate();
  const close = () => {
    navigate("/");
  };
  return (
    <BaseModal
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
      open={true}
      overlayStyles={{
        justifyItems: "center",
        alignItems: "center",
        background: "rgba(0, 0, 0, 0.4)",
        display: "grid",
        zIndex: 999999,
      }}
      render={() => {
        return (
          <div
            style={{
              background: "white",
              width: 476,
              height: 359,
              padding: 20,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 22,
                right: 32,
                cursor: "pointer",
              }}
              onClick={() => {
                close();
              }}
            >
              <CloseSvg />
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              Статистика
            </div>
            <Table columns={columns} data={data} />
          </div>
        );
      }}
    >
      <div></div>
    </BaseModal>
  );
};
