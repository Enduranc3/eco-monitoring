"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { reportClientError } from "@/lib/client-error-report";

interface ErrorBoundaryProps {
  children: ReactNode;
  title?: string;
  message?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    void reportClientError(error, {
      source: "react_error_boundary",
      componentStack: errorInfo.componentStack ?? undefined,
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white rounded-xl border border-amber-200 p-6 text-center space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">
            {this.props.title ?? "Виникла помилка у віджеті моніторингу"}
          </h2>
          <p className="text-sm text-slate-600">
            {this.props.message ??
              "Спробуйте повторити дію або перезавантажити сторінку."}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Спробувати знову
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
