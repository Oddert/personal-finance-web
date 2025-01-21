import { Component, JSX } from 'react';
// import { Component, ErrorInfo, JSX } from 'react';

interface IProps {
    children: JSX.Element | JSX.Element[] | null;
    fallback: JSX.Element | JSX.Element[] | null;
}

// interface IState {
//     error: string | null;
// }

// class ErrorBoundary extends Component<IProps, IState> {
//     constructor(props: IProps) {
//         super(props);
//         this.state = {
//             error: null,
//         };
//     }

//     static getDerivedStateFromError(error: any) {
//         console.log('getDerivedStateFromError');
//         console.log(error);
//         return {
//             error: true,
//         };
//     }

//     componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
//         console.log('componentDidCatch');
//         console.error(error, errorInfo.componentStack);
//     }

//     render() {
//         if (this.state.error) {
//             console.log('fallback');
//             return this.props.fallback;
//         }
//         console.log('children');
//         return this.props.children;
//     }
// }

class ErrorBoundary extends Component<IProps, { hasError: boolean }> {
    constructor(props: IProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(err: any) {
        console.error('getDerivedStateFromError', err);
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {
        // Example "componentStack":
        //   in ComponentThatThrows (created by App)
        //   in ErrorBoundary (created by App)
        //   in div (created by App)
        //   in App
        console.error('componentDidCatch', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
