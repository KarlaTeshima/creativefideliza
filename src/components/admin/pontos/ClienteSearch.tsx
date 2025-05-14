
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { buscarCliente, Cliente } from '@/lib/supabaseClient';

interface ClienteSearchProps {
  onClienteFound: (cliente: Cliente | null) => void;
  setLoading: (loading: boolean) => void;
  setPointsAdded: (added: boolean) => void;
}

const ClienteSearch: React.FC<ClienteSearchProps> = ({ 
  onClienteFound, 
  setLoading,
  setPointsAdded 
}) => {
  const { toast } = useToast();
  const [termoBusca, setTermoBusca] = React.useState('');

  const handleBuscarCliente = async () => {
    if (!termoBusca.trim()) {
      toast({
        title: "Campo de busca vazio",
        description: "Por favor, informe um termo para busca.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setPointsAdded(false);
    
    try {
      const cliente = await buscarCliente(termoBusca);
      onClienteFound(cliente);
      
      if (!cliente) {
        toast({
          title: "Cliente não encontrado",
          description: "Nenhum cliente encontrado com este termo de busca.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      toast({
        title: "Erro ao buscar cliente",
        description: "Ocorreu um erro ao buscar o cliente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="termo_busca">Buscar Cliente</Label>
        <Input 
          id="termo_busca" 
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          placeholder="Telefone ou código do cartão"
        />
      </div>
      <Button 
        onClick={handleBuscarCliente} 
        disabled={!termoBusca.trim()}
        className="w-full"
      >
        Buscar
      </Button>
    </div>
  );
};

export default ClienteSearch;
