import React, { useState } from 'react'
import styled from 'styled-components';
import TextInput from './Textinput';
import Button from './Button';
import { UserSignUp } from '../api';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/reducers/userSlice';

const Container = styled.div`
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 36px;
    @media (max-width: 480px) {
        gap: 24px;
        padding: 0 16px;
    }
`;
const Title = styled.div`
    font-size: 30px;
    font-weight: 800;
    color: ${({ theme }) => theme.text_primary};
    @media (max-width: 480px) {
        font-size: 24px;
    }
`;
const Span = styled.div`
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_secondary + 90};
    @media (max-width: 480px) {
        font-size: 14px;
    }
`;
const ErrorText = styled.div`
    font-size: 14px;
    color: ${({ theme }) => theme.red};
    text-align: center;
`;

const SignUp = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await UserSignUp(formData);
      dispatch(loginSuccess(res.data));
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
        <div>
            <Title>Create New Account👋</Title>
            <Span>Please enter details to create a new account</Span>
        </div>
        <div style={{
            display: 'flex',
            gap: '20px',
            flexDirection: 'column'
        }}>
            <TextInput 
                label="Full name" 
                name="name"
                placeholder="Enter your Full Name"
                value={formData.name}
                handelChange={handleChange}
            />
            <TextInput 
                label="Email" 
                name="email"
                placeholder="Enter your Email Address"
                value={formData.email}
                handelChange={handleChange}
            />
            <TextInput 
                label="Password" 
                name="password"
                password
                placeholder="Enter your Password" 
                value={formData.password}
                handelChange={handleChange}
            />
            {error && <ErrorText>{error}</ErrorText>}
            <Button 
              text="Sign Up" 
              onClick={handleSignUp}
              isLoading={loading}
              isDisabled={loading}
            />
        </div>
    </Container>
  )
}

export default SignUp;