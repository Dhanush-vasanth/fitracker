import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import {counts} from '../utils/data'
import CountsCard from '../components/cards/CountsCard';
import WeeklyStatCard from '../components/cards/WeeklyStatCard';
import CategoryChart from '../components/cards/CategoryChart';
import AddWorkout from '../components/AddWorkout';
import EditWorkout from '../components/EditWorkout';
import WorkoutCard from '../components/cards/WorkoutCard';
import { getDashboardDetails, getWorkouts, deleteWorkout } from '../api';
import { CircularProgress } from '@mui/material';
import { Add, CalendarMonth, Close, Today, ChevronLeft, ChevronRight, FitnessCenter } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

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

const slideIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
`;

const TitleRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 16px;
    @media (max-width: 480px) {
        padding: 0px 12px;
        flex-wrap: wrap;
        gap: 12px;
    }
`;

const TitleText = styled.div`
    font-size: 22px;
    color: ${({ theme }) => theme.text_primary};
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    @media (max-width: 480px) {
        font-size: 18px;
    }
`;

const CalendarButton = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    border-radius: 50px;
    background: linear-gradient(135deg, ${({ theme }) => theme.primary + '20'} 0%, ${({ theme }) => theme.primary + '10'} 100%);
    border: 1px solid ${({ theme }) => theme.primary + '30'};
    color: ${({ theme }) => theme.primary};
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 2px 8px ${({ theme }) => theme.primary + '15'};
    &:hover {
        background: linear-gradient(135deg, ${({ theme }) => theme.primary + '30'} 0%, ${({ theme }) => theme.primary + '20'} 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px ${({ theme }) => theme.primary + '25'};
    }
    @media (max-width: 480px) {
        padding: 8px 14px;
        font-size: 12px;
    }
`;

const CalendarIconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primary};
    color: white;
`;

const CalendarWrapper = styled.div`
    position: relative;
`;

const CalendarDropdown = styled.div`
    position: absolute;
    top: 55px;
    right: 0;
    background: ${({ theme }) => theme.card};
    border: 1px solid ${({ theme }) => theme.primary + '30'};
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px ${({ theme }) => theme.primary + '15'};
    z-index: 1000;
    padding: 0;
    min-width: 340px;
    overflow: hidden;
    animation: ${slideIn} 0.25s ease-out;
    @media (max-width: 480px) {
        min-width: 300px;
        right: -100px;
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        right: auto;
    }
`;

const CalendarHeaderBar = styled.div`
    background: linear-gradient(135deg, ${({ theme }) => theme.primary} 0%, ${({ theme }) => theme.primary + 'dd'} 100%);
    padding: 20px;
    color: white;
`;

const CalendarHeaderTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
`;

const CalendarTitle = styled.div`
    font-size: 14px;
    font-weight: 500;
    opacity: 0.9;
`;

const CloseButton = styled.div`
    cursor: pointer;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    &:hover {
        background: rgba(255,255,255,0.3);
        transform: rotate(90deg);
    }
`;

const SelectedDateDisplay = styled.div`
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.5px;
`;

const CalendarBody = styled.div`
    padding: 8px;
    
    .MuiDateCalendar-root {
        width: 100%;
        background: transparent;
    }
    
    .MuiPickersCalendarHeader-root {
        padding: 8px 16px;
        margin: 0;
    }
    
    .MuiPickersCalendarHeader-label {
        color: ${({ theme }) => theme.text_primary};
        font-weight: 600;
        font-size: 16px;
    }
    
    .MuiPickersArrowSwitcher-button {
        color: ${({ theme }) => theme.primary};
        &:hover {
            background: ${({ theme }) => theme.primary + '15'};
        }
    }
    
    .MuiDayCalendar-weekDayLabel {
        color: ${({ theme }) => theme.text_secondary};
        font-weight: 600;
        font-size: 12px;
    }
    
    .MuiPickersDay-root {
        color: ${({ theme }) => theme.text_primary};
        font-weight: 500;
        border-radius: 12px;
        transition: all 0.2s ease;
        
        &:hover {
            background: ${({ theme }) => theme.primary + '20'};
            transform: scale(1.1);
        }
        
        &.Mui-selected {
            background: linear-gradient(135deg, ${({ theme }) => theme.primary} 0%, ${({ theme }) => theme.primary + 'cc'} 100%);
            color: white;
            font-weight: 700;
            box-shadow: 0 4px 12px ${({ theme }) => theme.primary + '40'};
            
            &:hover {
                background: linear-gradient(135deg, ${({ theme }) => theme.primary} 0%, ${({ theme }) => theme.primary + 'cc'} 100%);
            }
        }
        
        &.MuiPickersDay-today {
            border: 2px solid ${({ theme }) => theme.primary};
            background: ${({ theme }) => theme.primary + '10'};
        }
        
        &.Mui-disabled {
            color: ${({ theme }) => theme.text_secondary + '50'};
        }
    }
    
    .MuiPickersYear-yearButton {
        color: ${({ theme }) => theme.text_primary};
        &.Mui-selected {
            background: ${({ theme }) => theme.primary};
        }
    }
`;

const QuickSelectButtons = styled.div`
    display: flex;
    gap: 8px;
    padding: 12px 16px 16px;
    border-top: 1px solid ${({ theme }) => theme.text_primary + '10'};
`;

const QuickButton = styled.button`
    flex: 1;
    padding: 10px 12px;
    border: none;
    border-radius: 12px;
    background: ${({ active, theme }) => active ? theme.primary : theme.primary + '15'};
    color: ${({ active, theme }) => active ? 'white' : theme.primary};
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    
    &:hover {
        background: ${({ active, theme }) => active ? theme.primary : theme.primary + '25'};
        transform: translateY(-2px);
    }
`;

const SelectedDateBadge = styled.span`
    background: linear-gradient(135deg, ${({ theme }) => theme.primary} 0%, ${({ theme }) => theme.primary + 'cc'} 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 2px 8px ${({ theme }) => theme.primary + '30'};
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    backdrop-filter: blur(2px);
`;

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const calendarRef = useRef(null);
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

    const fetchDashboardData = async (date = selectedDate) => {
        setLoading(true);
        try {
            const [dashboardRes, workoutsRes] = await Promise.all([
                getDashboardDetails(date),
                getWorkouts(date)
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
        fetchDashboardData(selectedDate);
    }, [selectedDate]);

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCalendarDateChange = (newValue) => {
        if (newValue) {
            setSelectedDate(newValue.format('YYYY-MM-DD'));
            setIsCalendarOpen(false);
        }
    };

    const handleTodayClick = () => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
        setIsCalendarOpen(false);
    };

    const handleYesterdayClick = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setSelectedDate(yesterday.toISOString().split('T')[0]);
        setIsCalendarOpen(false);
    };

    const handleLastWeekClick = () => {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        setSelectedDate(lastWeek.toISOString().split('T')[0]);
        setIsCalendarOpen(false);
    };

    const formatDisplayDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date().toISOString().split('T')[0];
        if (dateStr === today) return 'Today';
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatFullDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    const isYesterday = (() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return selectedDate === yesterday.toISOString().split('T')[0];
    })();

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
            <TitleRow>
                <TitleText>
                    Dashboard
                    {!isToday && (
                        <SelectedDateBadge>
                            <CalendarMonth style={{ fontSize: 14 }} />
                            {formatDisplayDate(selectedDate)}
                        </SelectedDateBadge>
                    )}
                </TitleText>
                <CalendarWrapper ref={calendarRef}>
                    <CalendarButton onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                        <CalendarIconWrapper>
                            <CalendarMonth style={{ fontSize: 16 }} />
                        </CalendarIconWrapper>
                        {formatDisplayDate(selectedDate)}
                    </CalendarButton>
                    {isCalendarOpen && (
                        <>
                            <Overlay onClick={() => setIsCalendarOpen(false)} />
                            <CalendarDropdown>
                                <CalendarHeaderBar>
                                    <CalendarHeaderTop>
                                        <CalendarTitle>Select Date</CalendarTitle>
                                        <CloseButton onClick={() => setIsCalendarOpen(false)}>
                                            <Close style={{ fontSize: 18 }} />
                                        </CloseButton>
                                    </CalendarHeaderTop>
                                    <SelectedDateDisplay>
                                        {formatFullDate(selectedDate)}
                                    </SelectedDateDisplay>
                                </CalendarHeaderBar>
                                <CalendarBody>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateCalendar 
                                            value={dayjs(selectedDate)}
                                            onChange={handleCalendarDateChange}
                                            maxDate={dayjs()}
                                            showDaysOutsideCurrentMonth
                                            fixedWeekNumber={6}
                                        />
                                    </LocalizationProvider>
                                </CalendarBody>
                                <QuickSelectButtons>
                                    <QuickButton 
                                        active={isToday} 
                                        onClick={handleTodayClick}
                                    >
                                        <Today style={{ fontSize: 16 }} />
                                        Today
                                    </QuickButton>
                                    <QuickButton 
                                        active={isYesterday}
                                        onClick={handleYesterdayClick}
                                    >
                                        <ChevronLeft style={{ fontSize: 16 }} />
                                        Yesterday
                                    </QuickButton>
                                    <QuickButton onClick={handleLastWeekClick}>
                                        <FitnessCenter style={{ fontSize: 16 }} />
                                        Week Ago
                                    </QuickButton>
                                </QuickSelectButtons>
                            </CalendarDropdown>
                        </>
                    )}
                </CalendarWrapper>
            </TitleRow>
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
                <Title>{isToday ? "Today's Workouts" : `Workouts on ${formatDisplayDate(selectedDate)}`}</Title>
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
                    <NoWorkouts>
                        {isToday 
                            ? "No workouts yet today. Add your first workout! 💪" 
                            : `No workouts recorded on ${formatDisplayDate(selectedDate)}`}
                    </NoWorkouts>
                )}
            </Section>

            <AddWorkout 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onWorkoutAdded={() => fetchDashboardData(selectedDate)}
            />

            <EditWorkout 
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingWorkout(null);
                }}
                workout={editingWorkout}
                onWorkoutUpdated={() => fetchDashboardData(selectedDate)}
            />
        </Wrapper>
    </Container>
  )
}

export default Dashboard