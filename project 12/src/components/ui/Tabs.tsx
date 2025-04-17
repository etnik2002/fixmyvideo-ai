import React, { createContext, useContext, useState } from 'react';

type TabsContextValue = {
  value: string;
  onChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

type TabsProps = {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
};

export const Tabs: React.FC<TabsProps> = ({ defaultValue, className, children }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onChange: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

type TabsListProps = {
  className?: string;
  children: React.ReactNode;
};

export const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return <div className={`flex space-x-2 ${className}`}>{children}</div>;
};

type TabsTriggerProps = {
  value: string;
  className?: string;
  children: React.ReactNode;
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className, children }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }
  
  const { value: selectedValue, onChange } = context;
  const isActive = value === selectedValue;
  
  return (
    <button
      type="button"
      className={`px-4 py-2 rounded-md text-sm font-medium ${
        isActive ? 'text-white bg-fmv-orange' : 'text-fmv-silk/80 hover:text-fmv-silk hover:bg-fmv-carbon-light/20'
      } transition-colors focus:outline-none focus:ring-2 focus:ring-fmv-orange/50 ${className}`}
      onClick={() => onChange(value)}
      data-state={isActive ? 'active' : 'inactive'}
    >
      {children}
    </button>
  );
};

type TabsContentProps = {
  value: string;
  className?: string;
  children: React.ReactNode;
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, className, children }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }
  
  const { value: selectedValue } = context;
  
  if (value !== selectedValue) {
    return null;
  }
  
  return <div className={className}>{children}</div>;
};