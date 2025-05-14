
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { listarClientes } from '@/lib/supabaseClient';

// Import our components
import AdminHeader from '@/components/admin/AdminHeader';
import LoginForm from '@/components/admin/LoginForm';
import ClienteForm from '@/components/admin/ClienteForm';
import PontosManager from '@/components/admin/PontosManager';
import ClientesConsulta from '@/components/admin/ClientesConsulta';

const AdminPanel = () => {
  const {
    isAuthenticated,
    login,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleClienteAdded = async () => {
    // Este método é chamado após um cliente ser adicionado
    // e pode ser usado para atualizar outros componentes
  };

  // Se o usuário não estiver autenticado, mostra o formulário de login
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} loading={loading} />;
  }

  // Se o usuário estiver autenticado, mostra o painel admin
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AdminHeader logout={logout} />
      
      <main className="container max-w-7xl mx-auto py-8 px-4">
        <Tabs defaultValue="cadastro" className="space-y-6">
          <TabsList className="flex flex-col space-y-3 w-full max-w-xs mx-auto mb-8 shadow-elegant">
            <TabsTrigger 
              value="cadastro" 
              className="bg-brand-primary text-white hover:bg-brand-secondary transition-all duration-300 py-4 px-6 w-full text-left justify-start font-semibold rounded-t-md rounded-b-none">
              CADASTRAR CLIENTES
            </TabsTrigger>
            <TabsTrigger 
              value="pontos" 
              className="bg-brand-primary text-white hover:bg-brand-secondary transition-all duration-300 py-4 px-6 w-full text-left justify-start font-semibold rounded-none">
              ADICIONAR PONTOS
            </TabsTrigger>
            <TabsTrigger 
              value="consulta" 
              className="bg-brand-primary text-white hover:bg-brand-secondary transition-all duration-300 py-4 px-6 w-full text-left justify-start font-semibold rounded-t-none rounded-b-md">
              CONSULTAR CLIENTES
            </TabsTrigger>
          </TabsList>
          
          {/* Cadastro Tab */}
          <TabsContent value="cadastro" className="mt-6">
            <div className="shadow-elegant rounded-lg overflow-hidden">
              <ClienteForm onClienteAdded={handleClienteAdded} />
            </div>
          </TabsContent>
          
          {/* Pontos Tab */}
          <TabsContent value="pontos" className="mt-6">
            <div className="shadow-elegant rounded-lg overflow-hidden">
              <PontosManager onClienteUpdated={handleClienteAdded} />
            </div>
          </TabsContent>
          
          {/* Consulta Tab */}
          <TabsContent value="consulta" className="mt-6">
            <div className="shadow-elegant rounded-lg overflow-hidden">
              <ClientesConsulta />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
