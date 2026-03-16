import React from 'react'
import styled from 'styled-components';
import { PieChart } from '@mui/x-charts/PieChart';

const Card = styled.div`
    flex: 1;
    min-width: 280px;
    padding: 24px;
    border: 1px solid ${({ theme }) => theme.text_primary + 20};
    border-radius: 14px;
    box-shadow: 1px 6px 20px 0px  ${({ theme }) => theme.primary + 15};
    display: flex;
    flex-direction: column;
    gap: 6px;
    @media (max-width: 600px) {
        padding: 16px;
    }
    @media (max-width: 480px) {
        min-width: 100%;
        padding: 12px;
    }
`;
const Title = styled.div`
    font-weight: 600;
    font-size: 16px;
    color: ${({ theme }) => theme.primary};
    @media (max-width: 600px) {
        font-size: 14px;
    }
`;

const NoData = styled.div`
    text-align: center;
    color: ${({ theme }) => theme.text_secondary};
    font-size: 14px;
    padding: 40px 0;
`;

const CategoryChart = ({ data}) => {
  const hasData = data?.pieChartData?.length > 0;
  return (
    <Card>
      <Title>Workouts by Category</Title>
      {hasData ? (
      <PieChart
      series={[
         {
           data: data?.pieChartData,
           innerRadius: 30,
           paddingAngle: 4,
           cornerRadius: 4,
           outerRadius: 120,
         },
        ]}
        height={300}
        />
      ) : (
        <NoData>No workout data for this date</NoData>
      )}
    </Card>
  );
};

export default CategoryChart ;