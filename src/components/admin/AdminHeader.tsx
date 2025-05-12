
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminHeaderProps {
  logout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ logout }) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="py-4 px-4 bg-white shadow">
      <div className="container max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Painel Administrativo</h1>
          <p className="text-sm text-gray-500">Sistema de Fidelidade</p>
        </div>
        <div className={`flex ${isMobile ? 'flex-col w-full' : 'flex-row'} gap-2`}>
          <Button 
            variant="outline" 
            asChild
            className={isMobile ? "w-full" : ""}
          >
            <Link to="/">Início</Link>
          </Button>
          <Button 
            variant="destructive" 
            onClick={logout}
            className={isMobile ? "w-full" : ""}
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
