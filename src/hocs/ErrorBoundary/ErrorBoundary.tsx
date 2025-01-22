import { Component, ErrorInfo, JSX } from 'react';

interface IProps {
    children: JSX.Element | JSX.Element[] | null;
    fallback: JSX.Element | JSX.Element[] | null;
}

interface IState {
    error: string | null;
}

class ErrorBoundary extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            error: null,
        };
    }

    static getDerivedStateFromError(error: any) {
        console.error(error);
        return {
            error: true,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error(error, errorInfo.componentStack);
    }

    render() {
        if (this.state.error) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
