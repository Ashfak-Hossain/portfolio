import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Rendered if the WebGL scene throws (e.g. context-creation failure). */
  fallback: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * Error boundary around the lazy three.js / R3F scene. If WebGL fails at
 * runtime (no GPU, lost context, driver quirk), render the static SVG
 * katana instead of letting the throw propagate to the root and unmount the
 * whole page. This is the one place a class component is warranted.
 */
export class SceneBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
