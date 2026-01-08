
import React, { ErrorInfo } from 'react';
import { ShieldAlert, RefreshCcw, HardDrive } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Fixed: Explicitly using React.Component to ensure 'props' is correctly typed from the base class.
export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full glass border-red-500/30 p-8 rounded-[32px] text-center space-y-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
              <ShieldAlert size={40} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Security Breach in UI Thread</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                The application encountered an unexpected runtime exception. Safe mode has been engaged.
              </p>
            </div>
            <div className="bg-black/40 p-4 rounded-xl text-left">
              <code className="text-[10px] text-red-400 block break-all font-mono">
                {this.state.error?.toString()}
              </code>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-2xl transition-all text-sm font-semibold"
              >
                <RefreshCcw size={16} /> Retry
              </button>
              <button 
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-3 rounded-2xl transition-all text-sm font-semibold shadow-lg shadow-red-600/20"
              >
                <HardDrive size={16} /> System Repair
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Fixed: Accessing children via this.props which is defined by extending React.Component<Props, State>.
    return this.props.children;
  }
}
