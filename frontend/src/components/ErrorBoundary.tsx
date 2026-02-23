import React from "react";
import * as Sentry from "@sentry/react";

type ErrorBoundaryProps = {
  Fallback: React.ComponentType<FallbackProps>;
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

interface FallbackProps {
  onReset: () => void;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      const { Fallback } = this.props;
      return <Fallback onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}
