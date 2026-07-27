import { Component } from "react";

export default class ToolErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Image tool failed to render", {
      error,
      componentStack: errorInfo.componentStack,
      tool: this.props.resetKey,
    });
  }

  componentDidUpdate(previousProps) {
    if (
      this.state.error &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ error: null });
    }
  }

  retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    const isChinese = this.props.locale === "zh";

    return (
      <div
        className="grid min-h-[360px] place-items-center rounded-lg border border-amber-200 bg-amber-50 px-6 py-12 text-center"
        role="alert"
      >
        <div className="max-w-md">
          <h3 className="text-lg font-black text-[#1A1A1A]">
            {isChinese
              ? `${this.props.toolName}暂时无法加载`
              : `${this.props.toolName} could not load`}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#6F6B65]">
            {isChinese
              ? "工具遇到了意外错误。你可以重试，或从左侧选择其他工具。"
              : "The tool encountered an unexpected error. Retry, or choose another tool from the sidebar."}
          </p>
          <button
            type="button"
            onClick={this.retry}
            className="mt-5 rounded-md bg-[#1A1A1A] px-4 py-2 text-sm font-bold text-white hover:bg-[#343434]"
          >
            {isChinese ? "重试" : "Try again"}
          </button>
        </div>
      </div>
    );
  }
}
