import { Component } from 'react';
import { Paper, Title, Text, Button, Stack, Group } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Paper p="xl" shadow="sm" radius="md" withBorder>
          <Stack align="center" spacing="md">
            <IconAlertCircle size={48} color="red" />
            <Title order={2}>Something went wrong</Title>
            <Text color="dimmed" size="sm" align="center">
              We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </Text>
            
            {/* Show error details only in development mode */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Paper p="md" bg="var(--mantine-color-gray-0)" withBorder style={{ maxWidth: '100%', overflow: 'auto' }}>
                <Text size="sm" color="red">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text size="xs" color="dimmed" mt="xs" style={{ whiteSpace: 'pre-wrap' }}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </Paper>
            )}

            <Group>
              <Button
                variant="light"
                leftIcon={<IconRefresh size={16} />}
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
              <Button
                variant="subtle"
                onClick={this.handleReset}
              >
                Try Again
              </Button>
            </Group>
          </Stack>
        </Paper>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
