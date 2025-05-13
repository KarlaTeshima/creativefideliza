
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  adicionarPonto, 
  reiniciarPontos, 
  Cliente
} from '@/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ClienteDetailsProps {
  cliente: Cliente;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onClienteUpdated: () => void;
  setPointsAdded: (added: boolean) => void;
  pointsAdded: boolean;
}

const ClienteDetails: React.FC<ClienteDetailsProps> = ({ 
  cliente, 
  loading, 
  setLoading,
  onClienteUpdated,
  setPointsAdded,
  pointsAdded
}) => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAdicionarPonto = async () => {
    if (!cliente) return;
    
    setLoading(true);
    
    try {
      const clienteAtualizado = await adicionarPonto(cliente.codigo_cartao);
      
      if (clienteAtualizado) {
        setPointsAdded(true);
        toast({
          title: "Ponto adicionado com sucesso!",
          description: `${clienteAtualizado.nome} agora possui ${clienteAtualizado.pontos} pontos.`
        });
        
        // Também atualiza a lista de clientes
        onClienteUpdated();
      }
    } catch (error) {
      console.error("Erro ao adicionar ponto:", error);
      toast({
        title: "Erro ao adicionar ponto",
        description: "Ocorreu um erro ao adicionar o ponto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleReiniciarPontos = async () => {
    if (!cliente) return;
    
    setLoading(true);
    setDialogOpen(false);
    
    try {
      const clienteAtualizado = await reiniciarPontos(cliente.codigo_cartao);
      
      if (clienteAtualizado) {
        toast({
          title: "Cliente premiado com sucesso!",
          description: "Cartão reiniciado e pronto para reutilização."
        });
        
        // Também atualiza a lista de clientes
        onClienteUpdated();
      }
    } catch (error) {
      console.error("Erro ao reiniciar pontos:", error);
      toast({
        title: "Erro ao premiar cliente",
        description: "Ocorreu um erro ao reiniciar os pontos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPointsMessage = () => {
    if (!cliente) return null;
    
    const pontos = cliente.pontos;
    
    if (pontos < 9) {
      return `Este cliente possui ${pontos} ${pontos === 1 ? 'ponto' : 'pontos'}. Acumule 10 pontos e seja premiado.`;
    } else if (pontos === 9) {
      return "Este cliente possui 9 pontos. Acumule mais 1 e seja premiado.";
    } else {
      return "Este cliente acumulou 10 pontos e pode receber o prêmio!";
    }
  };

  return (
    <div className="border rounded-md p-4 bg-white">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Cliente encontrado</h3>
          <p className="text-sm text-gray-500">
            {cliente.nome} {cliente.sobrenome} - {cliente.telefone}
          </p>
        </div>
        
        <div>
          <h4 className="font-medium">Status dos pontos</h4>
          <p className="text-lg mt-1">{renderPointsMessage()}</p>
          
          {/* Avisos baseados na pontuação */}
          {cliente.pontos === 9 && (
            <Alert className="mt-4 border-amber-500/50 bg-amber-500/10">
              <AlertTitle className="text-amber-600">Atenção</AlertTitle>
              <AlertDescription className="text-amber-700">
                Este cliente está a 1 ponto do prêmio!
              </AlertDescription>
            </Alert>
          )}
          
          {cliente.pontos === 10 && (
            <Alert className="mt-4 border-green-500/50 bg-green-500/10">
              <AlertTitle className="text-green-600">Prêmio!</AlertTitle>
              <AlertDescription className="text-green-700">
                Este cliente deve receber o prêmio agora.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleAdicionarPonto} 
            disabled={loading || cliente.pontos >= 10}
            className="flex-1"
          >
            {cliente.pontos >= 10 ? "Máximo de pontos atingido" : "Adicionar Ponto"}
          </Button>
          
          {cliente.pontos === 10 && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  Premiar Cliente e Reiniciar Pontos
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmação</DialogTitle>
                  <DialogDescription>
                    Deseja realmente premiar e reiniciar os pontos deste cliente?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleReiniciarPontos} disabled={loading}>
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClienteDetails;
