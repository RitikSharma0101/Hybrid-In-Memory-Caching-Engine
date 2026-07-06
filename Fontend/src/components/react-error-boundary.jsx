import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can log the error to a service here
    console.error("Caught by boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong in the table.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;