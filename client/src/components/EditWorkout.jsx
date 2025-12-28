import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { updateWorkout } from '../api';
import { Close } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

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
  max-width: 480px;
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

const EditWorkout = ({ isOpen, onClose, workout, onWorkoutUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [workoutName, setWorkoutName] = useState('');
  const [category, setCategory] = useState('Chest');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    if (workout) {
      setWorkoutName(workout.workoutName || '');
      setCategory(workout.category || 'Chest');
      setSets(workout.sets || 3);
      setReps(workout.reps || 10);
      setWeight(workout.weight || 0);
      setDuration(workout.duration || 30);
    }
  }, [workout]);

  const handleSubmit = async () => {
    if (!workoutName.trim()) {
      setError('Please enter a workout name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updateWorkout(workout._id, {
        workoutName,
        category,
        sets: Number(sets),
        reps: Number(reps),
        weight: Number(weight),
        duration: Number(duration)
      });
      
      if (onWorkoutUpdated) onWorkoutUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update workout');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !workout) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Edit Workout</Title>
          <CloseButton onClick={onClose}>
            <Close />
          </CloseButton>
        </Header>
        
        <Content>
          <FormBox>
            <Row>
              <FormGroup flex={1.5}>
                <Label>Workout Name *</Label>
                <Input 
                  placeholder="e.g., Bench Press"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
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
                <Label>Sets</Label>
                <Input 
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  min="1"
                />
              </FormGroup>
              <FormGroup>
                <Label>Reps</Label>
                <Input 
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  min="1"
                />
              </FormGroup>
            </Row>

            <Row>
              <FormGroup>
                <Label>Weight (kg)</Label>
                <Input 
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="0"
                />
              </FormGroup>
              <FormGroup>
                <Label>Duration (minutes)</Label>
                <Input 
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="1"
                />
              </FormGroup>
            </Row>
          </FormBox>

          {error && <ErrorText>{error}</ErrorText>}
        </Content>

        <Footer>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading && <CircularProgress size={16} color="inherit" />}
            Save Changes
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default EditWorkout;
