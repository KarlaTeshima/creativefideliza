
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { listarClientes } from '@/lib/supabaseClient';

// Import our new components
import AdminHeader from '@/components/admin/AdminHeader';
import LoginForm from '@/components/admin/LoginForm';
import ClienteForm from '@/components/admin/ClienteForm';
import PontosManager from '@/components/admin/PontosManager';
import ClientesConsulta from '@/components/admin/ClientesConsulta';

const AdminPanel = () => {
  const { isAuthenticated, login, logout } = useAuth();
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
    <div className="min-h-screen bg-gray-50">
      <AdminHeader logout={logout} />
      
      <main className="container max-w-7xl mx-auto py-8 px-4">
        <Tabs defaultValue="cadastro">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="cadastro">Cadastro de Cliente</TabsTrigger>
            <TabsTrigger value="pontos">Gerenciamento de Pontos</TabsTrigger>
            <TabsTrigger value="consulta">Consulta de Clientes</TabsTrigger>
          </TabsList>
          
          {/* Cadastro Tab */}
          <TabsContent value="cadastro">
            <ClienteForm onClienteAdded={handleClienteAdded} />
          </TabsContent>
          
          {/* Pontos Tab */}
          <TabsContent value="pontos">
            <PontosManager onClienteUpdated={handleClienteAdded} />
          </TabsContent>
          
          {/* Consulta Tab */}
          <TabsContent value="consulta">
            <ClientesConsulta />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
