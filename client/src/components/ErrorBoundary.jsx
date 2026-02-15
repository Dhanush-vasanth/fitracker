import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${({ theme }) => theme?.bg || '#ffffff'};
  text-align: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${({ theme }) => theme?.text_primary || '#404040'};
  margin-bottom: 16px;
`;

const Message = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme?.text_secondary || '#4d4c4c'};
  margin-bottom: 32px;
  max-width: 500px;
`;

const Button = styled.button`
  background: ${({ theme }) => theme?.primary || '#007AFF'};
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
`;

const Details = styled.details`
  margin-top: 32px;
  padding: 16px;
  background: ${({ theme }) => theme?.text_secondary + '10' || '#f5f5f5'};
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  text-align: left;
`;

const Summary = styled.summary`
  cursor: pointer;
  color: ${({ theme }) => theme?.text_secondary || '#4d4c4c'};
  font-size: 14px;
  margin-bottom: 8px;
`;

const ErrorStack = styled.pre`
  font-size: 12px;
  color: ${({ theme }) => theme?.red || '#ef5350'};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // Log error to console in production for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container>
          <Title>Oops!</Title>
          <Message>
            Something went wrong. Don't worry, your data is safe. 
            Try refreshing the page or go back to the dashboard.
          </Message>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button onClick={this.handleReload}>
              Refresh Page
            </Button>
            <Button onClick={this.handleGoHome} style={{ background: '#6c757d' }}>
              Go to Dashboard
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Details>
              <Summary>Error Details (Development Only)</Summary>
              <ErrorStack>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </ErrorStack>
            </Details>
          )}
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
