
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  adicionarPonto, 
  reiniciarPontos, 
  Cliente,
  buscarClientePorCodigo
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
  cliente: clienteInicial, 
  loading, 
  setLoading,
  onClienteUpdated,
  setPointsAdded,
  pointsAdded
}) => {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cliente, setCliente] = useState<Cliente>(clienteInicial);

  // Efeito para atualizar o cliente quando clienteInicial mudar
  useEffect(() => {
    setCliente(clienteInicial);
  }, [clienteInicial]);

  const handleAdicionarPonto = async () => {
    if (!cliente) return;
    
    setLoading(true);
    
    try {
      const clienteAtualizado = await adicionarPonto(cliente.codigo_cartao);
      
      if (clienteAtualizado) {
        setCliente(clienteAtualizado);
        setPointsAdded(true);
        toast({
          title: "Ponto adicionado com sucesso!",
          description: `${clienteAtualizado.nome} agora possui ${clienteAtualizado.pontos} pontos.`
        });
        
        // Também atualiza a lista de clientes
        onClienteUpdated();
      } else {
        throw new Error("Erro ao adicionar ponto: o cliente não foi encontrado");
      }
    } catch (error) {
      console.error("Erro ao adicionar ponto:", error);
      toast({
        title: "Erro ao adicionar ponto",
        description: "Ocorreu um erro ao adicionar o ponto. Por favor, tente novamente.",
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
        setCliente(clienteAtualizado);
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
    <div className="border rounded-md p-6 bg-white shadow-elegant-lg transition-all duration-300 hover:shadow-card-hover">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-brand-primary/15 to-brand-primary/5 p-6 rounded-lg border border-brand-primary/10">
          <h3 className="font-bold text-xl text-center mb-4 text-brand-primary">Detalhes do Cliente</h3>
          <div className="text-center">
            <p className="text-3xl font-bold text-brand-primary">
              {cliente.nome} {cliente.sobrenome}
            </p>
            <p className="text-gray-500 mt-2">
              {cliente.telefone}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-brand-primary/15 to-brand-primary/5 p-6 rounded-lg border border-brand-primary/10">
          <h4 className="font-bold text-xl text-center mb-3 text-brand-primary">Pontos Acumulados</h4>
          <div className="text-center">
            <div className="bg-white rounded-full w-24 h-24 mx-auto flex items-center justify-center border-4 border-brand-primary shadow-lg mb-4">
              <p className="text-5xl font-bold text-brand-primary">{cliente.pontos}</p>
            </div>
            <p className="text-gray-700 mt-3 font-medium">{renderPointsMessage()}</p>
          </div>
          
          {/* Avisos baseados na pontuação */}
          {cliente.pontos === 9 && (
            <Alert className="mt-5 border-amber-500/50 bg-amber-500/10 shadow-sm">
              <AlertTitle className="text-amber-600 font-bold">Atenção</AlertTitle>
              <AlertDescription className="text-amber-700">
                Este cliente está a 1 ponto do prêmio!
              </AlertDescription>
            </Alert>
          )}
          
          {cliente.pontos === 10 && (
            <Alert className="mt-5 border-green-500/50 bg-green-500/10 shadow-sm">
              <AlertTitle className="text-green-600 font-bold">Prêmio!</AlertTitle>
              <AlertDescription className="text-green-700">
                Este cliente deve receber o prêmio agora.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={handleAdicionarPonto} 
            disabled={loading || cliente.pontos >= 10}
            className="w-full bg-brand-primary hover:bg-brand-secondary shadow-elegant-hover text-white font-medium py-3"
            size="lg"
          >
            {cliente.pontos >= 10 ? "Máximo de pontos atingido" : "Adicionar Ponto"}
          </Button>
          
          {cliente.pontos === 10 && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-green-600 hover:bg-green-700 shadow-elegant-hover text-white font-medium py-3" size="lg">
                  Premiar Cliente e Reiniciar Pontos
                </Button>
              </DialogTrigger>
              <DialogContent className="shadow-elegant-lg">
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
