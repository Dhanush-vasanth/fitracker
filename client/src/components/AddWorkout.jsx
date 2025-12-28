import React, { useState } from 'react';
import styled from 'styled-components';
import { addWorkout } from '../api';
import { Close, Add, Check, Delete } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.popup || '#1a1a2e'};
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + '30'};
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.popup_text_primary || '#fff'};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.popup_text_secondary || '#999'};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  &:hover {
    background: ${({ theme }) => theme.text_secondary + '20'};
  }
`;

const Content = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormBox = styled.div`
  background: ${({ theme }) => theme.text_secondary + '10'};
  border: 1px solid ${({ theme }) => theme.text_secondary + '25'};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: ${({ flex }) => flex || 1};
`;

const Label = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.popup_text_secondary || '#999'};
  font-weight: 500;
`;

const Input = styled.input`
  background: ${({ theme }) => theme.text_secondary + '20'};
  border: 1px solid ${({ theme }) => theme.text_secondary + '40'};
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.popup_text_primary || '#fff'};
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
  &::placeholder {
    color: ${({ theme }) => theme.popup_text_secondary || '#666'};
  }
`;

const Select = styled.select`
  background: ${({ theme }) => theme.text_secondary + '20'};
  border: 1px solid ${({ theme }) => theme.text_secondary + '40'};
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.popup_text_primary || '#fff'};
  outline: none;
  cursor: pointer;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
  option {
    background: ${({ theme }) => theme.popup || '#1a1a2e'};
    color: ${({ theme }) => theme.popup_text_primary || '#fff'};
  }
`;

const TextArea = styled.textarea`
  background: ${({ theme }) => theme.text_secondary + '20'};
  border: 1px solid ${({ theme }) => theme.text_secondary + '40'};
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.popup_text_primary || '#fff'};
  outline: none;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
  &::placeholder {
    color: ${({ theme }) => theme.popup_text_secondary || '#666'};
  }
`;

const ExercisesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ExerciseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${({ theme }) => theme.primary + '20'};
  }
`;

const ExerciseCard = styled.div`
  background: ${({ theme }) => theme.text_secondary + '15'};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ExerciseCardHeader = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RemoveExerciseButton = styled.button`
  background: ${({ theme }) => theme.red + '20'};
  border: none;
  color: ${({ theme }) => theme.red};
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover {
    background: ${({ theme }) => theme.red + '40'};
  }
`;

const SetsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 50px;
  gap: 8px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.text_secondary + '30'};
  border-radius: 8px;
`;

const TableHeaderCell = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.popup_text_secondary || '#999'};
  text-transform: uppercase;
  text-align: center;
`;

const SetRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 50px;
  gap: 8px;
  align-items: center;
`;

const SetNumber = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.popup_text_primary || '#fff'};
  text-align: center;
`;

const SetInput = styled.input`
  background: ${({ theme }) => theme.primary + '30'};
  border: none;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.popup_text_primary || '#fff'};
  text-align: center;
  outline: none;
  &:focus {
    background: ${({ theme }) => theme.primary + '50'};
  }
`;

const CheckButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.popup_text_secondary + '50'};
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, checked }) => checked ? theme.green : theme.popup_text_secondary};
  ${({ checked, theme }) => checked && `
    background: ${theme.green + '20'};
    border-color: ${theme.green};
  `}
`;

const AddSetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.text_secondary + '60'};
  color: ${({ theme }) => theme.popup_text_secondary || '#999'};
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid ${({ theme }) => theme.text_secondary + '30'};
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${({ variant, theme }) => variant === 'primary' ? `
    background: ${theme.primary};
    color: white;
    border: none;
    &:hover {
      opacity: 0.9;
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  ` : `
    background: transparent;
    color: ${theme.popup_text_secondary || '#999'};
    border: 1px solid ${theme.text_secondary + '40'};
    &:hover {
      background: ${theme.text_secondary + '20'};
    }
  `}
`;

const ErrorText = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.red};
  text-align: center;
  padding: 8px;
`;

const CATEGORIES = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Abs',
  'Cardio',
  'Full Body',
  'Other'
];

const AddWorkout = ({ isOpen, onClose, onWorkoutAdded, selectedDate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [category, setCategory] = useState('Chest');
  const [duration, setDuration] = useState(30);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [date, setDate] = useState(selectedDate ? selectedDate.format('DD-MM-YYYY') : dayjs().format('DD-MM-YYYY'));
  const [notes, setNotes] = useState('');
  
  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: '',
      sets: [{ id: 1, kg: 0, reps: 10, completed: false }]
    }
  ]);

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Date.now(),
        name: '',
        sets: [{ id: 1, kg: 0, reps: 10, completed: false }]
      }
    ]);
  };

  const removeExercise = (exerciseId) => {
    if (exercises.length <= 1) {
      // Keep at least one exercise
      return;
    }
    setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

  const updateExerciseName = (exerciseId, name) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, name } : ex
    ));
  };

  const addSet = (exerciseId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        const newSetId = ex.sets.length + 1;
        return {
          ...ex,
          sets: [...ex.sets, { id: newSetId, kg: 0, reps: 10, completed: false }]
        };
      }
      return ex;
    }));
  };

  const updateSet = (exerciseId, setId, field, value) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(set => 
            set.id === setId ? { ...set, [field]: value } : set
          )
        };
      }
      return ex;
    }));
  };

  const toggleSetComplete = (exerciseId, setId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(set => 
            set.id === setId ? { ...set, completed: !set.completed } : set
          )
        };
      }
      return ex;
    }));
  };

  const buildWorkoutString = () => {
    // Build the workout string in the format expected by the API
    let workoutString = `#${category}\n`;
    
    exercises.forEach(exercise => {
      if (exercise.name.trim()) {
        const totalSets = exercise.sets.length;
        const avgReps = Math.round(exercise.sets.reduce((sum, s) => sum + Number(s.reps), 0) / totalSets);
        const maxWeight = Math.max(...exercise.sets.map(s => Number(s.kg)));
        
        workoutString += `${exercise.name}\n`;
        workoutString += `${totalSets} sets x ${avgReps} reps\n`;
        workoutString += `${maxWeight}kg\n`;
        workoutString += `${duration}mins\n`;
      }
    });

    // If using workout title as the exercise name when no exercises added
    if (exercises.every(ex => !ex.name.trim()) && workoutTitle.trim()) {
      workoutString += `${workoutTitle}\n`;
      workoutString += `1 sets x 1 reps\n`;
      workoutString += `0kg\n`;
      workoutString += `${duration}mins\n`;
    }

    return workoutString;
  };

  const handleSubmit = async () => {
    // Validation
    const hasExercises = exercises.some(ex => ex.name.trim());
    if (!hasExercises && !workoutTitle.trim()) {
      setError('Please add a workout title or at least one exercise');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const workoutString = buildWorkoutString();
      // Send the selected date along with the workout
      const workoutDate = selectedDate ? selectedDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
      await addWorkout({ workoutString, date: workoutDate });
      
      // Reset form
      setWorkoutTitle('');
      setCategory('Chest');
      setDuration(30);
      setCaloriesBurned(0);
      setNotes('');
      setExercises([{ id: 1, name: '', sets: [{ id: 1, kg: 0, reps: 10, completed: false }] }]);
      
      if (onWorkoutAdded) onWorkoutAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add workout');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const displayDate = selectedDate ? selectedDate.format('MMM D, YYYY') : dayjs().format('MMM D, YYYY');
  const isToday = selectedDate ? selectedDate.isSame(dayjs(), 'day') : true;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Add Workout {isToday ? '' : `for ${displayDate}`}</Title>
          <CloseButton onClick={onClose}>
            <Close />
          </CloseButton>
        </Header>
        
        <Content>
          <FormBox>
            <Row>
              <FormGroup flex={1.5}>
                <Label>Workout Title *</Label>
                <Input 
                  placeholder="e.g., Morning Push Day"
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Category *</Label>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Select>
              </FormGroup>
            </Row>

            <Row>
              <FormGroup>
                <Label>Duration (minutes)</Label>
                <Input 
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <Label style={{ marginTop: '12px' }}>Date</Label>
                <Input 
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="DD-MM-YYYY"
                />
              </FormGroup>
              <FormGroup>
                <Label>Calories Burned</Label>
                <Input 
                  type="number"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(e.target.value)}
                />
              </FormGroup>
            </Row>
          </FormBox>

          <ExercisesSection>
            <ExerciseHeader>
              <Label>Exercises</Label>
              <AddButton onClick={addExercise}>
                <Add fontSize="small" />
                Add Exercise
              </AddButton>
            </ExerciseHeader>

            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id}>
                <ExerciseCardHeader>
                  <Input
                    placeholder="Exercise name (e.g., Bench Press)"
                    value={exercise.name}
                    onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  {exercises.length > 1 && (
                    <RemoveExerciseButton 
                      onClick={() => removeExercise(exercise.id)}
                      title="Remove exercise"
                    >
                      <Delete fontSize="small" />
                    </RemoveExerciseButton>
                  )}
                </ExerciseCardHeader>
                <SetsTable>
                  <TableHeader>
                    <TableHeaderCell>Set</TableHeaderCell>
                    <TableHeaderCell>KG</TableHeaderCell>
                    <TableHeaderCell>Reps</TableHeaderCell>
                    <TableHeaderCell>✓</TableHeaderCell>
                  </TableHeader>
                  {exercise.sets.map((set) => (
                    <SetRow key={set.id}>
                      <SetNumber>{set.id}</SetNumber>
                      <SetInput
                        type="number"
                        value={set.kg}
                        onChange={(e) => updateSet(exercise.id, set.id, 'kg', e.target.value)}
                      />
                      <SetInput
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(exercise.id, set.id, 'reps', e.target.value)}
                      />
                      <CheckButton
                        checked={set.completed}
                        onClick={() => toggleSetComplete(exercise.id, set.id)}
                      >
                        <Check fontSize="small" />
                      </CheckButton>
                    </SetRow>
                  ))}
                </SetsTable>
                <AddSetButton onClick={() => addSet(exercise.id)}>
                  <Add fontSize="small" />
                  Add Set
                </AddSetButton>
              </ExerciseCard>
            ))}
          </ExercisesSection>

          <FormGroup>
            <Label>Notes</Label>
            <TextArea
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </FormGroup>

          {error && <ErrorText>{error}</ErrorText>}
        </Content>

        <Footer>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading && <CircularProgress size={16} color="inherit" />}
            Add Workout
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default AddWorkout;