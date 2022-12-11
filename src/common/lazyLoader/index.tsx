import React from "react";

const LazyLoadComponent = (Component: React.ComponentType) => (props: any) =>
  (
    <React.Suspense fallback={<>...</>}>
      <Component {...props} />
    </React.Suspense>
  );

export default LazyLoadComponent;
