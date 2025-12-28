import React, { useState, useEffect } from 'react'
import styled from 'styled-components';
import WorkoutCard from '../components/cards/WorkoutCard';
import AddWorkout from '../components/AddWorkout';
import EditWorkout from '../components/EditWorkout';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { getWorkouts, deleteWorkout } from '../api';
import { CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';


const Container = styled.div`
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 22px 0px;
    overflow-y: scroll;
`;
const Wrapper = styled.div`
    flex: 1;
    max-width: 1600px;
    display: flex;
    gap: 22px;
    padding: 0px 16px;
    @media  (max-width: 600px){
        gap: 12px;
        flex-direction: column;
    }
`;
  const Left = styled.div`
    flex: 0.2;
    height: fit-content;
    padding: 18px;
    border: 1px solid ${({ theme }) => theme.text_primary + 20};
    border-radius: 14px;
    box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
`;
const Right = styled.div`
    flex: 1;
`;
const Title = styled.div`
    font-weight: 600;
    font-size: 16px;
    color: ${({ theme }) => theme.primary};
    @media (max-width: 600px) {
      font-size: 14px;
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
const Section = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 16px;
    gap: 22px;
    padding: 0px 16px;
    @media (max-width: 600px) {
      gap: 12px;
    }
`;
const SecTitle = styled.div`
    font-size: 22px;
    color: ${({ theme }) => theme.text_primary};
    font-weight: 500;
`;
const LoadingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
`;
const NoWorkouts = styled.div`
    text-align: center;
    color: ${({ theme }) => theme.text_secondary};
    padding: 40px;
    font-size: 16px;
`;
const TotalCalories = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.orange};
    font-weight: 600;
`;

const AddWorkoutButton = styled.button`
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primary};
    border: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 20px ${({ theme }) => theme.primary + '60'};
    transition: all 0.3s ease;
    z-index: 100;
    &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 25px ${({ theme }) => theme.primary + '80'};
    }
`;

const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const AddButton = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    background: ${({ theme }) => theme.primary};
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }
`;



const Workouts = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setIsEditModalOpen(true);
  };

  const fetchWorkouts = async (date) => {
    setLoading(true);
    try {
      const res = await getWorkouts(date.format('YYYY-MM-DD'));
      setWorkouts(res.data.todaysWorkouts || []);
      setTotalCalories(res.data.totalCaloriesBurnt || 0);
    } catch (err) {
      console.error(err);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleDelete = async (workoutId) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await deleteWorkout(workoutId);
        fetchWorkouts(selectedDate);
      } catch (err) {
        console.error(err);
        alert('Failed to delete workout');
      }
    }
  };

  const formatDate = (date) => {
    const today = dayjs();
    if (date.isSame(today, 'day')) return "Today's Workouts";
    if (date.isSame(today.subtract(1, 'day'), 'day')) return "Yesterday's Workouts";
    return `Workouts on ${date.format('MMM D, YYYY')}`;
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Select Date</Title>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar 
              value={selectedDate}
              onChange={handleDateChange}
            />
          </LocalizationProvider>
        </Left>
        <Right>
          <Section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <SecTitle>{formatDate(selectedDate)}</SecTitle>
              <HeaderActions>
                {totalCalories > 0 && (
                  <TotalCalories>Total: {totalCalories} kcal burned 🔥</TotalCalories>
                )}
                <AddButton onClick={() => setIsAddModalOpen(true)}>
                  <Add fontSize="small" />
                  Add Workout
                </AddButton>
              </HeaderActions>
            </div>
            {loading ? (
              <LoadingWrapper>
                <CircularProgress />
              </LoadingWrapper>
            ) : workouts.length > 0 ? (
              <CardWrapper>
                {workouts.map((workout) => (
                  <WorkoutCard 
                    key={workout._id} 
                    workout={workout} 
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </CardWrapper>
            ) : (
              <NoWorkouts>
                No workouts scheduled for this day
                <br />
                <span style={{ fontSize: '14px', marginTop: '8px', display: 'block' }}>
                  Click "Add Workout" to add your first workout
                </span>
              </NoWorkouts>
            )}
          </Section>
        </Right>
      </Wrapper>

      {/* Floating Add Button for mobile */}
      <AddWorkoutButton onClick={() => setIsAddModalOpen(true)}>
        <Add fontSize="large" />
      </AddWorkoutButton>

      {/* Add Workout Modal */}
      <AddWorkout 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onWorkoutAdded={() => fetchWorkouts(selectedDate)}
        selectedDate={selectedDate}
      />

      {/* Edit Workout Modal */}
      <EditWorkout 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingWorkout(null);
        }}
        workout={editingWorkout}
        onWorkoutUpdated={() => fetchWorkouts(selectedDate)}
      />
    </Container>
  )
}

export default Workouts