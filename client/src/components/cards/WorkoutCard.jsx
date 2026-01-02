import { FitnessCenterRounded, TimelapseRounded, DeleteRounded, LocalFireDepartmentRounded, EditRounded } from "@mui/icons-material";
import React from 'react'
import styled from 'styled-components';

const Card = styled.div`
    flex: 1;
    min-width: 250px;
    max-width: 400px;
    padding: 16px 18px;
    border: 1px solid ${({ theme })=>theme.text_primary + 20};
    border-radius: 14px;
    box-shadow: 1px 6px 20px 0px ${({ theme })=>theme.primary + 15};
    display: flex;
    flex-direction: column;
    gap: 6px;
    @media (max-width: 600px) {
        padding: 12px 14px;
    }
    @media (max-width: 480px) {
        min-width: 100%;
        max-width: 100%;
        padding: 12px;
    }
`;
const CardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const Category = styled.div`
    width: fit-content;
    font-size: 14px;
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
    background: ${({ theme }) => theme.primary + 20};
    padding: 4px 10px;
    border-radius: 8px;
    @media (max-width: 480px) {
        font-size: 12px;
        padding: 3px 8px;
    }
`;
const ActionButtons = styled.div`
    display: flex;
    gap: 8px;
`;
const ActionButton = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    ${({ variant, theme }) => variant === 'edit' ? `
        color: ${theme.primary};
        background: ${theme.primary + '15'};
        &:hover {
            background: ${theme.primary + '30'};
        }
    ` : `
        color: ${theme.red};
        background: ${theme.red + '15'};
        &:hover {
            background: ${theme.red + '30'};
        }
    `}
`;
const Name = styled.div`
    font-size: 20px;
    color: ${({ theme }) => theme.text_primary};
    font-weight: 600;
    @media (max-width: 480px) {
        font-size: 16px;
    }
`;
const Sets = styled.div`
    font-size: 15px;
    color: ${({ theme }) => theme.text_secondary};
    font-weight: 500;
    display: flex;
    gap: 6px;
    @media (max-width: 480px) {
        font-size: 13px;
    }
`;
const Flex = styled.div`
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
`;
const Details = styled.div`
    font-size: 15px;
    color: ${({ theme }) => theme.text_primary};
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    @media (max-width: 480px) {
        font-size: 13px;
    }
`;
const CaloriesChip = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.orange};
    background: ${({ theme }) => theme.orange + 20};
    padding: 4px 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
`;

const WorkoutCard = ({ workout, onDelete, onEdit }) => {
  return <Card>
        <CardHeader>
            <Category>#{workout?.category || 'Legs'}</Category>
            <ActionButtons>
                {onEdit && (
                    <ActionButton variant="edit" onClick={() => onEdit(workout)}>
                        <EditRounded sx={{ fontSize: "18px" }} />
                    </ActionButton>
                )}
                {onDelete && (
                    <ActionButton variant="delete" onClick={() => onDelete(workout._id)}>
                        <DeleteRounded sx={{ fontSize: "18px" }} />
                    </ActionButton>
                )}
            </ActionButtons>
        </CardHeader>
        <Name>{workout?.workoutName || 'Back Squat'}</Name>
        <Sets>Count: {workout?.sets || 3} sets X {workout?.reps || 15} reps</Sets>
        <Flex>
            <Details>
                <FitnessCenterRounded sx={{fontSize: "20px"}} />
                {workout?.weight || 30}kg
            </Details>
            <Details>
                <TimelapseRounded sx={{fontSize: "20px"}} />
                {workout?.duration || 45}min
            </Details>
            <CaloriesChip>
                <LocalFireDepartmentRounded sx={{ fontSize: "14px" }} />
                {workout?.caloriesBurned || 0} kcal
            </CaloriesChip>
        </Flex>
    </Card>;
}

export default WorkoutCard;