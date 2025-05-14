
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cliente } from '@/lib/supabaseClient';
import ClienteSearch from './pontos/ClienteSearch';
import ClienteDetails from './pontos/ClienteDetails';

interface PontosManagerProps {
  onClienteUpdated: () => void;
}

const PontosManager: React.FC<PontosManagerProps> = ({ onClienteUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [clienteAtual, setClienteAtual] = useState<Cliente | null>(null);
  const [pointsAdded, setPointsAdded] = useState(false);

  const handleClienteFound = (cliente: Cliente | null) => {
    setClienteAtual(cliente);
  };

  return (
    <Card className="border-brand-secondary/20 shadow-elegant-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-brand-primary/20 to-brand-primary/5 border-b border-brand-primary/10">
        <CardTitle className="text-brand-primary text-2xl">Gerenciamento de Pontos</CardTitle>
        <CardDescription className="text-gray-600">
          Adicione pontos aos clientes cadastrados
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-8">
        <div className="space-y-8">
          <ClienteSearch 
            onClienteFound={handleClienteFound} 
            setLoading={setLoading}
            setPointsAdded={setPointsAdded}
          />
          
          {clienteAtual && (
            <ClienteDetails 
              cliente={clienteAtual}
              loading={loading}
              setLoading={setLoading}
              onClienteUpdated={onClienteUpdated}
              setPointsAdded={setPointsAdded}
              pointsAdded={pointsAdded}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PontosManager;
