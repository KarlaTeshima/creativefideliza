
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  logout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ logout }) => {
  return (
    <header className="py-4 px-4 bg-white shadow">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">Painel Administrativo</h1>
          <p className="text-sm text-gray-500">Sistema de Fidelidade</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/">Início</Link>
          </Button>
          <Button variant="destructive" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
