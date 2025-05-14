
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
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Pontos</CardTitle>
        <CardDescription>
          Adicione pontos aos clientes cadastrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
