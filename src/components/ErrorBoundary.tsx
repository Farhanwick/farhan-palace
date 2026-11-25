import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  isWhitePage?: boolean;
  onResetToHome?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error): void {
    // Error captured cleanly by UI boundary without crashing the tree
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      const isWhite = !!this.props.isWhitePage;
      return (
        <div
          className={`min-h-[60vh] flex items-center justify-center px-6 py-24 ${
            isWhite ? 'bg-white text-[#11100e]' : 'bg-[#080706] text-[#f4f1ea]'
          }`}
        >
          <div
            className={`max-w-md w-full rounded-3xl p-8 text-center space-y-4 border ${
              isWhite
                ? 'bg-[#faf9f6] border-[#e5e2da]'
                : 'bg-[#100e0c] border-[#e5c158]/25'
            }`}
          >
            <span className="text-xs font-mono-tech uppercase tracking-[0.2em] text-[#e5c158]">
              View Recovery
            </span>
            <h2 className="font-display text-2xl font-extrabold">
              Section Interrupted
            </h2>
            <p
              className={`text-sm leading-relaxed ${
                isWhite ? 'text-[#5b564c]' : 'text-[#a59b84]'
              }`}
            >
              A view module failed to load cleanly. Refresh this view or return to Home.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className={`px-5 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                  isWhite
                    ? 'bg-[#11100e] text-white hover:bg-[#9b7218]'
                    : 'bg-[#e5c158] text-[#080706] hover:bg-white'
                }`}
              >
                Retry View
              </button>
              {this.props.onResetToHome && (
                <button
                  type="button"
                  onClick={() => {
                    this.setState({ hasError: false });
                    this.props.onResetToHome?.();
                  }}
                  className={`px-5 py-2.5 rounded-xl border font-display text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    isWhite
                      ? 'border-[#d6d1c6] text-[#11100e] hover:border-[#11100e]'
                      : 'border-white/20 text-white hover:border-[#e5c158]'
                  }`}
                >
                  Return Home
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
