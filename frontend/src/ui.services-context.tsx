import { ReactNode, createContext, useEffect, useState } from "react";
import Services from "./services";

export const ServicesContext = createContext<Services | undefined>(undefined);

interface ServiceProviderProps {
  children: ReactNode
}

export function ServicesProvider({ children }: ServiceProviderProps) {
  const [services, setServices] = useState<Services>();
  
  useEffect(() => {
    let canceled = false;
    new Services().init().then(services => { !canceled && setServices(services) });
    return () => { canceled = true }  
  }, []);

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}
