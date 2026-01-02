import React, { useState } from 'react';
import styled from 'styled-components';
import { Link as linkR, NavLink, useNavigate } from 'react-router-dom';
import LogoImg from '../utils/images/Logo.png'
import { MenuRounded } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/reducers/userSlice';

const Nav = styled.div`
    background-color: ${({ theme })=>theme.bg};
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.rem;
    position: sticky;
    top: 0;
    z-index: 10;
    color: white;
    border-bottom: 1px solid ${({ theme })=>theme.text_secondary +20};
    @media (max-width: 480px) {
        height: 64px;
    }
`;
const NavContainer = styled.div`
    display: flex;
    width: 100%;
    max-width: 1400px;
    padding: 0 24px;
    gap: 14px;
    align-items: center;
    justify-content: space-between;
    font-size: 1rem;
    @media (max-width: 480px) {
        padding: 0 12px;
        gap: 8px;
    }
`;
const NavLogo = styled(linkR)`
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 6px;
    font-weight: 600;
    font-size: 18px;
    text-decoration: none;
    color: ${({ theme })=>theme.black};
    @media (max-width: 480px) {
        gap: 8px;
        font-size: 16px;
    }
`;
const Logo = styled.img`
    width: 40px;
    height: 42px;
    @media (max-width: 480px) {
        width: 32px;
        height: 34px;
    }
`;
const Mobileicon = styled.div`
    color: ${({ theme })=>theme.text_primary};
    display: none;

    @media screen and (max-width: 768px){
        display: flex;
        align-items: center;

    }
`;
const NavItems = styled.ul`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 0 6px;
    list-style: none;

    @media screen and (max-width: 768px){
        display: none;
    }
`;
const Navlink = styled(NavLink)`
    display: flex;
    align-items: center;
    color: ${({ theme })=>theme.text_primary};
    font-weight: 500;
    cursor: pointer;
    transition: all 1s slide-in;
    text-decoration: none;
    &:hover{
        color: ${({ theme })=>theme.primary};
    }
        &.active{
        color: ${({ theme })=>theme.primary};
        border-bottom: 1.8px solid ${({ theme })=>theme.primary};
    }
`;
const UserContainer = styled.div`
    width: 100%;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    padding: 0 6px;
    color: ${({ theme })=>theme.text_primary};
    @media (max-width: 480px) {
        gap: 8px;
        padding: 0;
    }
`;
const TextButton = styled.div`
    text-align: end;
    color: ${({ theme })=>theme.text_secondary};
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.3s ease;
    &:hover{
        color: ${({ theme })=>theme.primary};
    }
    @media (max-width: 480px) {
        font-size: 14px;
    }
`;
const MobileMenu = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 16px;
    padding: 0 6px;
    list-style: none;
    width: 90%;
    padding: 12px 40px 24px 40px;
    background-color: ${({ theme })=>theme.bg};
    position: absolute;
    top: 80px;
    right: 0;
    transition: all 0.6s ease-in-out;
    transform: ${({ isOpen }) =>
        isOpen ? "translateY(0)" : "translateY(-100%)"};
    border-readius: 0 0 20px 20px;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.2);
    opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
    z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
    @media (max-width: 480px) {
        top: 64px;
        padding: 12px 20px 24px 20px;
        width: 100%;
    }
`;
const AvatarLink = styled(NavLink)`
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        opacity: 0.8;
    }
`;

const Navbar = ({ currentUser }) => {
    const [isOpen,setIsOpen] =useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

  return (
    <Nav>
        <NavContainer>
            <Mobileicon onClick={()=> setIsOpen(!isOpen)}>
                <MenuRounded sx={{color: "inherit"}} />
            </Mobileicon>
            <NavLogo to="/">
                <Logo src={LogoImg} /> 
                Fittrack
            </NavLogo>

            <MobileMenu isOpen={isOpen}>
                <Navlink to="/">Dashboard</Navlink>
                <Navlink to="/workouts">Workouts</Navlink>
                <Navlink to="/tutorials">Tutorials</Navlink>
                <Navlink to="/ai-assistant">AI Assistant</Navlink>
            </MobileMenu>

            <NavItems>
                <Navlink to="/">Dashboard</Navlink>
                <Navlink to="/workouts">Workouts</Navlink>
                <Navlink to="/tutorials">Tutorials</Navlink>
                <Navlink to="/ai-assistant">AI Assistant</Navlink>
            </NavItems>

            <UserContainer>
                <AvatarLink to="/profile">
                    <Avatar 
                        src={currentUser?.img}
                        sx={{ bgcolor: '#007AFF' }}
                    >
                        {currentUser?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                </AvatarLink>
                <TextButton onClick={handleLogout}>Logout</TextButton>
            </UserContainer>
        </NavContainer>
    </Nav>
  )
}

export default Navbar