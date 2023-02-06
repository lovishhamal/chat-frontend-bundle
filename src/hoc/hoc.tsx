import React, { Component } from "react";

export default (OriginalComponent: any) => {
  class MixedComponent extends Component {
    async checkAuth() {}
    componentDidMount() {
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    render() {
      return <OriginalComponent {...this.props} />;
    }
  }

  return MixedComponent;
};
