import { TableRecord } from "../../types";
import { ReactComponent as CloseSvg } from "../../assets/close.svg";
import { ColumnDef } from "@tanstack/react-table";
import { Table } from "../../components/Table";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllStats } from "../../api/stats.api";
import * as S from "./stats.route.style";
import { IGetStatsRes } from "../../api/stats.api.types";
import { format } from "date-fns";
import { routePaths } from "../../constants/route.constant";

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

  const goHome = () => {
    navigate(routePaths.home);
  };

  // todo: fix this
  const limit = 102312312;

  const { data: stats, isLoading } = useQuery<IGetStatsRes>({
    queryKey: ["stats", limit],
    queryFn: () => {
      return getAllStats({
        limit,
      });
    },
  });

  const data = (stats?.records || []).map((stat) => ({
    id: stat.id,
    created_at: stat.start,
  }));

  if (isLoading) {
    return <div>...loading</div>;
  }

  if (!stats) {
    return <div>No data</div>;
  }

  return (
    <div>
      <S.CloseSvgContainer onClick={goHome}>
        <CloseSvg />
      </S.CloseSvgContainer>
      <S.Title>Статистика</S.Title>
      <S.DataContainer>
        {data.map((record) => (
          <S.Row key={record.id}>
            <div>#{record.id}</div>
            <div>
              &nbsp;&nbsp;
              {format(new Date(+record.created_at), "dd/MM/yyyy hh:mm:ss")}
            </div>
            <div>
              &nbsp;&nbsp;
              <Link to={routePaths.stat.replace(":id", String(record.id))}>View</Link>
            </div>
          </S.Row>
        ))}
      </S.DataContainer>
      {/* <Table columns={columns} data={data} /> */}
    </div>
  );
};
