import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ReactComponent as CloseSvg } from "../../assets/close.svg";
import * as S from "./list.route.style";
import { statsRoutePaths } from "../../route.paths";
import { appRoutePaths } from "../../../App/route.paths";
import { useStatsQuery } from "../../queries";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";

export const StatsRoute = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate(appRoutePaths.home);
  };

  // todo: implement infinite list
  const limit = 102312312;

  const { data: stats, isLoading } = useStatsQuery({
    limit,
  });

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: stats?.records.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 25,
    overscan: 5,
  });

  if (isLoading) {
    return <div>загрузка...</div>;
  }

  if (!stats) {
    return <div>Не удалось загрузить данные</div>;
  }

  return (
    <div>
      <S.CloseSvgContainer onClick={goHome}>
        <CloseSvg />
      </S.CloseSvgContainer>
      <S.Title>Статистика</S.Title>
      {!stats.records.length ? (
        <div>Данных нет</div>
      ) : (
        <S.ListContainer ref={parentRef}>
          <S.List
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <S.Row
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                key={virtualRow.index}
              >
                <S.ID>#{stats.records[virtualRow.index].id}</S.ID>
                <S.Date>
                  {format(
                    new Date(+stats.records[virtualRow.index].start_time),
                    "dd/MM/yyyy hh:mm:ss"
                  )}
                </S.Date>
                <S.Action>
                  <Link
                    to={statsRoutePaths.detail.replace(
                      ":id",
                      String(stats.records[virtualRow.index].id)
                    )}
                  >
                    View
                  </Link>
                </S.Action>
              </S.Row>
            ))}
          </S.List>
        </S.ListContainer>
      )}
    </div>
  );
};

export const Component = StatsRoute;
