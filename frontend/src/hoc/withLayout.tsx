import React, { ReactElement, ReactNode } from "react";
import Dashboard from "../features/dashboard/Dashboard";
import { ToastContainer } from "react-toastify";

type WithLayoutProps = {
  children?: ReactNode;
};

type WrappedComponentType = (props: any) => ReactElement;

// Define the withLayout HOC
const withLayout = (WrappedComponent: WrappedComponentType) => {
  return (props: WithLayoutProps & Record<string, any>) => (
    <Dashboard>
      <WrappedComponent {...props} />
      <ToastContainer position="top-center" autoClose={2000} />
    </Dashboard>
  );
};

export default withLayout;
