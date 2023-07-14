import { DbStatistic, TableRecord } from "../../types";
import { ReactComponent as CloseSvg } from "../../assets/close.svg";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { statisticsApi } from "../../api/statisticsApi";
import * as S from "./stats.route.style";

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
    header: "",
  },
];

export const StatsRoute = () => {
  const navigate = useNavigate();
  const close = () => {
    navigate("/");
  };

  const { data: stats, isLoading } = useQuery<DbStatistic[]>({
    queryKey: ["stats"],
    queryFn: () => {
      return statisticsApi.getAll();
    },
  });

  const data = (stats || [])?.map((stat) => ({
    id: stat.id,
    created_at: stat.start,
  }));

  return (
    <>
      {isLoading ? (
        "...loading"
      ) : (
        <div>
          <S.CloseSvgContainer
            onClick={() => {
              close();
            }}
          >
            <CloseSvg />
          </S.CloseSvgContainer>
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
      )}
    </>
  );
};
