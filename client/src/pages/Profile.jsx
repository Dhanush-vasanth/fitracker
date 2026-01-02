import React, { useState } from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/userSlice';
import { 
  PersonOutlined, 
  EmailOutlined, 
  CalendarMonthOutlined,
  LogoutRounded,
  FitnessCenterRounded
} from '@mui/icons-material';
import Button from '../components/Button';

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
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 0 16px;
`;

const Title = styled.div`
    font-size: 24px;
    color: ${({ theme }) => theme.text_primary};
    font-weight: 600;
`;

const ProfileCard = styled.div`
    background: ${({ theme }) => theme.card};
    border: 1px solid ${({ theme }) => theme.text_primary + 20};
    border-radius: 16px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    box-shadow: 0 4px 20px ${({ theme }) => theme.shadow};
    @media (max-width: 480px) {
        padding: 20px 16px;
        gap: 16px;
    }
`;

const AvatarSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
`;

const UserName = styled.div`
    font-size: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
    @media (max-width: 480px) {
        font-size: 22px;
    }
`;

const UserEmail = styled.div`
    font-size: 16px;
    color: ${({ theme }) => theme.text_secondary};
`;

const StatsSection = styled.div`
    display: flex;
    gap: 32px;
    padding: 20px 0;
    border-top: 1px solid ${({ theme }) => theme.text_primary + 15};
    border-bottom: 1px solid ${({ theme }) => theme.text_primary + 15};
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;

    @media (max-width: 500px) {
        gap: 16px;
    }
`;

const StatItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
`;

const StatValue = styled.div`
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.primary};
`;

const StatLabel = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.text_secondary};
`;

const InfoSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: ${({ theme }) => theme.bgLight};
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.text_primary + 10};
`;

const InfoIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: ${({ theme }) => theme.primary + 20};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.primary};
`;

const InfoContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const InfoLabel = styled.div`
    font-size: 12px;
    color: ${({ theme }) => theme.text_secondary};
`;

const InfoValue = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
`;

const LogoutSection = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    padding-top: 16px;
`;

const Profile = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    
    const handleLogout = () => {
        dispatch(logout());
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Container>
            <Wrapper>
                <Title>My Profile</Title>
                <ProfileCard>
                    <AvatarSection>
                        <Avatar
                            src={currentUser?.img}
                            sx={{ 
                                width: 120, 
                                height: 120, 
                                fontSize: '48px',
                                bgcolor: '#007AFF'
                            }}
                        >
                            {currentUser?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <UserName>{currentUser?.name || 'User'}</UserName>
                        <UserEmail>{currentUser?.email}</UserEmail>
                    </AvatarSection>

                    <StatsSection>
                        <StatItem>
                            <StatValue>
                                <FitnessCenterRounded sx={{ fontSize: 28 }} />
                            </StatValue>
                            <StatLabel>Active Member</StatLabel>
                        </StatItem>
                    </StatsSection>

                    <InfoSection>
                        <InfoItem>
                            <InfoIcon>
                                <PersonOutlined />
                            </InfoIcon>
                            <InfoContent>
                                <InfoLabel>Full Name</InfoLabel>
                                <InfoValue>{currentUser?.name || 'Not set'}</InfoValue>
                            </InfoContent>
                        </InfoItem>

                        <InfoItem>
                            <InfoIcon>
                                <EmailOutlined />
                            </InfoIcon>
                            <InfoContent>
                                <InfoLabel>Email Address</InfoLabel>
                                <InfoValue>{currentUser?.email || 'Not set'}</InfoValue>
                            </InfoContent>
                        </InfoItem>

                        <InfoItem>
                            <InfoIcon>
                                <CalendarMonthOutlined />
                            </InfoIcon>
                            <InfoContent>
                                <InfoLabel>Member Since</InfoLabel>
                                <InfoValue>{formatDate(currentUser?.createdAt)}</InfoValue>
                            </InfoContent>
                        </InfoItem>
                    </InfoSection>

                    <LogoutSection>
                        <Button 
                            text="Logout" 
                            leftIcon={<LogoutRounded />}
                            onClick={handleLogout}
                            outlined
                        />
                    </LogoutSection>
                </ProfileCard>
            </Wrapper>
        </Container>
    );
};

export default Profile;
