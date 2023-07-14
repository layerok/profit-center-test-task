import { TableRecord } from "../../types";
import { ReactComponent as CloseSvg } from "../../assets/close.svg";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "../../components/Table";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { statisticsApi } from "../../api/statisticsApi";
import * as S from "./stats.route.style";
import { IGetStatsRes } from "../../api/statisticsApi.types";
import { format } from "date-fns";

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

  const limit = 102312312;

  const { data: stats, isLoading } = useQuery<IGetStatsRes>({
    queryKey: ["stats", limit],
    queryFn: () => {
      return statisticsApi.getAll({
        limit,
      });
    },
  });

  const data = (stats?.records || [])?.map((stat) => ({
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
          <div
            style={{
              overflow: "auto",
              height: 275,
            }}
          >
            {data.map((record) => (
              <div
                style={{
                  display: "flex",
                  marginBottom: 4,
                }}
              >
                <div>#{record.id}</div>
                <div>
                  &nbsp;&nbsp;
                  {format(new Date(+record.created_at), "dd/MM/yyyy hh:mm:ss")}
                </div>
                <div>
                  &nbsp;&nbsp;
                  <Link to={`/stat/${record.id}`}>View</Link>
                </div>
              </div>
            ))}
          </div>
          {/* <Table columns={columns} data={data} /> */}
        </div>
      )}
    </>
  );
};
