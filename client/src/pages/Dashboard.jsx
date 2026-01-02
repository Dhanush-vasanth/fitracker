import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {counts} from '../utils/data'
import CountsCard from '../components/cards/CountsCard';
import WeeklyStatCard from '../components/cards/WeeklyStatCard';
import CategoryChart from '../components/cards/CategoryChart';
import AddWorkout from '../components/AddWorkout';
import EditWorkout from '../components/EditWorkout';
import WorkoutCard from '../components/cards/WorkoutCard';
import { getDashboardDetails, getWorkouts, deleteWorkout } from '../api';
import { CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';

const Container = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 22px 0px;
    overflow-y: scroll;
    @media (max-width: 480px) {
        padding: 12px 0px;
    }
`;
const Wrapper = styled.div`
    flex: 1;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    @media (max-width: 600px) {
        gap: 12px;
    }
    @media (max-width: 480px) {
        gap: 8px;
    }
`;
const Title = styled.div`
    padding: 0px 16px;
    font-size: 22px;
    color: ${({ theme })=>theme.text_primary};
    font-weight: 500;
    @media (max-width: 480px) {
        font-size: 18px;
        padding: 0px 12px;
    }
`;
const FlexWrap = styled.div`
    display: flex;
    flex-wrap:  wrap;
    justify-content: space-between;
    gap: 22px;
    padding: 0px 16px;
    @media (max-width: 600px) {
        gap: 12px;
    }
    @media (max-width: 480px) {
        gap: 8px;
        padding: 0px 8px;
    }
`;
const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 0px 16px;
    @media (max-width: 600px) {
        gap: 12px;
    }
    @media (max-width: 480px) {
        gap: 8px;
        padding: 0px 8px;
    }
`;
const CardWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-bottom: 100px;
    @media (max-width: 600px) {
        gap: 12px;
    }
`;
const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;
const NoWorkouts = styled.div`
    text-align: center;
    color: ${({ theme }) => theme.text_secondary};
    padding: 40px;
    font-size: 16px;
`;

const AddWorkoutCard = styled.div`
    flex: 1;
    min-width: 280px;
    padding: 24px;
    border: 1px solid ${({ theme }) => theme.text_primary + 20};
    border-radius: 14px;
    box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-height: 200px;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 1px 8px 25px 0px ${({ theme }) => theme.primary + 25};
    }
    @media (max-width: 480px) {
        min-width: 100%;
        padding: 16px;
        min-height: 150px;
        gap: 12px;
    }
`;

const AddWorkoutIcon = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primary + '20'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.primary};
`;

const AddWorkoutText = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.primary};
`;

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState(null);
    const [data, setData] = useState({
        totalCaloriesBurnt: 0,
        totalWorkouts: 0,
        avgCaloriesBurntPerWorkout: 0,
        totalWeeksCaloriesBurnt: {
            weeks: [],
            caloriesBurned: [],
        },
        pieChartData: [],
    });
    const [todaysWorkouts, setTodaysWorkouts] = useState([]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [dashboardRes, workoutsRes] = await Promise.all([
                getDashboardDetails(),
                getWorkouts(new Date().toISOString().split('T')[0])
            ]);
            setData(dashboardRes.data);
            setTodaysWorkouts(workoutsRes.data.todaysWorkouts || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleDelete = async (workoutId) => {
        if (window.confirm('Are you sure you want to delete this workout?')) {
            try {
                await deleteWorkout(workoutId);
                fetchDashboardData();
            } catch (err) {
                console.error(err);
                alert('Failed to delete workout');
            }
        }
    };

    if (loading) {
        return (
            <Container>
                <LoadingWrapper>
                    <CircularProgress />
                </LoadingWrapper>
            </Container>
        );
    }

  return (
    <Container>
        <Wrapper>
            <Title>
                Dashboard
            </Title>
            <FlexWrap>
                {counts.map((item, index) => (
                    <CountsCard key={index} item={item} data={data} />
                ))}
            </FlexWrap>
            <FlexWrap>
                <WeeklyStatCard data={data}/>
                <CategoryChart data={data}/>
                <AddWorkoutCard onClick={() => setIsAddModalOpen(true)}>
                    <AddWorkoutIcon>
                        <Add fontSize="large" />
                    </AddWorkoutIcon>
                    <AddWorkoutText>Add New Workout</AddWorkoutText>
                </AddWorkoutCard>
            </FlexWrap>
            <Section>
                <Title>Today's Workouts</Title>
                {todaysWorkouts.length > 0 ? (
                    <CardWrapper>
                        {todaysWorkouts.map((workout) => (
                            <WorkoutCard 
                                key={workout._id} 
                                workout={workout} 
                                onDelete={handleDelete}
                                onEdit={(workout) => {
                                    setEditingWorkout(workout);
                                    setIsEditModalOpen(true);
                                }}
                            />
                        ))}
                    </CardWrapper>
                ) : (
                    <NoWorkouts>No workouts yet today. Add your first workout! 💪</NoWorkouts>
                )}
            </Section>

            <AddWorkout 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onWorkoutAdded={fetchDashboardData}
            />

            <EditWorkout 
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingWorkout(null);
                }}
                workout={editingWorkout}
                onWorkoutUpdated={fetchDashboardData}
            />
        </Wrapper>
    </Container>
  )
}

export default Dashboard