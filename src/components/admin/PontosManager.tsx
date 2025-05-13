
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  adicionarPonto, 
  buscarCliente, 
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

interface PontosManagerProps {
  onClienteUpdated: () => void;
}

const PontosManager: React.FC<PontosManagerProps> = ({ onClienteUpdated }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [clienteAtual, setClienteAtual] = useState<Cliente | null>(null);
  const [pointsAdded, setPointsAdded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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
      setClienteAtual(cliente);
      
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
  
  const handleAdicionarPonto = async () => {
    if (!clienteAtual) return;
    
    setLoading(true);
    
    try {
      const clienteAtualizado = await adicionarPonto(clienteAtual.codigo_cartao);
      
      if (clienteAtualizado) {
        setClienteAtual(clienteAtualizado);
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
    if (!clienteAtual) return;
    
    setLoading(true);
    setDialogOpen(false);
    
    try {
      const clienteAtualizado = await reiniciarPontos(clienteAtual.codigo_cartao);
      
      if (clienteAtualizado) {
        setClienteAtual(clienteAtualizado);
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
    if (!clienteAtual) return null;
    
    const pontos = clienteAtual.pontos;
    
    if (pontos < 9) {
      return `Este cliente possui ${pontos} ${pontos === 1 ? 'ponto' : 'pontos'}. Acumule 10 pontos e seja premiado.`;
    } else if (pontos === 9) {
      return "Este cliente possui 9 pontos. Acumule mais 1 e seja premiado.";
    } else {
      return "Este cliente acumulou 10 pontos e pode receber o prêmio!";
    }
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
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="termo_busca">Buscar Cliente</Label>
            <div className="flex gap-2">
              <Input 
                id="termo_busca" 
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Telefone ou código do cartão"
              />
              <Button 
                onClick={handleBuscarCliente} 
                disabled={loading || !termoBusca.trim()}
              >
                Buscar
              </Button>
            </div>
          </div>
          
          {clienteAtual && (
            <div className="border rounded-md p-4 bg-white">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Cliente encontrado</h3>
                  <p className="text-sm text-gray-500">
                    {clienteAtual.nome} {clienteAtual.sobrenome} - {clienteAtual.telefone}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Status dos pontos</h4>
                  <p className="text-lg mt-1">{renderPointsMessage()}</p>
                  
                  {/* Avisos baseados na pontuação */}
                  {clienteAtual.pontos === 9 && (
                    <Alert className="mt-4 border-amber-500/50 bg-amber-500/10">
                      <AlertTitle className="text-amber-600">Atenção</AlertTitle>
                      <AlertDescription className="text-amber-700">
                        Este cliente está a 1 ponto do prêmio!
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {clienteAtual.pontos === 10 && (
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
                    disabled={loading || clienteAtual.pontos >= 10}
                    className="flex-1"
                  >
                    {clienteAtual.pontos >= 10 ? "Máximo de pontos atingido" : "Adicionar Ponto"}
                  </Button>
                  
                  {clienteAtual.pontos === 10 && (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PontosManager;
